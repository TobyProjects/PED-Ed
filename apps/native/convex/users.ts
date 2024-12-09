import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUserByClerkId = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerk_id"), args.clerkId))
      .unique();

    /**
     * if (!user?.image_url || user.image_url.startsWith("http")) {
      return user;
    }

    const url = await ctx.storage.getUrl(user.image_url as Id<"_storage">);
     */

    return {
      ...user,
    };
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user?.image_url || user.image_url.startsWith("http")) {
      return user;
    }

    const url = await ctx.storage.getUrl(user.image_url as Id<"_storage">);

    return {
      ...user,
      image_url: url,
    };
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
