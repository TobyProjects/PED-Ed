import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Mutation

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
