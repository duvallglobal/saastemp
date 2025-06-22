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

// New function to save partial onboarding data
export const submitClientOnboardingPartial = mutation({
  args: {
    // Service Selection
    serviceType: v.optional(serviceTypeValidator),
    
    // Basic Information
    legalFullName: v.optional(v.string()),
    preferredName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    
    // Privacy & Persona
    hasOnlinePersona: v.optional(v.boolean()),
    stageNames: v.optional(v.string()),
    facialVisibility: v.optional(facialVisibilityValidator),
    privacyConcerns: v.optional(v.string()),
    
    // Account Access
    accountCreationOption: v.optional(v.string()),
    needHelpCreating: v.optional(v.boolean()),
    doNotNeedAccountManagement: v.optional(v.boolean()),
    
    // OnlyFans specific
    ofUsername: v.optional(v.string()),
    ofEmail: v.optional(v.string()),
    ofPassword: v.optional(v.string()),
    ofCreatorHandle: v.optional(v.string()),
    ofExperience: v.optional(v.string()),
    ofObjectiveGrowth: v.optional(v.boolean()),
    ofObjectiveBrand: v.optional(v.boolean()),
    ofObjectiveDMs: v.optional(v.boolean()),
    ofObjectiveOther: v.optional(v.boolean()),
    ofObjectiveOtherText: v.optional(v.string()),
    ofContentPhotos: v.optional(v.boolean()),
    ofContentVideos: v.optional(v.boolean()),
    ofContentPPV: v.optional(v.boolean()),
    ofContentCustom: v.optional(v.boolean()),
    ofContentLive: v.optional(v.boolean()),
    ofContentOther: v.optional(v.boolean()),
    ofContentOtherText: v.optional(v.string()),
    ofContentSchedule: v.optional(v.string()),
    ofTargetAudience: v.optional(v.string()),
    ofPrimaryGoals: v.optional(v.string()),
    ofContentUnwilling: v.optional(v.string()),
    ofBrandDescription: v.optional(v.string()),
    ofDoNotSay: v.optional(v.string()),
    ofContentEditor: v.optional(v.string()),
    
    // Rent.Men specific
    rmUsername: v.optional(v.string()),
    rmEmail: v.optional(v.string()),
    rmPassword: v.optional(v.string()),
    rmProfileUrl: v.optional(v.string()),
    rmPrimaryServices: v.optional(v.string()),
    rmRateHourly: v.optional(v.boolean()),
    rmRateHourlyAmount: v.optional(v.string()),
    rmRateOvernight: v.optional(v.boolean()),
    rmRateOvernightAmount: v.optional(v.string()),
    rmRateTravel: v.optional(v.boolean()),
    rmRateTravelAmount: v.optional(v.string()),
    rmAvailability: v.optional(v.string()),
    rmGeographicAvailability: v.optional(v.string()),
    rmWillingToTravel: v.optional(v.boolean()),
    rmTravelRegions: v.optional(v.string()),
    rmCallType: v.optional(v.string()),
    rmIncallLocation: v.optional(v.string()),
    rmClientPreferences: v.optional(v.string()),
    rmServiceLimits: v.optional(v.string()),
    rmScreeningID: v.optional(v.boolean()),
    rmScreeningVideoCall: v.optional(v.boolean()),
    rmScreeningDeposit: v.optional(v.boolean()),
    rmScreeningOther: v.optional(v.boolean()),
    rmScreeningOtherText: v.optional(v.string()),
    rmApprovalProcess: v.optional(v.string()),
    rmRepeatClients: v.optional(v.string()),
    rmPaymentMethod: v.optional(v.string()),
    rmDepositRequirements: v.optional(v.string()),
    
    // Communication preferences
    communicationMethod: v.optional(v.string()),
    bestContactMethod: v.optional(v.string()),
    safetyRequirements: v.optional(v.string()),
    
    // Legal agreements
    authorizeAccess: v.optional(v.boolean()),
    backupResponsibility: v.optional(v.boolean()),
    termsAgreement: v.optional(v.boolean()),
    confirmInformation: v.optional(v.boolean()),
    
    // Social media
    igUsername: v.optional(v.string()),
    igEmail: v.optional(v.string()),
    igPassword: v.optional(v.string()),
    ttUsername: v.optional(v.string()),
    ttEmail: v.optional(v.string()),
    ttPassword: v.optional(v.string()),
    twUsername: v.optional(v.string()),
    twEmail: v.optional(v.string()),
    twPassword: v.optional(v.string()),
    additionalPlatformName: v.optional(v.string()),
    additionalPlatformUsername: v.optional(v.string()),
    additionalPlatformEmail: v.optional(v.string()),
    additionalPlatformPassword: v.optional(v.string()),
    
    // Step tracking
    stepCompleted: v.optional(v.number()),
    isComplete: v.optional(v.boolean()),
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
    
    // Update user role and onboarding status if not already set
    if (!user.role) {
      await ctx.db.patch(userId, {
        role: ROLES.CLIENT,
      });
    }
    
    // Update onboarding status based on step completed
    if (args.stepCompleted) {
      await ctx.db.patch(userId, {
        onboardingStatus: ONBOARDING_STATUS.IN_PROGRESS,
      });
    }
    
    // If onboarding is complete, update status
    if (args.isComplete) {
      await ctx.db.patch(userId, {
        onboardingStatus: ONBOARDING_STATUS.COMPLETED,
      });
    }
    
    // Update service type if provided
    if (args.serviceType) {
      await ctx.db.patch(userId, {
        serviceType: args.serviceType,
      });
    }
    
    // Extract location components if provided
    let city, state, country;
    if (args.location) {
      const locationParts = args.location.split(',').map(part => part.trim());
      if (locationParts.length >= 1) city = locationParts[0];
      if (locationParts.length >= 2) state = locationParts[1];
      if (locationParts.length >= 3) country = locationParts[2];
    }
    
    // Check if client profile already exists
    const existingProfile = await ctx.db
      .query("clientProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .unique();
    
    // Prepare profile data
    const profileData: any = {
      // Only include fields that are provided
      ...(args.legalFullName && { legalFullName: args.legalFullName }),
      ...(args.preferredName && { preferredName: args.preferredName }),
      ...(args.dateOfBirth && { dateOfBirth: args.dateOfBirth }),
      ...(args.phone && { phone: args.phone }),
      ...(city && { city }),
      ...(state && { state }),
      ...(country && { country }),
      ...(args.serviceType && { serviceType: args.serviceType }),
      ...(args.hasOnlinePersona !== undefined && { hasOnlinePersona: args.hasOnlinePersona }),
      ...(args.stageNames && { stageNames: args.stageNames }),
      ...(args.facialVisibility && { facialVisibility: args.facialVisibility }),
      ...(args.privacyConcerns && { privacyConcerns: args.privacyConcerns }),
    };
    
    // Store sensitive information securely (in a real implementation, these would be encrypted)
    // For this demo, we'll just store them in a JSON field
    const sensitiveData: any = {};
    
    // Add account credentials if provided
    if (args.ofUsername || args.ofEmail || args.ofPassword) {
      sensitiveData.onlyfans = {
        username: args.ofUsername,
        email: args.ofEmail,
        password: args.ofPassword,
      };
    }
    
    if (args.rmUsername || args.rmEmail || args.rmPassword) {
      sensitiveData.rentmen = {
        username: args.rmUsername,
        email: args.rmEmail,
        password: args.rmPassword,
      };
    }
    
    // Add social media credentials
    const socialMedia: any = {};
    
    if (args.igUsername || args.igEmail || args.igPassword) {
      socialMedia.instagram = {
        username: args.igUsername,
        email: args.igEmail,
        password: args.igPassword,
      };
    }
    
    if (args.ttUsername || args.ttEmail || args.ttPassword) {
      socialMedia.tiktok = {
        username: args.ttUsername,
        email: args.ttEmail,
        password: args.ttPassword,
      };
    }
    
    if (args.twUsername || args.twEmail || args.twPassword) {
      socialMedia.twitter = {
        username: args.twUsername,
        email: args.twEmail,
        password: args.twPassword,
      };
    }
    
    if (Object.keys(socialMedia).length > 0) {
      sensitiveData.socialMedia = socialMedia;
    }
    
    // Add additional platform if provided
    if (args.additionalPlatformName) {
      sensitiveData.additionalPlatform = {
        name: args.additionalPlatformName,
        username: args.additionalPlatformUsername,
        email: args.additionalPlatformEmail,
        password: args.additionalPlatformPassword,
      };
    }
    
    // Store service-specific data
    const serviceData: any = {};
    
    // OnlyFans specific data
    if (args.serviceType === "onlyfans" || args.serviceType === "both") {
      serviceData.onlyfans = {
        creatorHandle: args.ofCreatorHandle,
        experience: args.ofExperience,
        objectives: {
          growth: args.ofObjectiveGrowth,
          brand: args.ofObjectiveBrand,
          dms: args.ofObjectiveDMs,
          other: args.ofObjectiveOther,
          otherText: args.ofObjectiveOtherText,
        },
        content: {
          photos: args.ofContentPhotos,
          videos: args.ofContentVideos,
          ppv: args.ofContentPPV,
          custom: args.ofContentCustom,
          live: args.ofContentLive,
          other: args.ofContentOther,
          otherText: args.ofContentOtherText,
          schedule: args.ofContentSchedule,
          unwilling: args.ofContentUnwilling,
        },
        targetAudience: args.ofTargetAudience,
        primaryGoals: args.ofPrimaryGoals,
        brandDescription: args.ofBrandDescription,
        doNotSay: args.ofDoNotSay,
        contentEditor: args.ofContentEditor,
      };
    }
    
    // Rent.Men specific data
    if (args.serviceType === "rentmen" || args.serviceType === "both") {
      serviceData.rentmen = {
        profileUrl: args.rmProfileUrl,
        primaryServices: args.rmPrimaryServices,
        rates: {
          hourly: {
            enabled: args.rmRateHourly,
            amount: args.rmRateHourlyAmount,
          },
          overnight: {
            enabled: args.rmRateOvernight,
            amount: args.rmRateOvernightAmount,
          },
          travel: {
            enabled: args.rmRateTravel,
            amount: args.rmRateTravelAmount,
          },
        },
        availability: args.rmAvailability,
        geographicAvailability: args.rmGeographicAvailability,
        travel: {
          willing: args.rmWillingToTravel,
          regions: args.rmTravelRegions,
        },
        callType: args.rmCallType,
        incallLocation: args.rmIncallLocation,
        clientPreferences: args.rmClientPreferences,
        serviceLimits: args.rmServiceLimits,
        screening: {
          id: args.rmScreeningID,
          videoCall: args.rmScreeningVideoCall,
          deposit: args.rmScreeningDeposit,
          other: args.rmScreeningOther,
          otherText: args.rmScreeningOtherText,
        },
        approvalProcess: args.rmApprovalProcess,
        repeatClients: args.rmRepeatClients,
        paymentMethod: args.rmPaymentMethod,
        depositRequirements: args.rmDepositRequirements,
      };
    }
    
    // Communication preferences
    const communicationPrefs: any = {
      method: args.communicationMethod,
      bestContactMethod: args.bestContactMethod,
      safetyRequirements: args.safetyRequirements,
    };
    
    // Legal agreements
    const legalAgreements: any = {
      authorizeAccess: args.authorizeAccess,
      backupResponsibility: args.backupResponsibility,
      termsAgreement: args.termsAgreement,
      confirmInformation: args.confirmInformation,
    };
    
    // Add metadata fields to profile data
    if (Object.keys(sensitiveData).length > 0) {
      profileData.sensitiveData = sensitiveData;
    }
    
    if (Object.keys(serviceData).length > 0) {
      profileData.serviceData = serviceData;
    }
    
    if (Object.keys(communicationPrefs).length > 0) {
      profileData.communicationPreferences = communicationPrefs;
    }
    
    if (Object.keys(legalAgreements).length > 0) {
      profileData.legalAgreements = legalAgreements;
    }
    
    // Update last saved timestamp
    profileData.lastSaved = Date.now();
    
    if (args.isComplete) {
      profileData.onboardingCompletedAt = Date.now();
    }
    
    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, profileData);
    } else {
      // Create new profile with a unique identifier
      const uniqueIdentifier = `client-${Math.random().toString(36).substring(2, 15)}`;
      await ctx.db.insert("clientProfiles", {
        userId,
        uniqueIdentifier,
        ...profileData,
      });
    }
    
    return { success: true };
  },
});

// Function to get client profile
export const getClientProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    // Get the client profile
    const profile = await ctx.db
      .query("clientProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .unique();
    
    return profile;
  },
});
