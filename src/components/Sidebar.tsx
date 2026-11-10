import { Check, FilePlus2, FileImage, FileText } from "lucide-react";
import type { CaseFile } from "../types";

function RailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-folder-edge px-6 py-5 last:border-b-0">
      <h2 className="mb-3 text-sm font-semibold text-court-dark">{title}</h2>
      {children}
    </section>
  );
}

export function PartiesSection({
  plaintiff,
  defendant,
  onChange,
}: {
  plaintiff: string;
  defendant: string;
  onChange: (who: "plaintiff" | "defendant", v: string) => void;
}) {
  const field = "w-full rounded-md border border-folder-edge bg-white/80 px-3 py-2 text-[15px] text-ink focus:border-court focus:bg-white focus:outline-none";
  return (
    <RailSection title="คู่ความ">
      <label className="mb-3 block">
        <span className="mb-1 block text-xs text-ink-soft">โจทก์</span>
        <input className={field} value={plaintiff} onChange={(e) => onChange("plaintiff", e.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-ink-soft">จำเลย</span>
        <input className={field} value={defendant} onChange={(e) => onChange("defendant", e.target.value)} />
      </label>
      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        ชื่อจริงอยู่บนเซิร์ฟเวอร์ของเราเท่านั้น AI จะเห็นเป็น <code className="rounded bg-white/70 px-1 text-[11px]">[PERSON_A]</code> และ{" "}
        <code className="rounded bg-white/70 px-1 text-[11px]">[PERSON_B]</code>
      </p>
    </RailSection>
  );
}

export function ExhibitsSection({
  files,
  activeFile,
  onHover,
  onAdd,
  canAdd,
}: {
  files: CaseFile[];
  activeFile: string | null;
  onHover: (id: string | null) => void;
  onAdd: () => void;
  canAdd: boolean;
}) {
  return (
    <RailSection title="พยานเอกสาร">
      <ul className="space-y-1.5">
        {files.map((f) => {
          const active = activeFile === f.file_id;
          return (
            <li
              key={f.file_id}
              tabIndex={0}
              onMouseEnter={() => onHover(f.file_id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(f.file_id)}
              onBlur={() => onHover(null)}
              className={`row-fill flex cursor-default items-center gap-3 rounded-md border px-3 py-2.5 transition-colors ${
                active ? "border-court bg-white" : "border-transparent bg-white/55 hover:bg-white"
              }`}
            >
              <span className="w-9 shrink-0 font-serif text-[17px] font-semibold text-court">{f.exhibit}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-ink">{f.name}</span>
                <span className="flex items-center gap-1 text-[11px] text-ink-faint">
                  {f.type === "pdf" ? <FileText className="h-3 w-3" /> : <FileImage className="h-3 w-3" />}
                  {f.type === "pdf" ? "PDF" : "รูปภาพ"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      {canAdd && (
        <button
          onClick={onAdd}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-court/40 px-3 py-4 text-sm text-court transition-colors hover:border-court hover:bg-white/60"
        >
          <FilePlus2 className="h-4 w-4" />
          {files.length ? "เพิ่มพยานเอกสาร" : "เพิ่มพยานเอกสาร (รูปภาพหรือ PDF)"}
        </button>
      )}
      {files.length > 0 && (
        <p className="mt-2 text-[11px] text-ink-faint">ชี้ที่พยานเพื่อดูว่าใช้พิสูจน์องค์ประกอบใดบ้าง</p>
      )}
    </RailSection>
  );
}

const STEPS = [
  "อ่านข้อความด้วย OCR บนเซิร์ฟเวอร์ของเรา",
  "ปิดชื่อและเลขบัตรก่อนส่งให้ AI",
  "AI จับคู่พยานกับองค์ประกอบ",
  "ตรวจหาองค์ประกอบที่ยังไม่มีพยาน",
];

/** step = number of completed steps; -1 = not started. */
export function ProcessSection({ step }: { step: number }) {
  return (
    <RailSection title="ขั้นตอนการตรวจ">
      <ol className="space-y-2.5">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex items-start gap-2.5 text-[13px]">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  done ? "bg-court text-white" : active ? "border-2 border-court text-court" : "border border-folder-edge text-ink-faint"
                }`}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              <span className={done ? "text-ink" : active ? "font-semibold text-court-dark" : "text-ink-faint"}>{label}</span>
            </li>
          );
        })}
      </ol>
    </RailSection>
  );
}
