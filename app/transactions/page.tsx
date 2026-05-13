"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryStates, parseAsString } from "nuqs";
import { useRouter } from "next/navigation";
import {
  ArrowClockwiseIcon,
  CaretLeftIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

import { getTransactionsService } from "@/services/transactions";
import {
  SearchFilter,
  TypeFilter,
  DateRangeFilter,
  ClearFilters,
} from "@/components/filters";
import { InView } from "@/components/animations/in-view";
import TransactionCard from "./(components)/transaction-card";
import TransactionDetail from "./(components)/transaction-detail";
import TransactionSkeleton from "./(components)/transaction-skeleton";
import TransactionError from "./(components)/transaction-error";
import TransactionEmpty from "./(components)/transaction-empty";
import ProfileBanner from "./(components)/profile";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user";

export default function Page() {
  // state
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [filters, setFilters] = useQueryStates({
    type: parseAsString.withDefault("all"),
    from: parseAsString.withDefault(""),
    to: parseAsString.withDefault(""),
    search: parseAsString.withDefault(""),
  });

  // hooks
  const router = useRouter();
  const { user, clearUser, _hasHydrated } = useUserStore();

  // api
  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["transactions", filters],
    queryFn: ({ pageParam }) =>
      getTransactionsService({
        type: filters.type as "all" | "debit" | "credit",
        from: filters.from || undefined,
        to: filters.to || undefined,
        search: filters.search || undefined,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  // variables
  const transactions = data?.pages.flatMap((p) => p.data) ?? [];
  const hasFilters =
    filters.type !== "all" ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.search !== "";

  // functions
  const clearFilters = () => {
    setFilters({ type: "all", from: "", to: "", search: "" });
  };

  // effects
  useEffect(() => {
    if (_hasHydrated && !user) {
      router.push("/");
    }
  }, [_hasHydrated, user, router]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
      <Button
        variant="outline"
        className="rounded-full my-2"
        onClick={() => {
          clearUser();
          router.push("/");
        }}
      >
        <CaretLeftIcon weight="bold" className="size-4" /> Back
      </Button>

      {/* Profile */}
      <ProfileBanner />

      {/* Filters */}
      <div className="sticky top-73 rounded-lg px-4 z-50 my-4 flex flex-wrap items-center gap-2 bg-background py-3">
        <SearchFilter
          value={filters.search}
          onChange={(val) => setFilters({ search: val })}
        />
        <TypeFilter
          value={filters.type}
          onChange={(val) => setFilters({ type: val })}
        />
        <DateRangeFilter
          from={filters.from}
          to={filters.to}
          onChange={(from, to) => setFilters({ from, to })}
        />
        <ClearFilters filters={filters} onClear={clearFilters} />
      </div>

      {/* Data */}
      {isPending ? (
        <TransactionSkeleton />
      ) : error ? (
        <TransactionError onRetry={refetch} />
      ) : (
        <>
          {transactions.length === 0 ? (
            <TransactionEmpty hasFilters={hasFilters} />
          ) : (
            <InView
              viewOptions={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {transactions.map((txc) => (
                <TransactionCard
                  key={txc.id}
                  transaction={txc}
                  onClick={setSelectedId}
                />
              ))}
            </InView>
          )}

          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="gap-2 rounded-full"
              >
                <ArrowClockwiseIcon
                  className={`size-4 ${isFetchingNextPage ? "animate-spin" : ""}`}
                />
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
      <TransactionDetail id={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
