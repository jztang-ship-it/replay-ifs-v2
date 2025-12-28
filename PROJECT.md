# PROJECT: NBA REPLAY v2

## 1. CORE ARCHITECTURE
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **State**: React Context (`BankrollContext`)
- **Gatekeeper**: `.cursorrules` forces adherence to this file.

## 2. GOLD STANDARD UI (DO NOT CHANGE)

### A. The LiveCard Component
- **Visual Structure**:
  - **Flip Animation**: CSS 3D Transform (`rotateY`). Back has "REPLAY" watermark.
  - **Image**: High-Res Headshot (`1040x760`), scaled 125%, object-top.
  - **Name Overlay**: Bottom of image, gradient background, uppercase, `line-clamp-1`.
  - **Cost Badge**: Top Right. **Black/Dark** background.
  - **Hold Badge**: Bottom Right (Yellow Pill).
- **Data Footer**:
  - **Date Strip**: "YYYY, MMM DD - OPP".
  - **Stats Grid**: TWO rows of 3 stats (PTS/REB/AST, STL/BLK/TO).
  - **FP Score**: Large font, colored Green/Red based on projection beat.
- **Data Integrity (CRITICAL)**:
  - **NEVER** calculate or guess stats.
  - If stats are missing, display "N/A" or "-". **DO NOT** reverse-engineer them.
  - All displayed stats must come directly from the database source.

### B. The Play Page UI
- **Header**: Must use `Beta-logo.png`.
- **Budget**: Main number fixed at $15.0. Green indicator shows remaining based on HELD cards.
- **Layout**: Center tabs ("PLAY", "PULSE", "COLLECT"). Fixed footer with no scroll/cutoff issues.

## 3. MATH & LOGIC INVARIANTS
- **Salary Cap**: $15.00 Hard Cap.
- **Winning Floor**: The "Smart Math" builder must retry until it finds a hand >= **$14.50**.
- **Database**: Must include `avg_stats` object with real PTS, REB, AST, STL, BLK, TO values.

## 4. CURRENT KNOWN ISSUES
- None.