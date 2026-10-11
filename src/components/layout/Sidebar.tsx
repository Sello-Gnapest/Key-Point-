import React from 'react';
import {
  LayoutDashboard,
  Building2,
  KeyRound,
  Users,
  History,
  FileSpreadsheet,
  Archive,
  Settings,
  Sun,
  Moon,
  Laptop,
  ShieldCheck,
  UserCheck,
  Eye,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    theme,
    setTheme,
    currentUser,
    isAdmin,
    logout,
    isGuestReadOnly,
    activeVisitorSession,
    exitVisitorSession,
  } = useApp();

  // Guest Read-Only Pass should only show Keys only!
  const navItems: { tab: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] =
    isGuestReadOnly
      ? [{ tab: 'keys', label: 'Keys Catalog', icon: KeyRound }]
      : [
          { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { tab: 'properties', label: 'Properties', icon: Building2 },
          { tab: 'keys', label: 'Keys', icon: KeyRound },
          { tab: 'people', label: 'People', icon: Users },
          { tab: 'activity', label: 'Activity', icon: History },
          { tab: 'reports', label: 'Reports', icon: FileSpreadsheet },
          { tab: 'archived', label: 'Archived', icon: Archive },
          { tab: 'settings', label: 'Settings', icon: Settings },
        ];

  return (
    <aside className="w-64 bg-white dark:bg-[#090d14] text-slate-700 dark:text-slate-300 flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800/80 min-h-screen select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/60">
        <div className="w-10 h-10 rounded-xl bg-[#00a2ea] flex items-center justify-center text-white shadow-xs">
          <KeyRound className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            Key Point
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Property Management</p>
        </div>
      </div>

      {/* Guest Mode Restriction Alert in Sidebar */}
      {isGuestReadOnly && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-900 dark:text-emerald-200">
            <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Guest Read-Only Pass</span>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-tight">
            Restricted to Keys Catalog only. Checkout and modification features locked.
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setCurrentTab(item.tab)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left group ${
                isActive
                  ? 'bg-[#00a2ea] text-white border border-[#008ecf] shadow-xs dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-500/40'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-white dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              />
              <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
              {isGuestReadOnly ? (
                <span className="ml-auto text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  Read Only
                </span>
              ) : (
                item.tab === 'reports' &&
                !isAdmin && (
                  <span
                    className={`ml-auto text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-slate-500 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    Admin
                  </span>
                )
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Area: Theme Switcher & User Profile */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/70 space-y-3 bg-slate-50 dark:bg-[#080b11] transition-colors duration-200">
        {/* Theme Segmented Switcher */}
        <div className="flex items-center justify-between p-1 bg-slate-200/70 dark:bg-slate-900/90 rounded-lg border border-slate-300/80 dark:border-slate-800/80 text-xs">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded font-medium transition-all ${
              theme === 'light'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded font-medium transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
          <button
            onClick={() => setTheme('auto')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded font-medium transition-all ${
              theme === 'auto'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Auto</span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 shadow-xs">
          <div
            className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border ${
              isGuestReadOnly
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                : 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30'
            }`}
          >
            {isGuestReadOnly ? (
              <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1">
              <span>{isGuestReadOnly ? activeVisitorSession?.label || 'Guest Viewer' : currentUser.name}</span>
              {isAdmin && !isGuestReadOnly ? (
                <span title="Admin User">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                </span>
              ) : isGuestReadOnly ? (
                <span title="Guest Read-Only Pass">
                  <Eye className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                </span>
              ) : (
                <span title="Agent User">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {isGuestReadOnly ? 'Guest Read-Only Pass' : currentUser.email}
            </div>
          </div>

          <button
            onClick={activeVisitorSession ? exitVisitorSession : logout}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
            title={activeVisitorSession ? 'Exit Guest Session' : 'Sign Out'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
