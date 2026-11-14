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

    const systemPrompt = `You are "GapFinder AI", an elite AI learning assistant and tutor modeled after ChatGPT and Gemini.
You speak with exceptional clarity, high pedagogical intelligence, conversational warmth, and rigorous analytical depth.

STUDENT'S ACTIVE FOCUS TOPIC: ${activeTopicName || "All Uploaded Study Materials"}

YOUR CAPABILITIES & TOOL CALLING:
1. "searchUploadedNotes": Call this to inspect the student's uploaded textbooks, notes, and past exams.
2. "searchWeb": Call this whenever:
   - The user asks an out-of-topic or general question (e.g. general science, history, programming, math, life).
   - The user asks for real-world applications or comparisons between their syllabus notes and modern scientific/industry knowledge.
   - The uploaded notes lack sufficient detail to answer the user's question completely.

CRITICAL RULES FOR RESPONSE CRAFTING (GEMINI & CHATGPT STYLE):
1. NEVER dump raw database snippets, JSON, or rough unformatted chunks.
2. EVALUATE & SYNTHESIZE: Read the retrieved notes or web facts, evaluate them against what the student asked, and synthesize a polished, eloquent response.
3. FORMATTING STANDARDS:
   - Use clean Markdown with headers (###), bold key terms, and bullet points with strong lead-ins.
   - Include an intuitive real-world analogy to make abstract mechanisms click.
   - Highlight exam traps using:
     > ⚠️ **Common Exam Trap**: ...
   - If comparing notes with web knowledge, clearly differentiate:
     *"In your course syllabus notes: ... Whereas in modern practice / external context: ..."*
   - At the end, provide clean reference badges:
     *📚 References: [Course Document / Section] or [Web Knowledge: Source]*
4. CONVERSATIONAL MEMORY & ADAPTIVITY:
   - Understand the flow of conversation.
   - If the student says "explain simpler", "give an example", or "compare this with X", naturally build on the previous dialog.`;

    const result = streamText({
      model: groqProvider(GROQ_MODEL),
      system: systemPrompt,
      messages,
      maxSteps: 4, // Multi-step tool use: search notes -> search web -> evaluate & compare -> stream polished answer
      temperature: 0.3,
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
            "Search external live web knowledge (Wikipedia/encyclopedias) for out-of-topic questions, real-world context, or concepts not covered in the student's notes.",
          parameters: z.object({
            query: z
              .string()
              .describe("Search query for web knowledge (e.g. 'CRISPR cas9 discovery', 'Quantum entanglement')"),
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
