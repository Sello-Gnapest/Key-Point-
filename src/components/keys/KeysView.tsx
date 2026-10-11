import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Search,
  ArrowRightCircle,
  ArrowDownLeft,
  User,
  Phone,
  Clock,
  Archive,
  History,
  X,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KeyItem } from '../../types';
import { formatDateTime } from '../../utils/exportUtils';

export const KeysView: React.FC = () => {
  const {
    keys,
    properties,
    searchQuery,
    setSearchQuery,
    setIsAddKeyModalOpen,
    setIsCheckoutModalOpen,
    setPreselectedKeyForCheckout,
    returnKey,
    archiveKey,
    isAdmin,
    currentUser,
    activities,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedKeyForDetails, setSelectedKeyForDetails] = useState<KeyItem | null>(null);
  const [archiveModalKey, setArchiveModalKey] = useState<KeyItem | null>(null);
  const [archiveReason, setArchiveReason] = useState('Lock barrel changed / decommissioned');

  // Active keys only (archived keys are in Archived tab)
  const activeKeys = keys.filter((k) => !k.isArchived);

  // Property lookup map
  const propertyMap = new Map(properties.map((p) => [p.id, p]));

  // Now timestamp for overdue check
  const now = new Date();

  // Filter keys
  const filteredKeys = activeKeys.filter((k) => {
    const prop = propertyMap.get(k.propertyId);
    const matchesSearch =
      searchQuery === '' ||
      k.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.pegLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.currentBorrowerName && k.currentBorrowerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prop && prop.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prop && prop.address.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'All') return true;
    if (statusFilter === 'Available') return k.status === 'Available';
    if (statusFilter === 'Checked Out') return k.status === 'Checked Out';
    if (statusFilter === 'Overdue') {
      return (
        k.status === 'Checked Out' &&
        k.expectedReturnAt &&
        new Date(k.expectedReturnAt) < now
      );
    }
    return true;
  });

  const handleCheckoutKey = (k: KeyItem) => {
    setPreselectedKeyForCheckout(k);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmArchive = () => {
    if (archiveModalKey) {
      archiveKey(archiveModalKey.id, archiveReason);
      setArchiveModalKey(null);
      if (selectedKeyForDetails?.id === archiveModalKey.id) {
        setSelectedKeyForDetails(null);
      }
    }
  };

  // Specific key activity history
  const getKeyHistory = (keyId: string) => {
    return activities.filter((a) => a.keyId === keyId);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tag (H0015, T09), property, or borrower name..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-2xs"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
            {['All', 'Available', 'Checked Out', 'Overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Key Button (Admin Only Requirement) */}
          <button
            onClick={() => {
              if (isAdmin) {
                setIsAddKeyModalOpen(true);
              } else {
                alert('Only Admin users can capture new keys into the system. Switch to Admin role in the top header.');
              }
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2 font-bold text-xs rounded-xl transition-all whitespace-nowrap shadow-xs ${
              isAdmin
                ? 'bg-[#00a2ea] hover:bg-[#0092cc] text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-80'
            }`}
            title={!isAdmin ? 'Admin permission required' : 'Capture new key'}
          >
            <Plus className="w-4 h-4" />
            <span>Capture New Key</span>
            {!isAdmin && (
              <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-300 dark:bg-slate-900 px-1 py-0.5 rounded ml-1">
                Admin
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Keys Table / List View */}
      <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Key Tag</th>
                <th className="py-3.5 px-4">Property & Address</th>
                <th className="py-3.5 px-4">Type & Storage Peg</th>
                <th className="py-3.5 px-4">Current Status & Borrower</th>
                <th className="py-3.5 px-4">Expected Return</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredKeys.map((k) => {
                const prop = propertyMap.get(k.propertyId);
                const isCheckedOut = k.status === 'Checked Out';
                const isOverdue =
                  isCheckedOut && k.expectedReturnAt && new Date(k.expectedReturnAt) < now;

                return (
                  <tr
                    key={k.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer group"
                    onClick={() => setSelectedKeyForDetails(k)}
                  >
                    {/* Key Tag */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-300 group-hover:text-[#00a2ea]">
                          {k.tag}
                        </span>
                        {k.copies > 1 && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {k.copies} sets
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Property */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {prop?.name || 'Unassigned Property'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {prop?.address || '—'}
                      </div>
                    </td>

                    {/* Key Type & Peg */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{k.keyType}</div>
                      <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono font-semibold">{k.pegLocation}</div>
                    </td>

                    {/* Status & Borrower Name Prominently Displayed! */}
                    <td className="py-3 px-4">
                      {isCheckedOut ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isOverdue ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                            />
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {k.currentBorrowerName || 'Staff Member'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {k.currentBorrowerCompany ? `${k.currentBorrowerCompany} · ` : ''}
                            {k.currentBorrowerPhone || 'No contact'}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="font-medium text-emerald-700 dark:text-emerald-400">
                            Available in Peg
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Expected Return */}
                    <td className="py-3 px-4">
                      {isCheckedOut ? (
                        <div>
                          <div
                            className={`font-mono text-xs ${
                              isOverdue ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {formatDateTime(k.expectedReturnAt)}
                          </div>
                          {isOverdue && (
                            <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider">
                              OVERDUE
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {currentUser.role === 'visitor' ? (
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                            {isCheckedOut ? 'In Custody' : 'Available'}
                          </span>
                        ) : (
                          <>
                            {isCheckedOut ? (
                              <button
                                onClick={() => returnKey({ keyId: k.id, notes: 'Returned via keys list' })}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                                <span>Return</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCheckoutKey(k)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <ArrowRightCircle className="w-3.5 h-3.5" />
                                <span>Checkout</span>
                              </button>
                            )}

                            {isAdmin && (
                              <button
                                onClick={() => {
                                  setArchiveModalKey(k);
                                  setArchiveReason('Key retired or property sold');
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Archive key"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredKeys.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <KeyRound className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <div className="font-medium text-xs">No keys matching the filter criteria.</div>
            </div>
          )}
        </div>
      </div>

      {/* Key Details Drawer/Modal */}
      {selectedKeyForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-[#00a2ea] flex items-center justify-center font-mono font-bold text-sm">
                  {selectedKeyForDetails.tag}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Key Tag: {selectedKeyForDetails.tag}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {propertyMap.get(selectedKeyForDetails.propertyId)?.name || 'Property'} · {selectedKeyForDetails.keyType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedKeyForDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  selectedKeyForDetails.status === 'Checked Out'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                }`}
              >
                <div>
                  <div className="font-bold text-sm">Status: {selectedKeyForDetails.status}</div>
                  <div className="text-[11px] mt-0.5">
                    Storage Peg: <strong>{selectedKeyForDetails.pegLocation}</strong>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold">
                  {selectedKeyForDetails.copies} set(s)
                </span>
              </div>

              {/* Borrower Details Section (Prominently displayed) */}
              {selectedKeyForDetails.status === 'Checked Out' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Allocated Borrower Information</span>
                  </div>

                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedKeyForDetails.currentBorrowerName || 'Staff Member'}
                    {selectedKeyForDetails.currentBorrowerCompany && (
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1.5">
                        ({selectedKeyForDetails.currentBorrowerCompany})
                      </span>
                    )}
                  </div>

                  {selectedKeyForDetails.currentBorrowerPhone && (
                    <div className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 text-xs">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedKeyForDetails.currentBorrowerPhone}</span>
                    </div>
                  )}

                  <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Checked out: {formatDateTime(selectedKeyForDetails.checkedOutAt)}</span>
                  </div>
                  {selectedKeyForDetails.expectedReturnAt && (
                    <div className="text-amber-700 dark:text-amber-400 font-semibold text-xs">
                      Due back: {formatDateTime(selectedKeyForDetails.expectedReturnAt)}
                    </div>
                  )}

                  {selectedKeyForDetails.checkoutNotes && (
                    <div className="text-slate-600 dark:text-slate-400 italic text-[11px] pt-1">
                      Notes: {selectedKeyForDetails.checkoutNotes}
                    </div>
                  )}
                </div>
              )}

              {/* Key Activity History for this key */}
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-xs mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Handover History for Tag {selectedKeyForDetails.tag}</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {getKeyHistory(selectedKeyForDetails.id).length === 0 ? (
                    <div className="text-slate-400 italic text-[11px]">No activity history logged.</div>
                  ) : (
                    getKeyHistory(selectedKeyForDetails.id).map((act) => (
                      <div
                        key={act.id}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 text-[11px] flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-200 capitalize">
                            {act.action}:{' '}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">{act.personName}</span>
                          {act.notes && (
                            <span className="text-slate-400 italic block text-[10px]">
                              "{act.notes}"
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 text-[10px]">
                          {formatDateTime(act.timestamp)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              {selectedKeyForDetails.status === 'Checked Out' ? (
                <button
                  onClick={() => {
                    returnKey({ keyId: selectedKeyForDetails.id, notes: 'Returned via details modal' });
                    setSelectedKeyForDetails(null);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Return Key Now</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleCheckoutKey(selectedKeyForDetails);
                    setSelectedKeyForDetails(null);
                  }}
                  className="px-3.5 py-2 bg-[#00a2ea] hover:bg-[#0092cc] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <ArrowRightCircle className="w-3.5 h-3.5" />
                  <span>Checkout This Key</span>
                </button>
              )}

              <button
                onClick={() => setSelectedKeyForDetails(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {archiveModalKey && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center">
                <Archive className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Archive Key Tag {archiveModalKey.tag}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{archiveModalKey.pegLocation}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Archiving a key retires it from the active cabinet. Historical check-in and checkout reports will be permanently preserved.
            </p>

            <div className="mt-4 space-y-1.5 text-xs">
              <label className="text-slate-700 dark:text-slate-400 font-semibold">Archive Reason</label>
              <select
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Lock barrel changed / decommissioned">Lock barrel changed / decommissioned</option>
                <option value="Property sold or mandate finished">Property sold or mandate finished</option>
                <option value="Key lost / replacement cut">Key lost / replacement cut</option>
                <option value="Returned permanently to landlord">Returned permanently to landlord</option>
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setArchiveModalKey(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                Archive Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
