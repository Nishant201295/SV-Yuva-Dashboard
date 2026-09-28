export interface SheetMetadata {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface SpreadsheetDetails {
  spreadsheetId: string;
  title: string;
  sheets: {
    sheetId: number;
    title: string;
    index: number;
    rowCount?: number;
    columnCount?: number;
  }[];
}

export interface SheetValueRange {
  range: string;
  majorDimension: string;
  values: any[][];
}

export interface ParsedMISRecord {
  id: string;
  district?: string;
  block?: string;
  unitName?: string;
  sector?: string;
  targetCount: number;
  achievedCount: number;
  achievementRate: number;
  budgetAllocated: number;
  expenditure: number;
  budgetUtilization: number;
  beneficiariesCount: number;
  womenBeneficiaries: number;
  scStBeneficiaries: number;
  status: 'Completed' | 'On Track' | 'Delayed' | 'Critical';
  month?: string;
  remarks?: string;
  raw: Record<string, any>;
}

export interface MISSummaryMetrics {
  totalTarget: number;
  totalAchieved: number;
  avgAchievementRate: number;
  totalBudgetAllocated: number;
  totalExpenditure: number;
  avgBudgetUtilization: number;
  totalBeneficiaries: number;
  totalUnitsOrBlocks: number;
  completedUnits: number;
  onTrackUnits: number;
  delayedUnits: number;
  criticalUnits: number;
}
