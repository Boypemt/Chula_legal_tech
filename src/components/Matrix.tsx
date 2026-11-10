import { BookOpen, Check } from "lucide-react";
import type { CaseFile, MatrixRow } from "../types";

export type RowState = "idle" | "pending" | "done";

/** Five-segment strip: one segment per legal element, click to jump to it. */
export function CompletenessStrip({ rows, state }: { rows: MatrixRow[]; state: RowState }) {
  const done = state === "done";
  const have = rows.filter((r) => !r.is_missing).length;
  const missing = rows.filter((r) => r.is_missing);

  return (
    <div>
      <p className="mb-3 text-[15px] text-ink-soft">
        {done ? (
          <>
            มีพยานครบ <strong className="font-semibold text-ink">{have} จาก {rows.length}</strong> องค์ประกอบ
            {missing.length > 0 && (
              <>
                {" "}ยังขาดพยานเรื่อง <strong className="font-semibold text-seal">{missing.map((m) => m.short).join(", ")}</strong>
              </>
            )}
          </>
        ) : state === "pending" ? (
          "กำลังตรวจพยานกับองค์ประกอบทั้ง " + rows.length + " ข้อ"
        ) : (
          "องค์ประกอบที่ต้องพิสูจน์ในคดีกู้ยืมเงิน " + rows.length + " ข้อ"
        )}
      </p>
      <ol className="grid grid-cols-5 gap-1.5 max-sm:[&_.truncate]:hidden">
        {rows.map((r) => {
          const tone = !done ? "idle" : r.is_missing ? "missing" : "ok";
          return (
            <li key={r.element_id}>
              <a
                href={`#row-${r.element_id}`}
                className="group block rounded-sm focus-visible:outline-offset-4"
              >
                <span
                  className={`block h-2 rounded-full transition-colors duration-500 ${
                    tone === "ok" ? "bg-court" : tone === "missing" ? "bg-seal" : state === "pending" ? "pending-line bg-court-soft" : "bg-line"
                  }`}
                />
                <span className="mt-1.5 flex items-baseline gap-1.5 text-xs">
                  <span className="text-ink-faint">{r.element_id}</span>
                  <span className={`truncate group-hover:underline ${tone === "missing" ? "font-semibold text-seal" : "text-ink-soft"}`}>{r.short}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ExhibitTag({ file, name }: { file?: CaseFile; name: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-sm border border-court/30 bg-white px-2 py-0.5 text-[13px]">
      <span className="font-serif font-semibold text-court">{file?.exhibit ?? "–"}</span>
      <span className="text-ink-soft">{name.replace(/\.(jpg|png|pdf)$/i, "")}</span>
    </span>
  );
}

export function Ledger({
  rows,
  files,
  state,
  activeFile,
  onHoverFile,
  onRulings,
}: {
  rows: MatrixRow[];
  files: CaseFile[];
  state: RowState;
  activeFile: string | null;
  onHoverFile: (id: string | null) => void;
  onRulings: (row: MatrixRow) => void;
}) {
  const fileById = (id: string) => files.find((f) => f.file_id === id);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="hidden md:grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_9.5rem] gap-6 border-b border-line bg-paper/60 px-6 py-2.5 text-xs text-ink-faint">
        <span>องค์ประกอบที่ต้องพิสูจน์</span>
        <span>พยานที่ AI จับคู่ และข้อความที่ใช้อ้างอิง</span>
        <span>ผลการตรวจ</span>
      </div>
      <ol>
        {rows.map((r, i) => {
          const done = state === "done";
          const missing = done && r.is_missing;
          const related = activeFile !== null && r.evidence.some((e) => e.file_id === activeFile);
          const dimmed = done && activeFile !== null && !related;
          return (
            <li
              id={`row-${r.element_id}`}
              key={r.element_id}
              className={`relative grid scroll-mt-24 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_9.5rem] md:gap-6 border-b border-line px-6 py-5 transition-[background-color,opacity] duration-200 last:border-b-0 ${
                missing ? "bg-seal-soft" : related ? "bg-court-soft/40" : ""
              } ${dimmed ? "opacity-35" : ""}`}
            >
              {missing && <span className="absolute inset-y-0 left-0 w-1 bg-seal" />}

              {/* element */}
              <div>
                <span className="text-xs text-ink-faint">{r.element_id}</span>
                <p className={`font-serif text-[17px] leading-snug ${missing ? "text-seal" : "text-ink"}`}>{r.legal_element}</p>
              </div>

              {/* evidence */}
              <div className="min-w-0">
                {state === "idle" && <p className="pt-4 text-sm text-ink-faint">รอพยานเอกสาร</p>}
                {state === "pending" && (
                  <div className="space-y-2 pt-4">
                    <div className="pending-line h-2.5 w-2/5 rounded-full bg-line" />
                    <div className="pending-line h-2.5 w-4/5 rounded-full bg-line" />
                  </div>
                )}
                {done && (
                  <div className="row-fill space-y-2" style={{ animationDelay: `${i * 70}ms` }}>
                    {r.evidence.length === 0 && (
                      <p className="pt-1 text-sm text-seal">{r.hint ?? "ไม่พบพยานที่พิสูจน์องค์ประกอบนี้"}</p>
                    )}
                    {r.evidence.map((e) => (
                      <div key={e.file_id} onMouseEnter={() => onHoverFile(e.file_id)} onMouseLeave={() => onHoverFile(null)}>
                        <ExhibitTag file={fileById(e.file_id)} name={e.name} />
                        <p className="mt-1.5 text-[15px] leading-relaxed text-ink">
                          <span className="mark">“{e.quote}”</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* result */}
              <div className="flex flex-col items-start gap-3">
                {done &&
                  (missing ? (
                    <span className="stamp stamp-in mt-1 inline-block px-2.5 py-1 text-[15px] font-bold tracking-wide">ยังไม่มีพยาน</span>
                  ) : (
                    <span className="row-fill mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-court" style={{ animationDelay: `${i * 70}ms` }}>
                      <Check className="h-4 w-4" strokeWidth={3} /> มีพยานแล้ว
                    </span>
                  ))}
                {done && (
                  <button
                    onClick={() => onRulings(r)}
                    className="inline-flex items-center gap-1.5 text-[13px] text-ink-soft underline decoration-line underline-offset-4 hover:text-court hover:decoration-court"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> ดูแนวฎีกา
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
