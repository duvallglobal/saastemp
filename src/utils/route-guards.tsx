import { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useCurrentUser, isAdmin, isClient, needsOnboarding } from "./auth-helpers";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: "admin" | "client";
  redirectTo?: string;
}

/**
 * Guard component that checks if the user has the required role
 */
export function RoleGuard({ 
  children, 
  requiredRole, 
  redirectTo = "/login" 
}: RoleGuardProps) {
  const { data: user, isLoading } = useCurrentUser();
  
  // Show nothing while loading
  if (isLoading) {
    return null;
  }
  
  // If no user, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} />;
  }
  
  // Check if user has the required role
  const hasRequiredRole = 
    (requiredRole === "admin" && isAdmin(user)) || 
    (requiredRole === "client" && isClient(user));
  
  if (!hasRequiredRole) {
    // Redirect admin to admin dashboard
    if (isAdmin(user)) {
      return <Navigate to="/_app/_auth/admin" />;
    }
    
    // Redirect client to client dashboard
    if (isClient(user)) {
      // Check if client needs onboarding
      if (needsOnboarding(user)) {
        return <Navigate to="/_app/_auth/client/onboarding" />;
      }
      return <Navigate to="/_app/_auth/client" />;
    }
    
    // Fallback to login
    return <Navigate to={redirectTo} />;
  }
  
  // User has the required role, render children
  return <>{children}</>;
}

/**
 * Guard specifically for admin routes
 */
export function AdminGuard({ children, redirectTo = "/login" }: Omit<RoleGuardProps, "requiredRole">) {
  return (
    <RoleGuard requiredRole="admin" redirectTo={redirectTo}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard specifically for client routes
 */
export function ClientGuard({ children, redirectTo = "/login" }: Omit<RoleGuardProps, "requiredRole">) {
  return (
    <RoleGuard requiredRole="client" redirectTo={redirectTo}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard for client onboarding - ensures only clients who need onboarding can access
 */
export function OnboardingGuard({ children, redirectTo = "/_app/_auth/client" }: Omit<RoleGuardProps, "requiredRole">) {
  const { data: user, isLoading } = useCurrentUser();
  
  // Show nothing while loading
  if (isLoading) {
    return null;
  }
  
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Only clients should access onboarding
  if (!isClient(user)) {
    if (isAdmin(user)) {
      return <Navigate to="/_app/_auth/admin" />;
    }
    return <Navigate to="/login" />;
  }
  
  // If client has already completed onboarding, redirect to client dashboard
  if (!needsOnboarding(user)) {
    return <Navigate to={redirectTo} />;
  }
  
  // Client needs onboarding, render children
  return <>{children}</>;
}

