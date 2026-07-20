# WasteLess Eats

WasteLess Eats is a mobile-first sustainability app for small local F&B operators in Singapore. It combines inventory forecasting, a surplus food marketplace, packaging recommendations, loyalty rewards, and a simple analytics dashboard in one Next.js application backed by SQLite through Prisma.

## Stack

- Next.js 16 with the App Router
- Tailwind CSS 4 for styling
- Prisma ORM
- SQLite for local persistence

## Features

- Smart inventory cards with demand pressure and expiry alerts
- Surplus food marketplace with live reservation actions
- Packaging optimiser with eco-friendly supplier suggestions
- Consumer rewards workflow for BYO container behaviour
- Waste analytics snapshots seeded with demo data

## Run locally

Install dependencies, create the local database, seed demo content, and start the app:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Then open http://localhost:3000.

## Useful scripts

- `npm run dev` starts the local app
- `npm run lint` runs ESLint
- `npm run build` creates a production build
- `npm run db:push` syncs the Prisma schema to SQLite
- `npm run db:seed` reloads demo data
- `npm run db:studio` opens Prisma Studio

## Notes

- The SQLite database is configured through `.env` with `DATABASE_URL="file:./dev.db"`.
- Demo data lives in `prisma/seed.ts` and can be adjusted.
