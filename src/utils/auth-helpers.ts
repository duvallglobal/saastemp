import { User } from "~/types";
import { ROLES, ONBOARDING_STATUS, SERVICE_TYPES } from "@cvx/schema";

/**
 * Check if a user is an admin
 */
export function isAdmin(user: User | undefined): boolean {
  if (!user) return false;
  return user.role === ROLES.ADMIN;
}

/**
 * Check if a user is a client
 */
export function isClient(user: User | undefined): boolean {
  if (!user) return false;
  return user.role === ROLES.CLIENT;
}

/**
 * Check if a user needs to complete onboarding
 */
export function needsOnboarding(user: User | undefined): boolean {
  if (!user) return false;
  return (
    user.role === ROLES.CLIENT &&
    (!user.onboardingStatus ||
      user.onboardingStatus === ONBOARDING_STATUS.NOT_STARTED ||
      user.onboardingStatus === ONBOARDING_STATUS.IN_PROGRESS)
  );
}

/**
 * Check if a user has completed onboarding but is waiting for approval
 */
export function isOnboardingPending(user: User | undefined): boolean {
  if (!user) return false;
  return (
    user.role === ROLES.CLIENT &&
    user.onboardingStatus === ONBOARDING_STATUS.COMPLETED
  );
}

/**
 * Check if a user has approved onboarding
 */
export function isOnboardingApproved(user: User | undefined): boolean {
  if (!user) return false;
  return (
    user.role === ROLES.CLIENT &&
    user.onboardingStatus === ONBOARDING_STATUS.APPROVED
  );
}

/**
 * Check if a user is an OnlyFans client
 */
export function isOnlyFansClient(user: User | undefined): boolean {
  if (!user) return false;
  return (
    user.role === ROLES.CLIENT &&
    (user.serviceType === SERVICE_TYPES.ONLYFANS || user.serviceType === SERVICE_TYPES.BOTH)
  );
}

/**
 * Check if a user is a Rent.Men client
 */
export function isRentMenClient(user: User | undefined): boolean {
  if (!user) return false;
  return (
    user.role === ROLES.CLIENT &&
    (user.serviceType === SERVICE_TYPES.RENTMEN || user.serviceType === SERVICE_TYPES.BOTH)
  );
}

/**
 * Get the appropriate redirect path based on user role and onboarding status
 */
export function getRedirectPath(user: User | undefined): string {
  if (!user) return "/login";
  
  if (isAdmin(user)) {
    return "/_app/_auth/admin/";
  }
  
  if (isClient(user)) {
    if (needsOnboarding(user)) {
      return "/_app/_auth/client/onboarding/";
    }
    return "/_app/_auth/client/";
  }
  
  return "/login";
}

