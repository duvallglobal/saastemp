import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ClientNavigation } from "./-ui.navigation";
import { Header } from "@/ui/header";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { ClientGuard } from "@/utils/route-guards";

export const Route = createFileRoute("/_app/_auth/client/_layout")({
  component: ClientLayout,
});

function ClientLayout() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  
  if (!user) {
    return null;
  }
  
  return (
    <ClientGuard>
      <div className="flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black">
        <ClientNavigation user={user} />
        <Header />
        <Outlet />
      </div>
    </ClientGuard>
  );
}

