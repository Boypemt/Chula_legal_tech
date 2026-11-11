# JurisMatrix AI — UI prototype

Frontend prototype of the JurisMatrix AI evidence dashboard (Chula LegalTech Year 8).
React + TypeScript + Tailwind CSS, built with Vite. **Mock data only — no backend yet.**

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → import `Chula_legal_tech`**.
3. Vercel detects Vite automatically (build `npm run build`, output `dist`). Click **Deploy**.

## Demo flow (3 minutes)

The page opens on a finished analysis, ready for screenshots.

1. Click **เริ่มคดีใหม่**, then **เพิ่มพยานเอกสาร** three times to add exhibits จ.1–จ.3.
2. Click **ตรวจพยานหลักฐาน**: the 4 steps run and the ledger fills in; a red stamp lands on the missing element (E5).
3. Hover an exhibit (e.g. จ.1) to highlight every element it proves.
4. Click **ดูแนวฎีกา** on any row to open the ruling drawer.
5. Click **ส่งออกบัญชีระบุพยาน** for the court-form preview (real names are restored here; the AI only saw `[PERSON_A]`), then **ดาวน์โหลด PDF** to save a real A4 PDF. Names typed into the คู่ความ fields appear in the PDF.

Press **Esc** to close any panel. Fonts are bundled (no Google Fonts call), so the page looks the same offline.

## Project layout

```
src/
├── data/mockCase.ts       # Mock API response — replace with the real Java backend later
├── types.ts               # Mirrors the API contract (one row = one legal element)
├── App.tsx                # Page layout and demo state
├── index.css              # Design tokens (colours, fonts) and the stamp/highlighter styles
└── components/
    ├── Sidebar.tsx        # Folder rail: parties, exhibits (จ.1…), processing steps
    ├── Matrix.tsx         # Completeness strip and the evidence ledger
    └── Modals.tsx         # Ruling drawer and court-form export preview
```

## Rules for when the real backend arrives

- **Frontend is dumb:** render the JSON only. `is_missing` comes from the backend; never compute legal logic here.
- Swap `mockCase` for a `fetch` call to the Spring Boot API that returns the same shape as `CaseResult` in `types.ts`.
- The legal checklist and rulings in `mockCase.ts` are fictional placeholders — the law team must supply the real ones.
