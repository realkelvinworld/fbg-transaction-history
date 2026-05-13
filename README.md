# FBN Ghana — Transaction History

A banking transaction history interface built as a Frontend Engineer interview assessment for First Bank Nigeria (Ghana).

---

## Features

- **Landing page** — bank-branded hero, identity form with Zod validation
- **Profile banner** — user name, masked account number, and branch
- **Transaction list** — paginated, loads more on demand
- **Transaction card** — channel icon, credit/debit badge, amount, status
- **Transaction detail** — full breakdown in a modal on card click
- **Filters** — search, type (debit/credit), date range; all URL-persisted
- **States** — loading skeleton, error + retry, empty (filter-aware)

---

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Phosphor Icons |
| Data fetching | TanStack Query v5 |
| URL state | nuqs v2 |
| Global state | Zustand v5 |
| Forms | React Hook Form + Zod |

---

## Getting started

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. Enter any name, a 10-digit number, and pick a branch to get in.
