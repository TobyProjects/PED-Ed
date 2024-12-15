import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query

export const getFlashcards = query({
  args: { setId: v.id("sets") },
  handler: async (ctx, { setId }) => {
    return await ctx.db
      .query("flashcards")
      .withIndex("by_set", (q) => q.eq("set_id", setId))
      .collect();
  },
});

// Mutation

export const getCardCount = mutation({
  args: { setId: v.id("sets") },
  handler: async (ctx, { setId }) => {
    return (
      await ctx.db
        .query("flashcards")
        .withIndex("by_set", (q) => q.eq("set_id", setId))
        .collect()
    ).length;
  },
});

export const createFlashcard = mutation({
  args: {
    set_id: v.id("sets"),
    name: v.string(),
    term: v.string(),
    definition: v.string(),
    image_url: v.optional(v.string()),
  },
  handler: async (ctx, { set_id, name, term, definition, image_url }) => {
    await ctx.db.insert("flashcards", {
      set_id,
      name,
      term,
      definition,
      image_url: image_url ?? "",
    });
  },
});
