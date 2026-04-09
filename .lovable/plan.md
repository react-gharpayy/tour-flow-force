

# Gharpayy Tour Engine — Complete Missing Features

## What gets built

### 1. Persistent Top Header Bar (all pages)
Global bar showing: today's date, live tour count, global zone filter dropdown, and a "Who Am I" member selector. The selected member drives TCM/Flow Ops views so they see only their own data instead of hardcoded m5/m6.

### 2. Working Date Range Filter
The DateRangeToggle currently does nothing. Wire it up so HR Tower, Team Performance, and Draft Tracker actually filter tours by today / last 7 days / last 30 days. Requires adding varied `tourDate` values to mock data (not all same day).

### 3. MYT Lead Tracker (Flow Ops CRM-lite)
New page `/leads` for Flow Ops. Log leads with: Name, Phone, Area, Budget, Move-in date, Date confirmed. Auto-qualify against MYT criteria (area covered, budget ≥₹7K, move-in ≤15 days, date confirmed). Shows qualified vs unqualified count. Leads can be pushed to "Schedule Tour" with one tap.

### 4. Bookings Page
New page `/bookings`. Log anyone who commits: lead name, property, rent value, via-tour or direct, agreement status (Pending → Signed → Moved In), who closed it. Tracks revenue generated per member.

### 5. Funnel View
New page `/funnel` for HR. Full pipeline: Tours Scheduled → Show-Ups → Drafts → Bookings (via tour) with conversion % at each step. Plus a "Who Is Converting" table showing each member's full journey.

### 6. Leaderboard
New page `/leaderboard`. Scoring formula: `(tours × show-up rate × draft rate)`. Ranked list with #1/#2/#3 badges. Green zone (>70% show-up, strong drafts) vs Red zone (<50%). Sortable, filterable by role and zone.

### 7. Notifications / Reminders Panel
Component shown on TCM and HR views. Surfaces: tours in next 2 hours not yet confirmed, drafts older than 3 days with no agreement, completed tours with no outcome update.

### 8. Cycle Tracker (Flow Ops)
New section on Flow Ops dashboard. Track per 90-min cycle: chats closed (target 30), MYT leads identified (target 10), tours scheduled (target 4), same-day confirmed (target 2). Simple counter inputs with progress bars against targets. 4 cycles per day view.

### 9. Fix TCM Identity
Replace hardcoded `m5`/`m6` filter with `currentMemberId` from the top header "Who Am I" selector. TCM Dashboard, Actions, and Performance all use the selected member.

### 10. Mock Data Improvements
- Spread tour dates across last 30 days so date filtering works
- Add realistic lead names instead of "Lead 1", "Lead 2"

## Technical approach

- New component: `TopHeader.tsx` — rendered in `App.tsx` above `<Routes>`
- New types: `Lead` (MYT tracker), `Booking` (bookings page) added to `types.ts`
- New state in `app-context.tsx`: `leads`, `bookings`, `currentMemberId` already exists
- New pages: `MYTLeadTracker.tsx`, `Bookings.tsx`, `Funnel.tsx`, `Leaderboard.tsx`, `CycleTracker.tsx`
- New nav items added per role in `AppSidebar.tsx`
- All pages mobile-first: card stacks on mobile, tables on desktop

## File changes summary

| File | Action |
|------|--------|
| `src/components/TopHeader.tsx` | Create — persistent header |
| `src/pages/MYTLeadTracker.tsx` | Create — lead CRM |
| `src/pages/Bookings.tsx` | Create — booking tracker |
| `src/pages/Funnel.tsx` | Create — pipeline view |
| `src/pages/Leaderboard.tsx` | Create — ranked performance |
| `src/components/NotificationsPanel.tsx` | Create — alerts/reminders |
| `src/lib/types.ts` | Add Lead, Booking types |
| `src/lib/mock-data.ts` | Fix dates, add leads/bookings, realistic names |
| `src/lib/app-context.tsx` | Add leads, bookings state |
| `src/App.tsx` | Add TopHeader, new routes |
| `src/components/AppSidebar.tsx` | Add new nav items per role |
| `src/pages/HRTower.tsx` | Wire date filter, add notifications |
| `src/pages/TCMDashboard.tsx` | Use currentMemberId |
| `src/pages/TCMActions.tsx` | Use currentMemberId |
| `src/pages/TCMPerformance.tsx` | Use currentMemberId |
| `src/pages/FlowOpsDashboard.tsx` | Add cycle tracker section |

~16 files, estimated 8-10 minutes to implement.

