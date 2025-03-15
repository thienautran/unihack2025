// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json(); // Get messages from frontend
//     const chatModel = genAI.getGenerativeModel({ model: "gemini-pro" });

//     // Extract the last user message to send to Gemini
//     const userMessage = messages[messages.length - 1].content;

//     const result = await chatModel.generateContent({
//       contents: [{ role: "user", parts: [{ text: userMessage }] }],
//     });

//     // Extract the assistant's response
//     const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

//     return new Response(JSON.stringify({ message: responseText }), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return new Response(JSON.stringify({ error: "Failed to fetch AI response" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
//     const chatModel = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const userMessage = messages[messages.length - 1].content;

//     const result = await chatModel.generateContent({
//       contents: [{ role: "user", parts: [{ text: userMessage }] }],
//     });

//     const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

//     return new Response(JSON.stringify({ message: responseText }), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "Failed to fetch AI response" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// // ✅ Add a GET method for debugging
// export async function GET() {
//   return new Response(JSON.stringify({ message: "API is working! Use POST instead." }), {
//     headers: { "Content-Type": "application/json" },
//     status: 200,
//   });
// }


// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// export async function GET() {
//   try {
//     const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Hardcoded test query
//     const testQuestion = "What is the capital of france?";

//     const result = await chatModel.generateContent({
//       contents: [{ role: "user", parts: [{ text: testQuestion }] }],
//     });

//     const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

//     console.log("Gemini Flash API Response:", responseText);

//     return new Response(JSON.stringify({ message: responseText }), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return new Response(JSON.stringify({ error: "Failed to fetch AI response" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

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
