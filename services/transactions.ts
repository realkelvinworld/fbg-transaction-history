import http from "@/lib/http";

import { PaginatedResponseModel, SingleResponseModel } from "@/interfaces/api";
import { TransactionModel } from "@/models/transaction";

export const getTransactionsService = (params: {
  type?: "all" | "debit" | "credit";
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}) =>
  http.get<PaginatedResponseModel<TransactionModel>>("/api/transactions", {
    params,
  });

export const getTransactionByIdService = (id: string) =>
  http.get<SingleResponseModel<TransactionModel>>(`/api/transactions/${id}`);
