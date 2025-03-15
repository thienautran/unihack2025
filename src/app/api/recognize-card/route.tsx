// app/api/recognize-card/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the image data from the request
    const { imageData } = await request.json();
    
    if (!imageData) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }
    
    // Convert base64 data URL to base64 string expected by Google API
    const base64Image = imageData.split(',')[1];
    
    // Initialize Google Generative AI client with the correct API
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    };
    
    // Create a prompt for card identification
    const prompt = "Analyze this image of a gaming card (like Magic: The Gathering, Pokémon, Yu-Gi-Oh!, playing cards etc.). Identify the specific card including its exact name, set, and rarity if visible. Return a JSON response with the following format: {\"matchingCards\": [{\"name\": \"card name\", \"confidence\": 0.XX}, ...]} - Include the top 4 most likely cards with confidence scores between 0 and 1. Be specific with card names (e.g., 'Charizard GX Rainbow Rare' rather than just 'Pokémon Card').";
    

    // Generate content with the image
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const responseText = response.text();
    
    // Try to parse the JSON response
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
      
      // Parse the JSON
      const parsedResponse = JSON.parse(jsonStr);
      
      // Ensure it has the expected format
      if (!parsedResponse.matchingCards || !Array.isArray(parsedResponse.matchingCards)) {
        throw new Error("Invalid response format");
      }
      
      // Add image placeholders to the matching cards
      const matchingCards = parsedResponse.matchingCards.map(card => ({
        ...card,
        id: Math.random().toString(36).substring(2, 9),
        image: `/api/placeholder/60/90`
      }));
      
      return NextResponse.json({ 
        matchingCards: matchingCards,
        rawResponse: responseText
      });
    } catch (jsonError) {
      console.error('Error parsing AI response:', jsonError, responseText);
      
      // Fallback response if parsing fails
      return NextResponse.json({ 
        matchingCards: [
          { id: '1', name: "Unknown Card", confidence: 0.5, image: "/api/placeholder/60/90" },
        ],
        error: "Failed to parse card data",
        rawResponse: responseText
      });
    }
  } catch (error) {
    console.error('Error recognizing card:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}