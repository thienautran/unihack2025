'use server';

export async function getGameList() {
  return ['uno', 'chess'];
}

export async function getGamePrompt(gameId) {
  const prompt = 'give me the description for the provided card';

  return prompt;
}
