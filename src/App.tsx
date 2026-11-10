import { useEffect, useState } from "react";
import { FileOutput, Lock, RotateCcw, Trash2 } from "lucide-react";
import { mockCase } from "./data/mockCase";
import type { MatrixRow } from "./types";
import { CaseInfoCard, PipelineCard, UploadCard } from "./components/Sidebar";
import { MatrixTable, StatCards } from "./components/Matrix";
import { ExportModal, RulingsModal } from "./components/Modals";

type Phase = "empty" | "processing" | "done";
const STEP_MS = 900;

export default function App() {
  // Opens on the finished result so screenshots work straight away.
  const [phase, setPhase] = useState<Phase>("done");
  const [step, setStep] = useState(4);
  const [rulingRow, setRulingRow] = useState<MatrixRow | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    if (phase !== "processing") return;
    if (step >= 4) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [phase, step]);

  const analyze = () => {
    setStep(0);
    setPhase("processing");
  };
  const reset = () => {
    setStep(0);
    setPhase("empty");
  };

  const data = mockCase;
  // Real names stay on our server; only the AI sees [PERSON_A]/[PERSON_B].
  // The exported court document gets the real names put back.
  const plaintiffName = "นายสมชาย (ตัวอย่าง)";
  const defendantName = "นายสมศักดิ์ (ตัวอย่าง)";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setRulingRow(null);
        setExportOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen">
      <header className="bg-navy-700 text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-bold text-navy-700">JM</div>
            <div>
              <h1 className="text-xl font-bold leading-tight">JurisMatrix AI</h1>
              <p className="text-sm text-navy-100">กระดานจัดระเบียบพยานหลักฐานอัจฉริยะ</p>
            </div>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-medium text-emerald-200 ring-1 ring-emerald-400/40">
            <Lock className="h-4 w-4" /> ข้อมูลส่วนบุคคลถูกปิดบังก่อนส่งให้ AI
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] grid-cols-[minmax(320px,30%)_1fr] gap-6 px-8 py-6">
        <aside className="space-y-5">
          <CaseInfoCard plaintiff={plaintiffName} defendant={defendantName} />
          <UploadCard files={phase === "empty" ? [] : data.files} onAnalyze={phase === "empty" ? () => {} : analyze} busy={phase === "processing"} />
          <PipelineCard step={phase === "empty" ? -1 : step} />
        </aside>

        <section className="space-y-5">
          {phase === "done" ? (
            <>
              <StatCards rows={data.matrix} />
              <MatrixTable rows={data.matrix} onRulings={setRulingRow} />
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Trash2 className="h-3.5 w-3.5" /> ไฟล์ต้นฉบับจะถูกลบอัตโนมัติหลังประมวลผลเสร็จ
                </p>
                <div className="flex gap-3">
                  <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <RotateCcw className="h-4 w-4" /> เริ่มคดีใหม่
                  </button>
                  <button onClick={() => setExportOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
                    <FileOutput className="h-4 w-4" /> ส่งออกบัญชีระบุพยาน (PDF)
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState processing={phase === "processing"} onLoadSample={() => { setStep(0); setPhase("processing"); }} />
          )}
        </section>
      </main>

      {rulingRow && <RulingsModal row={rulingRow} rulings={data.rulings} onClose={() => setRulingRow(null)} />}
      {exportOpen && (
        <ExportModal items={data.witness_list} plaintiff={plaintiffName} defendant={defendantName} onClose={() => setExportOpen(false)} />
      )}
    </div>
  );
}

function EmptyState({ processing, onLoadSample }: { processing: boolean; onLoadSample: () => void }) {
  return (
    <div className="flex h-full min-h-[480px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white text-center">
      {processing ? (
        <>
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" />
          <p className="text-lg font-semibold text-navy-700">กำลังวิเคราะห์พยานหลักฐาน...</p>
          <p className="text-sm text-slate-500">ระบบกำลังอ่านเอกสาร ปิดบังข้อมูลส่วนบุคคล และจับคู่กับเช็กลิสต์คดี</p>
        </>
      ) : (
        <>
          <p className="text-lg font-semibold text-slate-700">เริ่มคดีใหม่</p>
          <p className="mb-5 text-sm text-slate-500">อัปโหลดพยานหลักฐานทางด้านซ้าย แล้วกด “วิเคราะห์พยานหลักฐาน”</p>
          <button onClick={onLoadSample} className="rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
            โหลดคดีตัวอย่างและวิเคราะห์
          </button>
        </>
      )}
    </div>
  );
}
