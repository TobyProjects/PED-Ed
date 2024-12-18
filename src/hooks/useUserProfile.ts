import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useUserProfile() {
  const { user } = useUser();
  const clerkId = user?.id;

  if (!clerkId) {
    throw new Error("User is not logged in");
  }

  const userProfile = useQuery(api.users.getUserByClerkId, {
    clerk_id: clerkId,
  });

  return { userProfile };
}
