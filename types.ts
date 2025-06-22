import { Doc } from "~/convex/_generated/dataModel";
import { PlanKey, Role, OnboardingStatus } from "~/convex/schema";

export type User = Doc<"users"> & {
  avatarUrl?: string;
  role?: Role;
  onboardingStatus?: OnboardingStatus;
  subscription?: Doc<"subscriptions"> & {
    planKey: PlanKey;
  };
};

export type ClientProfile = Doc<"clientProfiles">;
export type Appointment = Doc<"appointments">;
export type Content = Doc<"content">;

