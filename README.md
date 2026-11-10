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

1. Click **เริ่มคดีใหม่** → **โหลดคดีตัวอย่างและวิเคราะห์** to show the 4 processing steps animating.
2. Point at the red row (E5) — the evidence gap alert.
3. Click **แนะนำแนวฎีกา** on any row for the Mini-RAG popup.
4. Click **ส่งออกบัญชีระบุพยาน (PDF)** for the court-form preview (real names are restored here; the AI only saw `[PERSON_A]`).

Press **Esc** to close any popup.

## Project layout

```
src/
├── data/mockCase.ts       # Mock API response — replace with the real Java backend later
├── types.ts               # Mirrors the API contract (one row = one legal element)
├── App.tsx                # Page layout and demo state
└── components/
    ├── Sidebar.tsx        # Case info, upload, processing steps
    ├── Matrix.tsx         # Stat cards and the Fact-to-Evidence table
    └── Modals.tsx         # Ruling popup and export preview
```

## Rules for when the real backend arrives

- **Frontend is dumb:** render the JSON only. `is_missing` comes from the backend; never compute legal logic here.
- Swap `mockCase` for a `fetch` call to the Spring Boot API that returns the same shape as `CaseResult` in `types.ts`.
- The legal checklist and rulings in `mockCase.ts` are fictional placeholders — the law team must supply the real ones.
