import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_auth/client/profile/_layout")({
  component: Profile,
});

function Profile() {
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Profile Management</h1>
        <p className="text-primary/60">
          Update your profile and account information
        </p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center py-12">
          <p className="text-primary/60">Profile management will be available soon</p>
        </div>
      </div>
    </div>
  );
}

