import { streamText, tool } from "ai";
import { z } from "zod";
import { groqProvider, GROQ_MODEL } from "@/lib/groq";
import { retrieveRelevantChunks } from "@/lib/rag/retriever";
import { searchWebKnowledge } from "@/lib/webSearch";
import { DocumentChunk } from "@/lib/types";

export const maxDuration = 30; // 30s max for Vercel

export async function POST(req: Request) {
  try {
    const { messages, chunks, activeTopicId, activeTopicName } = await req.json();

    const allChunks: DocumentChunk[] = (chunks as DocumentChunk[]) || [];

    const systemPrompt = `You are GapFinder AI, an expert, empathetic, and professional Ed-Tech diagnostic tutor. 

${
  activeTopicName
    ? `ACTIVE TOPIC FOCUS: "${activeTopicName}"`
    : `STUDY CONTEXT: General Academic Course Materials.`
}

CRITICAL FORMATTING & PRESENTATION RULES:
- Write in a natural, conversational, elegant tone (matching the polish of Gemini or ChatGPT).
- DO NOT use numbered emoji badges (like 1️⃣, 2️⃣, 3️⃣) or emoji icons (like 📚, 🔬, 💡).
- DO NOT overuse markdown headers. Never use ### headers on consecutive lines. Use regular bold text or bullet points instead.
- For lists, use standard clean bullets (-) or numbered points (1., 2.).
- Ensure bullet items are separated with clean spacing so they read clearly.
- Write equations and formulas in simple, readable text (e.g. Work = Force × Distance), never in raw LaTeX codes or brackets.
- Never output raw JSON, system variable names, or internal tool names (e.g. searchUploadedNotes or searchWeb).
- If the student asks about a specific topic, explain it clearly with an intuitive concept summary, a step-by-step mechanism, and a practical application.`;

    const result = streamText({
      model: groqProvider(GROQ_MODEL),
      system: systemPrompt,
      messages,
      maxSteps: 4,
      temperature: 0.25,
      tools: {
        searchUploadedNotes: tool({
          description:
            "Search the student's uploaded course syllabus, textbooks, and lecture notes for specific topics, concepts, or mechanisms.",
          parameters: z.object({
            query: z.string().describe("Specific concept, mechanism, or term to search in notes"),
            topicFilter: z.string().optional().describe("Optional topic ID to constrain search"),
          }),
          execute: async ({ query, topicFilter }) => {
            const filterToUse = topicFilter || activeTopicId || undefined;
            const matches = retrieveRelevantChunks(query, allChunks, 4, filterToUse);

            if (matches.length === 0) {
              const broader = retrieveRelevantChunks(query, allChunks, 3);
              return broader.map((c) => ({
                source: c.docTitle,
                section: c.section,
                page: c.pageOrSlide || "N/A",
                passage: c.content,
              }));
            }

            return matches.map((c) => ({
              source: c.docTitle,
              section: c.section,
              page: c.pageOrSlide || "N/A",
              passage: c.content,
            }));
          },
        }),

        searchWeb: tool({
          description:
            "Search external live web knowledge for out-of-topic questions, real-world context, or concepts not covered in the student's notes.",
          parameters: z.object({
            query: z.string().describe("Search query for web knowledge"),
          }),
          execute: async ({ query }) => {
            const webData = await searchWebKnowledge(query);
            return {
              source: webData.source,
              title: webData.title,
              snippet: webData.snippet,
            };
          },
        }),
      },
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
