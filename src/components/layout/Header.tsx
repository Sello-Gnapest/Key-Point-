import React, { useState } from 'react';
import {
  KeyRound,
  Shield,
  ShieldAlert,
  Search,
  QrCode,
  Eye,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC<{ onOpenVisitorModal: () => void }> = ({ onOpenVisitorModal }) => {
  const {
    currentTab,
    searchQuery,
    setSearchQuery,
    currentUser,
    setCurrentUser,
    teamMembers,
    isAdmin,
    isGuestReadOnly,
    setIsCheckoutModalOpen,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const getTabTitle = () => {
    if (isGuestReadOnly) {
      return {
        title: 'Property Keys Directory',
        subtitle: 'Guest Read-Only Pass — Real-time key availability, custody status, and storage pegs',
      };
    }

    switch (currentTab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Overview of your property key management' };
      case 'properties':
        return { title: 'Properties', subtitle: 'Manage portfolio residences, registered keys, and occupancy' };
      case 'keys':
        return { title: 'Keys Catalog', subtitle: 'Manually capture tags, assign peg locations, and track borrowers' };
      case 'people':
        return { title: 'People & Borrowers', subtitle: 'Directory of agents, contractors, tenants, and company affiliations' };
      case 'activity':
        return { title: 'Activity Audit Log', subtitle: 'Complete check-in, check-out, and after-hours key movements' };
      case 'reports':
        return { title: 'Reports & Excel Export', subtitle: 'Generate daily activity logsheets and master key inventory spreadsheets' };
      case 'archived':
        return { title: 'Archived Records', subtitle: 'Sold or rented properties, retired keys, and inactive contacts' };
      case 'settings':
        return { title: 'Settings & Access', subtitle: 'Admin permissions, visitor access links, and team configurations' };
      default:
        return { title: 'Dashboard', subtitle: 'Overview of your property key management' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="px-8 py-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#f3f6f9]/85 dark:bg-[#0b0f17]/90 backdrop-blur-md sticky top-0 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-200">
      {/* Zone 1: Title & Breadcrumb */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>{title}</span>
          {isGuestReadOnly && (
            <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              Read-Only
            </span>
          )}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Zone 2 & 3: Actions & Controls */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-56 lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags, properties, pegs..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Visitor Access Link Shortcut - Only for Admins & Agents, NOT Guest Read-Only */}
        {!isGuestReadOnly && (
          <button
            onClick={onOpenVisitorModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            title="Create or manage visitor sign-in codes & access links"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Invite Links</span>
          </button>
        )}

        {/* Role Switcher - Hidden for Guest Read-Only */}
        {!isGuestReadOnly && (
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-xs cursor-pointer ${
                isAdmin
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-500/60'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              title="Switch user role to test Admin-only permissions"
            >
              {isAdmin ? (
                <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              )}
              <span className="hidden sm:inline">Role:</span>
              <span className="font-semibold capitalize text-slate-900 dark:text-white">{currentUser.role}</span>
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Switch Simulated User
                </div>
                <div className="py-1 space-y-1">
                  {teamMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setCurrentUser(member);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                        currentUser.id === member.id
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate font-medium">{member.name}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{member.email}</div>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                          member.role === 'admin'
                            ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {member.role}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="px-2 py-1.5 mt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  Only Admins can generate reports, create new keys, and manage permissions.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary Action Button: Checkout Key or Read-Only Badge */}
        {isGuestReadOnly ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Read-Only Keys Mode</span>
          </div>
        ) : (
          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold text-xs rounded-lg shadow-sm transition-all active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-white" />
            <span>Checkout Key</span>
          </button>
        )}
      </div>
    </header>
  );
};
