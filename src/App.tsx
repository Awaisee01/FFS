import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeTracking } from './lib/unified-tracking-manager';

// Critical above-the-fold components (loaded immediately)
import Navigation from "./components/SimpleNav";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";

// Load critical pages immediately for faster initial loads
import Index from "./pages/Index";
import ECO4 from "./pages/ECO4";
import Solar from "./pages/Solar";

// Lazy-load less critical pages
const GasBoilers = lazy(() => import("./pages/GasBoilers"));
const HomeImprovements = lazy(() => import("./pages/HomeImprovements"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Page loading skeleton
const PageLoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
    </div>
  </div>
);

// App wrapper with unified tracking
const AppWithTracking = () => {
  useEffect(() => {
    // Initialize tracking system on app start
    initializeTracking().catch(error => {
      console.error('❌ Failed to initialize tracking:', error);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Navigation />
            
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <Routes>
                {/* Critical pages load immediately */}
                <Route path="/" element={<Index />} />
                <Route path="/eco4" element={<ECO4 />} />
                <Route path="/solar" element={<Solar />} />
                
                {/* Less critical pages with suspense */}
                <Route path="/gas-boilers" element={
                  <Suspense fallback={<PageLoadingSkeleton />}>
                    <GasBoilers />
                  </Suspense>
                } />
                <Route path="/home-improvements" element={
                  <Suspense fallback={<PageLoadingSkeleton />}>
                    <HomeImprovements />
                  </Suspense>
                } />
                <Route path="/contact" element={
                  <Suspense fallback={<PageLoadingSkeleton />}>
                    <Contact />
                  </Suspense>
                } />
                <Route path="/admin" element={
                  <Suspense fallback={<PageLoadingSkeleton />}>
                    <Admin />
                  </Suspense>
                } />
                <Route path="*" element={
                  <Suspense fallback={<PageLoadingSkeleton />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          
          <Toaster position="top-center" />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AppWithTracking />
    </ErrorBoundary>
  );
};

export default App;