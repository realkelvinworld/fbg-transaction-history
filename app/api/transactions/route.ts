import { NextRequest, NextResponse } from "next/server";

import { ALL_TRANSACTIONS } from "./data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") ?? "all";
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
  );

  await new Promise((resolve) => setTimeout(resolve, 400));

  let results = [...ALL_TRANSACTIONS];

  if (type === "debit" || type === "credit") {
    results = results.filter((t) => t.type === type);
  }

  if (from) {
    const fromDate = new Date(from);
    results = results.filter((t) => new Date(t.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    results = results.filter((t) => new Date(t.date) <= toDate);
  }

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    results = results.filter(
      (t) =>
        t.narration.toLowerCase().includes(term) ||
        t.counterpartyName.toLowerCase().includes(term) ||
        t.reference.toLowerCase().includes(term)
    );
  }

  const totalRecords = results.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const offset = (page - 1) * limit;
  const data = results.slice(offset, offset + limit);

  return NextResponse.json({
    status: "success",
    page,
    limit,
    totalRecords,
    totalPages,
    data,
  });
}
