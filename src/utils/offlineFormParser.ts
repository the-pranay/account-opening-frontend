import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { OFFLINE_COLUMN_MAP } from '@/constants/formFields';
import type { OfflineFormData, ParsedOfflineResult } from '@/types/accountTypes';

const EXPECTED_FIELDS = [
  'customerName',
  'customerId',
  'branchCode',
  'accountType',
  'nomineeName',
  'address',
  'phone',
  'email',
];

function mapColumns(rawRow: Record<string, unknown>): OfflineFormData {
  const mapped: OfflineFormData = {};
  for (const [rawKey, value] of Object.entries(rawRow)) {
    const normalizedKey = OFFLINE_COLUMN_MAP[rawKey] || OFFLINE_COLUMN_MAP[rawKey.toLowerCase()];
    if (normalizedKey) {
      mapped[normalizedKey] = String(value ?? '').trim();
    }
  }
  return mapped;
}

function analyzeResult(rows: OfflineFormData[]): ParsedOfflineResult {
  if (rows.length === 0) {
    return { data: [], matchedFields: [], missingFields: EXPECTED_FIELDS, errors: ['No data rows found in file.'] };
  }

  const firstRow = rows[0];
  const matchedFields = EXPECTED_FIELDS.filter((f) => firstRow[f] && firstRow[f]!.length > 0);
  const missingFields = EXPECTED_FIELDS.filter((f) => !firstRow[f] || firstRow[f]!.length === 0);
  const errors: string[] = [];

  if (matchedFields.length === 0) {
    errors.push('No recognizable columns found. Please check the file format.');
  }

  return { data: rows, matchedFields, missingFields, errors };
}

// ─── Excel Parser ────────────────────────────────────────────

export function parseExcelFile(file: File): Promise<ParsedOfflineResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
        const mappedRows = rawRows.map(mapColumns);
        resolve(analyzeResult(mappedRows));
      } catch (err) {
        reject(new Error(`Failed to parse Excel file: ${(err as Error).message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
}

// ─── CSV Parser ──────────────────────────────────────────────

export function parseCsvFile(file: File): Promise<ParsedOfflineResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          const errorMessages = results.errors.map((e) => e.message);
          resolve({
            data: [],
            matchedFields: [],
            missingFields: EXPECTED_FIELDS,
            errors: errorMessages,
          });
          return;
        }
        const mappedRows = results.data.map(mapColumns);
        resolve(analyzeResult(mappedRows));
      },
      error: (err: Error) => reject(new Error(`Failed to parse CSV: ${err.message}`)),
    });
  });
}

// ─── Unified Parser ─────────────────────────────────────────

export async function parseOfflineForm(file: File): Promise<ParsedOfflineResult> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') {
    return parseCsvFile(file);
  }
  if (ext === 'xlsx' || ext === 'xls') {
    return parseExcelFile(file);
  }
  return {
    data: [],
    matchedFields: [],
    missingFields: EXPECTED_FIELDS,
    errors: [`Unsupported file format: .${ext}. Please upload .xlsx, .xls, or .csv files.`],
  };
}
