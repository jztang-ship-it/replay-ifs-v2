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
  - **Cost Badge**: Top Right.
  - **Hold Badge**: Bottom Right (Yellow Pill).
- **Data Footer**:
  - **Icons**: Row of badge animations or "- NO ICONS -".
  - **Date Strip**: "YYYY, MMM DD - OPP" (Uses `getAbbr` helper).
  - **Stats Grid**: TWO rows of 3 stats (Row 1: PTS/REB/AST, Row 2: STL/BLK/TO).
  - **FP Score**: Large font at bottom, colored Green/Red based on projection beat.

### B. Math & Logic Invariants
- **Salary Cap**: $15.00 Hard Cap.
- **Winning Floor**: The "Smart Math" builder must retry until it finds a hand >= **$14.50** (Golden Zone) or fallback to $13.00.
- **Max Player Cost**: $6.00.
- **Min Player Cost**: Avoid players < $1.50 unless absolutely necessary.
- **Database**: Must support `to` (Turnover) stat generation.

## 3. CURRENT KNOWN ISSUES
- None. (Gold Standard Restored & Math Fixed).