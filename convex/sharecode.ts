import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { generateRandomCode } from "@/utils/random";

// Mutation

export const getSetIdFromCode = mutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, { code }) => {
    const shareCode = await ctx.db
      .query("share_codes")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();

    if (!shareCode) {
      throw new Error("Code not found");
    }

    return shareCode.set_id;
  },
});

export const createShareCode = mutation({
  args: {
    setId: v.id("sets"),
  },
  handler: async (ctx, { setId }) => {
    const randomCode = generateRandomCode();
    await ctx.db.insert("share_codes", {
      code: randomCode,
      set_id: setId,
    });

    return randomCode;
  },
});

export const isCodeExist = mutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, { code }) => {
    const shareCode = await ctx.db
      .query("share_codes")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
    return shareCode != null;
  },
});
