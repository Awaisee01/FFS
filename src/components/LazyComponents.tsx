import { Suspense, lazy } from 'react';

// Lazy load non-critical components
const ServicesGrid = lazy(() => import('@/components/ServicesGrid'));
const TrustBadges = lazy(() => import('@/components/TrustBadges'));
const ProcessSection = lazy(() => import('@/components/ProcessSection'));
const CallToActionSection = lazy(() => import('@/components/CallToActionSection'));

// Loading fallback component
const SectionSkeleton = () => (
  <div className="animate-pulse bg-gray-200 h-64 rounded-lg mx-auto max-w-7xl"></div>
);

export const LazyComponents = {
  ServicesGrid: (props: any) => (
    <Suspense fallback={<SectionSkeleton />}>
      <ServicesGrid {...props} />
    </Suspense>
  ),
  TrustBadges: (props: any) => (
    <Suspense fallback={<div className="h-20"></div>}>
      <TrustBadges {...props} />
    </Suspense>
  ),
  ProcessSection: (props: any) => (
    <Suspense fallback={<SectionSkeleton />}>
      <ProcessSection {...props} />
    </Suspense>
  ),
  CallToActionSection: (props: any) => (
    <Suspense fallback={<div className="h-40"></div>}>
      <CallToActionSection {...props} />
    </Suspense>
  )
};