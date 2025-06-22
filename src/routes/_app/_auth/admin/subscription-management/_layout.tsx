import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_auth/admin/subscription-management/_layout")({
  component: SubscriptionManagement,
});

function SubscriptionManagement() {
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Subscription Management</h1>
        <p className="text-primary/60">
          Manage client subscriptions and payment information
        </p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center py-12">
          <p className="text-primary/60">No active subscriptions</p>
        </div>
      </div>
    </div>
  );
}

