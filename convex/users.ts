import { v, Validator } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { Id } from "./_generated/dataModel";

// Query

export const getUserByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const user = await ctx.db
      .query("users")
      .withSearchIndex("searchUsers", (q) => q.search("username", username))
      .unique();

    if (!user?.image_url || user.image_url.startsWith("http")) {
      return user;
    }

    const url = await ctx.storage.getUrl(user.image_url as Id<"_storage">);
    user.image_url = url!;
    return user;
  },
});

export const getUserByClerkId = query({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, { clerk_id }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerk_id"), clerk_id))
      .unique();

    if (!user?.image_url || user.image_url.startsWith("http")) {
      return user;
    }

    const url = await ctx.storage.getUrl(user.image_url as Id<"_storage">);
    user.image_url = url!;

    return user;
  },
});

// Mutations

export const updateUserAvatar = mutation({
  args: { storageId: v.id("_storage"), _id: v.id("users") },
  handler: async (ctx, { storageId, _id }) => {
    await ctx.db.patch(_id, { image_url: storageId });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  await localGetCurrentUserSafe(ctx); // Only allowed logged in users

  return await ctx.storage.generateUploadUrl();
});

export const setDescription = mutation({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    const user = await localGetCurrentUserSafe(ctx);
    await ctx.db.patch(user._id, { description: content });
  },
});

// Internal mutations
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const user = await localGetUserByClerkId(ctx, data.id);

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
      });
    }
  },
});

/** Delete a user by Clerk id */
export const deleteUser = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const user = await getUserByClerkId(ctx, { clerk_id: id });

    if (user === null) {
      console.warn("Can't delete user, does not exist", id);
    } else {
      await ctx.db.delete(user._id);

      if (!user.image_url.startsWith("http")) {
        await ctx.storage.delete(user.image_url as Id<"_storage">); // TODO: Investigate this
      }
    }
  },
});

// Helpers

async function localGetUserByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerkId))
    .unique();
}

/**
 * Get user by their id in Convex database
 */
async function localGetUserById(ctx: QueryCtx, id: Id<"users">) {
  return await ctx.db.get(id);
}

async function localGetCurrentUser(ctx: QueryCtx) {
  const currentIdentify = await ctx.auth.getUserIdentity();
  if (!currentIdentify) {
    return null;
  }
  return await localGetUserByClerkId(ctx, currentIdentify.subject);
}

/**
 * Always return an user
 */
async function localGetCurrentUserSafe(ctx: QueryCtx) {
  const user = await localGetCurrentUser(ctx);
  if (!user) throw new Error("Can't get current user");
  return user;
}
