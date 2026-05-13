import { Skeleton } from "@/components/ui/skeleton";

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-2/5 rounded-md" />
        <Skeleton className="h-3 w-3/5 rounded-md" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Skeleton className="h-3.5 w-20 rounded-md" />
        <Skeleton className="h-3 w-12 rounded-md" />
      </div>
    </div>
  );
}

export default function TransactionSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
