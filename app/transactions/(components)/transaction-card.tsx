"use client";

import dayjs from "dayjs";
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

import { Badge } from "@/components/ui/badge";
import { TransactionModel } from "@/models/transaction";

interface TransactionCardProps {
  transaction: TransactionModel;
  onClick: (id: string) => void;
}

const CHANNEL_ICON: Record<TransactionModel["channel"], React.ReactNode> = {
  POS: <StorefrontIcon weight="duotone" className="size-5" />,
  BANK_TRANSFER: <BankIcon weight="duotone" className="size-5" />,
  MOBILE_APP: <DeviceMobileIcon weight="duotone" className="size-5" />,
  CARD: <CreditCardIcon weight="duotone" className="size-5" />,
  USSD: <PhoneIcon weight="duotone" className="size-5" />,
  ATM: <MoneyIcon weight="duotone" className="size-5" />,
};

const CHANNEL_LABEL: Record<TransactionModel["channel"], string> = {
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

function formatDate(iso: string) {
  return dayjs(iso).format("MMM D, h:mm A");
}

export default function TransactionCard({
  transaction,
  onClick,
}: TransactionCardProps) {
  const {
    id,
    narration,
    counterpartyName,
    channel,
    type,
    amount,
    currency,
    status,
    date,
  } = transaction;

  const isCredit = type === "credit";

  return (
    <button
      onClick={() => onClick(id)}
      className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted"
    >
      {/* channel icon + debit/credit badge */}
      <div className="relative shrink-0">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-foreground/70">
          {CHANNEL_ICON[channel]}
        </div>
        <div
          className={`absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border-2 border-background ${
            isCredit
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
              : "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400"
          }`}
        >
          {isCredit ? (
            <ArrowDownLeftIcon weight="bold" className="size-2.5" />
          ) : (
            <ArrowUpRightIcon weight="bold" className="size-2.5" />
          )}
        </div>
      </div>

      {/* narration + meta */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {narration}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {counterpartyName} · {CHANNEL_LABEL[channel]} · {formatDate(date)}
        </p>
      </div>

      {/* amount + status */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className={`text-sm font-semibold tabular-nums ${
            isCredit
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-foreground"
          }`}
        >
          {isCredit ? "+ " : "- "}
          {formatAmount(amount, currency)}
        </span>

        <Badge
          className={
            status === "successful"
              ? " bg-emerald-50  border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              : status === "pending"
                ? "border-amber-100 bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                : "border-destructive-100 bg-destructive/10 text-destructive dark:bg-destructive/20"
          }
        >
          {status.toLocaleUpperCase()}
        </Badge>
      </div>
    </button>
  );
}
