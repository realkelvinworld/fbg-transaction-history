"use client";

import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BankIcon,
  CreditCardIcon,
  DeviceMobileIcon,
  MoneyIcon,
  PhoneIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";

import { getTransactionByIdService } from "@/services/transactions";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionModel } from "@/models/transaction";

interface TransactionDetailProps {
  id: string | null;
  onClose: () => void;
}

type Channel = TransactionModel["channel"];

const ICON_MAP: Record<Channel, (cls: string) => React.ReactNode> = {
  POS: (cls) => <StorefrontIcon weight="duotone" className={cls} />,
  BANK_TRANSFER: (cls) => <BankIcon weight="duotone" className={cls} />,
  MOBILE_APP: (cls) => <DeviceMobileIcon weight="duotone" className={cls} />,
  CARD: (cls) => <CreditCardIcon weight="duotone" className={cls} />,
  USSD: (cls) => <PhoneIcon weight="duotone" className={cls} />,
  ATM: (cls) => <MoneyIcon weight="duotone" className={cls} />,
};

const CHANNEL_LABEL: Record<Channel, string> = {
  POS: "POS",
  BANK_TRANSFER: "Bank Transfer",
  MOBILE_APP: "Mobile App",
  CARD: "Card",
  USSD: "USSD",
  ATM: "ATM",
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`truncate text-right text-sm font-medium ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </>
  );
}

function StatusBadge({ status }: { status: TransactionModel["status"] }) {
  return (
    <Badge
      className={
        status === "successful"
          ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          : status === "pending"
            ? "border-amber-100 bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
            : "border-red-100 bg-destructive/10 text-destructive dark:bg-destructive/20"
      }
    >
      {status.toLocaleUpperCase()}
    </Badge>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* hero skeleton */}
      <div className="flex flex-col items-center gap-3 rounded-xl bg-muted/50 p-5">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-5 w-20" />
      </div>
      {/* rows skeleton */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function TransactionDetail({
  id,
  onClose,
}: TransactionDetailProps) {
  const { data, isPending } = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransactionByIdService(id!),
    enabled: !!id,
  });

  const txn = data?.data;
  const isCredit = txn?.type === "credit";

  const heroBg = isCredit
    ? "bg-emerald-50 dark:bg-emerald-900/20"
    : "bg-violet-50 dark:bg-violet-900/20";

  const iconCircle = isCredit
    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
    : "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400";

  const directionBadge = isCredit
    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
    : "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400";

  return (
    <Dialog open={!!id} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          {isPending ? (
            <Skeleton className="h-5 w-3/4" />
          ) : (
            <DialogTitle className="pr-6 text-sm font-medium text-muted-foreground">
              {txn?.narration}
            </DialogTitle>
          )}
          <DialogDescription className="sr-only">
            Transaction details
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <LoadingSkeleton />
        ) : txn ? (
          <div className="space-y-4">
            {/* Hero */}
            <div
              className={`flex flex-col items-center gap-3 rounded-xl p-5 ${heroBg}`}
            >
              {/* Channel icon + direction badge */}
              <div className="relative">
                <div
                  className={`flex size-16 items-center justify-center rounded-full ${iconCircle}`}
                >
                  {ICON_MAP[txn.channel]("size-7")}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border-2 border-background ${directionBadge}`}
                >
                  {isCredit ? (
                    <ArrowDownLeftIcon weight="bold" className="size-2.5" />
                  ) : (
                    <ArrowUpRightIcon weight="bold" className="size-2.5" />
                  )}
                </div>
              </div>

              {/* Amount + status */}
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`text-3xl font-bold tabular-nums ${
                    isCredit
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-foreground"
                  }`}
                >
                  {isCredit ? "+ " : "− "}
                  {formatAmount(txn.amount, txn.currency)}
                </span>
                <StatusBadge status={txn.status} />
              </div>
            </div>

            {/* Transaction details */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Row label="Reference" value={txn.reference} mono />
              <Row
                label="Date"
                value={dayjs(txn.date).format("MMM D, YYYY · h:mm A")}
              />
              <Row
                label="Channel"
                value={
                  <span className="flex items-center justify-end gap-1.5">
                    {ICON_MAP[txn.channel]("size-3.5")}
                    {CHANNEL_LABEL[txn.channel]}
                  </span>
                }
              />
              <Row label="Type" value={isCredit ? "Credit" : "Debit"} />
            </div>

            <Separator />

            {/* Counterparty */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Row
                label={isCredit ? "From" : "To"}
                value={txn.counterpartyName}
              />
              <Row label="Account no." value={txn.counterpartyAccount} mono />
            </div>

            <Separator />

            {/* Balance */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Row
                label="Balance after"
                value={
                  <span className="font-semibold">
                    {formatAmount(txn.balanceAfter, txn.currency)}
                  </span>
                }
              />
              <Row label="Transaction ID" value={txn.id} mono />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
