import React, { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  UserCheck,
  Eye,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/exportUtils';
import { InviteAccessLevel } from '../../types';

export const VisitorAccessModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    visitorCodes,
    createVisitorCode,
    deleteVisitorCode,
    loginWithInviteCode,
    keys,
    properties,
  } = useApp();

  const [label, setLabel] = useState('');
  const [role, setRole] = useState<InviteAccessLevel>('agent');
  const [isPermanent, setIsPermanent] = useState(true);
  const [expiryDays, setExpiryDays] = useState(7);
  const [notes, setNotes] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Visitor portal preview test mode
  const [previewingCode, setPreviewingCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    createVisitorCode({
      label: label.trim(),
      role,
      isPermanent,
      expiresInDays: isPermanent ? undefined : expiryDays,
      notes: notes.trim(),
    });

    setLabel('');
    setNotes('');
  };

  const copyLink = (code: string, id: string) => {
    const clean = code.replace(/[^0-9]/g, '');
    const url = `${window.location.origin}${window.location.pathname}?invite=${clean}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleTestPass = (code: string) => {
    const res = loginWithInviteCode(code);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-[#00a2ea] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Create Invite Link & Access Codes</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate shareable links and 6-digit codes for Agents and Guests with distinct access levels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Active Codes List */}
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Active Invite Links & Passes ({visitorCodes.length})
            </div>

            <div className="space-y-2.5">
              {visitorCodes.map((pass) => (
                <div
                  key={pass.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-base font-bold text-cyan-600 dark:text-cyan-400 bg-white dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/30">
                        {pass.code}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{pass.label}</span>

                      {/* Access Level Badge */}
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                          pass.role === 'agent'
                            ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-500/30'
                            : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30'
                        }`}
                      >
                        {pass.role === 'agent' ? 'Agent (Checkout Access)' : 'Guest (Read-Only)'}
                      </span>

                      {pass.isPermanent ? (
                        <span className="text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          Permanent
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                          Expires: {formatDateTime(pass.expiresAt || undefined)}
                        </span>
                      )}
                    </div>

                    {pass.notes && (
                      <div className="text-slate-600 dark:text-slate-400 italic text-[11px]">{pass.notes}</div>
                    )}
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      Created by {pass.createdBy} · Used {pass.accessCount} time(s)
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyLink(pass.code, pass.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg font-medium transition-colors shadow-2xs cursor-pointer"
                    >
                      {copiedId === pass.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTestPass(pass.code)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded-lg transition-colors font-semibold cursor-pointer"
                      title="Test this pass in the app"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteVisitorCode(pass.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 cursor-pointer"
                      title="Delete code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {visitorCodes.length === 0 && (
                <div className="text-center py-6 text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                  No active invite links found. Create one below.
                </div>
              )}
            </div>
          </div>

          {/* New Invite Form */}
          <form onSubmit={handleCreate} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="font-bold text-slate-900 dark:text-white text-xs">
              Generate New Invite Link & Access Code
            </div>

            {/* Access Level Selector */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1.5">
                Target Access Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    role === 'agent'
                      ? 'bg-cyan-50/70 dark:bg-cyan-950/30 border-[#00a2ea] dark:border-cyan-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="accessRole"
                    checked={role === 'agent'}
                    onChange={() => setRole('agent')}
                    className="mt-1 accent-[#00a2ea]"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#00a2ea]" />
                      <span>Estate Agent (Operational)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Full key operational privileges: Can check out keys, return keys, and view custody logs. Admin settings & reports locked.
                    </p>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    role === 'guest'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="accessRole"
                    checked={role === 'guest'}
                    onChange={() => setRole('guest')}
                    className="mt-1 accent-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span>Guest (Read-Only)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Directory & availability view: Can search properties, see peg locations, and view live status. Checkout action disabled.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
                  Invite Label / Recipient
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pam Golding Weekend Viewings"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
                  Retention Duration
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={isPermanent}
                      onChange={() => setIsPermanent(true)}
                      className="accent-[#00a2ea]"
                    />
                    <span>Permanent / Keep for long time</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isPermanent}
                      onChange={() => setIsPermanent(false)}
                      className="accent-[#00a2ea]"
                    />
                    <span>Temporary (7 Days)</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
                Optional Notes & Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Authorized for Penthouse 402 and Unit 12 showings"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Invite Link & Code</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
