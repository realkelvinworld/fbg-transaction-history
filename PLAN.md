# Transaction History — Implementation Plan

## What we are building

A transaction history screen for a banking application. The user can view, filter, search, and inspect their transactions. Built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui — to the standard a production banking frontend would require.

---

## Real user flow (end to end)

1. User lands on the page — sees their full transaction list, most recent first, with a visible balance summary.
2. User scans the list — each row shows enough at a glance: counterparty name, narration, amount (colour-coded debit/credit), date, and a status badge.
3. User wants to find a specific payment — they type into the search box (narration, counterparty, or reference). Results update on Apply.
4. User wants to review spending for a period — they pick a date range using the date pickers. Invalid range (from > to) is caught before the API is called.
5. User wants to see only debits or only credits — they select a type filter.
6. User hits Apply — filters are written to the URL as query params. The list re-fetches only if the filters have actually changed.
7. User scrolls to the bottom and loads more — Load More fetches the next page and appends to the list.
8. User clicks a transaction row — a detail modal opens. It fetches full detail from `/api/transactions/:id` and displays all fields.
9. User closes the modal and hits browser back — URL params restore the exact filter state they were on.
10. User clears all filters — list resets to default (all transactions, no date range, no search).

---

## Requirements checklist (from assessment PDF)

### Filtering
- [x] Filter by type: All / Debit / Credit
- [x] Filter by date range: from–to date pickers
- [x] Search by narration / description
- [x] Apply filter button (not auto-fire on every keystroke)

### UI behaviour
- [x] List updates when filters are applied
- [x] Empty state when no results match
- [x] Click transaction row → opens detail modal
- [x] Modal shows: amount, narration, date, transaction type
- [x] Loading state while fetching

### Technical
- [x] Filters reflected in URL query params
- [x] Filter state persists when navigating back
- [x] Pagination via Load More (appends results)
- [x] No redundant API calls when filters are unchanged
- [x] Invalid date range (from > to) handled before API call

### Banking-grade additions (beyond the spec)
- [x] Debit amounts shown in red, credit in green
- [x] Transaction status badge (successful / pending / failed)
- [x] Channel badge (POS / BANK_TRANSFER / MOBILE_APP / CARD / ATM / USSD)
- [x] Masked counterparty account numbers (already in mock data)
- [x] Currency formatting (GHS + proper locale number format)
- [x] Accessible markup — ARIA labels, keyboard-navigable modal, focus trap
- [x] Skeleton loading state (not a spinner) — avoids layout shift
- [x] Error state with retry action
- [x] Responsive layout (mobile first — banking apps are used on phones)
- [x] Summary bar — total debit, total credit, and record count for the current filtered view

---

## User onboarding flow

Before reaching the transactions screen, the user fills a short profile form.

```
/ (landing page)
  → Profile form: full name, account number, branch (dropdown)
  → Zod validation before submit
  → On submit: persisted to zustand store (localStorage via persist middleware)
  → Redirect to /transactions
  → If store already has a profile: auto-redirect to /transactions

/transactions
  → If store has no profile: redirect back to /
  → Account card at top: name, masked account number, branch
  → Full transaction history below
```

Store: `store/user.ts` — `useUserStore` (zustand + persist, key: `fbn_user_profile`)

---

## Generic API response wrappers (`models/api.ts`)

All API responses are typed through these generics — callers never cast manually.

```ts
PaginatedResponseModel<T>  — { status, page, limit, totalRecords, totalPages, data: T[] }
SingleResponseModel<T>     — { status, data: T, message? }
```

---

## Architecture layers

Build order: model → service → hook → components

### 1. Models
```
models/api.ts          — PaginatedResponseModel<T>, SingleResponseModel<T>
models/transaction.ts  — TransactionModel, TransactionFiltersModel
models/user.ts         — IUser
```

### 2. Service (`services/transactions.ts`)
```
getTransactionsService(filters, page)  — GET /api/transactions
getTransactionByIdService(id)          — GET /api/transactions/:id
```
When a real API base URL is available, only the `http` client's `baseURL` needs updating — nothing else changes.

### 3. Store (`store/user.ts`)
```
useUserStore  — zustand + persist
  user: IUser | null
  setUser(user)
  clearUser()
```

### 4. Hook (`hooks/use-transactions.ts`)
```
useTransactions(filters)
  — owns fetching state (data, isLoading, isError)
  — owns pagination state (page, hasMore)
  — exposes loadMore()
  — skips re-fetch if filters are reference-equal to last fetch
```

### 5. Routes (`routes/index.ts`)
```
routes.home         — "/"
routes.transactions — "/transactions"
```

### 6. Components

| Component | Responsibility |
|---|---|
| `app/page.tsx` | Profile entry form — name, account number, branch |
| `app/transactions/page.tsx` | Transactions page — reads URL params, owns filter state |
| `components/profile-form.tsx` | Controlled form with Zod validation |
| `components/account-card.tsx` | Shows user name, masked account number, branch |
| `components/transaction-filters.tsx` | Filter bar — type select, date pickers, search input, Apply + Clear |
| `components/transaction-list.tsx` | Renders rows or skeleton/empty/error states |
| `components/transaction-row.tsx` | Single row — amount, narration, counterparty, date, status badge |
| `components/transaction-summary.tsx` | Summary bar — count, total debit, total credit for current filter |
| `components/transaction-detail-modal.tsx` | Modal — fetches by ID, renders full detail |
| `components/transaction-skeleton.tsx` | Skeleton placeholder rows during load |
| `components/empty-state.tsx` | Shown when filtered results are zero |
| `components/error-state.tsx` | Shown on fetch failure with retry button |

---

## State management

- **Filter state** lives in the URL (`useSearchParams`) — not in `useState`
  - `?type=debit&from=2026-01-01&to=2026-02-28&search=uber&page=1`
  - This gives free back-navigation restoration and shareable URLs
- **Pending filter state** (before Apply is clicked) lives in local `useState` inside the filter bar
- **Transaction list + pagination** lives in the `useTransactions` hook
- **Selected transaction ID** (for modal) lives in `useState` on the page — drives the modal open/close

## Filter application logic

```
1. User edits filters in the bar (local state only — no fetch yet)
2. User clicks Apply:
   a. Validate date range — if from > to, show inline error, abort
   b. Shallow-push updated params to URL
   c. Hook detects URL param change, compares to last fetched params
   d. If different → fetch page 1, replace list
   e. If same → no-op
3. User clicks Clear — reset URL params to defaults, reset local filter state
```

---

## File structure (final)

```
app/
  page.tsx                          ← transaction history page
  globals.css
  layout.tsx
  api/
    transactions/
      data.ts                       ← mock data + TransactionModel
      route.ts                      ← GET /api/transactions
      [id]/
        route.ts                    ← GET /api/transactions/:id

components/
  transaction-filters.tsx
  transaction-list.tsx
  transaction-row.tsx
  transaction-summary.tsx
  transaction-detail-modal.tsx
  transaction-skeleton.tsx
  empty-state.tsx
  error-state.tsx
  ui/                               ← shadcn primitives (barrel exported)
    index.ts

models/
  transaction.ts

services/
  transactions.ts

hooks/
  use-transactions.ts
  index.ts

routes/
  index.ts

lib/
  http.ts                           ← axios client (baseURL via env var)
  utils.ts
```

---

## shadcn components needed

Run before building:
```
npx shadcn add dialog select input badge separator skeleton
```

---

## API transition note

When a real API base URL is confirmed, the only change needed is:

```ts
// lib/http.ts  or  .env.local
NEXT_PUBLIC_API_URL=https://api.realbank.com
```

The service layer, hooks, and all components remain unchanged.
