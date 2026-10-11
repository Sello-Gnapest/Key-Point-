import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { PropertiesView } from './components/properties/PropertiesView';
import { KeysView } from './components/keys/KeysView';
import { PeopleView } from './components/people/PeopleView';
import { ActivityView } from './components/activity/ActivityView';
import { ReportsView } from './components/reports/ReportsView';
import { ArchivedView } from './components/archived/ArchivedView';
import { SettingsView } from './components/settings/SettingsView';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { AddKeyModal } from './components/modals/AddKeyModal';
import { AddPropertyModal } from './components/modals/AddPropertyModal';
import { AddPersonModal } from './components/modals/AddPersonModal';
import { VisitorAccessModal } from './components/visitor/VisitorAccessModal';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { UserCheck, Eye, LogOut, ShieldAlert } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentTab, isAuthenticated, activeVisitorSession, exitVisitorSession } = useApp();
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);

  // If not authenticated, render Admin Login Page
  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  const isAgentSession = activeVisitorSession?.role === 'agent';
  const isGuestSession = activeVisitorSession && activeVisitorSession.role !== 'agent';

  return (
    <div className="min-h-screen bg-[#f3f6f9] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased selection:bg-cyan-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onOpenVisitorModal={() => setIsVisitorModalOpen(true)} />

        {/* Active Invite / Guest Pass Status Banner */}
        {activeVisitorSession && (
          <div
            className={`px-6 py-2.5 border-b text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-colors ${
              isAgentSession
                ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2.5 flex-wrap">
              <div
                className={`p-1 rounded-md ${
                  isAgentSession
                    ? 'bg-cyan-200/70 dark:bg-cyan-800/80 text-cyan-800 dark:text-cyan-200'
                    : 'bg-emerald-200/70 dark:bg-emerald-800/80 text-emerald-800 dark:text-emerald-200'
                }`}
              >
                {isAgentSession ? <UserCheck className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>

              <div>
                <span className="font-bold">
                  {isAgentSession ? 'Estate Agent Access' : 'Guest Read-Only Pass'}:
                </span>{' '}
                <span>{activeVisitorSession.label}</span>{' '}
                <span className="font-mono font-semibold px-1.5 py-0.5 rounded bg-white/70 dark:bg-black/30 border border-current text-[11px]">
                  Code: {activeVisitorSession.code}
                </span>
              </div>

              <div className="hidden lg:inline-flex items-center gap-1.5 text-[11px] opacity-80 border-l border-current/30 pl-2.5">
                {isAgentSession ? (
                  <span>✓ Check out & return keys allowed · ✕ Admin settings locked</span>
                ) : (
                  <span>✓ Real-time directory lookup · ✕ Key checkout disabled</span>
                )}
              </div>
            </div>

            <button
              onClick={exitVisitorSession}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 font-semibold text-[11px] border border-current/20 transition-colors cursor-pointer shrink-0"
              title="End session and return to sign in"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Session</span>
            </button>
          </div>
        )}

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && <DashboardView />}
          {currentTab === 'properties' && <PropertiesView />}
          {currentTab === 'keys' && <KeysView />}
          {currentTab === 'people' && <PeopleView />}
          {currentTab === 'activity' && <ActivityView />}
          {currentTab === 'reports' && <ReportsView />}
          {currentTab === 'archived' && <ArchivedView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <CheckoutModal />
      <AddKeyModal />
      <AddPropertyModal />
      <AddPersonModal />
      <VisitorAccessModal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
