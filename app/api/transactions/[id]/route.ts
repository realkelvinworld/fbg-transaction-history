import { NextRequest, NextResponse } from "next/server";

import { ALL_TRANSACTIONS } from "../data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await new Promise((resolve) => setTimeout(resolve, 300));

  const transaction = ALL_TRANSACTIONS.find((t) => t.id === id);

  if (!transaction) {
    return NextResponse.json(
      { status: "error", message: "Transaction not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: "success", data: transaction });
}
