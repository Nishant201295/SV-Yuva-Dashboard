import type { SheetMetadata, SpreadsheetDetails, ParsedMISRecord } from '../types/mis';
import { SAMPLE_SVYSY_MIS_DATA } from './mockData';

// Public or exported Google Sheets CSV Fetcher (No authentication required)
export async function fetchPublicGoogleSheetCSV(spreadsheetIdOrUrl: string, sheetGid: string = '0'): Promise<string> {
  // Extract spreadsheet ID if full URL provided
  const match = spreadsheetIdOrUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const id = match ? match[1] : spreadsheetIdOrUrl.trim();

  const exportUrl = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${sheetGid}`;
  const response = await fetch(exportUrl);
  if (!response.ok) {
    throw new Error(`Unable to fetch public sheet: HTTP ${response.status}. Make sure the sheet link sharing is set to 'Anyone with the link can view' or use CSV upload.`);
  }
  return await response.text();
}

// Robust CSV Line parser supporting commas inside quotes
export function parseCSVToRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Normalize string keys for header mapping
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Parse Raw 2D Spreadsheet rows into typed ParsedMISRecord array
export function parseSheetRowsToMIS(rows: any[][]): { records: ParsedMISRecord[]; headers: string[] } {
  if (!rows || rows.length < 2) {
    return { records: SAMPLE_SVYSY_MIS_DATA, headers: [] };
  }

  // Find header row (the first row with at least 3 non-empty string headers)
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const row = rows[i];
    const nonEmpties = row.filter((cell) => cell !== null && cell !== undefined && String(cell).trim().length > 0);
    if (nonEmpties.length >= 3) {
      headerRowIndex = i;
      break;
    }
  }

  const rawHeaders = rows[headerRowIndex].map((h) => String(h || '').trim());
  const headerMap: Record<string, number> = {};
  rawHeaders.forEach((h, idx) => {
    headerMap[normalizeKey(h)] = idx;
  });

  const findCol = (...aliases: string[]): number => {
    for (const a of aliases) {
      const norm = normalizeKey(a);
      if (headerMap[norm] !== undefined) return headerMap[norm];
      for (const [key, idx] of Object.entries(headerMap)) {
        if (key.includes(norm) || norm.includes(key)) {
          return idx;
        }
      }
    }
    return -1;
  };

  const colDistrict = findCol('district', 'zilla', 'location', 'region', 'area');
  const colBlock = findCol('block', 'taluk', 'subdivision', 'taluka', 'mandal', 'division');
  const colUnit = findCol('unit', 'unitname', 'shgname', 'shg', 'group', 'entity', 'name', 'enterprise');
  const colSector = findCol('sector', 'activity', 'category', 'trade', 'industry', 'domain');
  
  const colTarget = findCol('target', 'planned', 'targetcount', 'physicaltarget', 'targetunits');
  const colAchieved = findCol('achieved', 'achievement', 'actual', 'physicalachieved', 'completedcount');
  
  const colBudgetAlloc = findCol('budget', 'budgetallocated', 'allocated', 'financialtarget', 'sanctioned', 'allocation', 'targetamount');
  const colExpenditure = findCol('expenditure', 'utilized', 'spent', 'financialachieved', 'disbursed', 'expenses', 'actualexpenditure');
  
  const colBeneficiaries = findCol('beneficiaries', 'beneficiary', 'totalbeneficiaries', 'members', 'youthcount', 'youths');
  const colWomen = findCol('women', 'female', 'womenbeneficiaries', 'shgmembers', 'femalemembers');
  const colScSt = findCol('scst', 'sc', 'st', 'marginalized', 'scstbeneficiaries');
  
  const colStatus = findCol('status', 'progress', 'stage', 'remarksstatus');
  const colRemarks = findCol('remarks', 'notes', 'comments', 'issues', 'details');
  const colMonth = findCol('month', 'period', 'quarter', 'date', 'timeline');

  const records: ParsedMISRecord[] = [];

  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;
    
    const hasData = row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
    if (!hasData) continue;

    const getVal = (colIdx: number): any => (colIdx >= 0 && colIdx < row.length ? row[colIdx] : undefined);
    const getNum = (colIdx: number, defaultVal = 0): number => {
      const v = getVal(colIdx);
      if (v === undefined || v === null || v === '') return defaultVal;
      const cleaned = String(v).replace(/[^0-9.-]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? defaultVal : num;
    };
    const getStr = (colIdx: number, defaultVal = ''): string => {
      const v = getVal(colIdx);
      return v !== undefined && v !== null ? String(v).trim() : defaultVal;
    };

    const targetCount = getNum(colTarget, 100);
    const achievedCount = getNum(colAchieved, 80);
    const achievementRate = targetCount > 0 ? Number(((achievedCount / targetCount) * 100).toFixed(1)) : 0;

    const budgetAllocated = getNum(colBudgetAlloc, 5000000);
    const expenditure = getNum(colExpenditure, 4000000);
    const budgetUtilization = budgetAllocated > 0 ? Number(((expenditure / budgetAllocated) * 100).toFixed(1)) : 0;

    const beneficiariesCount = getNum(colBeneficiaries, achievedCount > 0 ? achievedCount * 3 : 150);
    const womenBeneficiaries = getNum(colWomen, Math.round(beneficiariesCount * 0.65));
    const scStBeneficiaries = getNum(colScSt, Math.round(beneficiariesCount * 0.25));

    let rawStatus = getStr(colStatus, '');
    let status: 'Completed' | 'On Track' | 'Delayed' | 'Critical' = 'On Track';

    const lowerStatus = rawStatus.toLowerCase();
    if (lowerStatus.includes('complete') || lowerStatus.includes('done') || achievementRate >= 95) {
      status = 'Completed';
    } else if (lowerStatus.includes('critic') || lowerStatus.includes('stuck') || achievementRate < 55) {
      status = 'Critical';
    } else if (lowerStatus.includes('delay') || lowerStatus.includes('lag') || (achievementRate >= 55 && achievementRate < 75)) {
      status = 'Delayed';
    } else {
      status = 'On Track';
    }

    const rawObject: Record<string, any> = {};
    rawHeaders.forEach((h, idx) => {
      rawObject[h || `Col_${idx + 1}`] = row[idx];
    });

    records.push({
      id: `sheet-rec-${r}`,
      district: getStr(colDistrict, `District ${r}`),
      block: getStr(colBlock, `Taluk / Block ${r}`),
      unitName: getStr(colUnit, `Youth Unit ${r}`),
      sector: getStr(colSector, 'General Enterprise'),
      targetCount,
      achievedCount,
      achievementRate,
      budgetAllocated,
      expenditure,
      budgetUtilization,
      beneficiariesCount,
      womenBeneficiaries,
      scStBeneficiaries,
      status,
      month: getStr(colMonth, '2026-27'),
      remarks: getStr(colRemarks, ''),
      raw: rawObject,
    });
  }

  if (records.length === 0) {
    return { records: SAMPLE_SVYSY_MIS_DATA, headers: rawHeaders };
  }

  return { records, headers: rawHeaders };
}
