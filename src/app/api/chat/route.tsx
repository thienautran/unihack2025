// import { google } from "@ai-sdk/google";
// import { generateText } from "ai";

// export async function GET() {
//   try {
//     // Hardcoded test question
//     const testQuestion = "What is the capital of France?";

//     // Use Gemini 1.5 Flash model
//     const model = google("gemini-1.5-flash");

//     // Generate response
//     const result = await generateText({
//       model,
//       prompt: testQuestion,
//     });

//     console.log("Gemini AI Response:", result.text); // Log response to terminal

//     return new Response(JSON.stringify({ message: result.text }), {
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
import { streamText } from "ai";
import fs from "fs";
import path from "path";

export const maxDuration = 60; // Max execution time

export async function GET() {
  try {
    // Define the path to the local image
    const imagePath = path.join(process.cwd(), "src/app/resource/image/download.png");

    // Read the image file and convert it to a Base64 string
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    // Initialize the Gemini model
    const model = google("gemini-1.5-flash");

    // Stream the response by sending a message with both text and image parts
    const result = streamText({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What flag is this?" },
            { type: "image", image: imageBase64 },
          ],
        },
      ],
    });

    // Return streaming response to client
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
