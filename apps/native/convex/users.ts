import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const createUser = internalMutation({
  args: {
    clerk_id: v.string(),
    email: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    username: v.string(),
    description: v.optional(v.string()),
    image_url: v.optional(v.string()),
    streak: v.number(),
    sets: v.array(v.id("sets")),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", { ...args });

    return userId;
  },
});
