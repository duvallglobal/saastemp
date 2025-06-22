import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { ROLES } from "@cvx/schema";
import { User } from "~/types";

/**
 * Hook to get the current user with role information
 */
export function useCurrentUser() {
  return useQuery(convexQuery(api.app.getCurrentUser, {}));
}

/**
 * Check if the user has admin role
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.role === ROLES.ADMIN;
}

/**
 * Check if the user has client role
 */
export function isClient(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.role === ROLES.CLIENT;
}

/**
 * Check if the user has completed onboarding
 */
export function hasCompletedOnboarding(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.onboardingStatus === "completed" || user.onboardingStatus === "approved";
}

/**
 * Check if the user needs to be redirected to onboarding
 */
export function needsOnboarding(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isAdmin(user)) return false; // Admins don't need onboarding
  return !hasCompletedOnboarding(user);
}

/**
 * Get the appropriate redirect path based on user role and onboarding status
 */
export function getRedirectPath(user: User | null | undefined): string {
  if (!user) return "/login";
  
  // If user is an admin, redirect to admin dashboard
  if (isAdmin(user)) {
    return "/_app/_auth/admin";
  }
  
  // If user is a client who needs onboarding, redirect to onboarding
  if (isClient(user) && needsOnboarding(user)) {
    return "/_app/_auth/client/onboarding";
  }
  
  // Otherwise, redirect to client dashboard
  return "/_app/_auth/client";
}

