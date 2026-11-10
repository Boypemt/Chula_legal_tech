import { AlertTriangle, CheckCircle2, FileImage, Scale, ListChecks } from "lucide-react";
import type { MatrixRow } from "../types";

export function StatCards({ rows }: { rows: MatrixRow[] }) {
  const missing = rows.filter((r) => r.is_missing).length;
  const stats = [
    { label: "องค์ประกอบทั้งหมด", value: rows.length, cls: "text-navy-700", bg: "bg-white", icon: <ListChecks className="h-5 w-5 text-navy-600" /> },
    { label: "มีหลักฐานแล้ว", value: rows.length - missing, cls: "text-emerald-700", bg: "bg-emerald-50", icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" /> },
    { label: "ขาดหลักฐาน", value: missing, cls: "text-red-700", bg: "bg-red-50", icon: <AlertTriangle className="h-5 w-5 text-red-600" /> },
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className={`flex items-center justify-between rounded-xl border border-slate-200 ${s.bg} px-5 py-4 shadow-sm`}>
          <div>
            <p className="text-sm text-slate-600">{s.label}</p>
            <p className={`text-3xl font-bold ${s.cls}`}>{s.value}</p>
          </div>
          {s.icon}
        </div>
      ))}
    </div>
  );
}

export function MatrixTable({ rows, onRulings }: { rows: MatrixRow[]; onRulings: (row: MatrixRow) => void }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-navy-700">ตารางจับคู่ข้อเท็จจริงกับพยานหลักฐาน</h2>
        <p className="text-xs text-slate-500">Fact-to-Evidence Matrix · AI เสนอการจับคู่ ทนายความเป็นผู้ตรวจทาน</p>
      </header>
      <table className="w-full table-fixed text-sm">
        <colgroup>
          <col className="w-[27%]" />
          <col className="w-[19%]" />
          <col className="w-[34%]" />
          <col className="w-[20%]" />
        </colgroup>
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3">องค์ประกอบข้อกฎหมาย</th>
            <th className="px-3 py-3">พยานหลักฐานที่พบ</th>
            <th className="px-3 py-3">ข้อความอ้างอิงจากหลักฐาน</th>
            <th className="px-3 py-3">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.element_id}
              style={{ animationDelay: `${i * 80}ms` }}
              className={`animate-fade-in border-t border-slate-100 align-top ${
                r.is_missing ? "border-l-4 border-l-red-500 bg-red-50" : "border-l-4 border-l-transparent"
              }`}
            >
              <td className="px-5 py-4">
                <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">{r.element_id}</span>
                <span className={`font-medium ${r.is_missing ? "text-red-800" : "text-slate-800"}`}>{r.legal_element}</span>
                {r.hint && <p className="mt-2 text-xs font-medium text-red-600">💡 {r.hint}</p>}
              </td>
              <td className="px-3 py-4">
                {r.evidence.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {r.evidence.map((e) => (
                      <span key={e.file_id} className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-800 ring-1 ring-sky-200">
                        <FileImage className="h-3.5 w-3.5" />
                        {e.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs italic text-red-500">— ไม่พบหลักฐาน —</span>
                )}
              </td>
              <td className="px-3 py-4">
                {r.evidence.map((e) => (
                  <p key={e.file_id} className="border-l-2 border-slate-300 pl-2 text-[13px] italic leading-relaxed text-slate-600">
                    “{e.quote}”
                  </p>
                ))}
              </td>
              <td className="px-3 py-4">
                {r.is_missing ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                    <AlertTriangle className="h-3.5 w-3.5" /> ขาดหลักฐาน
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" /> ครบ
                  </span>
                )}
                <button
                  onClick={() => onRulings(r)}
                  className="mt-2 flex items-center gap-1 text-xs font-medium text-navy-600 hover:underline"
                >
                  <Scale className="h-3.5 w-3.5" /> แนะนำแนวฎีกา
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
