import { Doc } from "./_generated/dataModel";
import {
  PlanKey,
  Role,
  OnboardingStatus,
  ServiceType,
  FacialVisibility,
  AppointmentType,
  AppointmentStatus,
  ContentStatus,
  ScreeningStatus,
  Currency,
  Interval
} from "./schema";

// Extended User type with computed fields
export type User = Doc<"users"> & {
  avatarUrl?: string;
  role?: Role;
  onboardingStatus?: OnboardingStatus;
  serviceType?: ServiceType;
  subscription?: Doc<"subscriptions"> & {
    planKey: PlanKey;
  };
};

// Extended ClientProfile type with computed fields
export type ClientProfile = Doc<"clientProfiles"> & {
  user?: User;
  // Computed fields for sensitive data access
  hasCredentials?: boolean;
  lastUpdated?: number;
  completionPercentage?: number;
};

// Extended Appointment type with related data
export type Appointment = Doc<"appointments"> & {
  client?: User;
  creator?: User;
  admin?: User;
  // Computed fields
  isUpcoming?: boolean;
  isPast?: boolean;
  canRespond?: boolean;
  timeUntilAppointment?: number;
};

// Extended Content type with related data
export type Content = Doc<"content"> & {
  uploader?: User;
  moderator?: User;
  // Computed fields
  fileUrl?: string;
  thumbnailUrl?: string;
  isModerated?: boolean;
  canEdit?: boolean;
};

// Plan type with subscription info
export type Plan = Doc<"plans"> & {
  isActive?: boolean;
  userCount?: number;
};

// Subscription type with plan details
export type Subscription = Doc<"subscriptions"> & {
  plan?: Plan;
  user?: User;
  isActive?: boolean;
  daysUntilRenewal?: number;
};

// Extended AppointmentAttachment type
export type AppointmentAttachment = Doc<"appointmentAttachments"> & {
  fileUrl?: string;
  canDelete?: boolean;
};

// Form data types for onboarding
export interface OnboardingFormData {
  // Service Selection
  serviceType?: ServiceType;

  // Basic Information
  legalFullName?: string;
  preferredName?: string;
  dateOfBirth?: string;
  phone?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  // Privacy & Persona
  hasOnlinePersona?: boolean;
  stageNames?: string;
  facialVisibility?: FacialVisibility;
  privacyConcerns?: string;

  // Account Access
  accountCreationOption?: string;
  needHelpCreating?: boolean;
  doNotNeedAccountManagement?: boolean;

  // OnlyFans specific
  ofUsername?: string;
  ofEmail?: string;
  ofPassword?: string;
  ofCreatorHandle?: string;
  ofExperience?: string;
  ofObjectiveGrowth?: boolean;
  ofObjectiveBrand?: boolean;
  ofObjectiveDMs?: boolean;
  ofObjectiveOther?: boolean;
  ofObjectiveOtherText?: string;
  ofContentPhotos?: boolean;
  ofContentVideos?: boolean;
  ofContentPPV?: boolean;
  ofContentCustom?: boolean;
  ofContentLive?: boolean;
  ofContentOther?: boolean;
  ofContentOtherText?: string;
  ofContentSchedule?: string;
  ofTargetAudience?: string;
  ofPrimaryGoals?: string;
  ofContentUnwilling?: string;
  ofBrandDescription?: string;
  ofDoNotSay?: string;
  ofContentEditor?: string;

  // Rent.Men specific
  rmUsername?: string;
  rmEmail?: string;
  rmPassword?: string;
  rmProfileUrl?: string;
  rmPrimaryServices?: string;
  rmRateHourly?: boolean;
  rmRateHourlyAmount?: string;
  rmRateOvernight?: boolean;
  rmRateOvernightAmount?: string;
  rmRateTravel?: boolean;
  rmRateTravelAmount?: string;
  rmAvailability?: string;
  rmGeographicAvailability?: string;
  rmWillingToTravel?: boolean;
  rmTravelRegions?: string;
  rmCallType?: string;
  rmIncallLocation?: string;
  rmClientPreferences?: string;
  rmServiceLimits?: string;
  rmScreeningID?: boolean;
  rmScreeningVideoCall?: boolean;
  rmScreeningDeposit?: boolean;
  rmScreeningOther?: boolean;
  rmScreeningOtherText?: string;
  rmApprovalProcess?: string;
  rmRepeatClients?: string;
  rmPaymentMethod?: string;
  rmDepositRequirements?: string;

  // Social Media
  igUsername?: string;
  igEmail?: string;
  igPassword?: string;
  ttUsername?: string;
  ttEmail?: string;
  ttPassword?: string;
  twUsername?: string;
  twEmail?: string;
  twPassword?: string;
  additionalPlatformName?: string;
  additionalPlatformUsername?: string;
  additionalPlatformEmail?: string;
  additionalPlatformPassword?: string;

  // Communication preferences
  communicationMethod?: string;
  bestContactMethod?: string;
  safetyRequirements?: string;

  // Legal agreements
  authorizeAccess?: boolean;
  backupResponsibility?: boolean;
  termsAgreement?: boolean;
  confirmInformation?: boolean;

  // Step tracking
  stepCompleted?: number;
  isComplete?: boolean;
}

// Appointment form data
export interface AppointmentFormData {
  clientId: string;
  appointmentType: AppointmentType;
  locationAddress?: string;
  appointmentDate: string;
  startTime: string;
  duration: string;
  durationDetails?: string;
  services?: string;
  rate: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  screeningStatus?: ScreeningStatus;
  screeningNotes?: string;
  internalNotes?: string;
  clientNotes?: string;
}

// Content upload form data
export interface ContentFormData {
  title: string;
  description?: string;
  contentType: 'image' | 'video' | 'document';
  category: 'profile' | 'verification' | 'content' | 'appointment';
  file?: File;
  appointmentId?: string;
}

// Client profile update form data
export interface ClientProfileUpdateData {
  legalFullName?: string;
  preferredName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  serviceType?: ServiceType;
  facialVisibility?: FacialVisibility;
  privacyConcerns?: string;
  businessName?: string;
  businessDescription?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

// Error response type
export interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: any;
}

// Dashboard stats
export interface DashboardStats {
  totalClients: number;
  activeAppointments: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  completedAppointments: number;
  cancelledAppointments: number;
  newClientsThisMonth: number;
  averageResponseTime: number;
  clientSatisfactionScore?: number;
  topServices: Array<{
    service: string;
    count: number;
    revenue: number;
  }>;
}

// Client dashboard stats
export interface ClientDashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  pendingApprovals: number;
  profileCompleteness: number;
  lastActivity: number;
  totalSpent: number;
  favoriteServices: string[];
  nextAppointment?: {
    date: string;
    time: string;
    service: string;
  };
}

// File upload types
export interface FileUpload {
  file: File;
  type: 'image' | 'document' | 'video';
  category: 'profile' | 'verification' | 'content' | 'appointment';
  description?: string;
  appointmentId?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

// File upload response
export interface FileUploadResponse {
  success: boolean;
  fileId?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'appointment' | 'approval' | 'message' | 'system' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expiresAt?: number;
  metadata?: {
    appointmentId?: string;
    clientId?: string;
    contentId?: string;
  };
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  status?: AppointmentStatus | ContentStatus | OnboardingStatus;
  serviceType?: ServiceType;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'name' | 'status' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  includeArchived?: boolean;
}

// Advanced search filters
export interface AdvancedSearchFilters extends SearchFilters {
  clientId?: string;
  createdBy?: string;
  tags?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  location?: string;
  hasAttachments?: boolean;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
  filters?: SearchFilters;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
  permissions: string[];
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animations: boolean;
}

// App settings
export interface AppSettings {
  theme: ThemeConfig;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
    profileVisibility: 'public' | 'private' | 'clients-only';
  };
  business: {
    timezone: string;
    currency: Currency;
    workingHours: {
      start: string;
      end: string;
      days: string[];
    };
    autoApproval: boolean;
    requireDeposit: boolean;
  };
}

// Calendar event types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  appointmentId?: string;
  clientId?: string;
  type: 'appointment' | 'reminder' | 'personal' | 'system';
  status: AppointmentStatus;
  location?: string;
  notes?: string;
}

// Communication types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  appointmentId?: string;
  replyTo?: string;
}

// Conversation thread
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: number;
  updatedAt: number;
  appointmentId?: string;
  archived: boolean;
  muted: boolean;
}

// Analytics types
export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  metrics: {
    appointments: {
      total: number;
      completed: number;
      cancelled: number;
      pending: number;
      approved: number;
    };
    revenue: {
      total: number;
      average: number;
      growth: number;
    };
    clients: {
      total: number;
      new: number;
      returning: number;
      retention: number;
    };
    services: Array<{
      name: string;
      count: number;
      revenue: number;
      growth: number;
    }>;
  };
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}

// Webhook types
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  source: 'stripe' | 'system' | 'external';
  processed: boolean;
  retryCount: number;
}