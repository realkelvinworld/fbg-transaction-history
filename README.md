# FBN Ghana — Transaction History

A banking transaction history interface built as a Frontend Engineer interview assessment for First Bank Nigeria (Ghana). The goal was to demonstrate production-grade thinking: real data states, URL-persisted filters, infinite pagination, and a polished detail view — not just a happy-path list.

---

## Features

### Landing page

- Bank-branded hero with background image and gradient overlay
- "Get started" opens a form to verify identity (name, account number, branch)
- Form validates with Zod: account number must be exactly 10 numeric digits
- On submit, user data is saved to a Zustand store (persisted to `localStorage`) and the app navigates to the transaction history

### Transaction history

- **Profile banner** — shows the logged-in user's name, masked account number, and branch with a soft brand gradient
- **Infinite list** — loads 10 transactions at a time via `useInfiniteQuery`; a "Load more" button fetches the next page
- **Transaction card** — channel icon (POS, ATM, Bank Transfer, etc.) with a credit/debit direction badge overlay, narration, counterparty, date, amount (green for credit), and a status badge
- **Transaction detail modal** — opens on card click; shows a colored hero section (emerald for credit, violet for debit) with the channel icon, large amount, status badge, and every field: reference, date, channel, type, counterparty name and account, balance after, and transaction ID
- **Auth guard** — redirects to `/` if no user is in the store

### Filters (all URL-persisted via nuqs)

| Filter | Behaviour |
| --- | --- |
| Search | Debounced 400 ms, matches narration, counterparty name, and reference |
| Type | All / Debit only / Credit only |
| Date range | Calendar popover; future dates disabled |
| Clear | Appears when any filter is active; resets all at once |

Active filters highlight amber so the user always knows something is applied.

### States

Every async surface handles all four states:

- **Loading** — skeleton rows that match the real layout to avoid layout shift
- **Error** — warning icon + retry button
- **Empty** — context-aware copy ("No matching transactions" vs "No transactions yet")
- **Success** — the actual data

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (new-york) |
| Icons | Phosphor Icons |
| Fonts | Geist Sans & Geist Mono |
| Animation | Framer Motion |
| Data fetching | TanStack Query v5 (`useInfiniteQuery`) |
| URL state | nuqs v2 (`useQueryStates`) |
| Global state | Zustand v5 + persist middleware |
| HTTP client | Axios (typed wrapper, response interceptor unwraps `data`) |
| Form validation | React Hook Form + Zod |
| Date utilities | dayjs + date-fns |
| Date picker | react-day-picker v9 |

---

## Project structure

```text
app/
  page.tsx                        # Landing page
  layout.tsx                      # Root layout (fonts, theme toggler, providers)
  (components)/
    footer.tsx                    # Site footer
  transactions/
    page.tsx                      # Transaction history page
    (components)/
      profile.tsx                 # Profile banner
      transaction-card.tsx        # List item card
      transaction-detail.tsx      # Detail dialog
      transaction-skeleton.tsx    # Loading skeleton
      transaction-error.tsx       # Error state
      transaction-empty.tsx       # Empty state
  api/
    transactions/
      route.ts                    # GET /api/transactions (filtered + paginated)
      [id]/route.ts               # GET /api/transactions/:id
      data.ts                     # Mock transaction dataset

components/
  filters/index.tsx               # SearchFilter, TypeFilter, DateRangeFilter, ClearFilters
  forms/user-form.tsx             # Identity verification form
  ui/                             # shadcn primitives

models/
  transaction.ts                  # TransactionModel, TransactionFiltersModel
  user.ts                         # UserModel

services/
  transactions.ts                 # getTransactionsService, getTransactionByIdService

store/
  user.ts                         # Zustand user store (persisted)

providers/
  app-provider.tsx                # QueryClient + NuqsAdapter + progress bar

lib/
  http.ts                         # Typed axios wrapper
```

---

## Getting started

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. Enter any name, a 10-digit account number, and pick a branch to access the transaction history.
