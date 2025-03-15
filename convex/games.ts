import { query } from './_generated/server';

export const getPrompt = query({
  args: {},
  handler: async (ctx) => {
    // return await ctx.db.query('games').collect();
    return 'bruh';
  },
});
