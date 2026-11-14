import { NextRequest, NextResponse } from "next/server";
import { groqClient, GROQ_MODEL } from "@/lib/groq";
import {
  Topic,
  QuizQuestion,
  StudentAnswer,
  TopicGap,
  StudyPlanDay,
  GapDiagnosisReport,
  MasteryLevel,
} from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const {
      topics,
      questions,
      studentAnswers,
      availableDays = 5,
      hoursPerDay = 2,
    } = await req.json();

    if (!questions || !studentAnswers) {
      return NextResponse.json(
        { error: "Missing questions or student answers." },
        { status: 400 }
      );
    }

    // 1. Group answers and calculate raw performance by topic
    const topicStats: Record<
      string,
      {
        total: number;
        correct: number;
        missedSubtopics: Set<string>;
        missedQuestions: { q: string; ans: string; expected: string; exp: string }[];
      }
    > = {};

    (topics as Topic[]).forEach((t) => {
      topicStats[t.id] = {
        total: 0,
        correct: 0,
        missedSubtopics: new Set(),
        missedQuestions: [],
      };
    });

    let overallCorrect = 0;
    const totalQuestions = questions.length;

    (studentAnswers as StudentAnswer[]).forEach((sa) => {
      const q = (questions as QuizQuestion[]).find((item) => item.id === sa.questionId);
      if (!q) return;

      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = {
          total: 0,
          correct: 0,
          missedSubtopics: new Set(),
          missedQuestions: [],
        };
      }

      topicStats[q.topicId].total += 1;
      if (sa.isCorrect) {
        topicStats[q.topicId].correct += 1;
        overallCorrect += 1;
      } else {
        topicStats[q.topicId].missedSubtopics.add(q.subtopicName);
        topicStats[q.topicId].missedQuestions.push({
          q: q.question,
          ans: q.options[sa.selectedOptionIndex] || "None",
          expected: q.options[q.correctAnswerIndex],
          exp: q.explanation,
        });
      }
    });

    // 2. Classify Weak / Medium / Strong
    const rawGaps: TopicGap[] = (topics as Topic[]).map((t) => {
      const stats = topicStats[t.id] || { total: 0, correct: 0, missedSubtopics: new Set() };
      const scorePct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

      let mastery: MasteryLevel = "STRONG";
      if (scorePct < 50) {
        mastery = "WEAK";
      } else if (scorePct <= 75) {
        mastery = "MEDIUM";
      }

      const missedList = Array.from(stats.missedSubtopics);

      return {
        topicId: t.id,
        topicName: t.name,
        masteryLevel: mastery,
        scorePercentage: scorePct,
        totalQuestions: stats.total,
        correctQuestions: stats.correct,
        examWeightage: t.examWeightage || 25,
        reasoning:
          missedList.length > 0
            ? `Struggled with ${missedList.slice(0, 2).join(" & ")}. Got ${stats.correct} of ${stats.total} questions correct.`
            : `Demonstrated solid mastery answering all ${stats.total} questions correctly.`,
        missedSubtopics: missedList,
        recommendedAction:
          mastery === "WEAK"
            ? "Revisit core notes and test with active recall flashcards immediately."
            : mastery === "MEDIUM"
            ? "Practice application problems to reinforce edge cases."
            : "Review summary sheets 2 days prior to exam for retention.",
      };
    });

    // 3. Compute priority score = (100 - scorePct) * examWeightage
    const sortedTopicsForRevision = [...rawGaps].sort((a, b) => {
      const priorityA = (100 - a.scorePercentage) * a.examWeightage;
      const priorityB = (100 - b.scorePercentage) * b.examWeightage;
      return priorityB - priorityA;
    });

    // 4. Use Groq to generate clinical reasoning and a polished day-by-day plan
    const prompt = `You are an AI diagnostic academic physician. A student just completed a diagnostic exam.
Topic Performance:
${JSON.stringify(rawGaps, null, 2)}

Constraints:
Available Days: ${availableDays} days.
Daily study time: ${hoursPerDay} hours per day.

Generate:
1. "summaryDiagnosis": A sharp 2-3 sentence diagnosis of the student's primary conceptual vulnerability and how it jeopardizes their exam score.
2. "revisionPlan": A day-by-day revision schedule for ${availableDays} days (1 entry per day) ordered by priority (highest exam risk first).
   Include:
   - dayNumber
   - targetTopicName
   - targetTopicId
   - allocatedHours (${hoursPerDay} hrs)
   - keySubtopicsToReview (list)
   - actionItem (specific actionable instruction, e.g. "Draw the thylakoid membrane electron flow diagram")
   - recommendedCitation (e.g. "Section 9.4: Oxidative Phosphorylation")

Return valid JSON with:
{
  "summaryDiagnosis": "...",
  "revisionPlan": [
    {
      "dayNumber": 1,
      "targetTopicName": "...",
      "targetTopicId": "...",
      "allocatedHours": ${hoursPerDay},
      "keySubtopicsToReview": ["..."],
      "actionItem": "...",
      "recommendedCitation": "..."
    }
  ]
}`;

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an academic diagnostic engine. Return pure valid JSON with no markdown wrapping.",
        },
        { role: "user", content: prompt },
      ],
      model: GROQ_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 2500,
    });

    const parsedAi = JSON.parse(completion.choices[0]?.message?.content || "{}");

    const overallPct = totalQuestions > 0 ? Math.round((overallCorrect / totalQuestions) * 100) : 0;

    const report: GapDiagnosisReport = {
      studentId: "demo-student-1",
      attemptId: `att-${Date.now()}`,
      overallScore: overallPct,
      timestamp: new Date().toISOString(),
      topicGaps: rawGaps,
      weakTopicsCount: rawGaps.filter((g) => g.masteryLevel === "WEAK").length,
      mediumTopicsCount: rawGaps.filter((g) => g.masteryLevel === "MEDIUM").length,
      strongTopicsCount: rawGaps.filter((g) => g.masteryLevel === "STRONG").length,
      revisionPlan: (parsedAi.revisionPlan as StudyPlanDay[]) || [],
      summaryDiagnosis:
        parsedAi.summaryDiagnosis ||
        `Student scored ${overallPct}% overall. Key vulnerabilities identified in high-yield exam sections.`,
    };

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("Evaluation API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to evaluate diagnostic exam." },
      { status: 500 }
    );
  }
}
