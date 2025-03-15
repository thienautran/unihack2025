import OpenAI from 'openai'; 
import { NextResponse } from 'next/server';  

export async function getImageDescription(imageData, gamePrompt) {
  try {
    console.log("Calling analyze-card API...");
    
    // Create the request to send to the API
    const response = await fetch('/api/analyze-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        imageData, 
        gamePrompt 
      }),
    });

    console.log("API response status:", response.status);
    
    // Get response as text first
    const responseText = await response.text();
    console.log("Raw API response:", responseText);
    
    // Then try to parse it as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse API response as JSON:", parseError);
      
      // Create a fallback response
      return {
        matchingCards: [
          { 
            id: '1', 
            name: "Unable to identify card", 
            confidence: 0.5, 
            image: "/api/placeholder/60/90" 
          }
        ],
        error: "Failed to parse API response"
      };
    }
    
    // Return the parsed data
    return data;
  } catch (error) {
    console.error('Error in getImageDescription:', error);
    
    // Return a fallback response so the UI can still show something
    return {
      matchingCards: [
        { 
          id: '1', 
          name: "Error analyzing card", 
          confidence: 0.5, 
          image: "/api/placeholder/60/90" 
        }
      ],
      error: error.message || "Unknown error"
    };
  }
}

// API route handler for /api/analyze-card
export async function POST(request) {
  console.log("API route handler started");
  
  try {
    // Parse the request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json({ 
        error: 'Invalid request format',
        matchingCards: [{ id: '1', name: "Invalid Request", confidence: 0.5, image: "/api/placeholder/60/90" }]
      }, { status: 400 });
    }
    
    const { imageData, gamePrompt } = requestBody;
    
    if (!imageData) {
      console.error("No image data provided");
      return NextResponse.json({ 
        error: 'No image data provided',
        matchingCards: [{ id: '1', name: "No Image Data", confidence: 0.5, image: "/api/placeholder/60/90" }]
      }, { status: 400 });
    }
    
    // Get OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('OpenAI API Key exists:', !!apiKey);
    
    if (!apiKey) {
      console.error('Missing OpenAI API key in environment');
      return NextResponse.json({ 
        error: 'Configuration error: Missing API key',
        matchingCards: [{ id: '1', name: "Configuration Error", confidence: 0.5, image: "/api/placeholder/60/90" }]
      }, { status: 500 });
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey
    });

    // Create prompt for card identification
    let prompt = "Analyze this image of a gaming card. Identify the specific card including its exact name, set, and rarity if visible. Your response must be valid JSON in exactly this format MAKE SURE THIS FORMAT!!: {\"matchingCards\": [{\"name\": \"card name\", \"confidence\": 0.95}]}";
    
    if (gamePrompt) {
      prompt = `${gamePrompt}\n\nYour response must be valid JSON in exactly this format  MAKE SURE THIS FORMAT!!: {\"matchingCards\": [{\"name\": \"card name\", \"confidence\": 0.95}]}`;
    }

    console.log("Calling OpenAI API...");
    
    try {
      // Make request to OpenAI
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a card recognition assistant. You only respond with JSON in the exact format requested. Never include explanations or additional text."
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: imageData,
                },
              },
            ],
          },
        ],
        max_tokens: 1024,
        response_format: { type: "json_object" },
      });

      const responseContent = aiResponse.choices[0].message.content;
      console.log("OpenAI raw response:", responseContent);
      
      // Attempt to parse JSON response
      let cardData;
      try {
        cardData = JSON.parse(responseContent);
        
        if (!cardData.matchingCards || !Array.isArray(cardData.matchingCards)) {
          throw new Error("Invalid response format from OpenAI");
        }
      } catch (jsonError) {
        console.error("Failed to parse OpenAI response:", jsonError);
        
        // Create a manual response with default data
        cardData = {
          matchingCards: [{ name: "Unknown Card", confidence: 0.5 }]
        };
      }
      
      // Ensure all cards have necessary properties
      const matchingCards = cardData.matchingCards.map(card => ({
        id: Math.random().toString(36).substring(2, 9),
        name: card.name || "Unnamed Card",
        confidence: card.confidence || 0.5,
        image: `/api/placeholder/60/90`
      }));
      
      console.log("Returning processed card data:", matchingCards);
      
      // Return the processed card data
      return NextResponse.json({
        matchingCards: matchingCards,
        success: true
      });
      
    } catch (aiError) {
      console.error("OpenAI API error:", aiError);
      
      // Return a fallback response with error information
      return NextResponse.json({ 
        error: 'Error communicating with AI service: ' + aiError.message,
        matchingCards: [{ id: '1', name: "AI Service Error", confidence: 0.5, image: "/api/placeholder/60/90" }]
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("General error in API route:", error);
    
    // Return a fallback response for any unexpected errors
    return NextResponse.json({ 
      error: 'Unexpected error: ' + error.message,
      matchingCards: [{ id: '1', name: "Processing Error", confidence: 0.5, image: "/api/placeholder/60/90" }]
    }, { status: 500 });
  }
}