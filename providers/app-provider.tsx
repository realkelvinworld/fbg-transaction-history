"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressProvider } from "@bprogress/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense, useState } from "react";

import { Toaster } from "@/components/ui/sonner";

function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30,
            retry: 1,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppProgressProvider
        shallowRouting
        color="#022e64"
        options={{ showSpinner: false }}
      >
        <Suspense>
          <NuqsAdapter>{children}</NuqsAdapter>
        </Suspense>
      </AppProgressProvider>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default AppProvider;
