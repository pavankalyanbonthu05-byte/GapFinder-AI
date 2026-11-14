import { streamText, tool } from "ai";
import { z } from "zod";
import { groqProvider, GROQ_MODEL } from "@/lib/groq";
import { retrieveRelevantChunks } from "@/lib/rag/retriever";
import { DocumentChunk } from "@/lib/types";

export const maxDuration = 30; // 30s max for Vercel

export async function POST(req: Request) {
  try {
    const { messages, chunks, activeTopicId, activeTopicName } = await req.json();

    const allChunks: DocumentChunk[] = (chunks as DocumentChunk[]) || [];

    const systemPrompt = `You are "GapFinder AI", a premier academic tutor and knowledge diagnostic expert.
Your mission is to evaluate the student's uploaded notes, synthesize the core facts, and generate a polished, highly pedagogical, and friendly explanation.

ACTIVE TOPIC FOCUS: ${activeTopicName || "All Uploaded Study Materials"}

CRITICAL RULES FOR POLISHED GENERATION:
1. NEVER display raw database chunks, JSON structures, or rough text fragments (like "[CHUNK #1]" or raw metadata).
2. ALWAYS evaluate whether the retrieved data directly answers the student's specific question. If you need more specific details or citations, use the provided "searchStudyNotes" tool to find the exact concept!
3. FRAME EVERY EXPLANATION USING THIS CLEAN, ELEGANT STRUCTURE:
   • 💡 **Intuitive Explanation**: Explain the concept in clear, conversational English using an intuitive analogy where helpful.
   • 🔍 **Key Mechanism / Breakdown**: Bulleted, step-by-step breakdown of how it works.
   • ⚠️ **Exam Blindspot / Common Trap**: Highlight the exact conceptual trap students make on this topic.
   • 📖 **Verified Reference**: Cite the exact Document and Section name at the bottom in a clean tag (e.g. *Source: Campbell Biology, Section 9.2*).

4. CONVERSATIONAL MEMORY & ADAPTIVE TEACHING:
   • Actively remember previous questions and answers in this conversation.
   • If the student asks for simplification (e.g. "I don't understand", "make it simpler"), adapt by breaking it down into smaller steps.
   • If the student asks for deeper exam details, increase technical precision while maintaining clarity.

5. GROUNDING INTEGRITY:
   • Only assert facts verified in the student's uploaded study materials.
   • If a requested detail cannot be found even after searching, state clearly:
     "This specific detail is not covered in your uploaded notes. Here is the closest verified topic covered in your syllabus..."`;

    const result = streamText({
      model: groqProvider(GROQ_MODEL),
      system: systemPrompt,
      messages,
      maxSteps: 3, // allows tool calling -> evaluation -> final polished synthesis
      temperature: 0.2,
      tools: {
        searchStudyNotes: tool({
          description:
            "Search and evaluate the student's uploaded study material, notes, and textbooks for specific concepts, mechanisms, or exam terms.",
          parameters: z.object({
            searchQuery: z
              .string()
              .describe("The specific academic term, concept, or mechanism to search for"),
            topicFilter: z
              .string()
              .optional()
              .describe("Optional topic id to constrain search"),
          }),
          execute: async ({ searchQuery, topicFilter }) => {
            const filterToUse = topicFilter || activeTopicId || undefined;
            const matches = retrieveRelevantChunks(searchQuery, allChunks, 4, filterToUse);

            if (matches.length === 0) {
              // Try broader search across all topics if filtered search yielded 0
              const broader = retrieveRelevantChunks(searchQuery, allChunks, 3);
              return broader.map((c) => ({
                documentTitle: c.docTitle,
                section: c.section,
                pageOrChapter: c.pageOrSlide || "N/A",
                passage: c.content,
              }));
            }

            return matches.map((c) => ({
              documentTitle: c.docTitle,
              section: c.section,
              pageOrChapter: c.pageOrSlide || "N/A",
              passage: c.content,
            }));
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
