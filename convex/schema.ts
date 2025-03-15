import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  games: defineTable({
    name: v.string(),
    prompt: v.string(),
  }),
});
