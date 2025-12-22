import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

// Lazy load pages for code-splitting
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configure React Query with optimal caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Page loading skeleton
const PageSkeleton = () => (
  <div className="min-h-screen bg-background p-8">
    <div className="max-w-4xl mx-auto space-y-8">
      <Skeleton className="h-32 w-64 mx-auto" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-3/4 mx-auto" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  </div>
);

const SESSION_RELOAD_KEY = "foodlens_postlogin_reload";
const SESSION_RELOAD_DONE_KEY = "foodlens_postlogin_reload_done";

// Auth wrapper component
const AuthenticatedApp = () => {
  const { user, isLoggedIn, isLoading, login, signUp, logout } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;

    const shouldReload = sessionStorage.getItem(SESSION_RELOAD_KEY) === "1";
    const done = sessionStorage.getItem(SESSION_RELOAD_DONE_KEY) === "1";

    if (shouldReload && !done) {
      sessionStorage.setItem(SESSION_RELOAD_DONE_KEY, "1");
      sessionStorage.removeItem(SESSION_RELOAD_KEY);
      window.location.reload();
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isLoggedIn) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Login onLogin={login} onSignUp={signUp} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Index user={user} onLogout={logout} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthenticatedApp />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
