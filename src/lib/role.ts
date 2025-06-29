import { auth } from "@clerk/nextjs/server";

export async function getRole() {
  const { sessionClaims } = await auth();
  return (sessionClaims?.metadata as { role: string })?.role || "admin";
}

export async function getCurrentUserId() {
  const { userId } = await auth();
  return userId;
}

// Temporary fallback exports to prevent build errors
// These should be replaced with async function calls in all pages
export const role = "admin" as "admin" | "teacher" | "student" | "parent";
export const currentUserId = "temp-user-id";
