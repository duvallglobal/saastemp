import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { Upload, Calendar, CreditCard, User } from "lucide-react";

export const Route = createFileRoute("/_app/_auth/client/_layout/")({
  component: ClientDashboard,
});

function ClientDashboard() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Your Dashboard</h1>
        <p className="text-primary/60">
          Welcome to Manage The Fans
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Dashboard cards */}
        <DashboardCard 
          title="Content Upload" 
          icon={<Upload className="h-6 w-6" />}
          link="/_app/_auth/client/content-upload"
          description="Upload and manage your content"
        />
        <DashboardCard 
          title="Appointment Approval" 
          icon={<Calendar className="h-6 w-6" />}
          link="/_app/_auth/client/appointment-approval"
          description="Review and approve appointment requests"
        />
        <DashboardCard 
          title="Subscription" 
          icon={<CreditCard className="h-6 w-6" />}
          link="/_app/_auth/client/subscription"
          description="Manage your subscription and payments"
        />
        <DashboardCard 
          title="Profile" 
          icon={<User className="h-6 w-6" />}
          link="/_app/_auth/client/profile"
          description="Update your profile information"
        />
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  icon, 
  link, 
  description 
}: { 
  title: string; 
  icon: React.ReactNode; 
  link: string; 
  description: string;
}) {
  return (
    <a 
      href={link} 
      className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-primary">{title}</h3>
      <p className="mt-2 text-sm text-primary/60">{description}</p>
    </a>
  );
}

