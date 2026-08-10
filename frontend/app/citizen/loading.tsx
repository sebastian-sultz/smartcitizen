import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 w-full opacity-0 animate-[fade-in_0.25s_ease-out_350ms_both]">
      {/* Page Header Skeleton */}
      <div className="space-y-2.5">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>

      {/* Grid Dashboard Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Pane */}
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-44 w-full rounded-card" />
          
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Skeleton className="h-28 w-full rounded-card" />
              <Skeleton className="h-28 w-full rounded-card" />
              <Skeleton className="h-28 w-full rounded-card" />
            </div>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div className="w-full">
          <Skeleton className="h-96 w-full rounded-card" />
        </div>
      </div>

      {/* Lower Details Table Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
