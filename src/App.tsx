import { useEffect, useState } from "react";
import { FileOutput, Lock, RotateCcw, ScanSearch } from "lucide-react";
import { mockCase } from "./data/mockCase";
import type { MatrixRow } from "./types";
import { ExhibitsSection, PartiesSection, ProcessSection } from "./components/Sidebar";
import { CompletenessStrip, Ledger, type RowState } from "./components/Matrix";
import { ExportModal, RulingsModal } from "./components/Modals";

const STEP_MS = 850;
const data = mockCase;

export default function App() {
  // Opens on the finished result so screenshots work straight away.
  const [state, setState] = useState<RowState>("done");
  const [fileCount, setFileCount] = useState(data.files.length);
  const [step, setStep] = useState(4);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [rulingRow, setRulingRow] = useState<MatrixRow | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  // Real names stay on our server; only the AI sees [PERSON_A]/[PERSON_B].
  const [names, setNames] = useState({ plaintiff: "นายสมชาย ใจดี (ตัวอย่าง)", defendant: "นายสมศักดิ์ มั่นคง (ตัวอย่าง)" });

  useEffect(() => {
    if (state !== "pending") return;
    if (step >= 4) {
      setState("done");
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [state, step]);

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

  const files = data.files.slice(0, fileCount);
  const analyze = () => {
    setStep(0);
    setState("pending");
  };
  const reset = () => {
    setFileCount(0);
    setStep(-1);
    setState("idle");
  };
  // Demo upload: adds the sample exhibits one at a time.
  const addFile = () => setFileCount((n) => Math.min(n + 1, data.files.length));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-court text-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-xl font-semibold">JurisMatrix</span>
            <span className="hidden text-sm text-white/70 sm:inline">แฟ้มพยานหลักฐานสำหรับทนายความ</span>
          </div>
          <span className="flex items-center gap-2 text-sm text-white/85">
            <Lock className="h-4 w-4" />
            <span className="hidden md:inline">ปิดชื่อและเลขบัตรก่อนส่งให้ AI ทุกครั้ง</span>
          </span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] lg:bg-[linear-gradient(to_right,var(--color-folder)_320px,transparent_320px)]">
        <aside className="border-r border-folder-edge bg-folder lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] lg:overflow-auto">
          <PartiesSection
            plaintiff={names.plaintiff}
            defendant={names.defendant}
            onChange={(who, v) => setNames((n) => ({ ...n, [who]: v }))}
          />
          <ExhibitsSection
            files={files}
            activeFile={activeFile}
            onHover={setActiveFile}
            onAdd={addFile}
            canAdd={state === "idle" && fileCount < data.files.length}
          />
          <ProcessSection step={state === "idle" ? -1 : step} />
        </aside>

        <main className="min-w-0 px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-ink-faint">คดีแพ่ง</p>
                <h1 className="font-serif text-[34px] font-semibold leading-tight text-ink">คดีกู้ยืมเงิน</h1>
                <p className="mt-1 text-[15px] text-ink-soft">
                  ระหว่าง {names.plaintiff} โจทก์ กับ {names.defendant} จำเลย
                </p>
              </div>
              {state === "done" ? (
                <button
                  onClick={() => setExportOpen(true)}
                  className="flex items-center gap-2 rounded-md bg-court px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-court-dark"
                >
                  <FileOutput className="h-4 w-4" /> ส่งออกบัญชีระบุพยาน
                </button>
              ) : (
                <button
                  onClick={analyze}
                  disabled={state === "pending" || fileCount === 0}
                  className="flex items-center gap-2 rounded-md bg-court px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-court-dark disabled:cursor-not-allowed disabled:bg-ink-faint/50"
                >
                  <ScanSearch className="h-4 w-4" />
                  {state === "pending" ? "กำลังตรวจพยาน..." : "ตรวจพยานหลักฐาน"}
                </button>
              )}
            </div>

            <div className="mb-6">
              <CompletenessStrip rows={data.matrix} state={state} />
            </div>

            {state === "idle" && fileCount === 0 && (
              <p className="mb-4 rounded-md border border-dashed border-court/40 bg-court-soft/30 px-4 py-3 text-sm text-court-dark">
                เพิ่มพยานเอกสารทางซ้าย แล้วกด “ตรวจพยานหลักฐาน” ระบบจะจับคู่พยานกับองค์ประกอบด้านล่างให้
              </p>
            )}

            <Ledger
              rows={data.matrix}
              files={files}
              state={state}
              activeFile={activeFile}
              onHoverFile={setActiveFile}
              onRulings={setRulingRow}
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-faint">
              <p>ไฟล์ต้นฉบับถูกลบจากเซิร์ฟเวอร์ทันทีหลังตรวจเสร็จ ระบบเก็บไว้เฉพาะผลการจับคู่</p>
              {state === "done" && (
                <button onClick={reset} className="flex items-center gap-1.5 rounded-md px-3 py-2 text-ink-soft hover:bg-white hover:text-ink">
                  <RotateCcw className="h-4 w-4" /> เริ่มคดีใหม่
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {rulingRow && <RulingsModal row={rulingRow} rulings={data.rulings} onClose={() => setRulingRow(null)} />}
      {exportOpen && (
        <ExportModal items={data.witness_list} plaintiff={names.plaintiff} defendant={names.defendant} onClose={() => setExportOpen(false)} />
      )}
    </div>
  );
}
