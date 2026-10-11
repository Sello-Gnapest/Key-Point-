import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  Plus,
  Trash2,
  Copy,
  Check,
  QrCode,
  KeyRound,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, InviteAccessLevel } from '../../types';
import { formatDateTime } from '../../utils/exportUtils';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    teamMembers,
    addTeamMember,
    updateTeamRole,
    deleteTeamMember,
    isAdmin,
    adminCount,
    maxAdmins,
    visitorCodes,
    deleteVisitorCode,
    createVisitorCode,
    resetToDemoData,
  } = useApp();

  // New Team Member Form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('agent');
  const [memberMessage, setMemberMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // New Visitor Code Form
  const [visitorLabel, setVisitorLabel] = useState('');
  const [visitorRole, setVisitorRole] = useState<InviteAccessLevel>('agent');
  const [isPermanent, setIsPermanent] = useState(true);
  const [expiryDays, setExpiryDays] = useState(7);
  const [visitorNotes, setVisitorNotes] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberMessage(null);
    if (!newMemberName || !newMemberEmail) return;

    const result = addTeamMember({
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
    });

    if (!result.success) {
      setMemberMessage({
        text: result.error || 'Failed to add member.',
        isError: true,
      });
      return;
    }

    setMemberMessage({
      text: `Successfully added ${newMemberName} as ${newMemberRole}.`,
      isError: false,
    });
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('agent');
  };

  const handleRoleChange = (memberId: string, role: UserRole) => {
    setMemberMessage(null);
    const result = updateTeamRole(memberId, role);
    if (!result.success) {
      setMemberMessage({
        text: result.error || 'Cannot update role.',
        isError: true,
      });
    } else {
      setMemberMessage({
        text: 'Role updated successfully.',
        isError: false,
      });
    }
  };

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorLabel) return;

    createVisitorCode({
      label: visitorLabel,
      role: visitorRole,
      isPermanent,
      expiresInDays: isPermanent ? undefined : expiryDays,
      notes: visitorNotes,
    });

    setVisitorLabel('');
    setVisitorNotes('');
  };

  const copyVisitorLink = (code: string, id: string) => {
    const cleanCode = code.replace(/[^0-9]/g, '');
    const url = `${window.location.origin}${window.location.pathname}?invite=${cleanCode}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Section 1: Team Access Permissions (Admin Managed) */}
      <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-500" />
              <span>Team Members & System Permissions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enforces role-based permissions with a strict maximum of 2 Admin Users.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                isAdmin
                  ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              Current: {currentUser.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* 2-Admin Enforcement Card */}
        <div className="my-5 p-4 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/25 border border-cyan-200 dark:border-cyan-500/30 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Lock className="w-4 h-4 text-[#00a2ea]" />
              <span>Maximum 2 Admins Enforced</span>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 w-fit">
              {adminCount} / {maxAdmins} Admin Slots Used
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            The system permits a maximum of 2 Administrators. The authorized main users are{' '}
            <strong className="text-slate-900 dark:text-white">sello@gnapest.com</strong> (Sello Ncwani) and{' '}
            <strong className="text-slate-900 dark:text-white">admin@keypoint.com</strong> (Key Point Admin).
            Only Admins can export Excel sheets, capture new keys, and manage team roles.
          </p>
        </div>

        {/* Feedback Alert */}
        {memberMessage && (
          <div
            className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              memberMessage.isError
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {memberMessage.isError ? (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            <span>{memberMessage.text}</span>
          </div>
        )}

        {/* Permission Matrix Summary */}
        <div className="my-5 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="font-semibold text-slate-900 dark:text-slate-200 mb-2">Role Access Control Matrix:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-white dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-800/60 shadow-2xs">
              <div className="font-bold text-cyan-600 dark:text-cyan-400">Admin (2 Max: Sello & Admin)</div>
              <ul className="text-slate-500 dark:text-slate-400 mt-1 space-y-0.5 text-[11px]">
                <li>✓ Full system control</li>
                <li>✓ Generate & export Excel reports</li>
                <li>✓ Manually capture new keys</li>
                <li>✓ Manage team & visitor passes</li>
              </ul>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-800/60 shadow-2xs">
              <div className="font-bold text-amber-600 dark:text-amber-400">Estate Agent / Staff</div>
              <ul className="text-slate-500 dark:text-slate-400 mt-1 space-y-0.5 text-[11px]">
                <li>✓ Checkout & return keys</li>
                <li>✓ Add people during checkout</li>
                <li>✓ Capture after-hours paper logs</li>
                <li>✗ Reports & key creation locked</li>
              </ul>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-800/60 shadow-2xs">
              <div className="font-bold text-slate-700 dark:text-slate-300">Visitor Desk / Viewer</div>
              <ul className="text-slate-500 dark:text-slate-400 mt-1 space-y-0.5 text-[11px]">
                <li>✓ Read-only key lookup</li>
                <li>✓ 6-Digit sign-in pass access</li>
                <li>✗ Handover actions restricted</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="space-y-2 mt-4">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Active Team Members ({teamMembers.length})
          </div>
          {teamMembers.map((member) => {
            const isMemberAdmin = member.role === 'admin';
            return (
              <div
                key={member.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{member.name}</span>
                      {currentUser.id === member.id && (
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-normal bg-cyan-50 dark:bg-cyan-950 px-1.5 rounded border border-cyan-200 dark:border-cyan-800">
                          (You)
                        </span>
                      )}
                      {isMemberAdmin && (
                        <span className="text-[10px] uppercase font-bold text-[#00a2ea] bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/30">
                          Main Admin
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">{member.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                      disabled={member.id === currentUser.id}
                      className="p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 text-xs font-medium focus:outline-none focus:border-cyan-500 capitalize shadow-2xs"
                    >
                      <option value="admin" disabled={!isMemberAdmin && adminCount >= maxAdmins}>
                        Admin {!isMemberAdmin && adminCount >= maxAdmins ? '(Max 2)' : ''}
                      </option>
                      <option value="agent">Estate Agent</option>
                      <option value="visitor">Visitor Desk</option>
                    </select>
                  ) : (
                    <span className="capitalize px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-medium">
                      {member.role}
                    </span>
                  )}

                  {isAdmin && member.id !== currentUser.id && member.email !== 'sello@gnapest.com' && member.email !== 'admin@keypoint.com' && (
                    <button
                      onClick={() => deleteTeamMember(member.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Team Member (Admin Only) */}
        {isAdmin && (
          <form onSubmit={handleAddMember} className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input
              type="text"
              placeholder="Full Name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-xs"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-xs"
              required
            />
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
              className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
            >
              <option value="agent">Estate Agent</option>
              <option value="admin" disabled={adminCount >= maxAdmins}>
                Admin {adminCount >= maxAdmins ? '(Max 2 Admins reached)' : ''}
              </option>
              <option value="visitor">Visitor Desk</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </form>
        )}
      </div>

      {/* Section 2: Visitor Access Links & Sign-In Codes */}
      <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-cyan-500" />
              <span>Visitor Access Links & Sign-In Codes</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Create temporary or permanent sign-in codes for visitors, contractors, or viewing agents. Keep them for a long time or delete them whenever needed.
            </p>
          </div>
        </div>

        {/* Existing Visitor Codes */}
        <div className="space-y-3 mt-5">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Active Visitor Access Passes ({visitorCodes.length})
          </div>
          {visitorCodes.map((pass) => (
            <div
              key={pass.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-base font-bold text-cyan-600 dark:text-cyan-400 bg-white dark:bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/30">
                    {pass.code}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{pass.label}</span>

                  {/* Access Level Badge */}
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                      pass.role === 'agent'
                        ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-500/30'
                        : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30'
                    }`}
                  >
                    {pass.role === 'agent' ? 'Agent (Operational)' : 'Guest (Read-Only)'}
                  </span>

                  {pass.isPermanent ? (
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                      Permanent / Long-Term
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                      Expires: {formatDateTime(pass.expiresAt || undefined)}
                    </span>
                  )}
                </div>
                {pass.notes && <div className="text-slate-600 dark:text-slate-400 mt-1 italic">{pass.notes}</div>}
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Created by {pass.createdBy} · Used {pass.accessCount} time(s)
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyVisitorLink(pass.code, pass.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors font-medium shadow-2xs cursor-pointer"
                >
                  {copiedId === pass.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-300">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Copy Access Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteVisitorCode(pass.id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Revoke / Delete Code"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {visitorCodes.length === 0 && (
            <div className="text-center py-8 text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800">
              No visitor access codes configured. Create one below.
            </div>
          )}
        </div>

        {/* Create New Visitor Code Form */}
        <form onSubmit={handleCreateCode} className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
          <div className="font-bold text-slate-900 dark:text-white text-xs">Create New Invite Pass & Link</div>

          {/* Access Level Selector */}
          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1">Target Access Level</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  visitorRole === 'agent'
                    ? 'bg-cyan-50/70 dark:bg-cyan-950/30 border-[#00a2ea] dark:border-cyan-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="settingsVisitorRole"
                  checked={visitorRole === 'agent'}
                  onChange={() => setVisitorRole('agent')}
                  className="mt-0.5 accent-[#00a2ea]"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Estate Agent (Operational Access)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Can check out & return keys, view custody details, and browse properties.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  visitorRole === 'guest'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="settingsVisitorRole"
                  checked={visitorRole === 'guest'}
                  onChange={() => setVisitorRole('guest')}
                  className="mt-0.5 accent-emerald-500"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Guest (Read-Only Access)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Browse property directory and real-time key availability. Key checkout disabled.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Purpose / Label</label>
              <input
                type="text"
                placeholder="e.g. Weekend Open House Viewings - Chas Everitt"
                value={visitorLabel}
                onChange={(e) => setVisitorLabel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-xs"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Duration / Retention</label>
              <div className="flex items-center gap-3 mt-2">
                <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    checked={isPermanent}
                    onChange={() => setIsPermanent(true)}
                    className="accent-cyan-500"
                  />
                  <span>Keep for a long time (Permanent)</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isPermanent}
                    onChange={() => setIsPermanent(false)}
                    className="accent-cyan-500"
                  />
                  <span>Temporary (7 Days)</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1">Optional Notes</label>
            <input
              type="text"
              placeholder="e.g. Authorized for plumbing inspections on Oakwood Heights"
              value={visitorNotes}
              onChange={(e) => setVisitorNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invite Pass & Code</span>
          </button>
        </form>
      </div>

      {/* Section 3: System Storage & Demo Reset */}
      <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset Demo Database</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Restores the test portfolio of 10 properties, test keys, and the 2 main admins.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset database back to initial estate demonstration portfolio?')) {
              resetToDemoData();
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </div>
  );
};
