import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/ui/header";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { OnboardingGuard } from "@/utils/route-guards";
import { Logo } from "@/ui/logo";

export const Route = createFileRoute("/_app/_auth/client/onboarding/_layout")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  
  if (!user) {
    return null;
  }
  
  return (
    <OnboardingGuard>
      <div className="flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black">
        <nav className="sticky top-0 z-50 flex w-full flex-col border-b border-border bg-card px-6">
          <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-3">
            <div className="flex h-10 items-center gap-2">
              <div className="flex h-10 items-center gap-1">
                <Logo />
                <span className="font-semibold text-primary">Onboarding</span>
              </div>
            </div>
          </div>
        </nav>
        <Header />
        
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-primary">Welcome to Manage The Fans</h1>
              <p className="mt-2 text-primary/60">
                Let's set up your account to get you started
              </p>
            </div>
            
            <Outlet />
          </div>
        </div>
      </div>
    </OnboardingGuard>
  );
}

