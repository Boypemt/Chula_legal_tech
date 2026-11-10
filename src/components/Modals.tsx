import { Download, Scale, X } from "lucide-react";
import type { MatrixRow, Ruling, WitnessItem } from "../types";

function Overlay({ onClose, children, wide }: { onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-6 animate-fade-in" onClick={onClose}>
      <div
        className={`max-h-full w-full overflow-auto rounded-2xl bg-white shadow-2xl ${wide ? "max-w-4xl" : "max-w-2xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function RulingsModal({ row, rulings, onClose }: { row: MatrixRow; rulings: Ruling[]; onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <header className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-700">
            <Scale className="h-5 w-5" /> แนวคำพิพากษาที่เกี่ยวข้อง
          </h3>
          <p className="text-sm text-slate-500">
            {row.element_id} · {row.legal_element}
          </p>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
          <X className="h-5 w-5" />
        </button>
      </header>
      <div className="space-y-4 px-6 py-5">
        {rulings.map((r) => (
          <article key={r.title} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between gap-4">
              <h4 className="font-semibold text-slate-800">{r.title}</h4>
              <div className="flex w-44 items-center gap-2">
                <span className="text-xs text-slate-500">ความเกี่ยวข้อง</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-navy-600" style={{ width: `${r.relevance}%` }} />
                </div>
                <span className="text-xs font-semibold text-navy-700">{r.relevance}%</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{r.summary}</p>
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm italic text-amber-900 ring-1 ring-amber-200">{r.excerpt}</p>
          </article>
        ))}
        <p className="text-xs text-slate-400">ผลการค้นหาเป็นข้อมูลประกอบ ทนายความควรตรวจสอบต้นฉบับคำพิพากษาก่อนใช้งาน</p>
      </div>
    </Overlay>
  );
}

export function ExportModal({
  items,
  plaintiff,
  defendant,
  onClose,
}: {
  items: WitnessItem[];
  plaintiff: string;
  defendant: string;
  onClose: () => void;
}) {
  return (
    <Overlay onClose={onClose} wide>
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <h3 className="font-semibold text-navy-700">ตัวอย่างเอกสารก่อนส่งออก</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800">
            <Download className="h-4 w-4" /> ดาวน์โหลด PDF
          </button>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>
      <div className="bg-slate-200 p-8">
        {/* A4-ish page */}
        <div className="mx-auto aspect-[1/1.414] w-full max-w-[620px] bg-white px-14 py-12 text-[15px] shadow-lg">
          <h1 className="mt-2 text-center text-2xl font-bold">บัญชีระบุพยาน</h1>
          <div className="mt-6 space-y-1 text-sm leading-7">
            <p>
              ความ<span className="font-semibold"> แพ่ง</span>
              <span className="ml-8">ศาล ..............................</span>
            </p>
            <p>
              ระหว่าง <span className="font-semibold">{plaintiff}</span> โจทก์
            </p>
            <p className="pl-12">
              <span className="font-semibold">{defendant}</span> จำเลย
            </p>
            <p className="pt-2">ข้าพเจ้า โจทก์ ขอระบุพยานเพื่อนำสืบในคดีนี้ ดังต่อไปนี้</p>
          </div>
          <table className="mt-4 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-14 border border-slate-700 py-2">ลำดับ</th>
                <th className="border border-slate-700 py-2">รายการพยานหลักฐาน</th>
                <th className="border border-slate-700 py-2">ประเด็นที่ต้องการพิสูจน์</th>
              </tr>
            </thead>
            <tbody>
              {items.map((w) => (
                <tr key={w.no}>
                  <td className="border border-slate-700 py-2 text-center align-top">{w.no}</td>
                  <td className="border border-slate-700 px-3 py-2 align-top">{w.item}</td>
                  <td className="border border-slate-700 px-3 py-2 align-top">{w.issue}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-12 text-right text-sm leading-8">
            <p>ลงชื่อ ......................................... ผู้ระบุพยาน</p>
            <p className="pr-16">( ......................................... )</p>
          </div>
          <p className="mt-10 text-center text-[11px] text-slate-400">สร้างโดย JurisMatrix AI · เอกสารร่าง ทนายความต้องตรวจทานก่อนยื่นต่อศาล</p>
        </div>
      </div>
    </Overlay>
  );
}
