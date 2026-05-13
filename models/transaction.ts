export interface TransactionModel {
  id: string;
  reference: string;
  type: "debit" | "credit";
  amount: number;
  currency: string;
  narration: string;
  channel: "POS" | "BANK_TRANSFER" | "MOBILE_APP" | "CARD" | "USSD" | "ATM";
  counterpartyName: string;
  counterpartyAccount: string;
  status: "successful" | "pending" | "failed";
  date: string;
  balanceAfter: number;
}

export interface TransactionFiltersModel {
  type: "all" | "debit" | "credit";
  from: string;
  to: string;
  search: string;
  page: number;
}
