import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const User = {
  clerk_id: v.string(),
  username: v.string(),
  email: v.string(),
  first_name: v.string(),
  last_name: v.string(),
  description: v.optional(v.string()),
  image_url: v.string(),
  streak: v.number(),
  sets: v.array(v.id("sets")),
};

export const Set = {
  owner: v.id("users"),
  name: v.string(),
  description: v.string(),
  public: v.boolean(),
  flashcards: v.array(v.id("flashcards")),
};

export const Flashcard = {
  set_id: v.id("sets"),
  name: v.string(),
  term: v.string(),
  definition: v.string(),
  image_url: v.optional(v.string()),
};

export default defineSchema({
  users: defineTable(User).index("by_clerk_id", ["clerk_id"]),
  sets: defineTable(Set),
  flashcards: defineTable(Flashcard),
});
