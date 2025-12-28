# PROJECT: NBA REPLAY v2

## 1. CORE ARCHITECTURE
- **Root**: `main.jsx` wraps everything in `<BankrollProvider>`.
- **Routing**: `App.jsx` handles `BrowserRouter` and Routes.
- **Layout Strategy ("Smart App Shell")**:
  - **Global**: `PageContainer.jsx` sets `h-screen w-full overflow-hidden`.
  - **Scroll Policy**: The window **NEVER** scrolls.
  - **Content**: Inner pages use `flex-1` and `overflow-y-auto` to manage their own scrolling.
  - **Headers**: Managed by `PageContainer` (NOT `App.jsx`).

## 2. GOLD STANDARD UI RULES

### A. The Play Page
- **Layout**: Flex Column (Header -> Jackpot -> Cards -> Footer). No gap above Jackpot.
- **Budget Display**:
  - **Format**: **$15.0** (Constant Anchor) + **(Remaining)**.
  - **Logic**: Parenthesis shows `$15.0 - Current_Liability`.
  - **Liability**: During Deal = Cost of Holds. During Reveal = Cost of Full Hand.
- **Card Grid**: Scrolls independently behind the footer.

### B. The LiveCard Component
- **Visuals**: Flip animation, High-Res Headshot (scaled 125%), Black Cost Badge.
- **Stats**: TWO rows. (PTS/REB/AST) and (STL/BLK/TO).
- **Data**: **REAL DATA ONLY**. If `avg_stats` is missing in DB, show "-". Do not calculate/guess.

### C. Feature Tabs
- **Pulse**: News Aggregator, Social Feed, Chat. (NOT a betting ticker).
- **Collect**: VIP Tiers, Daily Tasks, Slot Machine. (NOT a card gallery).

## 3. DATA INTEGRITY
- **Source**: `src/data/real_nba_db.js`.
- **Immutable Rule**: We never simulate stats. We display what is in the DB.

## 4. CURRENT STATUS
- **Architecture**: Stable (Smart Shell + Global Context).
- **Play**: Complete (Layout & Math fixed).
- **Pulse**: Functional (News/Social).
- **Collect**: Functional (VIP/Tasks).
- **Home**: Static Landing.