import Groq from "groq-sdk";
import { createGroq } from "@ai-sdk/groq";

const apiKey = process.env.GROQ_API_KEY || "";

export const groqClient = new Groq({
  apiKey: apiKey,
});

export const groqProvider = createGroq({
  apiKey: apiKey,
});

// Primary verified model for this Groq key: openai/gpt-oss-120b
// Fallback: openai/gpt-oss-20b
export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
export const GROQ_FALLBACK_MODEL = "openai/gpt-oss-20b";

export async function createGroqChatCompletion(params: any) {
  try {
    return await groqClient.chat.completions.create({
      ...params,
      model: params.model || GROQ_MODEL,
    });
  } catch (err: any) {
    console.warn(
      `Primary model ${params.model || GROQ_MODEL} failed, falling back to ${GROQ_FALLBACK_MODEL}:`,
      err?.message
    );
    return await groqClient.chat.completions.create({
      ...params,
      model: GROQ_FALLBACK_MODEL,
    });
  }
}
