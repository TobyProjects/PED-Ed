import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query

export const getSets = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.query("sets").withIndex("by_user", (q) => q.eq("owner", userId)).collect();
  },
});

// Mutation

export const createSet = mutation({
  args: {
    name: v.string(),
    userId: v.id("users"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { name, description, userId }) => {
    await ctx.db.insert("sets", {
      name,
      description: description ?? "",
      public: false,
      flashcards: [],
      owner: userId,
    });
  },
});
