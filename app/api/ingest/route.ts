import { NextRequest, NextResponse } from "next/server";
import { createGroqChatCompletion } from "@/lib/groq";
import { Topic, DocumentChunk } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { syllabusText, notesText, pastPapersText } = await req.json();

    if (!syllabusText && !notesText) {
      return NextResponse.json(
        { error: "Please provide syllabus or notes text." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert curriculum analyzer and EdTech assessment specialist.
Given the uploaded syllabus, notes, and past exam papers, extract:
1. A structured Topic Map containing:
   - Topic name and category
   - Estimated exam weightage (percentage 1-100, sum close to 100)
   - Subtopics with titles, descriptions, exam frequency (HIGH, MEDIUM, LOW) and estimated past questions count.
2. Structured Document Chunks with citations:
   - Chunk text
   - Section name
   - Estimated page or chapter reference
   - Associated topic index

Return pure, valid JSON with no markdown wrapping following this format:
{
  "topics": [
    {
      "id": "topic-1",
      "name": "Topic Name",
      "category": "Category",
      "examWeightage": 30,
      "subtopics": [
        {
          "id": "sub-1-1",
          "title": "Subtopic Title",
          "description": "Short summary",
          "examFrequency": "HIGH",
          "pastQuestionsCount": 5
        }
      ]
    }
  ],
  "chunks": [
    {
      "id": "chk-1",
      "docTitle": "Course Notes / Textbook",
      "section": "Section 1.1: Name",
      "pageOrSlide": "Page 12",
      "topicId": "topic-1",
      "content": "Detailed text chunk content for grounding..."
    }
  ]
}`;

    const userContent = `
SYLLABUS:
${syllabusText ? syllabusText.slice(0, 4000) : "Not provided"}

NOTES EXCERPTS:
${notesText ? notesText.slice(0, 8000) : "Not provided"}

PAST EXAM PAPERS:
${pastPapersText ? pastPapersText.slice(0, 4000) : "Not provided"}
`;

    const chatCompletion = await createGroqChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 3000,
    });

    const parsed = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    return NextResponse.json({
      topics: (parsed.topics as Topic[]) || [],
      chunks: (parsed.chunks as DocumentChunk[]) || [],
    });
  } catch (error: any) {
    console.error("Ingestion API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process study material." },
      { status: 500 }
    );
  }
}
