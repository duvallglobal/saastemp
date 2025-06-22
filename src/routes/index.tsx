import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../ui/logo";
import { cn } from "@/utils/misc";
import { buttonVariants } from "@/ui/button-util";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/ui/button";
import siteConfig from "~/site.config";
import { ThemeSwitcherHome } from "@/ui/theme-switcher";
import ShadowPNG from "/images/shadow.png";
import { useConvexAuth } from "@convex-dev/react-query";
import { Route as AuthLoginRoute } from "@/routes/_app/login/_layout.index";
import { Route as AdminDashboardRoute } from "@/routes/_app/_auth/admin/_layout.index";
import { Route as ClientDashboardRoute } from "@/routes/_app/_auth/client/_layout.index";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { isAdmin, isClient, needsOnboarding } from "@/utils/auth-helpers";
import { Route as ClientOnboardingRoute } from "@/routes/_app/_auth/client/onboarding/_layout.index";

export const Route = createFileRoute("/")(
{
  component: Index,
});

function Index() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  const theme = "dark";
  
  // Determine the dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return AuthLoginRoute.fullPath;
    
    if (isAdmin(user)) {
      return AdminDashboardRoute.fullPath;
    }
    
    if (isClient(user)) {
      if (needsOnboarding(user)) {
        return ClientOnboardingRoute.fullPath;
      }
      return ClientDashboardRoute.fullPath;
    }
    
    return AuthLoginRoute.fullPath;
  };
  
  return (
    <div className="relative flex h-full w-full flex-col bg-card">
      {/* Navigation */}
      <div className="sticky top-0 z-50 mx-auto flex w-full max-w-screen-lg items-center justify-between p-6 py-3">
        <Link to="/" className="flex h-10 items-center gap-1">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to={isAuthenticated ? getDashboardRoute() : AuthLoginRoute.fullPath}
            className={buttonVariants({ size: "sm" })}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin w-16 h-4" />}
            {!isLoading && isAuthenticated && "Dashboard"}
            {!isLoading && !isAuthenticated && "Get Started"}
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="z-10 mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-6">
        <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-4 p-12 md:p-24">
          <Button
            variant="outline"
            className={cn(
              "hidden h-8 rounded-full bg-white/40 px-3 text-sm font-bold backdrop-blur hover:text-primary dark:bg-secondary md:flex",
            )}
          >
            <span className="flex items-center font-medium text-primary/60">
              Welcome to
            </span>
            {siteConfig.siteTitle}
          </Button>
          <h1 className="text-center text-6xl font-bold leading-tight text-primary md:text-7xl lg:leading-tight">
            Manage The Fans
            <br />
            User Portal
          </h1>
          <p className="max-w-screen-md text-center text-lg !leading-normal text-muted-foreground md:text-xl">
            A two-tiered user management and login portal with{" "}
            <span className="font-medium text-primary">
              admin and client access levels
            </span>
          </p>
          <div className="mt-2 flex w-full items-center justify-center gap-2">
            <Link
              to={AuthLoginRoute.fullPath}
              className={cn(buttonVariants({ size: "sm" }), "hidden sm:flex")}
            >
              Get Started
            </Link>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col border border-border backdrop-blur-sm lg:flex-row">
          <div className="flex w-full flex-col items-start justify-center gap-6 border-r border-primary/10 p-10 lg:p-12">
            <p className="h-14 text-lg text-primary/60">
              <span className="font-semibold text-primary">
                Admin Portal.
              </span>{" "}
              Full control over user management, appointments, content, and subscriptions.
            </p>
            <Link
              to={AuthLoginRoute.fullPath}
              className={buttonVariants({ size: "sm" })}
            >
              Admin Login
            </Link>
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-6 p-10 lg:w-[60%] lg:border-b-0 lg:p-12">
            <p className="h-14 text-lg text-primary/60">
              <span className="font-semibold text-primary">Client Portal.</span>{" "}
              Personalized dashboard with content upload, appointment approval, and profile management.
            </p>
            <Link
              to={AuthLoginRoute.fullPath}
              className={cn(
                `${buttonVariants({ variant: "outline", size: "sm" })} dark:bg-secondary dark:hover:opacity-80`,
              )}
            >
              Client Login
            </Link>
          </div>

          <div className="absolute left-0 top-0 z-10 flex flex-col items-center justify-center">
            <span className="absolute h-6 w-[1px] bg-primary/40" />
            <span className="absolute h-[1px] w-6 bg-primary/40" />
          </div>
          <div className="absolute bottom-0 right-0 z-10 flex flex-col items-center justify-center">
            <span className="absolute h-6 w-[1px] bg-primary/40" />
            <span className="absolute h-[1px] w-6 bg-primary/40" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="z-10 flex w-full flex-col items-center justify-center gap-8 py-6">
        <ThemeSwitcherHome />

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <p className="flex items-center whitespace-nowrap text-center text-sm font-medium text-primary/60">
            © {new Date().getFullYear()} Manage The Fans. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Background */}
      <img
        src={ShadowPNG}
        alt="Hero"
        className={`fixed left-0 top-0 z-0 h-full w-full opacity-60 ${theme === "dark" ? "invert" : ""}`}
      />
      <div className="base-grid fixed h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
    </div>
  );
}

