import { v, Validator } from "convex/values";
import { internalMutation, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { Id } from "./_generated/dataModel";

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const user = await getUserByClerkId(ctx, data.id);

    if (user === null) {
      await ctx.db.insert("users", {
        clerk_id: data.id,
        email: data.email_addresses[0].email_address,
        username: data.username!,
        first_name: data.first_name!,
        last_name: data.last_name!,
        description: "",
        image_url: data.image_url,
        streak: 0,
        sets: [],
      });
    } else {
      await ctx.db.patch(user._id, {
        clerk_id: data.id,
        email: data.email_addresses[0].email_address,
        username: data.username!,
        first_name: data.first_name!,
        last_name: data.last_name!,
        image_url: data.image_url,
      });
    }
  },
});

// Helpers

async function getUserByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerkId))
    .unique();
}

/**
 * Get user by their id in Convex database
 */
async function getUserById(ctx: QueryCtx, id: Id<"users">) {
  return await ctx.db.get(id);
}

async function getCurrentUser(ctx: QueryCtx) {
  const currentIdentify = await ctx.auth.getUserIdentity();
  if (!currentIdentify) {
    return null;
  }
  return await getUserByClerkId(ctx, currentIdentify.subject);
}

/**
 * Always return an user
 */
async function getCurrentUserSafe(ctx: QueryCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Can't get current user");
  return user;
}
