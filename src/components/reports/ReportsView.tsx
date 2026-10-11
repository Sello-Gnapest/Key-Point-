import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  KeyRound,
  Shield,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  exportDailyActivityExcel,
  exportFullKeysExcel,
  downloadCSV,
  formatDateTime,
} from '../../utils/exportUtils';

export const ReportsView: React.FC = () => {
  const { keys, properties, people, activities, isAdmin } = useApp();

  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const propertyMap = new Map(properties.map((p) => [p.id, p]));

  // Activities for chosen date
  const dayActivities = activities.filter((act) => act.timestamp.startsWith(selectedDate));
  const dayCheckouts = dayActivities.filter((act) => act.action === 'checkout');
  const dayReturns = dayActivities.filter((act) => act.action === 'return');

  // Currently in-use keys
  const keysCurrentlyOut = keys.filter((k) => !k.isArchived && k.status === 'Checked Out');

  // Handlers
  const handleExportDailyExcel = () => {
    exportDailyActivityExcel(activities, selectedDate, keys, properties);
  };

  const handleExportDailyCSV = () => {
    const headers = [
      'Timestamp',
      'Action',
      'Key Tag',
      'Property Name',
      'Property Address',
      'Person / Borrower',
      'Company',
      'Phone',
      'Logged By',
      'After Hours Flag',
      'Notes',
    ];
    const rows = dayActivities.map((a) => [
      formatDateTime(a.timestamp),
      a.action.toUpperCase(),
      a.keyTag,
      a.propertyName,
      a.propertyAddress,
      a.personName,
      a.personCompany || 'Independent',
      a.personPhone || '',
      a.performedBy,
      a.isAfterHours ? 'YES' : 'NO',
      a.notes || '',
    ]);
    downloadCSV(`KeyPoint_Daily_Activity_${selectedDate}.csv`, headers, rows);
  };

  const handleExportFullKeysExcel = () => {
    exportFullKeysExcel(keys, properties);
  };

  const handleExportFullKeysCSV = () => {
    const headers = [
      'Key Tag',
      'Property Name',
      'Property Address',
      'Key Type',
      'Peg Location',
      'Status',
      'Current Holder Name',
      'Company',
      'Holder Phone',
      'Checked Out At',
      'Expected Return',
      'Copies',
      'Archived',
      'Notes',
    ];
    const rows = keys.map((k) => {
      const prop = propertyMap.get(k.propertyId);
      return [
        k.tag,
        prop?.name || 'Unassigned',
        prop?.address || '',
        k.keyType,
        k.pegLocation,
        k.status,
        k.currentBorrowerName || 'In Cabinet',
        k.currentBorrowerCompany || '',
        k.currentBorrowerPhone || '',
        k.checkedOutAt ? formatDateTime(k.checkedOutAt) : '',
        k.expectedReturnAt ? formatDateTime(k.expectedReturnAt) : '',
        k.copies,
        k.isArchived ? 'YES' : 'NO',
        k.notes || '',
      ];
    });
    downloadCSV(`KeyPoint_Full_Keys_Catalog_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  return (
    <div className="space-y-8">
      {/* Admin Notice if not admin */}
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <div className="font-bold">Administrative Permission Enforced</div>
            <div>Only Admin Users have access to generate and export spreadsheets. Switch to Admin role in the top bar to unlock full exports.</div>
          </div>
        </div>
      )}

      {/* Section 1: Daily Activity & After-Hours Logsheet */}
      <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Activity & After-Hours Handover Spreadsheet
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pull an Excel report of daily movements for estate agents to manually fill after hours and backfill the next day.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
              />
            </div>
          </div>
        </div>

        {/* Quick Date Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Date Activity</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{dayActivities.length}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Checked Out</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">{dayCheckouts.length}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Returned</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{dayReturns.length}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Still Out Today</div>
            <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">{keysCurrentlyOut.length}</div>
          </div>
        </div>

        {/* Preview of rows that will be in the report */}
        <div className="border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden mb-5">
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Report Preview for {selectedDate} ({dayActivities.length} rows)</span>
            <span className="text-[11px] font-normal text-slate-500">Includes printable night sign-out sheet</span>
          </div>

          <div className="max-h-56 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-900/40 text-[10px] text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Key Tag</th>
                  <th className="py-2 px-3">Property</th>
                  <th className="py-2 px-3">Person / Borrower</th>
                  <th className="py-2 px-3">Company</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                {dayActivities.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{formatDateTime(a.timestamp)}</td>
                    <td className="py-2 px-3 capitalize font-semibold">{a.action}</td>
                    <td className="py-2 px-3 font-mono font-bold text-cyan-600 dark:text-cyan-300">{a.keyTag}</td>
                    <td className="py-2 px-3">{a.propertyName}</td>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">{a.personName}</td>
                    <td className="py-2 px-3 text-slate-500">{a.personCompany || '—'}</td>
                  </tr>
                ))}
                {dayActivities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                      No electronic activity logged for this date. Exporting will produce the blank after-hours log template.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportDailyExcel}
            disabled={!isAdmin}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
              isAdmin
                ? 'bg-[#00a2ea] hover:bg-[#0092cc] text-white cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-75'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Daily Activity Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportDailyCSV}
            disabled={!isAdmin}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all ${
              isAdmin
                ? 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-75'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Section 2: Master Inventory Keys Spreadsheet */}
      <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-[#00a2ea]">
                <KeyRound className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Full Property Keys Inventory Master Spreadsheet
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Requirement: Generate and export a spreadsheet of property keys (full keys report) with holder names and peg storage codes.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {keys.length} Total Keys Tagged
            </span>
          </div>
        </div>

        <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{properties.length} Properties Covered</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Portfolios, units, and commercial keys</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60 flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{keysCurrentlyOut.length} Keys In Hand</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Allocated to external agents & staff</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Peg Verification</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Cabinet hook & rack numbers audited</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportFullKeysExcel}
            disabled={!isAdmin}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
              isAdmin
                ? 'bg-[#00a2ea] hover:bg-[#0092cc] text-white cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-75'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Full Keys Master Spreadsheet (.xlsx)</span>
          </button>

          <button
            onClick={handleExportFullKeysCSV}
            disabled={!isAdmin}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all ${
              isAdmin
                ? 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-75'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Export Full Keys (.csv)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
