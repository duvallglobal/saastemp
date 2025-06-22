import { v } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { ROLES } from "./schema";

/**
 * Verify that the current user is authenticated
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

/**
 * Verify that the current user is an admin
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await requireAuth(ctx);
  
  // Get the user from the database
  const user = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", identity.email))
    .first();
  
  if (!user || user.role !== ROLES.ADMIN) {
    throw new Error("Not authorized - admin access required");
  }
  
  return { identity, user };
}

/**
 * Verify that the current user is a client
 */
export async function requireClient(ctx: QueryCtx | MutationCtx) {
  const identity = await requireAuth(ctx);
  
  // Get the user from the database
  const user = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", identity.email))
    .first();
  
  if (!user || user.role !== ROLES.CLIENT) {
    throw new Error("Not authorized - client access required");
  }
  
  return { identity, user };
}

/**
 * Get the current user with role information
 */
export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  
  // Get the user from the database
  const user = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", identity.email))
    .first();
  
  if (!user) {
    return null;
  }
  
  return user;
}

