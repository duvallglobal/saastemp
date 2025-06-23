import { auth } from "@cvx/auth";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { ROLES } from "./schema";

/**
 * Verify that the current user is authenticated
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return { userId, user };
}

/**
 * Verify that the current user is an admin
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const { userId, user } = await requireAuth(ctx);

  if (user.role !== ROLES.ADMIN) {
    throw new Error("Not authorized - admin access required");
  }

  return { userId, user };
}

/**
 * Verify that the current user is a client
 */
export async function requireClient(ctx: QueryCtx | MutationCtx) {
  const { userId, user } = await requireAuth(ctx);

  if (user.role !== ROLES.CLIENT) {
    throw new Error("Not authorized - client access required");
  }

  return { userId, user };
}

/**
 * Get the current user with role information (returns null if not authenticated)
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) {
    return null;
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    return null;
  }

  return { userId, user };
}

/**
 * Verify user has permission to access a specific client's data
 */
export async function requireClientAccess(ctx: QueryCtx | MutationCtx, targetClientId: string) {
  const { userId, user } = await requireAuth(ctx);

  // Admins can access any client's data
  if (user.role === ROLES.ADMIN) {
    return { userId, user, isAdmin: true };
  }

  // Clients can only access their own data
  if (user.role === ROLES.CLIENT && userId === targetClientId) {
    return { userId, user, isAdmin: false };
  }

  throw new Error("Not authorized to access this client's data");
}

/**
 * Check if user is admin without throwing error
 */
export async function isAdmin(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  try {
    const { user } = await requireAuth(ctx);
    return user.role === ROLES.ADMIN;
  } catch {
    return false;
  }
}

/**
 * Check if user is client without throwing error
 */
export async function isClient(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  try {
    const { user } = await requireAuth(ctx);
    return user.role === ROLES.CLIENT;
  } catch {
    return false;
  }
}

/**
 * Get user role safely (returns null if not authenticated)
 */
export async function getUserRole(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  try {
    const { user } = await requireAuth(ctx);
    return user.role || null;
  } catch {
    return null;
  }
}