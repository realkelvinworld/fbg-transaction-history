export interface PaginatedResponseModel<T> {
  status: "success" | "error";
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
}

export interface SingleResponseModel<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}
