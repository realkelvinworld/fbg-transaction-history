import { ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";

interface TransactionErrorProps {
  onRetry: () => void;
}

export default function TransactionError({ onRetry }: TransactionErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <WarningCircleIcon weight="duotone" className="size-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Failed to load transactions</p>
        <p className="text-xs text-muted-foreground">Something went wrong. Please try again.</p>
      </div>
      <Button variant="outline" size="sm" className="gap-2" onClick={onRetry}>
        <ArrowClockwiseIcon className="size-4" />
        Try again
      </Button>
    </div>
  );
}
