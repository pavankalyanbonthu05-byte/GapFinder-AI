import Groq from "groq-sdk";
import { createGroq } from "@ai-sdk/groq";

const apiKey = process.env.GROQ_API_KEY || "";

export const groqClient = new Groq({
  apiKey: apiKey,
});

export const groqProvider = createGroq({
  apiKey: apiKey,
});

// The standard high-speed versatile model
export const GROQ_MODEL = "llama-3.3-70b-versatile";
