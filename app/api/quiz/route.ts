import { NextRequest, NextResponse } from "next/server";
import { createGroqChatCompletion } from "@/lib/groq";
import { Topic, DocumentChunk, QuizQuestion } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { topics, chunks } = await req.json();

    if (!topics || topics.length === 0) {
      return NextResponse.json(
        { error: "No topics provided for quiz generation." },
        { status: 400 }
      );
    }

    // Ensure chunks exist; if empty, create chunks from topics and subtopics
    const effectiveChunks: DocumentChunk[] =
      chunks && chunks.length > 0
        ? chunks
        : (topics as Topic[]).flatMap((t) =>
            t.subtopics.map((s, idx) => ({
              id: `chk-synth-${t.id}-${idx}`,
              docTitle: `${t.name} Study Guide`,
              section: `Section ${idx + 1}: ${s.title}`,
              pageOrSlide: `Topic Section ${idx + 1}`,
              topicId: t.id,
              subtopicId: s.id,
              content: `${s.title}: ${s.description}. Key concept in ${t.name}.`,
            }))
          );

    // Build context chunks with explicit citation labels
    const contextText = effectiveChunks
      .map(
        (c, idx) => `[CHUNK #${idx + 1}]
Source: ${c.docTitle}
Section: ${c.section} (${c.pageOrSlide || "N/A"})
Topic ID: ${c.topicId}
Content:
${c.content}
---`
      )
      .join("\n");

    const systemPrompt = `You are an elite educational psychometrician creating a strict diagnostic quiz.
MANDATORY CONSTRAINT (RAG GROUNDING & WEIGHTAGE PROPORTIONALITY):
1. Every question, option, correct answer, and explanation MUST be derived strictly and exclusively from the provided CHUNKS and TOPICS below.
2. Weightage Proportionality: The number of questions generated per topic MUST be directly proportional to that topic's examWeightage:
   - High Weightage topics (>25%) should receive 2 to 4 questions.
   - Lower Weightage topics should receive 1 to 2 questions.
3. EVERY question must include an exact citation pointing back to the Chunk Source, Section, and verbatim sentence snippet.

Generate multiple-choice questions (4 options per question, exactly 1 correct).
Return pure JSON with no markdown formatting:
{
  "questions": [
    {
      "id": "q-1",
      "topicId": "topic-1",
      "topicName": "Exact Topic Name",
      "subtopicId": "sub-1-1",
      "subtopicName": "Exact Subtopic Name",
      "question": "Clear, concept-testing question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Why Option A is correct and why other options are incorrect based on the text.",
      "citation": {
        "documentTitle": "Name of source document",
        "section": "Section name",
        "pageOrChapter": "Page/Chapter reference",
        "verbatimSnippet": "Exact phrase from the chunk supporting the answer"
      }
    }
  ]
}`;

    const userPrompt = `
TOPICS AND THEIR EXAM WEIGHTAGE:
${JSON.stringify(
  topics.map((t: Topic) => ({
    id: t.id,
    name: t.name,
    examWeightage: `${t.examWeightage}%`,
    subtopics: t.subtopics.map((s) => ({ id: s.id, title: s.title })),
  })),
  null,
  2
)}

DOCUMENT CHUNKS (SOURCE TRUTH):
${contextText.slice(0, 12000)}

Generate the complete diagnostic quiz now. Allocate more questions to the highest weightage topics. Ensure every question matches one of the topic IDs.
`;

    const chatCompletion = await createGroqChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 3500,
    });

    const parsed = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    return NextResponse.json({
      questions: (parsed.questions as QuizQuestion[]) || [],
    });
  } catch (error: any) {
    console.error("Quiz Generator API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate diagnostic quiz." },
      { status: 500 }
    );
  }
}
