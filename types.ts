import { Doc } from "~/convex/_generated/dataModel";
import { 
  PlanKey, 
  Role, 
  OnboardingStatus, 
  ServiceType, 
  FacialVisibility,
  AppointmentType,
  AppointmentStatus,
  ContentStatus
} from "~/convex/schema";

export type User = Doc<"users"> & {
  avatarUrl?: string;
  role?: Role;
  onboardingStatus?: OnboardingStatus;
  serviceType?: ServiceType;
  subscription?: Doc<"subscriptions"> & {
    planKey: PlanKey;
  };
};

export type ClientProfile = Doc<"clientProfiles"> & {
  // Add any computed fields here
};

export type Appointment = Doc<"appointments"> & {
  // Add any computed fields here
  client?: User;
  creator?: User;
};

export type Content = Doc<"content"> & {
  // Add any computed fields here
  uploader?: User;
  moderator?: User;
};

