import React, { useState } from 'react';
import {
  History,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Archive,
  KeyRound,
  FileSpreadsheet,
  Plus,
  Clock,
  Calendar,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KeyActivity } from '../../types';
import { formatDateTime } from '../../utils/exportUtils';

export const ActivityView: React.FC = () => {
  const {
    activities,
    keys,
    people,
    properties,
    logAfterHoursEntry,
    searchQuery,
    setSearchQuery,
    setCurrentTab,
  } = useApp();

  const [actionFilter, setActionFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual after-hours entry form state
  const [manualKeyId, setManualKeyId] = useState(keys[0]?.id || '');
  const [manualPersonId, setManualPersonId] = useState(people[0]?.id || '');
  const [manualAction, setManualAction] = useState<'checkout' | 'return'>('checkout');
  const [manualTimestamp, setManualTimestamp] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(19, 30, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [manualNotes, setManualNotes] = useState('After-hours estate agent client viewing');

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      searchQuery === '' ||
      act.keyTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.personCompany && act.personCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
      act.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.notes && act.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (actionFilter !== 'All' && act.action !== actionFilter) return false;

    if (dateFilter === 'Today') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (!act.timestamp.startsWith(todayStr)) return false;
    }

    return true;
  });

  const handleSaveManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualKeyId || !manualPersonId) return;

    logAfterHoursEntry({
      keyId: manualKeyId,
      personId: manualPersonId,
      action: manualAction,
      timestamp: new Date(manualTimestamp).toISOString(),
      notes: manualNotes,
    });

    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity by tag, person, address, company..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-2xs"
            />
          </div>

          {/* Action Filter */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
            {['All', 'checkout', 'return', 'archive'].map((action) => (
              <button
                key={action}
                onClick={() => setActionFilter(action)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-colors ${
                  actionFilter === action
                    ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
            {['All', 'Today'].map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  dateFilter === df
                    ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {df}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Feature: Log manual after-hours paperwork */}
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-xl transition-all shadow-2xs whitespace-nowrap"
            title="Update system from paper logsheet filled by agents after hours"
          >
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Log After-Hours Handover</span>
          </button>

          <button
            onClick={() => setCurrentTab('reports')}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold text-xs rounded-xl transition-all shadow-xs whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Daily Excel Report</span>
          </button>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          All Key Allocation Audit Events ({filteredActivities.length})
        </div>

        <div className="space-y-3">
          {filteredActivities.map((act) => {
            const isCheckout = act.action === 'checkout';
            const isReturn = act.action === 'return';
            const isArchive = act.action === 'archive';

            return (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  {/* Action Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isCheckout
                        ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                        : isReturn
                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                    }`}
                  >
                    {isCheckout && <ArrowUpRight className="w-4 h-4" />}
                    {isReturn && <ArrowDownLeft className="w-4 h-4" />}
                    {isArchive && <Archive className="w-4 h-4" />}
                  </div>

                  {/* Event Details */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300 text-sm">{act.keyTag}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold text-slate-900 dark:text-white">{act.propertyName}</span>
                      <span className="text-slate-400">·</span>
                      <span
                        className={`font-semibold capitalize px-2 py-0.5 rounded text-[10px] ${
                          isCheckout
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                            : isReturn
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {act.action}
                      </span>

                      {act.isAfterHours && (
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-500/30">
                          After Hours
                        </span>
                      )}

                      {act.manualAfterHoursEntry && (
                        <span className="text-[10px] text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/30">
                          Paperwork Back-Entered
                        </span>
                      )}
                    </div>

                    <div className="text-slate-600 dark:text-slate-300">
                      Person: <strong className="text-slate-900 dark:text-white font-semibold">{act.personName}</strong>
                      {act.personCompany && (
                        <span className="text-slate-500 dark:text-slate-400 ml-1">({act.personCompany})</span>
                      )}
                      {act.personPhone && (
                        <span className="text-slate-400 ml-2">Tel: {act.personPhone}</span>
                      )}
                    </div>

                    {act.notes && (
                      <div className="text-slate-500 dark:text-slate-400 italic text-[11px]">"{act.notes}"</div>
                    )}
                  </div>
                </div>

                {/* Right: Timestamp & Operator */}
                <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 w-full sm:w-auto">
                  <div className="font-mono text-slate-700 dark:text-slate-300">{formatDateTime(act.timestamp)}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Logged by {act.performedBy}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <div>No activity records found matching filters.</div>
            </div>
          )}
        </div>
      </div>

      {/* Manual After-Hours Paper Log Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Backfill After-Hours Logsheet</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Capture manual paper handover sheet entries from previous night
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualEntry} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Key Handed Over</label>
                <select
                  value={manualKeyId}
                  onChange={(e) => setManualKeyId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                >
                  {keys.map((k) => {
                    const prop = properties.find((p) => p.id === k.propertyId);
                    return (
                      <option key={k.id} value={k.id}>
                        {k.tag} — {prop?.name || 'Property'} ({k.keyType})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Estate Agent / Person Involved</label>
                <select
                  value={manualPersonId}
                  onChange={(e) => setManualPersonId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.company ? `(${p.company})` : ''} — {p.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Action Type</label>
                  <select
                    value={manualAction}
                    onChange={(e) => setManualAction(e.target.value as 'checkout' | 'return')}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="checkout">Key Checked Out</option>
                    <option value="return">Key Returned Back</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Actual Time Taken / Returned</label>
                  <input
                    type="datetime-local"
                    value={manualTimestamp}
                    onChange={(e) => setManualTimestamp(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Handover Notes / Signatures</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Viewing completed; key returned to night lockbox"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold rounded-xl transition-colors shadow-xs"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
