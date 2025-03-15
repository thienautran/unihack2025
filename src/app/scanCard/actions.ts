'use server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// const data = await getImageDescription(imageData, prompt?.prompt);

export async function getImageDescription(
  imageData: any,
  prompt: string | null
) {
  console.log('starting server action');

  // Create a prompt for card identification, including the game prompt if available
  let defaultPrompt =
    'Analyze this image of a gaming card (like Magic: The Gathering, Pokémon, Yu-Gi-Oh!, playing cards etc.). Identify the specific card including its exact name, set, and rarity if visible. Return a JSON response with the following format: {"matchingCards": [{"name": "card name", "confidence": 0.XX}, ...]} - Include the top 4 most likely cards with confidence scores between 0 and 1. Be specific with card names (e.g., \'Charizard GX Rainbow Rare\' rather than just \'Pokémon Card\').';

  // If we have a specific game prompt, include it in the AI request

  if (prompt) {
    defaultPrompt = `${prompt}\n\nAnalyze this image and return a JSON response with the following format: {\"matchingCards\": [{\"name\": \"card name\", \"confidence\": 0.XX}, ...]} - Include the top 4 most likely matches with confidence scores between 0 and 1.`;
  }

  const model = openai('gpt-4o');

  // run the analysis
  const result = await generateText({
    model: model,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: defaultPrompt },
          { type: 'image', image: imageData },
        ],
      },
    ],
  });

  console.log(result.text);

  // Try to parse the JSON response

  // Extract JSON from the response (in case there's additional text)
  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : result.text;

  // Parse the JSON
  const parsedResponse = JSON.parse(jsonStr);

  // Ensure it has the expected format
  if (
    !parsedResponse.matchingCards ||
    !Array.isArray(parsedResponse.matchingCards)
  ) {
    throw new Error('Invalid response format');
  }

  // Add image placeholders to the matching cards
  const matchingCards = parsedResponse.matchingCards.map((card) => ({
    ...card,
    id: Math.random().toString(36).substring(2, 9),
    image: `/api/placeholder/60/90`,
  }));

  console.log('all done');

  return {
    matchingCards: matchingCards,
    rawResponse: result.text,
  };
}
