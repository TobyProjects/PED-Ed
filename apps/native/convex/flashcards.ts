import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Query

export const getFlashcards = query({
  args: { setId: v.id("sets") },
  handler: async (ctx, { setId }) => {
    const flashcards = await ctx.db
      .query("flashcards")
      .withIndex("by_set", (q) => q.eq("set_id", setId))
      .collect();

    const processedFlashcards = await Promise.all(
      flashcards.map(async (flashcard) => {
        if (flashcard.image_url && !flashcard.image_url.startsWith("http")) {
          const url = await ctx.storage.getUrl(
            flashcard.image_url as Id<"_storage">,
          );
          flashcard.image_url = url!;
        }
        return flashcard;
      }),
    );

    return processedFlashcards;
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
