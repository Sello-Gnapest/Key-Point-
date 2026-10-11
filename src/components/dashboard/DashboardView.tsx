import React from 'react';
import {
  Building2,
  KeyRound,
  TrendingUp,
  Users,
  Plus,
  ArrowRightCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Activity as PulseIcon,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KeyActivity } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    properties,
    keys,
    people,
    activities,
    setCurrentTab,
    setIsAddPropertyModalOpen,
    setIsAddKeyModalOpen,
    setIsAddPersonModalOpen,
    setIsCheckoutModalOpen,
    setSelectedKeyId,
    isAdmin,
  } = useApp();

  // Active items (excluding archived)
  const activeProperties = properties.filter((p) => !p.isArchived);
  const activeKeys = keys.filter((k) => !k.isArchived);
  const activePeople = people.filter((p) => !p.isArchived);

  const keysInUse = activeKeys.filter((k) => k.status === 'Checked Out');
  const availableKeys = activeKeys.filter((k) => k.status === 'Available');

  // Compute today's actions
  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter((a) => a.timestamp.startsWith(todayStr));
  const todayCheckouts = todayActivities.filter((a) => a.action === 'checkout').length;
  const todayReturns = todayActivities.filter((a) => a.action === 'return').length;

  // Overdue keys (checked out with expected return date before right now)
  const now = new Date();
  const overdueKeys = keysInUse.filter((k) => {
    if (!k.expectedReturnAt) return false;
    return new Date(k.expectedReturnAt) < now;
  });

  // Relative time helper
  const getRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards Grid - Faithful recreation of the uploaded screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Properties */}
        <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all">
          <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Properties</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {activeProperties.length}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {properties.filter((p) => p.isArchived).length} archived
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e6f3fe] dark:bg-blue-500/10 text-[#0082f4] dark:text-blue-400 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Keys */}
        <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all">
          <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Keys</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {activeKeys.length}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">
              <span className="font-semibold text-slate-600 dark:text-cyan-400">{availableKeys.length}</span> available
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e0f7fa] dark:bg-cyan-500/10 text-[#00a2ea] dark:text-cyan-400 flex items-center justify-center shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Keys In Use */}
        <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all">
          <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Keys In Use</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {keysInUse.length}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">
              {overdueKeys.length > 0 ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">{overdueKeys.length} overdue</span>
              ) : (
                'All on schedule'
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fef7e0] dark:bg-amber-500/10 text-[#f59e0b] dark:text-amber-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Registered People */}
        <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all">
          <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Registered People</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {activePeople.length}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Agents & contractors
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f5ecfd] dark:bg-purple-500/10 text-[#9333ea] dark:text-purple-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Overdue Alert Banner (if any keys are overdue) */}
      {overdueKeys.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                {overdueKeys.length} key{overdueKeys.length > 1 ? 's are' : ' is'} currently past expected return time
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                {overdueKeys.map((k) => `${k.tag} (${k.currentBorrowerName || 'Unknown'})`).join(', ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('keys')}
            className="px-3.5 py-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-700 dark:text-amber-300 rounded-xl font-medium transition-colors shrink-0"
          >
            Review In Keys Tab
          </button>
        </div>
      )}

      {/* Main Split Row: Quick Actions (Left) and Recent Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Actions Card */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Quick Actions</h2>
            <div className="space-y-3">
              {/* Add Property */}
              <button
                onClick={() => setIsAddPropertyModalOpen(true)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium transition-all shadow-2xs group"
              >
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#00a2ea] transition-colors" />
                <span>Add Property</span>
              </button>

              {/* Add Key */}
              <button
                onClick={() => {
                  if (isAdmin) {
                    setIsAddKeyModalOpen(true);
                  } else {
                    alert('Only Admin users can manually capture new keys into the system. Switch to Admin role in the top header to unlock.');
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all shadow-2xs group ${
                  isAdmin
                    ? 'border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    : 'border-slate-200/70 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
                title={!isAdmin ? 'Admin access required to create keys' : ''}
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#00a2ea] transition-colors" />
                  <span>Add Key</span>
                </div>
                {!isAdmin && (
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-transparent">
                    Admin
                  </span>
                )}
              </button>

              {/* Add Person */}
              <button
                onClick={() => setIsAddPersonModalOpen(true)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium transition-all shadow-2xs group"
              >
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#00a2ea] transition-colors" />
                <span>Add Person</span>
              </button>

              {/* Checkout Key Button (Solid vibrant cyan matching the screenshot) */}
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99] mt-3"
              >
                <ArrowRightCircle className="w-4 h-4 text-white" />
                <span>Checkout Key</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-400 dark:text-slate-400 leading-relaxed">
            Need to add a person during checkout? You can create new contacts inline inside the checkout dialog.
          </div>
        </div>

        {/* Right Column: Recent Activity Card */}
        <div className="lg:col-span-8 bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <button
              onClick={() => setCurrentTab('activity')}
              className="text-xs text-slate-500 hover:text-[#00a2ea] font-medium transition-colors"
            >
              View all
            </button>
          </div>

          {/* Clean, spacious rows without heavy card wrapping matching screenshot */}
          <div className="space-y-4 flex-1">
            {activities.slice(0, 6).map((activity) => {
              const isReturn = activity.action === 'return';
              const isCheckout = activity.action === 'checkout';

              return (
                <div
                  key={activity.id}
                  className="flex items-start sm:items-center justify-between gap-3 text-sm py-1 border-b border-slate-100/80 dark:border-slate-800/40 last:border-0"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    {/* Circle Icon Badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                        isReturn
                          ? 'bg-[#e6f9f0] border border-[#a3e9c6] text-[#10b981] dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
                          : 'bg-[#fef7e0] border border-[#fde68a] text-[#f59e0b] dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'
                      }`}
                    >
                      {isReturn ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    {/* Description & Address */}
                    <div className="min-w-0">
                      <div className="text-slate-900 dark:text-white font-medium truncate flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-slate-900 dark:text-cyan-300">{activity.keyTag}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-normal">
                          {isReturn ? 'returned by' : 'checked out to'}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{activity.personName}</span>
                        {activity.personCompany && (
                          <span className="text-xs text-slate-400">
                            ({activity.personCompany})
                          </span>
                        )}
                      </div>

                      <div className="text-slate-400 text-xs mt-0.5 flex items-center gap-1.5 truncate">
                        <span className="truncate">{activity.propertyName || activity.propertyAddress}</span>
                        <span aria-hidden="true">·</span>
                        <span className="shrink-0">{getRelativeTime(activity.timestamp)}</span>
                        {activity.isAfterHours && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-purple-600 dark:text-purple-400 font-medium">After-Hours</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Today's Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Summary Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Today&apos;s Summary</h2>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e0f7fa] dark:bg-cyan-500/10 text-[#00a2ea] dark:text-cyan-400 flex items-center justify-center shrink-0">
              <PulseIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {todayActivities.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total actions today</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/50">
              <div className="text-slate-500 dark:text-slate-400">Checkouts Today</div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums mt-0.5">
                {todayCheckouts}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/50">
              <div className="text-slate-500 dark:text-slate-400">Returns Today</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
                {todayReturns}
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Key Inventory Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Key Inventory Status</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time status of all cataloged property keys</p>
            </div>
            <button
              onClick={() => setCurrentTab('reports')}
              className="text-xs font-semibold text-[#00a2ea] hover:underline"
            >
              Export Report
            </button>
          </div>

          {/* Visual Percentage Bar */}
          <div className="space-y-2.5 mt-2">
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(availableKeys.length / (activeKeys.length || 1)) * 100}%` }}
                className="bg-[#00a2ea] h-full transition-all"
                title={`Available: ${availableKeys.length}`}
              />
              <div
                style={{ width: `${((keysInUse.length - overdueKeys.length) / (activeKeys.length || 1)) * 100}%` }}
                className="bg-amber-400 h-full transition-all"
                title={`In Use: ${keysInUse.length - overdueKeys.length}`}
              />
              <div
                style={{ width: `${(overdueKeys.length / (activeKeys.length || 1)) * 100}%` }}
                className="bg-red-500 h-full transition-all"
                title={`Overdue: ${overdueKeys.length}`}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00a2ea]" />
                <span className="text-slate-500 dark:text-slate-400">Available:</span>
                <span className="text-slate-900 dark:text-white font-mono tabular-nums font-bold">{availableKeys.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-500 dark:text-slate-400">In Use:</span>
                <span className="text-slate-900 dark:text-white font-mono tabular-nums font-bold">
                  {keysInUse.length - overdueKeys.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-500 dark:text-slate-400">Overdue:</span>
                <span className="text-slate-900 dark:text-white font-mono tabular-nums font-bold">{overdueKeys.length}</span>
              </div>
            </div>
          </div>

          {/* Currently Out Keys Snapshot */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
              Currently Checked Out Keys
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {keysInUse.slice(0, 4).map((k) => (
                <div
                  key={k.id}
                  onClick={() => {
                    setSelectedKeyId(k.id);
                    setCurrentTab('keys');
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800/80 cursor-pointer transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#00a2ea] font-bold">{k.tag}</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Checked Out</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-medium mt-1 truncate">
                    Held by: <span className="text-slate-900 dark:text-white font-bold">{k.currentBorrowerName || 'Staff Member'}</span>
                  </div>
                  {k.currentBorrowerCompany && (
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate mt-0.5">
                      {k.currentBorrowerCompany}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
