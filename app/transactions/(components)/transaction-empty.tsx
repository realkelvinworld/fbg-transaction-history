import { ReceiptXIcon } from "@phosphor-icons/react/dist/ssr";

interface TransactionEmptyProps {
  hasFilters: boolean;
}

export default function TransactionEmpty({ hasFilters }: TransactionEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <ReceiptXIcon weight="duotone" className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          {hasFilters ? "No matching transactions" : "No transactions yet"}
        </p>
        <p className="text-xs text-muted-foreground">
          {hasFilters
            ? "Try adjusting your filters or search term"
            : "Your transactions will appear here once you make one"}
        </p>
      </div>
    </div>
  );
}
