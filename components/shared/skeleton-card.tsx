export default function SkeletonCard() {
  return (
    <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 animate-pulse">
      {/* Title skeleton */}
      <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
      {/* Description lines */}
      <div className="space-y-2 mt-3">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      {/* Topic chips skeleton */}
      <div className="flex gap-1.5 mt-3">
        <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      {/* Language badge + stats row */}
      <div className="flex items-center gap-2 mt-3">
        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
