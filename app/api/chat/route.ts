import { streamText } from "ai";
import { groqProvider, GROQ_MODEL } from "@/lib/groq";
import { retrieveRelevantChunks } from "@/lib/rag/retriever";
import { DocumentChunk } from "@/lib/types";

export const maxDuration = 30; // 30s max for Vercel

export async function POST(req: Request) {
  try {
    const { messages, chunks, activeTopicId } = await req.json();

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // Retrieve the most relevant chunks using fast keyword + cosine matching
    const relevantChunks = retrieveRelevantChunks(
      lastUserMessage,
      chunks as DocumentChunk[],
      4,
      activeTopicId
    );

    const contextText =
      relevantChunks.length > 0
        ? relevantChunks
            .map(
              (c, i) => `[CITATION #${i + 1}]
Source: ${c.docTitle}
Section: ${c.section} (${c.pageOrSlide || "No page reference"})
Content:
${c.content}`
            )
            .join("\n\n")
        : "No directly matching chunks found in uploaded materials.";

    const systemPrompt = `You are "GapFinder Explain", an empathetic, highly pedagogical AI tutor.
CRITICAL MANDATORY INSTRUCTIONS:
1. You must answer the student's question STRICTLY based on the provided RETRIEVED NOTES CONTEXT below.
2. Under no circumstances should you hallucinate or introduce facts from outside the provided context.
3. If the answer is NOT present in the notes context, politely state:
   "I cannot find this in your uploaded notes and textbook chapters. Please make sure the relevant chapter is uploaded."
4. Always provide inline citations, referencing the exact Section and Source (e.g. [Campbell Biology, Section 9.2]).
5. Keep explanations clear, step-by-step, and focused on overcoming common exam mistakes.

RETRIEVED NOTES CONTEXT:
${contextText}
`;

    const result = streamText({
      model: groqProvider(GROQ_MODEL),
      system: systemPrompt,
      messages,
      temperature: 0.1,
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
