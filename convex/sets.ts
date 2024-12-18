import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query

export const getSharedSets = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const sharedSets = await ctx.db.query("sets").collect();

    return sharedSets.filter((obj) => obj.shared_with.includes(userId));
  },
});

export const getSets = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("sets")
      .withIndex("by_user", (q) => q.eq("owner", userId))
      .collect();
  },
});

export const getSetById = query({
  args: { setId: v.id("sets") },
  handler: async (ctx, { setId }) => {
    return await ctx.db.get(setId);
  },
});

// Mutation

export const updateSharedWith = mutation({
  args: {
    setId: v.id("sets"),
    userId: v.id("users"),
    action: v.union(v.literal("add"), v.literal("remove")),
  },
  handler: async (ctx, { setId, userId, action }) => {
    const existingSet = await ctx.db.get(setId);

    if (!existingSet) {
      throw new Error("Set not found");
    }

    let updatedSharedWith;

    if (action === "add") {
      updatedSharedWith = existingSet.shared_with.includes(userId)
        ? existingSet.shared_with
        : [...existingSet.shared_with, userId];
    } else {
      updatedSharedWith = existingSet.shared_with.filter(
        (userId) => userId !== userId,
      );
    }

    await ctx.db.patch(setId, {
      shared_with: updatedSharedWith,
    });

    return updatedSharedWith;
  },
});

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
      shared_with: [],
      owner: userId,
    });
  },
});
