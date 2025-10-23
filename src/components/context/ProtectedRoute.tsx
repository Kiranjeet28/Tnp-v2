// components/ProtectedRoute.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // If no user is logged in, redirect to login
            if (!user) {
                router.push("/login");
                return;
            }

            // If admin is required but user is not admin, redirect to home
            if (requireAdmin && !isAdmin) {
                router.push("/");
            }
        }
    }, [user, loading, isAdmin, requireAdmin, router]);

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If not authenticated, show nothing (will redirect)
    if (!user) {
        return null;
    }

    // If admin required but user is not admin, show nothing (will redirect)
    if (requireAdmin && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    // User is authenticated and has required permissions
    return <>{children}</>;
}

// Example usage in a protected page:
// app/create/page.tsx
/*
"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CreatePage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto p-6">
        <h1>Create Content (Admin Only)</h1>
        {/* Your create page content *\/}
      </div>
    </ProtectedRoute>
  );
}
*/