import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";

const http = httpRouter();

export const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validateRequest(req);

  if (!event) {
    return new Response("Error occurred", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      await ctx.runMutation(internal.users.upsertFromClerk, {
        data: event.data,
      });
      break;
    }
    case "user.deleted": {
      break;
    }
    default: {
      console.log("Unknown event type", event.type);
    }
  }

  return new Response(null, { status: 200 });
});

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

async function validateRequest(
  req: Request,
): Promise<WebhookEvent | undefined> {
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (_) {
    console.error("Something went wrong");
    return;
  }

  return evt as unknown as WebhookEvent;
}

export default http;
