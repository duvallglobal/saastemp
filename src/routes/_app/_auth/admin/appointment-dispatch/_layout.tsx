import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_auth/admin/appointment-dispatch/_layout")({
  component: AppointmentDispatch,
});

function AppointmentDispatch() {
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Appointment Dispatch</h1>
        <p className="text-primary/60">
          Create and manage appointment requests for clients
        </p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center py-12">
          <p className="text-primary/60">No appointments created yet</p>
        </div>
      </div>
    </div>
  );
}

