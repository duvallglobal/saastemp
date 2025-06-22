import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";

export const Route = createFileRoute("/_app/_auth/admin/_layout/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-primary/60">
          Welcome to the Manage The Fans admin portal
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Dashboard cards */}
        <DashboardCard 
          title="Pending Onboarding" 
          value="0" 
          link="/_app/_auth/admin/onboarding-review"
          description="Client onboarding requests awaiting review"
        />
        <DashboardCard 
          title="Pending Appointments" 
          value="0" 
          link="/_app/_auth/admin/appointment-dispatch"
          description="Appointments awaiting client approval"
        />
        <DashboardCard 
          title="Content Submissions" 
          value="0" 
          link="/_app/_auth/admin/content-moderation"
          description="Content items awaiting moderation"
        />
        <DashboardCard 
          title="Active Subscriptions" 
          value="0" 
          link="/_app/_auth/admin/subscription-management"
          description="Clients with active subscriptions"
        />
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  value, 
  link, 
  description 
}: { 
  title: string; 
  value: string; 
  link: string; 
  description: string;
}) {
  return (
    <a 
      href={link} 
      className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
    >
      <h3 className="text-lg font-medium text-primary">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-primary">{value}</p>
      <p className="mt-2 text-sm text-primary/60">{description}</p>
    </a>
  );
}

