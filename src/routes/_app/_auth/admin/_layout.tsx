import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminNavigation } from "./-ui.navigation";
import { Header } from "@/ui/header";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { AdminGuard } from "@/utils/route-guards";

export const Route = createFileRoute("/_app/_auth/admin/_layout")({
  component: AdminLayout,
});

function AdminLayout() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  
  if (!user) {
    return null;
  }
  
  return (
    <AdminGuard>
      <div className="flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black">
        <AdminNavigation user={user} />
        <Header />
        <Outlet />
      </div>
    </AdminGuard>
  );
}

