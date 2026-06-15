import SkeletonCard from '@/components/shared/skeleton-card';

export default function Loading() {
  return (
    <main>
      {/* Hero skeleton */}
      <section className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8 sm:mb-12 pb-8 sm:pb-12 border-b border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-gray-100 dark:ring-gray-800" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex gap-4 mt-3">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </section>

      {/* Projects heading skeleton */}
      <section>
        <div className="h-8 w-56 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
