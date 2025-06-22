import { internal } from "@cvx/_generated/api";
import { mutation, query } from "@cvx/_generated/server";
import { auth } from "@cvx/auth";
import { 
  currencyValidator, 
  PLANS, 
  ROLES, 
  ONBOARDING_STATUS, 
  APPOINTMENT_STATUS,
  appointmentTypeValidator,
  serviceTypeValidator,
  facialVisibilityValidator
} from "@cvx/schema";
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

export const createAppointment = mutation({
  args: {
    clientId: v.id("users"),
    appointmentType: appointmentTypeValidator,
    location: v.optional(v.string()),
    date: v.string(),
    startTime: v.string(),
    duration: v.string(),
    durationDetails: v.optional(v.string()),
    services: v.string(),
    rate: v.number(),
  },
  handler: async (ctx, args) => {
    // Only admins can create appointments
    const { user: adminUser } = await requireAdmin(ctx);
    
    // Create the appointment
    const appointmentId = await ctx.db.insert("appointments", {
      createdBy: adminUser._id,
      clientId: args.clientId,
      appointmentType: args.appointmentType,
      location: args.location,
      date: args.date,
      startTime: args.startTime,
      duration: args.duration,
      durationDetails: args.durationDetails,
      services: args.services,
      rate: args.rate,
      status: APPOINTMENT_STATUS.PENDING,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return appointmentId;
  },
});

export const respondToAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"),
    approved: v.boolean(),
    responseNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Only clients can respond to appointments
    const { user: clientUser } = await requireClient(ctx);
    
    // Get the appointment
    const appointment = await ctx.db.get(args.appointmentId);
    
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    
    // Verify that the appointment belongs to this client
    if (appointment.clientId !== clientUser._id) {
      throw new Error("Not authorized to respond to this appointment");
    }
    
    // Update the appointment
    await ctx.db.patch(args.appointmentId, {
      status: args.approved ? APPOINTMENT_STATUS.APPROVED : APPOINTMENT_STATUS.REJECTED,
      respondedAt: Date.now(),
      responseNotes: args.responseNotes,
      updatedAt: Date.now(),
    });
  },
});

export const submitClientOnboarding = mutation({
  args: {
    // Service Selection
    serviceType: serviceTypeValidator,
    
    // Basic Information
    legalFullName: v.string(),
    preferredName: v.optional(v.string()),
    dateOfBirth: v.string(),
    phone: v.string(),
    location: v.string(),
    
    // Identity Verification - we'll handle file uploads separately
    
    // Privacy & Persona
    hasOnlinePersona: v.boolean(),
    stageNames: v.optional(v.string()),
    facialVisibility: facialVisibilityValidator,
    privacyConcerns: v.optional(v.string()),
    
    // Account Access
    accountCreationOption: v.optional(v.string()),
    
    // Additional fields
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    businessName: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the current user
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Update the user's service type and role
    await ctx.db.patch(userId, {
      role: ROLES.CLIENT,
      serviceType: args.serviceType,
      onboardingStatus: ONBOARDING_STATUS.COMPLETED,
    });
    
    // Generate a unique identifier for the client
    const uniqueIdentifier = `client-${Math.random().toString(36).substring(2, 15)}`;
    
    // Create or update the client profile
    const existingProfile = await ctx.db
      .query("clientProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .unique();
    
    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        legalFullName: args.legalFullName,
        preferredName: args.preferredName,
        dateOfBirth: args.dateOfBirth,
        phone: args.phone,
        address: args.address,
        city: args.city,
        state: args.state,
        zipCode: args.zipCode,
        country: args.country,
        serviceType: args.serviceType,
        hasOnlinePersona: args.hasOnlinePersona,
        stageNames: args.stageNames,
        facialVisibility: args.facialVisibility,
        privacyConcerns: args.privacyConcerns,
        accountCreationOption: args.accountCreationOption,
        businessName: args.businessName,
        businessDescription: args.businessDescription,
        onboardingCompletedAt: Date.now(),
      });
    } else {
      // Create new profile
      await ctx.db.insert("clientProfiles", {
        userId,
        legalFullName: args.legalFullName,
        preferredName: args.preferredName,
        dateOfBirth: args.dateOfBirth,
        phone: args.phone,
        address: args.address,
        city: args.city,
        state: args.state,
        zipCode: args.zipCode,
        country: args.country,
        serviceType: args.serviceType,
        hasOnlinePersona: args.hasOnlinePersona,
        stageNames: args.stageNames,
        facialVisibility: args.facialVisibility,
        privacyConcerns: args.privacyConcerns,
        accountCreationOption: args.accountCreationOption,
        businessName: args.businessName,
        businessDescription: args.businessDescription,
        onboardingCompletedAt: Date.now(),
        uniqueIdentifier,
      });
    }
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

export const getClientAppointments = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the current user
    const { user } = await requireClient(ctx);
    
    // Query appointments
    let appointmentsQuery = ctx.db
      .query("appointments")
      .withIndex("clientId", (q) => q.eq("clientId", user._id));
    
    // Filter by status if provided
    if (args.status) {
      appointmentsQuery = appointmentsQuery.filter((q) => 
        q.eq(q.field("status"), args.status)
      );
    }
    
    // Get the appointments
    const appointments = await appointmentsQuery.collect();
    
    // Get the admin users who created the appointments
    const adminUsers = await asyncMap(
      [...new Set(appointments.map((a) => a.createdBy))],
      (adminId) => ctx.db.get(adminId)
    );
    
    // Map admin users by ID for easy lookup
    const adminMap = new Map(
      adminUsers.filter(Boolean).map((admin) => [admin!._id, admin])
    );
    
    // Return appointments with admin info
    return appointments.map((appointment) => ({
      ...appointment,
      admin: adminMap.get(appointment.createdBy),
    }));
  },
});

export const getAdminAppointments = query({
  args: {
    status: v.optional(v.string()),
    clientId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Only admins can view all appointments
    await requireAdmin(ctx);
    
    // Start with base query
    let appointmentsQuery = ctx.db.query("appointments");
    
    // Filter by client if provided
    if (args.clientId) {
      appointmentsQuery = appointmentsQuery.withIndex("clientId", (q) => 
        q.eq("clientId", args.clientId)
      );
    }
    
    // Filter by status if provided
    if (args.status) {
      appointmentsQuery = appointmentsQuery.filter((q) => 
        q.eq(q.field("status"), args.status)
      );
    }
    
    // Get the appointments
    const appointments = await appointmentsQuery.collect();
    
    // Get all client users
    const clientIds = [...new Set(appointments.map((a) => a.clientId))];
    const clients = await asyncMap(clientIds, (clientId) => ctx.db.get(clientId));
    
    // Map clients by ID for easy lookup
    const clientMap = new Map(
      clients.filter(Boolean).map((client) => [client!._id, client])
    );
    
    // Return appointments with client info
    return appointments.map((appointment) => ({
      ...appointment,
      client: clientMap.get(appointment.clientId),
    }));
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
