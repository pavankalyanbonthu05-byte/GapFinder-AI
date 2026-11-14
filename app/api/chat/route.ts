import { streamText } from "ai";
import { groqProvider, GROQ_MODEL } from "@/lib/groq";
import { retrieveRelevantChunks } from "@/lib/rag/retriever";
import { DocumentChunk } from "@/lib/types";

export const maxDuration = 30; // 30s max for Vercel

export async function POST(req: Request) {
  try {
    const { messages, chunks, activeTopicId, activeTopicName } = await req.json();

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // Multi-turn context awareness: combine recent user context with active topic for richer retrieval
    const recentContext = messages
      .slice(-3)
      .map((m: any) => m.content)
      .join(" ");

    const retrievalQuery = `${activeTopicName || ""} ${lastUserMessage} ${recentContext}`;

    // Retrieve the most relevant chunks using fast keyword + cosine matching
    const relevantChunks = retrieveRelevantChunks(
      retrievalQuery,
      chunks as DocumentChunk[],
      5,
      activeTopicId
    );

    const contextText =
      relevantChunks.length > 0
        ? relevantChunks
            .map(
              (c, i) => `[REFERENCE #${i + 1}]
Source: ${c.docTitle}
Section: ${c.section} (${c.pageOrSlide || "No page reference"})
Content:
${c.content}`
            )
            .join("\n\n")
        : "No directly matching chunks found in uploaded materials.";

    const systemPrompt = `You are "GapFinder AI", a master academic tutor and diagnostic learning specialist.
Your mission is to evaluate the student's study materials and teach the concept with crystal-clear pedagogical framing, adapting dynamically to the student's understanding.

CRITICAL INSTRUCTIONS ON EVALUATION & SYNTHESIS:
1. NEVER just dump raw textbook excerpts. Your role is to READ, EVALUATE, and REFRAME the retrieved facts into a well-crafted, easy-to-understand teaching response.
2. FORMAT EVERY TOPIC EXPLANATION USING THIS ELEGANT STRUCTURE:
   • 💡 **Intuitive Core Concept**: Explain the big picture in 2-3 engaging sentences using an intuitive real-world analogy.
   • 🔍 **Step-by-Step Breakdown**: Walk through the mechanism or concept logically (bullet points).
   • ⚠️ **Exam Blindspot / Common Pitfall**: Highlight the exact mistake students commonly make on this topic in exams.
   • 📚 **Verified Citations**: Mention the exact source documents & sections where this is grounded (e.g., [Campbell Biology, Section 9.2]).

3. CONVERSATIONAL MEMORY & ADAPTIVE TEACHING:
   • Actively review the previous chat history to track what the student has already grasped.
   • If the student expresses confusion or asks for simplification, recalibrate your tone: break it down simpler with step-by-step analogies.
   • If the student wants rigorous exam details, provide deep biochemical/conceptual rigor.

4. GROUNDING CONSTRAINT:
   • Every factual assertion must be verified by the RETRIEVED NOTES CONTEXT below.
   • If a question cannot be answered from the uploaded notes, explicitly state:
     "This specific detail is not covered in your uploaded notes. Here is what your syllabus material does cover regarding this topic..."

RETRIEVED NOTES CONTEXT (STUDENT STUDY MATERIAL):
${contextText}
`;

    const result = streamText({
      model: groqProvider(GROQ_MODEL),
      system: systemPrompt,
      messages,
      temperature: 0.2, // slightly higher for fluid pedagogical framing while remaining grounded
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Chat failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
