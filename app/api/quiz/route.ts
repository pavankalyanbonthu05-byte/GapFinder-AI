import { NextRequest, NextResponse } from "next/server";
import { createGroqChatCompletion } from "@/lib/groq";
import { Topic, DocumentChunk, QuizQuestion } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { topics, chunks, countPerTopic = 2 } = await req.json();

    if (!chunks || chunks.length === 0) {
      return NextResponse.json(
        { error: "No document chunks provided for grounding." },
        { status: 400 }
      );
    }

    // Build context chunks with explicit citation labels
    const contextText = (chunks as DocumentChunk[])
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
MANDATORY CONSTRAINT (RAG GROUNDING):
Every question, option, correct answer, and explanation MUST be derived strictly and exclusively from the provided CHUNKS below.
DO NOT use outside web or unverified general memory.
EVERY question must include an exact citation pointing back to the Chunk Source, Section, and verbatim sentence snippet.

Generate multiple-choice questions (4 options per question, exactly 1 correct).
Return pure JSON with no markdown formatting:
{
  "questions": [
    {
      "id": "q-1",
      "topicId": "topic-1",
      "topicName": "Topic Name",
      "subtopicId": "sub-1-1",
      "subtopicName": "Subtopic Name",
      "question": "Clear, concept-testing question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Why Option A is correct and why other options are incorrect based on the text.",
      "citation": {
        "documentTitle": "Name of source",
        "section": "Section name",
        "pageOrChapter": "Page/Chapter",
        "verbatimSnippet": "Exact phrase from the chunk supporting the answer"
      }
    }
  ]
}`;

    const userPrompt = `
TOPICS AVAILABLE:
${JSON.stringify(topics?.map((t: Topic) => ({ id: t.id, name: t.name, subtopics: t.subtopics })) || [])}

DOCUMENT CHUNKS (GROUNDING TRUTH):
${contextText.slice(0, 10000)}

Please generate ${countPerTopic} high-yield diagnostic questions per topic. Focus on testing comprehension and common student misconceptions.
`;

    const chatCompletion = await createGroqChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // low temperature for high fidelity to chunks
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
