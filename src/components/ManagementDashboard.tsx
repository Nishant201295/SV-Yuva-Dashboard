import React, { useRef } from 'react';
import { 
  Building2, 
  Target, 
  TrendingUp, 
  Wallet, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle,
  FileSpreadsheet,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  Download,
  Calendar,
  ChevronRight,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Upload,
  Link2,
  HelpCircle,
  FileText
} from 'lucide-react';
import type { ParsedMISRecord, MISSummaryMetrics } from '../types/mis';
import { computeMISMetrics } from '../services/mockData';

interface DashboardProps {
  records: ParsedMISRecord[];
  allHeaders: string[];
  spreadsheetTitle: string;
  activeSheetTitle: string;
  isLoading: boolean;
  onRefresh: () => void;
  onConnectSheetUrl: (urlOrId: string) => void;
  onUploadCSV: (file: File) => void;
  onResetToDemo: () => void;
}

export const ManagementDashboard: React.FC<DashboardProps> = ({
  records,
  allHeaders,
  spreadsheetTitle,
  activeSheetTitle,
  isLoading,
  onRefresh,
  onConnectSheetUrl,
  onUploadCSV,
  onResetToDemo,
}) => {
  // Filters state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>('All');
  const [selectedSector, setSelectedSector] = React.useState<string>('All');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('All');
  const [activeTab, setActiveTab] = React.useState<'overview' | 'units' | 'financials' | 'rawTable'>('overview');

  // Sheet connection bar state
  const [sheetUrlInput, setSheetUrlInput] = React.useState('');
  const [showConnectModal, setShowConnectModal] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique filter options
  const districts = React.useMemo(() => {
    const list = Array.from(new Set(records.map((r) => r.district).filter(Boolean))) as string[];
    return ['All', ...list.sort()];
  }, [records]);

  const sectors = React.useMemo(() => {
    const list = Array.from(new Set(records.map((r) => r.sector).filter(Boolean))) as string[];
    return ['All', ...list.sort()];
  }, [records]);

  // Filtered records
  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        !searchTerm ||
        r.unitName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.block?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.remarks?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDistrict = selectedDistrict === 'All' || r.district === selectedDistrict;
      const matchSector = selectedSector === 'All' || r.sector === selectedSector;
      const matchStatus = selectedStatus === 'All' || r.status === selectedStatus;

      return matchSearch && matchDistrict && matchSector && matchStatus;
    });
  }, [records, searchTerm, selectedDistrict, selectedSector, selectedStatus]);

  // Computed metrics for currently filtered dataset
  const metrics: MISSummaryMetrics = React.useMemo(() => {
    return computeMISMetrics(filteredRecords);
  }, [filteredRecords]);

  // Currency Formatter
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredRecords.length) return;
    const headers = [
      'ID',
      'District',
      'Block/Taluk',
      'Unit Name',
      'Sector',
      'Target',
      'Achieved',
      'Achievement %',
      'Budget Allocated (INR)',
      'Expenditure (INR)',
      'Utilization %',
      'Beneficiaries',
      'Women Beneficiaries',
      'SC/ST Beneficiaries',
      'Status',
      'Remarks',
    ];
    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.district || ''}"`,
      `"${r.block || ''}"`,
      `"${r.unitName || ''}"`,
      `"${r.sector || ''}"`,
      r.targetCount,
      r.achievedCount,
      `${r.achievementRate}%`,
      r.budgetAllocated,
      r.expenditure,
      `${r.budgetUtilization}%`,
      r.beneficiariesCount,
      r.womenBeneficiaries,
      r.scStBeneficiaries,
      `"${r.status}"`,
      `"${(r.remarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SVYSY_2026-27_MIS_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrlInput.trim()) return;
    onConnectSheetUrl(sheetUrlInput.trim());
    setShowConnectModal(false);
    setSheetUrlInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadCSV(file);
      setShowConnectModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-16">
      {/* Top Management Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-500 to-sky-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  MIS 2026-27
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Executive Dashboard
                </span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                SVYSY Management Cockpit
              </h1>
            </div>
          </div>

          {/* Action Center (No Auth Required) */}
          <div className="flex items-center gap-2.5">
            {/* Connected Source Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-200">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="max-w-[170px] truncate" title={spreadsheetTitle}>
                {spreadsheetTitle}
              </span>
            </div>

            {/* Load Google Sheet or CSV */}
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
              title="Connect Google Sheet URL or Upload File"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Import Sheet / CSV</span>
            </button>

            {/* Reset / Reload Demo */}
            <button
              onClick={onResetToDemo}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition"
              title="Load original SVYSY 2026-27 dataset"
            >
              Demo Data
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
              title="Refresh dataset"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Sub-Header Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-slate-800/60 overflow-x-auto text-xs py-2 gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Executive Overview
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'units'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Unit Breakdown ({filteredRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'financials'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              Financials & Outlay
            </button>
            <button
              onClick={() => setActiveTab('rawTable')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'rawTable'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Raw Spreadsheet View
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Active Dataset: <span className="text-slate-200">{activeSheetTitle}</span> ({records.length} records)
          </div>
        </div>
      </header>

      {/* Sheet / CSV Connection Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Import Google Sheet or CSV</h3>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Option 1: Public Google Sheet URL */}
            <form onSubmit={handleUrlSubmit} className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Option 1: Paste Google Sheet URL or ID (Public / Link-shared)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/... or ID"
                  value={sheetUrlInput}
                  onChange={(e) => setSheetUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={!sheetUrlInput.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold"
                >
                  Load
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                In Google Sheets, set Share to <span className="text-indigo-300">"Anyone with the link can view"</span>, then copy the link here.
              </p>
            </form>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">
                Or
              </span>
            </div>

            {/* Option 2: Upload CSV */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Option 2: Upload CSV exported from SVYSY_2026-27_MIS
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/80 bg-slate-950/60 hover:bg-indigo-950/20 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Click to browse and upload CSV file</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Management KPI Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Physical Achievement Rate */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-indigo-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Physical Achievement
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {metrics.avgAchievementRate}%
              </div>
              <span className="text-xs font-medium text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {metrics.totalAchieved} / {metrics.totalTarget}
              </span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(metrics.avgAchievementRate, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                <span>Units Target Reached</span>
                <span className="font-semibold text-slate-300">{metrics.totalAchieved} units</span>
              </div>
            </div>
          </div>

          {/* Card 2: Financial Utilization */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Financial Outlay & Spent
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {metrics.avgBudgetUtilization}%
              </div>
              <span className="text-xs font-medium text-slate-400">
                Utilized
              </span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(metrics.avgBudgetUtilization, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                <span>Exp: {formatCurrency(metrics.totalExpenditure)}</span>
                <span className="font-semibold text-slate-300">Alloc: {formatCurrency(metrics.totalBudgetAllocated)}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Beneficiaries Impacted */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-sky-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Youth Beneficiaries
              </span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {metrics.totalBeneficiaries.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-sky-400 font-medium">
                Enrolled
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-pink-400"></span>
                <span>Women: {filteredRecords.reduce((a, b) => a + (b.womenBeneficiaries || 0), 0).toLocaleString('en-IN')}</span>
                <span className="text-slate-600">|</span>
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span>SC/ST: {filteredRecords.reduce((a, b) => a + (b.scStBeneficiaries || 0), 0).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">Affirmative inclusive cohort representation: ~68%</p>
            </div>
          </div>

          {/* Card 4: Operational Health / Milestone Status */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Enterprise Unit Health
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                {metrics.completedUnits + metrics.onTrackUnits}
              </div>
              <span className="text-xs text-slate-400">
                of {metrics.totalUnitsOrBlocks} units active & healthy
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                {metrics.completedUnits} Done
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20">
                {metrics.onTrackUnits} On Track
              </span>
              {metrics.delayedUnits > 0 && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                  {metrics.delayedUnits} Lag
                </span>
              )}
              {metrics.criticalUnits > 0 && (
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
                  {metrics.criticalUnits} Critical
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Global Filter Bar */}
        <section className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[220px] max-w-sm flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search unit, district, block, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 py-1.5 px-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Sector:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 py-1.5 px-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 py-1.5 px-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="On Track">On Track</option>
                <option value="Delayed">Delayed</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {(searchTerm || selectedDistrict !== 'All' || selectedSector !== 'All' || selectedStatus !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDistrict('All');
                  setSelectedSector('All');
                  setSelectedStatus('All');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Download MIS report as CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              Export CSV
            </button>
          </div>
        </section>

        {/* View Content: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Target vs Achieved Progress */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                      District-Wise Physical Target vs. Achievement
                    </h3>
                    <p className="text-xs text-slate-400">
                      Comparison of target quotas against actual verified units established
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {filteredRecords.length} Nodes
                  </span>
                </div>

                <div className="space-y-3.5 pt-2">
                  {filteredRecords.slice(0, 7).map((item) => {
                    const pct = item.targetCount > 0 ? (item.achievedCount / item.targetCount) * 100 : 0;
                    return (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200">{item.district}</span>
                            <span className="text-[11px] text-slate-400">({item.sector})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 text-[11px]">
                              {item.achievedCount} / {item.targetCount} units
                            </span>
                            <span
                              className={`font-bold font-mono text-[11px] px-1.5 py-0.5 rounded ${
                                pct >= 90
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : pct >= 70
                                  ? 'bg-sky-500/10 text-sky-400'
                                  : 'bg-amber-500/10 text-amber-400'
                              }`}
                            >
                              {pct.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              pct >= 90
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : pct >= 70
                                ? 'bg-gradient-to-r from-indigo-500 to-sky-400'
                                : 'bg-gradient-to-r from-amber-500 to-rose-400'
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Breakdown & Sector Representation */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-emerald-400" />
                    Delivery Health Breakdown
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-slate-300 font-medium">Completed / 100% Target</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {metrics.completedUnits}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span className="text-xs text-slate-300 font-medium">On Track</span>
                      </div>
                      <span className="text-xs font-bold text-sky-400 font-mono">
                        {metrics.onTrackUnits}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-slate-300 font-medium">Delayed</span>
                      </div>
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        {metrics.delayedUnits}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-xs text-slate-300 font-medium">Critical Intervention</span>
                      </div>
                      <span className="text-xs font-bold text-rose-400 font-mono">
                        {metrics.criticalUnits}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                    <Sparkles className="w-4 h-4" />
                    Executive Brief & Highlights
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>
                      Overall physical progress is tracking at{' '}
                      <span className="font-bold text-white">{metrics.avgAchievementRate}%</span> of the targeted SVYSY mandate.
                    </li>
                    <li>
                      Capital utilization stands at{' '}
                      <span className="font-bold text-white">{metrics.avgBudgetUtilization}%</span> ({formatCurrency(metrics.totalExpenditure)} disbursed).
                    </li>
                    <li>
                      Priority intervention needed on {metrics.delayedUnits + metrics.criticalUnits} units encountering credit clearance bottlenecks.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Priority Action Table */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Priority Action Table (Units Needing Executive Attention)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Units with achievement lag or critical bottlenecks highlighted from the 2026-27 spreadsheet
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('units')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  View All Units <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">District / Block</th>
                      <th className="px-4 py-3">Unit / Enterprise</th>
                      <th className="px-4 py-3">Sector</th>
                      <th className="px-4 py-3 text-right">Target / Achieved</th>
                      <th className="px-4 py-3 text-right">Expenditure</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3">Remarks / Blockers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRecords
                      .filter((r) => r.status === 'Delayed' || r.status === 'Critical')
                      .concat(filteredRecords.filter((r) => r.status !== 'Delayed' && r.status !== 'Critical'))
                      .slice(0, 5)
                      .map((unit) => (
                        <tr key={unit.id} className="hover:bg-slate-800/30 transition">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-white">{unit.district}</div>
                            <div className="text-[11px] text-slate-400">{unit.block}</div>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-200">{unit.unitName}</td>
                          <td className="px-4 py-3 text-slate-400">{unit.sector}</td>
                          <td className="px-4 py-3 text-right font-mono">
                            <span className="text-emerald-400 font-bold">{unit.achievedCount}</span>
                            <span className="text-slate-500"> / {unit.targetCount}</span>
                            <div className="text-[10px] text-slate-400 font-sans">
                              {unit.achievementRate}% achieved
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono">
                            <div>{formatCurrency(unit.expenditure)}</div>
                            <div className="text-[10px] text-slate-400 font-sans">
                              of {formatCurrency(unit.budgetAllocated)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                unit.status === 'Completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : unit.status === 'On Track'
                                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                  : unit.status === 'Delayed'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {unit.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 max-w-xs truncate" title={unit.remarks}>
                            {unit.remarks || 'No issues reported'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View Content: Unit Breakdown */}
        {activeTab === 'units' && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  All Units & Enterprise Entities ({filteredRecords.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Comprehensive performance grid with drilldown metrics and beneficiary statistics
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Unit / SHG Name</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3 text-right">Physical Progress</th>
                    <th className="px-4 py-3 text-right">Financial Outlay</th>
                    <th className="px-4 py-3 text-center">Beneficiaries</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRecords.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{unit.district}</div>
                        <div className="text-[11px] text-slate-400">{unit.block}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{unit.unitName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{unit.id}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                          {unit.sector}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-white font-bold">{unit.achievedCount}</span>
                          <span className="text-slate-500">/ {unit.targetCount}</span>
                        </div>
                        <div className="w-24 ml-auto bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(unit.achievementRate, 100)}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-indigo-400 mt-0.5">{unit.achievementRate}%</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <div className="text-white font-semibold">{formatCurrency(unit.expenditure)}</div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          Alloc: {formatCurrency(unit.budgetAllocated)} ({unit.budgetUtilization}%)
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="font-bold text-white">{unit.beneficiariesCount}</div>
                        <div className="text-[10px] text-slate-400">
                          F: {unit.womenBeneficiaries} | SC: {unit.scStBeneficiaries}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            unit.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : unit.status === 'On Track'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : unit.status === 'Delayed'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs max-w-xs truncate" title={unit.remarks}>
                        {unit.remarks || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Content: Financials & Outlay */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Allocation</span>
                <div className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(metrics.totalBudgetAllocated)}
                </div>
                <p className="text-xs text-slate-500 mt-2">Approved budget for SVYSY 2026-27 cohort</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Expenditure</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {formatCurrency(metrics.totalExpenditure)}
                </div>
                <p className="text-xs text-slate-500 mt-2">Disbursed to youth units & clusters</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Unspent Balance</span>
                <div className="text-2xl font-bold text-sky-400 mt-1">
                  {formatCurrency(metrics.totalBudgetAllocated - metrics.totalExpenditure)}
                </div>
                <p className="text-xs text-slate-500 mt-2">Remaining pool for next operational phase</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Sector-Wise Financial Allocation & Spent
              </h3>

              <div className="space-y-4 pt-2">
                {sectors
                  .filter((s) => s !== 'All')
                  .map((sectorName) => {
                    const sectorUnits = filteredRecords.filter((r) => r.sector === sectorName);
                    const alloc = sectorUnits.reduce((a, b) => a + (b.budgetAllocated || 0), 0);
                    const spent = sectorUnits.reduce((a, b) => a + (b.expenditure || 0), 0);
                    const pct = alloc > 0 ? (spent / alloc) * 100 : 0;

                    return (
                      <div key={sectorName} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white text-sm">{sectorName}</span>
                            <span className="text-slate-500 ml-2">({sectorUnits.length} Units)</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-emerald-400 font-bold">{formatCurrency(spent)}</span>
                            <span className="text-slate-400"> / {formatCurrency(alloc)}</span>
                            <span className="ml-2 font-bold font-mono text-indigo-400">({pct.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* View Content: Raw Spreadsheet Table */}
        {activeTab === 'rawTable' && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  Live Spreadsheet Records
                </h3>
                <p className="text-xs text-slate-400">
                  Direct raw row inspection from sheet "{activeSheetTitle}"
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {records.length} Total Rows Loaded
              </span>
            </div>

            <div className="overflow-x-auto max-h-[600px] border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-300 sticky top-0 uppercase font-semibold border-b border-slate-800 z-10">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Block</th>
                    <th className="px-4 py-3">Unit Name</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3 text-right">Target</th>
                    <th className="px-4 py-3 text-right">Achieved</th>
                    <th className="px-4 py-3 text-right">Budget</th>
                    <th className="px-4 py-3 text-right">Spent</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {records.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-2.5 text-slate-500 font-sans">{i + 1}</td>
                      <td className="px-4 py-2.5 font-sans font-medium text-slate-200">{r.district}</td>
                      <td className="px-4 py-2.5 font-sans text-slate-400">{r.block}</td>
                      <td className="px-4 py-2.5 font-sans font-medium text-white">{r.unitName}</td>
                      <td className="px-4 py-2.5 font-sans text-slate-300">{r.sector}</td>
                      <td className="px-4 py-2.5 text-right">{r.targetCount}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-400">{r.achievedCount}</td>
                      <td className="px-4 py-2.5 text-right">₹{r.budgetAllocated.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5 text-right text-sky-400">₹{r.expenditure.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5 text-center font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-sans text-slate-400 max-w-xs truncate">{r.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
