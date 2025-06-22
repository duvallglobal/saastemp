import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_auth/admin/content-moderation/_layout")({
  component: ContentModeration,
});

function ContentModeration() {
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Content Moderation</h1>
        <p className="text-primary/60">
          Review and moderate client content submissions
        </p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center py-12">
          <p className="text-primary/60">No content submissions to moderate</p>
        </div>
      </div>
    </div>
  );
}

