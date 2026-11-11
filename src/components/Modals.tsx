import { useRef, useState } from "react";
import { Check, Download, Loader2, X } from "lucide-react";
import type { MatrixRow, Ruling, WitnessItem } from "../types";

/** Side drawer: keeps the ledger visible while reading rulings. */
export function RulingsModal({ row, rulings, onClose }: { row: MatrixRow; rulings: Ruling[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="แนวคำพิพากษาที่เกี่ยวข้อง">
      <div className="absolute inset-0 bg-ink/20" onClick={onClose} />
      <aside className="drawer-in absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col border-l border-line bg-paper shadow-[-12px_0_32px_rgba(23,32,42,.10)]">
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="text-xs text-ink-faint">แนวฎีกาสำหรับ {row.element_id}</p>
            <h3 className="mt-1 font-serif text-xl leading-snug text-ink">{row.legal_element}</h3>
          </div>
          <button onClick={onClose} aria-label="ปิด" className="rounded-md p-1.5 text-ink-faint hover:bg-white hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 space-y-4 overflow-auto px-6 py-5">
          {rulings.map((r) => (
            <article key={r.title} className="rounded-lg border border-line bg-white p-5">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h4 className="font-serif text-[17px] font-semibold text-ink">{r.title}</h4>
                <span className="shrink-0 text-xs text-court">ใกล้เคียง {r.relevance}%</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{r.summary}</p>
              <p className="mt-3 border-l-2 border-court pl-3 text-[15px] leading-relaxed text-ink">
                <span className="mark">{r.excerpt}</span>
              </p>
            </article>
          ))}
        </div>
        <p className="border-t border-line px-6 py-4 text-xs leading-relaxed text-ink-faint">
          ผลการค้นหาจากคลังฎีกาของระบบเป็นข้อมูลประกอบ ทนายความควรตรวจต้นฉบับคำพิพากษาก่อนอ้างอิง
        </p>
      </aside>
    </div>
  );
}

const PAGE_W = 640;
const PAGE_H = Math.round(PAGE_W * 1.414);

/** The court form itself, used for both the on-screen preview and the PDF. */
function WitnessPage({ items, plaintiff, defendant }: { items: WitnessItem[]; plaintiff: string; defendant: string }) {
  return (
    <>
      <h1 className="text-center text-[26px] font-bold">บัญชีระบุพยาน</h1>
      <div className="mt-8">
        <p>
          คดีแพ่ง <span className="ml-24">ศาล ..........................................</span>
        </p>
        <p className="mt-2">
          ระหว่าง <span className="font-semibold">{plaintiff}</span> <span className="ml-6">โจทก์</span>
        </p>
        <p className="pl-[3.6rem]">
          <span className="font-semibold">{defendant}</span> <span className="ml-6">จำเลย</span>
        </p>
        <p className="mt-4 indent-12">ข้าพเจ้า โจทก์ ขอระบุพยานเพื่อนำสืบในคดีนี้ ดังต่อไปนี้</p>
      </div>
      <table className="mt-5 w-full border-collapse text-[15px] leading-7">
        <thead>
          <tr>
            <th className="w-16 border border-black py-1.5 font-semibold">ลำดับ</th>
            <th className="border border-black py-1.5 font-semibold">รายการพยานหลักฐาน</th>
            <th className="border border-black py-1.5 font-semibold">ประเด็นที่ต้องการพิสูจน์</th>
          </tr>
        </thead>
        <tbody>
          {items.map((w) => (
            <tr key={w.no}>
              <td className="border border-black py-1.5 text-center align-top">{w.no}</td>
              <td className="border border-black px-3 py-1.5 align-top">{w.item}</td>
              <td className="border border-black px-3 py-1.5 align-top">{w.issue}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-14 text-right">
        <p>ลงชื่อ ............................................ ผู้ระบุพยาน</p>
        <p className="pr-20">( ............................................ )</p>
      </div>
      <p className="absolute inset-x-0 bottom-6 text-center text-[11px] leading-5 text-neutral-500">
        ร่างจาก JurisMatrix AI · ทนายความต้องตรวจทานก่อนยื่นต่อศาล · ข้อมูลตัวอย่างจำลอง
      </p>
    </>
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
  // Hidden copy laid out at a fixed A4 width, so the PDF is identical on phone and desktop.
  const printRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");

  const downloadPdf = async () => {
    if (!printRef.current || status === "working") return;
    setStatus("working");
    try {
      const [{ toJpeg }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      await document.fonts.ready;
      const img = await toJpeg(printRef.current, {
        width: PAGE_W,
        height: PAGE_H,
        pixelRatio: 2.5,
        quality: 0.92,
        backgroundColor: "#ffffff",
        style: { position: "relative", left: "0", top: "0" },
      });
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
      pdf.addImage(img, "JPEG", 0, 0, 210, 297);
      pdf.setProperties({ title: "บัญชีระบุพยาน (ร่าง)", creator: "JurisMatrix AI" });
      pdf.save("JurisMatrix-witness-list.pdf");
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#3a4148]" role="dialog" aria-modal="true" aria-label="ตัวอย่างบัญชีระบุพยาน">
      <header className="flex items-center justify-between gap-3 bg-ink px-4 py-3 text-white sm:px-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold">บัญชีระบุพยาน (ร่าง)</p>
          <p className="text-xs text-white/60">
            {status === "error" ? "สร้าง PDF ไม่สำเร็จ ลองกดอีกครั้ง" : "ใส่ชื่อจริงของคู่ความกลับเข้าไปบนเซิร์ฟเวอร์ของเราแล้ว"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={downloadPdf}
            disabled={status === "working"}
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-folder disabled:opacity-70"
          >
            {status === "working" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> กำลังสร้าง PDF...
              </>
            ) : status === "done" ? (
              <>
                <Check className="h-4 w-4 text-court" /> ดาวน์โหลดแล้ว
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> ดาวน์โหลด PDF
              </>
            )}
          </button>
          <button onClick={onClose} aria-label="ปิด" className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-auto px-4 py-8 sm:px-6 sm:py-10">
        <div className="relative mx-auto aspect-[1/1.414] w-full max-w-[640px] bg-white px-6 py-10 font-doc text-[16px] leading-8 text-black shadow-2xl sm:px-16 sm:py-14">
          <WitnessPage items={items} plaintiff={plaintiff} defendant={defendant} />
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none fixed left-[-10000px] top-0">
        <div
          ref={printRef}
          style={{ width: PAGE_W, height: PAGE_H, padding: "56px 64px" }}
          className="relative bg-white font-doc text-[16px] leading-8 text-black"
        >
          <WitnessPage items={items} plaintiff={plaintiff} defendant={defendant} />
        </div>
      </div>
    </div>
  );
}
