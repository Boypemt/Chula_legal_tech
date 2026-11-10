// Mirrors the API contract the Java backend will return (one row = one legal element).
export interface EvidenceRef {
  file_id: string;
  name: string;
  quote: string;
}

export interface MatrixRow {
  element_id: string;
  legal_element: string;
  evidence: EvidenceRef[];
  is_missing: boolean; // decided by the backend, never by the frontend
  short: string; // short label for the completeness strip
  hint?: string;
}

export interface CaseFile {
  file_id: string;
  exhibit: string; // exhibit mark, e.g. จ.1
  name: string;
  type: "image" | "pdf";
}

export interface Ruling {
  title: string;
  relevance: number;
  summary: string;
  excerpt: string;
}

export interface WitnessItem {
  no: number;
  item: string;
  issue: string;
}

export interface CaseResult {
  case_type: string;
  plaintiff: string;
  defendant: string;
  files: CaseFile[];
  matrix: MatrixRow[];
  rulings: Ruling[];
  witness_list: WitnessItem[];
}
