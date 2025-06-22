import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v, Infer } from "convex/values";

export const CURRENCIES = {
  USD: "usd",
  EUR: "eur",
} as const;
export const currencyValidator = v.union(
  v.literal(CURRENCIES.USD),
  v.literal(CURRENCIES.EUR),
);
export type Currency = Infer<typeof currencyValidator>;

export const INTERVALS = {
  MONTH: "month",
  YEAR: "year",
} as const;
export const intervalValidator = v.union(
  v.literal(INTERVALS.MONTH),
  v.literal(INTERVALS.YEAR),
);
export type Interval = Infer<typeof intervalValidator>;

export const PLANS = {
  FREE: "free",
  PRO: "pro",
} as const;
export const planKeyValidator = v.union(
  v.literal(PLANS.FREE),
  v.literal(PLANS.PRO),
);
export type PlanKey = Infer<typeof planKeyValidator>;

// Define user roles
export const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
} as const;
export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.CLIENT),
);
export type Role = Infer<typeof roleValidator>;

// Define onboarding status
export const ONBOARDING_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  APPROVED: "approved",
} as const;
export const onboardingStatusValidator = v.union(
  v.literal(ONBOARDING_STATUS.NOT_STARTED),
  v.literal(ONBOARDING_STATUS.IN_PROGRESS),
  v.literal(ONBOARDING_STATUS.COMPLETED),
  v.literal(ONBOARDING_STATUS.APPROVED),
);
export type OnboardingStatus = Infer<typeof onboardingStatusValidator>;

// Define appointment status
export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export const appointmentStatusValidator = v.union(
  v.literal(APPOINTMENT_STATUS.PENDING),
  v.literal(APPOINTMENT_STATUS.APPROVED),
  v.literal(APPOINTMENT_STATUS.REJECTED),
  v.literal(APPOINTMENT_STATUS.COMPLETED),
  v.literal(APPOINTMENT_STATUS.CANCELLED),
);
export type AppointmentStatus = Infer<typeof appointmentStatusValidator>;

// Define content status
export const CONTENT_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
  PUBLISHED: "published",
} as const;
export const contentStatusValidator = v.union(
  v.literal(CONTENT_STATUS.DRAFT),
  v.literal(CONTENT_STATUS.SUBMITTED),
  v.literal(CONTENT_STATUS.APPROVED),
  v.literal(CONTENT_STATUS.REJECTED),
  v.literal(CONTENT_STATUS.PUBLISHED),
);
export type ContentStatus = Infer<typeof contentStatusValidator>;

// Define service types
export const SERVICE_TYPES = {
  ONLYFANS: "onlyfans",
  RENTMEN: "rentmen",
  BOTH: "both",
} as const;
export const serviceTypeValidator = v.union(
  v.literal(SERVICE_TYPES.ONLYFANS),
  v.literal(SERVICE_TYPES.RENTMEN),
  v.literal(SERVICE_TYPES.BOTH),
);
export type ServiceType = Infer<typeof serviceTypeValidator>;

// Define facial visibility preferences
export const FACIAL_VISIBILITY = {
  FACE_OKAY: "face-okay",
  NO_FACE: "no-face",
  MASKED_FACE: "masked-face",
  OTHER: "other",
} as const;
export const facialVisibilityValidator = v.union(
  v.literal(FACIAL_VISIBILITY.FACE_OKAY),
  v.literal(FACIAL_VISIBILITY.NO_FACE),
  v.literal(FACIAL_VISIBILITY.MASKED_FACE),
  v.literal(FACIAL_VISIBILITY.OTHER),
);
export type FacialVisibility = Infer<typeof facialVisibilityValidator>;

// Define appointment types
export const APPOINTMENT_TYPES = {
  INCALL: "incall",
  OUTCALL: "outcall",
} as const;
export const appointmentTypeValidator = v.union(
  v.literal(APPOINTMENT_TYPES.INCALL),
  v.literal(APPOINTMENT_TYPES.OUTCALL),
);
export type AppointmentType = Infer<typeof appointmentTypeValidator>;

const priceValidator = v.object({
  stripeId: v.string(),
  amount: v.number(),
});
const pricesValidator = v.object({
  [CURRENCIES.USD]: priceValidator,
  [CURRENCIES.EUR]: priceValidator,
});

// Define screening status
export const SCREENING_STATUS = {
  SCREENING_COMPLETE: "screening-complete",
  PENDING_SCREENING: "pending-screening",
  SCREENING_WAIVED: "screening-waived",
  SCREENING_FAILED: "screening-failed",
  FURTHER_INFO_REQUIRED: "further-info-required",
} as const;
export const screeningStatusValidator = v.union(
  v.literal(SCREENING_STATUS.SCREENING_COMPLETE),
  v.literal(SCREENING_STATUS.PENDING_SCREENING),
  v.literal(SCREENING_STATUS.SCREENING_WAIVED),
  v.literal(SCREENING_STATUS.SCREENING_FAILED),
  v.literal(SCREENING_STATUS.FURTHER_INFO_REQUIRED),
);
export type ScreeningStatus = Infer<typeof screeningStatusValidator>;

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    customerId: v.optional(v.string()),
    // Add role field for user type
    role: v.optional(roleValidator),
    // Add onboarding status field
    onboardingStatus: v.optional(onboardingStatusValidator),
    // Add service type field
    serviceType: v.optional(serviceTypeValidator),
  })
    .index("email", ["email"])
    .index("customerId", ["customerId"])
    .index("role", ["role"]),
  
  // Client profiles for storing detailed client information
  clientProfiles: defineTable({
    userId: v.id("users"),
    // Basic information
    legalFullName: v.string(),
    preferredName: v.optional(v.string()),
    dateOfBirth: v.string(), // For age verification
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    phone: v.string(),
    // Service-specific information
    serviceType: serviceTypeValidator,
    // Identity verification
    frontIdImageId: v.optional(v.id("_storage")),
    backIdImageId: v.optional(v.id("_storage")),
    selfieWithIdImageId: v.optional(v.id("_storage")),
    // Privacy & Persona
    hasOnlinePersona: v.boolean(),
    stageNames: v.optional(v.string()),
    facialVisibility: facialVisibilityValidator,
    privacyConcerns: v.optional(v.string()),
    // Account access
    accountCreationOption: v.optional(v.string()),
    // Business information
    businessName: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
    // Onboarding data
    onboardingCompletedAt: v.optional(v.number()),
    onboardingApprovedAt: v.optional(v.number()),
    onboardingApprovedBy: v.optional(v.id("users")),
    // Unique identifier for the client
    uniqueIdentifier: v.string(),
  })
    .index("userId", ["userId"])
    .index("uniqueIdentifier", ["uniqueIdentifier"])
    .index("serviceType", ["serviceType"]),
  
  // Appointments for scheduling between admin and clients
  appointments: defineTable({
    // Who created the appointment (admin)
    createdBy: v.id("users"),
    // Client the appointment is for
    clientId: v.id("users"),
    // Appointment details
    appointmentType: appointmentTypeValidator,
    locationAddress: v.optional(v.string()),
    date: v.string(),
    startTime: v.string(),
    duration: v.string(), // Could be "1", "2", "3", "4", "travel", "overnight", "other"
    durationDetails: v.optional(v.string()), // For "other" duration
    services: v.optional(v.string()), // Services to be provided
    rate: v.number(), // Agreed rate/price
    
    // Booking contact information
    contactName: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    
    // Screening information
    screeningStatus: v.optional(v.string()),
    screeningNotes: v.optional(v.string()),
    
    // Notes
    internalNotes: v.optional(v.string()), // Admin only
    clientNotes: v.optional(v.string()), // Visible to client
    
    // Status tracking
    status: appointmentStatusValidator,
    
    // Response tracking
    respondedAt: v.optional(v.number()),
    responseNotes: v.optional(v.string()),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("clientId", ["clientId"])
    .index("createdBy", ["createdBy"])
    .index("status", ["status"]),
  
  // Content for client uploads and admin moderation
  content: defineTable({
    // Who uploaded the content
    uploadedBy: v.id("users"),
    // Content details
    title: v.string(),
    description: v.optional(v.string()),
    contentType: v.string(), // e.g., "image", "video", "document"
    fileId: v.optional(v.id("_storage")),
    fileUrl: v.optional(v.string()),
    // Status tracking
    status: contentStatusValidator,
    // Moderation
    moderatedBy: v.optional(v.id("users")),
    moderatedAt: v.optional(v.number()),
    moderationNotes: v.optional(v.string()),
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("uploadedBy", ["uploadedBy"])
    .index("status", ["status"])
    .index("contentType", ["contentType"]),
  
  // ... existing plans table ...
  plans: defineTable({
    key: planKeyValidator,
    stripeId: v.string(),
    name: v.string(),
    description: v.string(),
    prices: v.object({
      [INTERVALS.MONTH]: pricesValidator,
      [INTERVALS.YEAR]: pricesValidator,
    }),
  })
    .index("key", ["key"])
    .index("stripeId", ["stripeId"]),
  
  // ... existing subscriptions table ...
  subscriptions: defineTable({
    userId: v.id("users"),
    planId: v.id("plans"),
    priceStripeId: v.string(),
    stripeId: v.string(),
    currency: currencyValidator,
    interval: intervalValidator,
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  })
    .index("userId", ["userId"])
    .index("stripeId", ["stripeId"]),
});

export default schema;
