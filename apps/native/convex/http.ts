import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

export const clerkUser = httpAction(async (ctx, req) => {
  const { data, type } = await req.json();

  switch (type) {
    case "user.created":
      await ctx.runMutation(internal.users.createUser, {
        clerk_id: data.id,
        email: data.email_addresses[0].email_address,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        description: undefined,
        image_url: data.image_url,
        streak: 0,
        sets: [],
      });
      break;
    case "user.updated":
      break;
    case "user.deleted":
      break;
  }

  return new Response(null, { status: 200 });
});

http.route({
  path: "/clerk-user",
  method: "POST",
  handler: clerkUser,
});

export default http;
