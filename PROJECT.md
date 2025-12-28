# PROJECT: REPLAY - IFS (Interactive Fantasy Sports)

## 1. CORE IDENTITY
- **Product**: A modular "Instant Fantasy" betting platform.
- **Hook**: Simplified DFS (Daily Fantasy Sports). Build a 5-player lineup under a Salary Cap.
- **Platform**: Mobile-First Web App.

## 2. CURRENT ARCHITECTURE (The "Golden Copy")
- **Frontend**: React + Vite + Tailwind CSS.
- **State**: Global `BankrollContext` (User money/XP) and `BrowserRouter` (Navigation).
- **Layout**: "Smart App Shell" (Locked `100vh`, internal scrolling).
- **Data**: Static "Real Data" DB (`real_nba_db.js`).

## 3. ROADMAP & PRIORITIES

### PHASE 1: DISTRIBUTION (Current Focus)
- **Goal**: Get the app live and playable on mobile devices.
- **Tasks**:
  1. **Deployment**: Host on Vercel.
  2. **Mobile Polish**: Ensure Card Grid uses 2 columns on mobile, 5 on desktop.
  3. **Touch Targets**: Buttons must be "Thumb-Friendly" (>44px).

### PHASE 2: MODULARITY (Next Up)
- **Goal**: Decouple the engine from NBA-specifics.
- **Refactor**:
  - Create `SportConfig` object (defines Salary Cap, Stat Labels, Scoring Math).
  - Rename `real_nba_db.js` to `data_nba.js` and add `data_nfl.js`.
  - Update `LiveCard` to render dynamic stat labels.

### PHASE 3: RETENTION (Later)
- **Pulse**: Real-time social feed.
- **Collect**: VIP progression systems.

## 4. UI/UX RULES (Immutable)
- **Play Page**:
  - **Budget Math**: Always display `$15.0 (Remaining)`.
  - **Grid**: No global scroll. Cards scroll independently.
- **LiveCard**:
  - **Visuals**: High-Res Headshot, Black Cost Badge.
  - **Stats**: Must handle missing data gracefully.

## 5. DEVELOPMENT PROTOCOL ("Ironclad Vibe Coding")
1.  **Save Point**: Always create a feature branch (`git checkout -b feature-name`).
2.  **Context**: Provide current file code before requesting changes.
3.  **Verify**: Test on Localhost -> Push to Main -> Auto-Deploy to Vercel.
## 📱 Mobile-First & Responsive Standards (Added Dec 2025)
1. **Single Codebase:** We use a single React codebase. Use Tailwind's `md:` prefix for desktop-specific styles.
2. **Card Layout:**
   - **Mobile:** Flexbox wrapper. Cards are `w-[45%]` to create a 2-1-2 diamond formation.
   - **Desktop:** CSS Grid (`grid-cols-5`).
3. **Data Safety:**
   - **Images:** Always use the `LiveCard` manual URL constructor (ID-based) as a fallback.
   - **Colors:** Force Tailwind to keep tier colors (Amber/Purple/Blue) using a hidden safelist div.
   - **Math:** The Hand Builder in `Play.jsx` must NEVER exceed the Salary Cap. Use a "Panic Mode" that finds the cheapest player (/bin/zsh.50), not the first player.

## 📱 Mobile-First & Responsive Standards (Added Dec 2025)
1. **Single Codebase:** We use a single React codebase. Use Tailwind's `md:` prefix for desktop-specific styles.
2. **Card Layout:**
   - **Mobile:** Flexbox wrapper. Cards are `w-[45%]` to create a 2-1-2 diamond formation.
   - **Desktop:** CSS Grid (`grid-cols-5`).
3. **Data Safety:**
   - **Images:** Always use the `LiveCard` manual URL constructor (ID-based) as a fallback.
   - **Colors:** Force Tailwind to keep tier colors (Amber/Purple/Blue) using a hidden safelist div.
   - **Math:** The Hand Builder in `Play.jsx` must NEVER exceed the Salary Cap. Use a "Panic Mode" that finds the cheapest player (/bin/zsh.50), not the first player.

## 📱 Mobile-First & Responsive Standards (Added Dec 2025)
1. **Single Codebase:** We use a single React codebase. Use Tailwind's `md:` prefix for desktop-specific styles.
2. **Card Layout:**
   - **Mobile:** Flexbox wrapper. Cards are `w-[45%]` to create a 2-1-2 diamond formation.
   - **Desktop:** CSS Grid (`grid-cols-5`).
3. **Data Safety:**
   - **Images:** Always use the `LiveCard` manual URL constructor (ID-based) as a fallback.
   - **Colors:** Force Tailwind to keep tier colors (Amber/Purple/Blue) using a hidden safelist div.
   - **Math:** The Hand Builder in `Play.jsx` must NEVER exceed the Salary Cap. Use a "Panic Mode" that finds the cheapest player (/bin/zsh.50), not the first player.
