import type { CaseResult } from "../types";

// MOCK DATA — fictional. Replace with the real API response from the Java backend.
// Legal elements are placeholders: the law team should confirm the real checklist.
export const mockCase: CaseResult = {
  case_type: "คดีกู้ยืมเงิน",
  plaintiff: "[PERSON_A]",
  defendant: "[PERSON_B]",
  files: [
    { file_id: "f1", exhibit: "จ.1", name: "สัญญากู้ยืมเงิน.jpg", type: "image" },
    { file_id: "f2", exhibit: "จ.2", name: "สลิปโอนเงิน.png", type: "image" },
    { file_id: "f3", exhibit: "จ.3", name: "แชทไลน์ทวงหนี้.png", type: "image" },
  ],
  matrix: [
    {
      element_id: "E1",
      short: "ตกลงกู้ยืม",
      legal_element: "มีการตกลงกู้ยืมเงินระหว่างคู่กรณี",
      evidence: [
        { file_id: "f1", name: "สัญญากู้ยืมเงิน.jpg", quote: "ข้าพเจ้า [PERSON_B] ได้กู้ยืมเงินจาก [PERSON_A] เป็นจำนวน 150,000 บาท" },
      ],
      is_missing: false,
    },
    {
      element_id: "E2",
      short: "ลงลายมือชื่อ",
      legal_element: "มีหลักฐานเป็นหนังสือลงลายมือชื่อผู้ยืม",
      evidence: [
        { file_id: "f1", name: "สัญญากู้ยืมเงิน.jpg", quote: "ลงชื่อ ......[PERSON_B]...... ผู้กู้" },
      ],
      is_missing: false,
    },
    {
      element_id: "E3",
      short: "ส่งมอบเงิน",
      legal_element: "มีการส่งมอบเงินให้ผู้ยืมแล้ว",
      evidence: [
        { file_id: "f2", name: "สลิปโอนเงิน.png", quote: "โอนเงินสำเร็จ จำนวน 150,000.00 บาท" },
      ],
      is_missing: false,
    },
    {
      element_id: "E4",
      short: "รับสภาพหนี้",
      legal_element: "ผู้ยืมรับว่าเป็นหนี้และยังไม่ชำระ",
      evidence: [
        { file_id: "f3", name: "แชทไลน์ทวงหนี้.png", quote: "ขอผัดไปเดือนหน้านะ ตอนนี้ยังไม่มีให้" },
      ],
      is_missing: false,
    },
    {
      element_id: "E5",
      short: "ทวงถาม",
      legal_element: "มีการทวงถามให้ชำระหนี้แล้ว",
      evidence: [],
      is_missing: true,
      hint: "แนะนำ: หาหนังสือบอกกล่าวทวงถามหรือหลักฐานการทวงถาม",
    },
  ],
  rulings: [
    {
      title: "คำพิพากษาตัวอย่างที่ 1",
      relevance: 92,
      summary:
        "คู่ความโต้แย้งว่าข้อความสนทนาผ่านแอปพลิเคชันแชทใช้เป็นหลักฐานการกู้ยืมได้หรือไม่ ศาลพิจารณาว่าข้อความที่ระบุจำนวนเงินและการยอมรับหนี้ของผู้ยืม ประกอบกับหลักฐานการโอนเงิน รับฟังได้ว่ามีการกู้ยืมจริง",
      excerpt: "...ข้อความที่จำเลยส่งยอมรับว่าค้างชำระและขอผัดการชำระ ถือเป็นการรับสภาพหนี้...",
    },
    {
      title: "คำพิพากษาตัวอย่างที่ 2",
      relevance: 85,
      summary:
        "โจทก์ฟ้องเรียกเงินกู้คืนโดยไม่ได้แสดงหลักฐานการทวงถาม ศาลวินิจฉัยประเด็นการเริ่มนับดอกเบี้ยผิดนัดและความจำเป็นของการบอกกล่าวทวงถามก่อนฟ้อง",
      excerpt: "...เมื่อสัญญาไม่ได้กำหนดเวลาชำระไว้ ผู้ให้กู้ต้องบอกกล่าวให้ชำระภายในเวลาอันสมควรก่อน...",
    },
  ],
  witness_list: [
    { no: 1, item: "สัญญากู้ยืมเงิน (ต้นฉบับ)", issue: "การตกลงกู้ยืมเงินและหลักฐานเป็นหนังสือลงลายมือชื่อผู้ยืม" },
    { no: 2, item: "หลักฐานการโอนเงินผ่านธนาคาร", issue: "การส่งมอบเงินกู้ให้แก่จำเลย" },
    { no: 3, item: "ข้อความสนทนาผ่านแอปพลิเคชันไลน์", issue: "จำเลยรับว่าเป็นหนี้และยังไม่ชำระ" },
  ],
};
