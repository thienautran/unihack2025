import { v } from 'convex/values';
import { query } from './_generated/server';

export const getGamesList = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('games').collect();
  },
});

export const getGamePrompt = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, args) => {
    return ctx.db.get(args.gameId);
  },
});
