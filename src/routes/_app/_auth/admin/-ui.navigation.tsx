import {
  ChevronUp,
  ChevronDown,
  Slash,
  Check,
  Settings,
  LogOut,
  Users,
  Calendar,
  FileText,
  CreditCard,
} from "lucide-react";
import { cn, useSignOut } from "@/utils/misc";
import { ThemeSwitcher } from "@/ui/theme-switcher";
import { LanguageSwitcher } from "@/ui/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { buttonVariants } from "@/ui/button-util";
import { Logo } from "@/ui/logo";
import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { User } from "~/types";

// Create route imports for admin pages
const AdminDashboardPath = "/_app/_auth/admin";
const OnboardingReviewPath = "/_app/_auth/admin/onboarding-review";
const AppointmentDispatchPath = "/_app/_auth/admin/appointment-dispatch";
const ContentModerationPath = "/_app/_auth/admin/content-moderation";
const SubscriptionManagementPath = "/_app/_auth/admin/subscription-management";
const AdminSettingsPath = "/_app/_auth/admin/settings";

export function AdminNavigation({ user }: { user: User }) {
  const signOut = useSignOut();
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  
  const isDashboardPath = matchRoute({ to: AdminDashboardPath });
  const isOnboardingReviewPath = matchRoute({ to: OnboardingReviewPath });
  const isAppointmentDispatchPath = matchRoute({ to: AppointmentDispatchPath });
  const isContentModerationPath = matchRoute({ to: ContentModerationPath });
  const isSubscriptionManagementPath = matchRoute({ to: SubscriptionManagementPath });
  const isSettingsPath = matchRoute({ to: AdminSettingsPath });

  if (!user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col border-b border-border bg-card px-6">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-3">
        <div className="flex h-10 items-center gap-2">
          <Link
            to={AdminDashboardPath}
            className="flex h-10 items-center gap-1"
          >
            <Logo />
            <span className="font-semibold text-primary">Admin</span>
          </Link>
          <Slash className="h-6 w-6 -rotate-12 stroke-[1.5px] text-primary/10" />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 px-2 data-[state=open]:bg-primary/5"
              >
                <div className="flex items-center gap-2">
                  {user.avatarUrl ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      alt={user.username ?? user.email}
                      src={user.avatarUrl}
                    />
                  ) : (
                    <span className="h-8 w-8 rounded-full bg-gradient-to-br from-red-400 from-10% via-purple-300 to-blue-500" />
                  )}

                  <p className="text-sm font-medium text-primary/80">
                    {user?.username || ""}
                  </p>
                  <span className="flex h-5 items-center rounded-full bg-red-100 px-2 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                    Admin
                  </span>
                </div>
                <span className="flex flex-col items-center justify-center">
                  <ChevronUp className="relative top-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" />
                  <ChevronDown className="relative bottom-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              sideOffset={8}
              className="min-w-56 bg-card p-2"
            >
              <DropdownMenuLabel className="flex items-center text-xs font-normal text-primary/60">
                Admin Account
              </DropdownMenuLabel>
              <DropdownMenuItem className="h-10 w-full cursor-pointer justify-between rounded-md bg-secondary px-2">
                <div className="flex items-center gap-2">
                  {user.avatarUrl ? (
                    <img
                      className="h-6 w-6 rounded-full object-cover"
                      alt={user.username ?? user.email}
                      src={user.avatarUrl}
                    />
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-gradient-to-br from-red-400 from-10% via-purple-300 to-blue-500" />
                  )}

                  <p className="text-sm font-medium text-primary/80">
                    {user.username || ""}
                  </p>
                </div>
                <Check className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex h-10 items-center gap-3">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                {user.avatarUrl ? (
                  <img
                    className="min-h-8 min-w-8 rounded-full object-cover"
                    alt={user.username ?? user.email}
                    src={user.avatarUrl}
                  />
                ) : (
                  <span className="min-h-8 min-w-8 rounded-full bg-gradient-to-br from-red-400 from-10% via-purple-300 to-blue-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              sideOffset={8}
              className="fixed -right-4 min-w-56 bg-card p-2"
            >
              <DropdownMenuItem className="group flex-col items-start focus:bg-transparent">
                <p className="text-sm font-medium text-primary/80 group-hover:text-primary group-focus:text-primary">
                  {user?.username || ""}
                </p>
                <p className="text-sm text-primary/60">{user?.email}</p>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => navigate({ to: AdminSettingsPath })}
              >
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Settings
                </span>
                <Settings className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent",
                )}
              >
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Theme
                </span>
                <ThemeSwitcher />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent",
                )}
              >
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Language
                </span>
                <LanguageSwitcher />
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-0 my-2" />

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => signOut()}
              >
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Log Out
                </span>
                <LogOut className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-screen-xl items-center gap-3">
        <div
          className={cn(
            `flex h-12 items-center border-b-2`,
            isDashboardPath ? "border-primary" : "border-transparent",
          )}
        >
          <Link
            to={AdminDashboardPath}
            className={cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`,
            )}
          >
            Dashboard
          </Link>
        </div>
        <div
          className={cn(
            `flex h-12 items-center border-b-2`,
            isOnboardingReviewPath ? "border-primary" : "border-transparent",
          )}
        >
          <Link
            to={OnboardingReviewPath}
            className={cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80 flex items-center gap-1`,
            )}
          >
            <Users className="h-4 w-4" />
            Onboarding Review
          </Link>
        </div>
        <div
          className={cn(
            `flex h-12 items-center border-b-2`,
            isAppointmentDispatchPath ? "border-primary" : "border-transparent",
          )}
        >
          <Link
            to={AppointmentDispatchPath}
            className={cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80 flex items-center gap-1`,
            )}
          >
            <Calendar className="h-4 w-4" />
            Appointment Dispatch
          </Link>
        </div>
        <div
          className={cn(
            `flex h-12 items-center border-b-2`,
            isContentModerationPath ? "border-primary" : "border-transparent",
          )}
        >
          <Link
            to={ContentModerationPath}
            className={cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80 flex items-center gap-1`,
            )}
          >
            <FileText className="h-4 w-4" />
            Content Moderation
          </Link>
        </div>
        <div
          className={cn(
            `flex h-12 items-center border-b-2`,
            isSubscriptionManagementPath ? "border-primary" : "border-transparent",
          )}
        >
          <Link
            to={SubscriptionManagementPath}
            className={cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80 flex items-center gap-1`,
            )}
          >
            <CreditCard className="h-4 w-4" />
            Subscription Management
          </Link>
        </div>
      </div>
    </nav>
  );
}

