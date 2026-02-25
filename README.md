# MealSpin 🎰

> Spin the wheel. Decide your fate. Eat well.

A premium, Vegas-style meal selection app for private groups. Press a button, watch the wheel spin, and get a randomly selected meal — with smart cooldown rules to prevent repeats.

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript** — modern full-stack React framework
- **Tailwind CSS** — utility-first styling with custom Vegas color theme
- **Prisma** + **SQLite** — simple, self-contained database; no external services needed
- **Framer Motion** — smooth reveal animations
- **date-fns** — date formatting and calculations
- **canvas-confetti** — celebration effect on meal confirmation
- **lucide-react** — icons

**Why SQLite?** This app is for a private group. SQLite lives in a single file, requires zero configuration, and deploys anywhere. No Supabase account, no cloud costs, no latency. Perfect for a household or small team.

## Setup

```bash
# 1. Clone and install
git clone <repo>
cd mealspin
npm install

# 2. Create database schema
npx prisma db push

# 3. Seed with 27 sample meals and test history
npm run db:seed

# 4. Start development server
npm run dev
```

Open **http://localhost:3000**

## How It Works

### Spin → Preview → Confirm or Reject

The core flow is a 3-step loop:

1. **Spin** — the wheel animates, an eligible meal is selected (not yet saved)
2. **Preview** — the meal is revealed in a spotlight card
3. **Confirm** — writes the selection to history, starts cooldown
   — or —
   **Reject & Re-spin** — excludes the meal from *this session only* (not from history) and spins again

**Only confirmed selections are saved to history.** Rejected meals are not counted against you.

### Cooldown System

- Default cooldown: **21 days**
- If a meal was confirmed within the last 21 days, it is excluded from the random pool
- Blocked meals are shown in the eligibility status ("X on cooldown")
- Cooldown is configurable: 7 / 14 / 21 / 28 / 42 days via the settings gear icon
- If no eligible meals remain, the app shows an explanation and offers to reduce the cooldown

### Selection History

- Main view: last 7 days of confirmed selections
- Tabs: "This Week" | "Last 3 Weeks" | "All Time"
- Sort: newest first
- Each item shows: meal name, category, timestamp, relative time

## Architecture

```
mealspin/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # 27 sample meals + test history
├── src/
│   ├── types/index.ts         # Shared TypeScript interfaces
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton client
│   │   └── selectionService.ts  # ← Core business logic
│   ├── app/
│   │   ├── api/
│   │   │   ├── meals/         # CRUD for meals
│   │   │   ├── spin/          # POST → pick eligible meal
│   │   │   ├── selections/    # Confirm selections / fetch history
│   │   │   └── settings/      # Cooldown configuration
│   │   ├── page.tsx           # Main spin page
│   │   └── meals/page.tsx     # Meal management
│   └── components/
│       ├── SpinWheel.tsx      # SVG roulette wheel with forwardRef
│       ├── MealReveal.tsx     # Spotlight reveal with confetti
│       ├── HistoryPanel.tsx   # Tabbed selection history
│       ├── MealManager.tsx    # Full CRUD list
│       ├── MealForm.tsx       # Add/edit form with tag input
│       ├── EligibilityStatus.tsx  # Status pill + cooldown selector
│       └── NoEligibleMealsPanel.tsx  # Fallback when pool is empty
```

The eligibility algorithm lives entirely in `src/lib/selectionService.ts` — pure, testable, no side effects:

```typescript
getEligibilityResult(allMeals, history, cooldownDays, sessionRejectedIds)
// → { eligibleMeals, blockedMeals, sessionRejectedMeals, totalEnabled }
```

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:seed      # Reset and re-seed database
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:reset     # Full reset + reseed
```

## Deployment

### Option A: Self-hosted (simplest)
```bash
npm run build
npm start
```
The SQLite database lives at `prisma/dev.db`. Back it up periodically.

### Option B: Vercel
Note: Vercel's serverless functions don't support persistent SQLite. For Vercel deployment, migrate to Supabase/PlanetScale and update the Prisma datasource.

### Option C: Railway / Fly.io / Render
Works perfectly — these platforms support persistent volumes for the SQLite file.

## Future Upgrades

- **Auth** — add NextAuth.js; the schema has `selectedBy` field ready to go
- **Group voting** — add a "veto" mechanic where multiple users vote before confirming
- **Notifications** — webhook/Slack notification when a meal is confirmed
- **Scheduling** — "Plan meals for the week" view
- **Rejection analytics** — separate `spin_events` table to track why meals get rejected
- **Weighted randomness** — give recently-added meals higher spin weight
- **Ingredient notes** — attach shopping list items to each meal

---

*MealSpin — built with Next.js, Prisma, and a touch of Vegas magic.*
