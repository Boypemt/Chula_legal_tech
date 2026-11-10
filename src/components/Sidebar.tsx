import { Check, FileImage, FileText, Loader2, UploadCloud, Briefcase, ShieldCheck } from "lucide-react";
import type { CaseFile } from "../types";

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-navy-700">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CaseInfoCard({ plaintiff, defendant }: { plaintiff: string; defendant: string }) {
  return (
    <Card title="ข้อมูลคดี" icon={<Briefcase className="h-4 w-4" />}>
      <label className="mb-1 block text-sm font-medium text-slate-600">ประเภทคดี</label>
      <select className="mb-4 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm" defaultValue="loan">
        <option value="loan">คดีกู้ยืมเงิน</option>
      </select>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">ชื่อโจทก์</label>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue={plaintiff} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">ชื่อจำเลย</label>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue={defendant} />
        </div>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
        ใช้สำหรับปิดบังชื่อในเอกสารก่อนส่งให้ AI
      </p>
    </Card>
  );
}

export function UploadCard({ files, onAnalyze, busy }: { files: CaseFile[]; onAnalyze: () => void; busy: boolean }) {
  return (
    <Card title="อัปโหลดพยานหลักฐาน" icon={<UploadCloud className="h-4 w-4" />}>
      <div className="mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-navy-100 bg-navy-50/60 px-4 py-6 text-center">
        <UploadCloud className="mb-2 h-8 w-8 text-navy-600" />
        <p className="text-sm font-medium text-navy-700">ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</p>
        <p className="text-xs text-slate-500">รองรับ JPG, PNG, PDF</p>
      </div>
      <ul className="space-y-2">
        {files.map((f) => (
          <li key={f.file_id} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm animate-fade-in">
            {f.type === "pdf" ? (
              <FileText className="h-5 w-5 text-rose-500" />
            ) : (
              <FileImage className="h-5 w-5 text-sky-600" />
            )}
            <span className="flex-1 truncate">{f.name}</span>
            <Check className="h-4 w-4 text-emerald-600" />
          </li>
        ))}
        {files.length === 0 && <li className="text-center text-sm text-slate-400">ยังไม่มีไฟล์</li>}
      </ul>
      <button
        onClick={onAnalyze}
        disabled={busy}
        className="mt-4 w-full rounded-lg bg-navy-700 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60"
      >
        {busy ? "กำลังวิเคราะห์..." : "วิเคราะห์พยานหลักฐาน"}
      </button>
    </Card>
  );
}

const STEPS = [
  "อ่านข้อความด้วย OCR บนเซิร์ฟเวอร์ของเรา",
  "ปิดบังข้อมูลส่วนบุคคล (PII Masking)",
  "AI จับคู่หลักฐานกับเช็กลิสต์",
  "ตรวจหาหลักฐานที่ขาด",
];

/** step = number of completed steps (0..4). */
export function PipelineCard({ step }: { step: number }) {
  return (
    <Card title="ขั้นตอนการประมวลผล" icon={<Loader2 className="h-4 w-4" />}>
      <ol>
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="relative flex gap-3 pb-4 last:pb-0">
              {i < STEPS.length - 1 && (
                <span className={`absolute left-[13px] top-7 h-[calc(100%-20px)] w-0.5 ${done ? "bg-emerald-500" : "bg-slate-200"}`} />
              )}
              <span
                className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-navy-700 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : i + 1}
              </span>
              <span className={`pt-1 text-sm ${done ? "text-slate-700" : active ? "font-semibold text-navy-700" : "text-slate-400"}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
