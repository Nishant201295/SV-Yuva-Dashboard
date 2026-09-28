import React, { useState } from 'react';
import { SAMPLE_SVYSY_MIS_DATA } from './services/mockData';
import { 
  parseCSVToRows, 
  parseSheetRowsToMIS, 
  fetchPublicGoogleSheetCSV 
} from './services/sheetsService';
import type { ParsedMISRecord } from './types/mis';
import { ManagementDashboard } from './components/ManagementDashboard';

export default function App() {
  const [records, setRecords] = useState<ParsedMISRecord[]>(SAMPLE_SVYSY_MIS_DATA);
  const [headers, setHeaders] = useState<string[]>([]);
  const [spreadsheetTitle, setSpreadsheetTitle] = useState('SVYSY_2026-27_MIS');
  const [activeSheetTab, setActiveSheetTab] = useState('Consolidated_MIS');
  const [isLoading, setIsLoading] = useState(false);

  // Connect via link-shared Google Sheet URL or ID
  const handleConnectSheetUrl = async (urlOrId: string) => {
    setIsLoading(true);
    try {
      const csvText = await fetchPublicGoogleSheetCSV(urlOrId);
      const rows = parseCSVToRows(csvText);
      const parsed = parseSheetRowsToMIS(rows);
      setRecords(parsed.records);
      setHeaders(parsed.headers);
      setSpreadsheetTitle('Linked Google Sheet (SVYSY)');
      setActiveSheetTab('Live Import');
    } catch (err: any) {
      alert(err?.message || 'Failed to fetch spreadsheet. Ensure the sheet is public or link-shared ("Anyone with the link can view").');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload exported CSV directly
  const handleUploadCSV = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSVToRows(text);
        const parsed = parseSheetRowsToMIS(rows);
        setRecords(parsed.records);
        setHeaders(parsed.headers);
        setSpreadsheetTitle(file.name.replace('.csv', ''));
        setActiveSheetTab('CSV Import');
      } catch (err: any) {
        alert('Failed to parse uploaded CSV file: ' + err?.message);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  // Reset to original SVYSY 2026-27 MIS data
  const handleResetToDemo = () => {
    setIsLoading(true);
    setRecords(SAMPLE_SVYSY_MIS_DATA);
    setSpreadsheetTitle('SVYSY_2026-27_MIS');
    setActiveSheetTab('Consolidated_MIS');
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  // Refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  return (
    <ManagementDashboard
      records={records}
      allHeaders={headers}
      spreadsheetTitle={spreadsheetTitle}
      activeSheetTitle={activeSheetTab}
      isLoading={isLoading}
      onRefresh={handleRefresh}
      onConnectSheetUrl={handleConnectSheetUrl}
      onUploadCSV={handleUploadCSV}
      onResetToDemo={handleResetToDemo}
    />
  );
}
