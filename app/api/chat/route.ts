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

    const systemPrompt = `You are an elite academic AI tutor, built to deliver the polished, articulate, and natural prose of ChatGPT and Gemini.

CURRENT STUDY CONTEXT: ${activeTopicName || "General Course Materials"}

CRITICAL WRITING & PRESENTATION STANDARDS:
1. Direct Academic Focus:
   - Address the student's question immediately and thoroughly.
   - NEVER discuss your internal architecture, tools, function names (such as "searchUploadedNotes" or "searchWeb"), or "behind-the-scenes" mechanics.
   - Do not write meta-commentary explaining how you searched or retrieved data. Simply present the verified academic knowledge seamlessly.

2. Zero Gimmick Emojis & Zero Raw LaTeX Syntax:
   - Absolutely DO NOT use emoji numbers (such as 1️⃣, 2️⃣, 3️⃣) or emoji icons (such as 📚, 💡, 🔍, ⚠️).
   - NEVER output raw LaTeX syntax like \\[ ... \\], \\( ... \\), \\frac, \\text, or \\times.
   - Write all formulas and equations in clean, readable plain text (e.g. "Work = Force × Displacement (Joules)", "Power = Work / Time (Watts)").
   - Use clean, standard, professional Markdown formatting:
     - Clear, descriptive section headings (### Concept Overview, ### Step-by-Step Mechanism, ### Common Exam Pitfalls).
     - Standard numbered lists (1., 2.) for sequential steps.
     - Clean bullet points (- or *) with bold keywords for lists of components.
     - Tables where side-by-side or step-by-step comparisons add clarity.
     - Bold technical terms naturally for reading comfort.

3. Complete, High-Yield Explanations:
   - Begin with a direct, comprehensive explanation of the core concept.
   - Break down the underlying mechanism logically from start to finish.
   - Emphasize common exam misconceptions and critical nuances where students frequently lose marks.
   - If the student asks for real-world context, compare the syllabus notes with modern scientific applications naturally.
   - End with a clean, unobtrusive reference line in italics (e.g. *Reference: Campbell Biology, Chapter 9*).

4. Conversational Continuity:
   - Maintain natural memory of prior questions.
   - If the student asks to clarify a previous step or simplify, adapt your explanation smoothly without restarting from scratch.`;

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
