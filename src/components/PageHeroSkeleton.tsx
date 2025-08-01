
import { Skeleton } from '@/components/ui/skeleton';

interface PageHeroSkeletonProps {
  hasForm?: boolean;
}

const PageHeroSkeleton = ({ hasForm = false }: PageHeroSkeletonProps) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-6">
            <Skeleton className="h-16 w-full bg-white/20" />
            <Skeleton className="h-8 w-3/4 bg-white/20" />
            <Skeleton className="h-6 w-full bg-white/20" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-5/6 bg-white/20" />
              <Skeleton className="h-6 w-4/5 bg-white/20" />
              <Skeleton className="h-6 w-full bg-white/20" />
              <Skeleton className="h-6 w-3/4 bg-white/20" />
            </div>
          </div>
          
          {hasForm && (
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm">
                <Skeleton className="h-[580px] w-full bg-white/20 rounded-lg" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeroSkeleton;
