import { internal } from "@cvx/_generated/api";
import { mutation, query } from "@cvx/_generated/server";
import { auth } from "@cvx/auth";
import { currencyValidator, PLANS, ROLES, ONBOARDING_STATUS } from "@cvx/schema";
import { asyncMap } from "convex-helpers";
import { v } from "convex/values";
import { User } from "~/types";
import { requireAdmin, requireClient } from "./auth-helpers";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<User | undefined> => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return;
    }
    const [user, subscription] = await Promise.all([
      ctx.db.get(userId),
      ctx.db
        .query("subscriptions")
        .withIndex("userId", (q) => q.eq("userId", userId))
        .unique(),
    ]);
    if (!user) {
      return;
    }
    const plan = subscription?.planId
      ? await ctx.db.get(subscription.planId)
      : undefined;
    const avatarUrl = user.imageId
      ? await ctx.storage.getUrl(user.imageId)
      : user.image;
    return {
      ...user,
      avatarUrl: avatarUrl || undefined,
      subscription:
        subscription && plan
          ? {
              ...subscription,
              planKey: plan.key,
            }
          : undefined,
    };
  },
});

export const updateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return;
    }
    await ctx.db.patch(userId, { username: args.username });
  },
});

export const completeOnboarding = mutation({
  args: {
    username: v.string(),
    currency: currencyValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return;
    }
    await ctx.db.patch(userId, { username: args.username });
    if (user.customerId) {
      return;
    }
    await ctx.scheduler.runAfter(
      0,
      internal.stripe.PREAUTH_createStripeCustomer,
      {
        currency: args.currency,
        userId,
      },
    );
  },
});

export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal(ROLES.ADMIN), v.literal(ROLES.CLIENT)),
  },
  handler: async (ctx, args) => {
    // Only admins can set roles
    await requireAdmin(ctx);
    
    // Update the user's role
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const submitClientOnboarding = mutation({
  args: {
    fullName: v.string(),
    businessName: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    country: v.string(),
    businessDescription: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the current user
    const { user } = await requireClient(ctx);
    
    // Generate a unique identifier for the client
    const uniqueIdentifier = `client-${Math.random().toString(36).substring(2, 15)}`;
    
    // Create or update the client profile
    const existingProfile = await ctx.db
      .query("clientProfiles")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();
    
    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        fullName: args.fullName,
        businessName: args.businessName,
        phone: args.phone,
        address: args.address,
        city: args.city,
        state: args.state,
        zipCode: args.zipCode,
        country: args.country,
        businessDescription: args.businessDescription,
        onboardingCompletedAt: Date.now(),
      });
    } else {
      // Create new profile
      await ctx.db.insert("clientProfiles", {
        userId: user._id,
        fullName: args.fullName,
        businessName: args.businessName,
        phone: args.phone,
        address: args.address,
        city: args.city,
        state: args.state,
        zipCode: args.zipCode,
        country: args.country,
        businessDescription: args.businessDescription,
        onboardingCompletedAt: Date.now(),
        uniqueIdentifier,
      });
    }
    
    // Update the user's onboarding status
    await ctx.db.patch(user._id, {
      onboardingStatus: ONBOARDING_STATUS.COMPLETED,
    });
  },
});

export const approveClientOnboarding = mutation({
  args: {
    clientId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Only admins can approve onboarding
    const { user: adminUser } = await requireAdmin(ctx);
    
    // Get the client profile
    const clientProfile = await ctx.db
      .query("clientProfiles")
      .withIndex("userId", (q) => q.eq("userId", args.clientId))
      .unique();
    
    if (!clientProfile) {
      throw new Error("Client profile not found");
    }
    
    // Update the client profile
    await ctx.db.patch(clientProfile._id, {
      onboardingApprovedAt: Date.now(),
      onboardingApprovedBy: adminUser._id,
    });
    
    // Update the user's onboarding status
    await ctx.db.patch(args.clientId, {
      onboardingStatus: ONBOARDING_STATUS.APPROVED,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateUserImage = mutation({
  args: {
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return;
    }
    ctx.db.patch(userId, { imageId: args.imageId });
  },
});

export const removeUserImage = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return;
    }
    ctx.db.patch(userId, { imageId: undefined, image: undefined });
  },
});

export const getActivePlans = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return;
    }
    const [free, pro] = await asyncMap(
      [PLANS.FREE, PLANS.PRO] as const,
      (key) =>
        ctx.db
          .query("plans")
          .withIndex("key", (q) => q.eq("key", key))
          .unique(),
    );
    if (!free || !pro) {
      throw new Error("Plan not found");
    }
    return { free, pro };
  },
});

export const deleteCurrentUserAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .unique();
    if (!subscription) {
      console.error("No subscription found");
    } else {
      await ctx.db.delete(subscription._id);
      await ctx.scheduler.runAfter(
        0,
        internal.stripe.cancelCurrentUserSubscriptions,
      );
    }
    await ctx.db.delete(userId);
    await asyncMap(["resend-otp", "github"], async (provider) => {
      const authAccount = await ctx.db
        .query("authAccounts")
        .withIndex("userIdAndProvider", (q) =>
          q.eq("userId", userId).eq("provider", provider),
        )
        .unique();
      if (!authAccount) {
        return;
      }
      await ctx.db.delete(authAccount._id);
    });
  },
});
