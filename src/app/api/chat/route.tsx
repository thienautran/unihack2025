

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  try {
    // Hardcoded test question
    const testQuestion = "What is the capital of France?";

    // Use Gemini 1.5 Flash model
    const model = google("gemini-1.5-flash");

    // Generate response
    const result = await generateText({
      model,
      prompt: testQuestion,
    });

    console.log("Gemini AI Response:", result.text); // Log response to terminal

    return new Response(JSON.stringify({ message: result.text }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
