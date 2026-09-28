import type { ParsedMISRecord, MISSummaryMetrics } from '../types/mis';

export const DEFAULT_SHEET_NAME_TARGET = "SVYSY_2026-27_MIS";

// Comprehensive mock data tailored to SVYSY (Swami Vivekananda Yuva Shakti Yojana / Scheme) 2026-27 MIS
export const SAMPLE_SVYSY_MIS_DATA: ParsedMISRecord[] = [
  {
    id: "rec-1",
    district: "Bengaluru Urban",
    block: "North Zone - Hub 1",
    unitName: "TechCraft Solutions SHG",
    sector: "Digital & IT Services",
    targetCount: 150,
    achievedCount: 142,
    achievementRate: 94.67,
    budgetAllocated: 7500000,
    expenditure: 7120000,
    budgetUtilization: 94.93,
    beneficiariesCount: 420,
    womenBeneficiaries: 290,
    scStBeneficiaries: 110,
    status: "Completed",
    month: "August 2026",
    remarks: "Micro-enterprise units operational; 95% loan disbursed",
    raw: {}
  },
  {
    id: "rec-2",
    district: "Mysuru",
    block: "Hunsur Sub-Division",
    unitName: "Heritage Agro-Food Clusters",
    sector: "Agri & Food Processing",
    targetCount: 180,
    achievedCount: 165,
    achievementRate: 91.67,
    budgetAllocated: 9000000,
    expenditure: 8100000,
    budgetUtilization: 90.0,
    beneficiariesCount: 540,
    womenBeneficiaries: 380,
    scStBeneficiaries: 190,
    status: "On Track",
    month: "August 2026",
    remarks: "Cold storage infrastructure supported under DPR",
    raw: {}
  },
  {
    id: "rec-3",
    district: "Dharwad",
    block: "Hubballi Rural",
    unitName: "Yuva Textiles Cooperative",
    sector: "Handloom & Textiles",
    targetCount: 120,
    achievedCount: 104,
    achievementRate: 86.67,
    budgetAllocated: 6000000,
    expenditure: 5100000,
    budgetUtilization: 85.0,
    beneficiariesCount: 360,
    womenBeneficiaries: 295,
    scStBeneficiaries: 125,
    status: "On Track",
    month: "July 2026",
    remarks: "Modern jacquard units commissioned successfully",
    raw: {}
  },
  {
    id: "rec-4",
    district: "Belagavi",
    block: "Chikkodi Cluster",
    unitName: "Sugarbelt Allied Tooling",
    sector: "Light Engineering",
    targetCount: 140,
    achievedCount: 102,
    achievementRate: 72.86,
    budgetAllocated: 8400000,
    expenditure: 5800000,
    budgetUtilization: 69.05,
    beneficiariesCount: 380,
    womenBeneficiaries: 140,
    scStBeneficiaries: 95,
    status: "Delayed",
    month: "August 2026",
    remarks: "Bank credit linkage sanction pending for Phase-2 batches",
    raw: {}
  },
  {
    id: "rec-5",
    district: "Kalaburagi",
    block: "Aland Rural Belt",
    unitName: "Kalyana Bio-Pulses Unit",
    sector: "Agri & Food Processing",
    targetCount: 160,
    achievedCount: 148,
    achievementRate: 92.5,
    budgetAllocated: 8000000,
    expenditure: 7400000,
    budgetUtilization: 92.5,
    beneficiariesCount: 490,
    womenBeneficiaries: 340,
    scStBeneficiaries: 230,
    status: "On Track",
    month: "August 2026",
    remarks: "FPO procurement agreement signed",
    raw: {}
  },
  {
    id: "rec-6",
    district: "Shivamogga",
    block: "Sagar Eco-Belt",
    unitName: "Sahyadri Spices & Extracts",
    sector: "Herbal & Spices",
    targetCount: 110,
    achievedCount: 106,
    achievementRate: 96.36,
    budgetAllocated: 5500000,
    expenditure: 5350000,
    budgetUtilization: 97.27,
    beneficiariesCount: 310,
    womenBeneficiaries: 235,
    scStBeneficiaries: 85,
    status: "Completed",
    month: "August 2026",
    remarks: "Export packing accreditation initiated",
    raw: {}
  },
  {
    id: "rec-7",
    district: "Ballari",
    block: "Sandur Mineral Zone",
    unitName: "Tungabhadra Metal Fabrication",
    sector: "Light Engineering",
    targetCount: 95,
    achievedCount: 52,
    achievementRate: 54.74,
    budgetAllocated: 5700000,
    expenditure: 2950000,
    budgetUtilization: 51.75,
    beneficiariesCount: 190,
    womenBeneficiaries: 45,
    scStBeneficiaries: 70,
    status: "Critical",
    month: "August 2026",
    remarks: "Site clearance and 3-phase electricity delay at industrial shed",
    raw: {}
  },
  {
    id: "rec-8",
    district: "Dakshina Kannada",
    block: "Mangaluru Coastal Sub-Hub",
    unitName: "Coastal Fisheries Processing",
    sector: "Marine & Aquaculture",
    targetCount: 130,
    achievedCount: 122,
    achievementRate: 93.85,
    budgetAllocated: 7800000,
    expenditure: 7450000,
    budgetUtilization: 95.51,
    beneficiariesCount: 395,
    womenBeneficiaries: 260,
    scStBeneficiaries: 65,
    status: "On Track",
    month: "August 2026",
    remarks: "Value added fish oil and cold chain vans commissioned",
    raw: {}
  },
  {
    id: "rec-9",
    district: "Tumakuru",
    block: "Tiptur Coconut Park",
    unitName: "Kalpataru Bio-Products",
    sector: "Renewable & Bio-Energy",
    targetCount: 105,
    achievedCount: 98,
    achievementRate: 93.33,
    budgetAllocated: 6300000,
    expenditure: 5900000,
    budgetUtilization: 93.65,
    beneficiariesCount: 320,
    womenBeneficiaries: 210,
    scStBeneficiaries: 110,
    status: "On Track",
    month: "August 2026",
    remarks: "Activated carbon coir briquetting unit fully functional",
    raw: {}
  },
  {
    id: "rec-10",
    district: "Vijayapura",
    block: "Indi Dryland Zone",
    unitName: "Bijapur Horticulture Yuva Kendra",
    sector: "Agri & Food Processing",
    targetCount: 115,
    achievedCount: 78,
    achievementRate: 67.83,
    budgetAllocated: 6900000,
    expenditure: 4400000,
    budgetUtilization: 63.77,
    beneficiariesCount: 260,
    womenBeneficiaries: 175,
    scStBeneficiaries: 120,
    status: "Delayed",
    month: "July 2026",
    remarks: "Solar pump subsidy synchronization under review by district committee",
    raw: {}
  },
  {
    id: "rec-11",
    district: "Udupi",
    block: "Kundapura Belt",
    unitName: "Malpe Eco-Tourism & Handicrafts",
    sector: "Hospitality & Crafts",
    targetCount: 85,
    achievedCount: 84,
    achievementRate: 98.82,
    budgetAllocated: 4250000,
    expenditure: 4200000,
    budgetUtilization: 98.82,
    beneficiariesCount: 245,
    womenBeneficiaries: 195,
    scStBeneficiaries: 40,
    status: "Completed",
    month: "August 2026",
    remarks: "Homestay youth cluster and digital booking portal launched",
    raw: {}
  },
  {
    id: "rec-12",
    district: "Raichur",
    block: "Manvi Agro-Hub",
    unitName: "Krishna Cotton Ginning Support",
    sector: "Handloom & Textiles",
    targetCount: 90,
    achievedCount: 54,
    achievementRate: 60.0,
    budgetAllocated: 5400000,
    expenditure: 3100000,
    budgetUtilization: 57.41,
    beneficiariesCount: 185,
    womenBeneficiaries: 110,
    scStBeneficiaries: 95,
    status: "Delayed",
    month: "August 2026",
    remarks: "Machinery delivery expedited through state vendor panel",
    raw: {}
  }
];

export function computeMISMetrics(records: ParsedMISRecord[]): MISSummaryMetrics {
  if (!records.length) {
    return {
      totalTarget: 0,
      totalAchieved: 0,
      avgAchievementRate: 0,
      totalBudgetAllocated: 0,
      totalExpenditure: 0,
      avgBudgetUtilization: 0,
      totalBeneficiaries: 0,
      totalUnitsOrBlocks: 0,
      completedUnits: 0,
      onTrackUnits: 0,
      delayedUnits: 0,
      criticalUnits: 0
    };
  }

  const totalTarget = records.reduce((acc, r) => acc + (r.targetCount || 0), 0);
  const totalAchieved = records.reduce((acc, r) => acc + (r.achievedCount || 0), 0);
  const avgAchievementRate = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

  const totalBudgetAllocated = records.reduce((acc, r) => acc + (r.budgetAllocated || 0), 0);
  const totalExpenditure = records.reduce((acc, r) => acc + (r.expenditure || 0), 0);
  const avgBudgetUtilization = totalBudgetAllocated > 0 ? (totalExpenditure / totalBudgetAllocated) * 100 : 0;

  const totalBeneficiaries = records.reduce((acc, r) => acc + (r.beneficiariesCount || 0), 0);

  const completedUnits = records.filter(r => r.status === 'Completed').length;
  const onTrackUnits = records.filter(r => r.status === 'On Track').length;
  const delayedUnits = records.filter(r => r.status === 'Delayed').length;
  const criticalUnits = records.filter(r => r.status === 'Critical').length;

  return {
    totalTarget,
    totalAchieved,
    avgAchievementRate: Number(avgAchievementRate.toFixed(1)),
    totalBudgetAllocated,
    totalExpenditure,
    avgBudgetUtilization: Number(avgBudgetUtilization.toFixed(1)),
    totalBeneficiaries,
    totalUnitsOrBlocks: records.length,
    completedUnits,
    onTrackUnits,
    delayedUnits,
    criticalUnits
  };
}
