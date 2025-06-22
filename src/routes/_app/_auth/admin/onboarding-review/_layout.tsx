import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_auth/admin/onboarding-review/_layout")({
  component: OnboardingReview,
});

function OnboardingReview() {
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Onboarding Review</h1>
        <p className="text-primary/60">
          Review and approve client onboarding submissions
        </p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center py-12">
          <p className="text-primary/60">No pending onboarding submissions</p>
        </div>
      </div>
    </div>
  );
}

