import React from "react";
import { CheckIcon, Loader2 } from "lucide-react";
import { cn } from "@/utils/misc";

interface OnboardingCardProps {
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isSaving: boolean;
  saveStatus: "idle" | "saving" | "success" | "error";
  children: React.ReactNode;
  className?: string;
}

export function OnboardingCard({
  title,
  isActive,
  isCompleted,
  isSaving,
  saveStatus,
  children,
  className,
}: OnboardingCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border transition-all duration-300 overflow-hidden",
        isActive
          ? "border-primary shadow-md bg-card"
          : isCompleted
          ? "border-green-500/30 bg-green-50/10"
          : "border-border bg-card/50",
        !isActive && "cursor-pointer hover:border-primary/50",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {isCompleted && !isActive && (
            <CheckIcon className="h-5 w-5 text-green-500" />
          )}
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {isSaving && (
            <div className="flex items-center text-sm text-primary/60">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Saving...
            </div>
          )}
          {saveStatus === "success" && (
            <div className="flex items-center text-sm text-green-500">
              <CheckIcon className="mr-1 h-3 w-3" />
              Saved
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center text-sm text-red-500">
              Error saving
            </div>
          )}
        </div>
      </div>
      <div className={cn("p-4", !isActive && "hidden")}>{children}</div>
    </div>
  );
}

