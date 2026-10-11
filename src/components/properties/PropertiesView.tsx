import React, { useState } from 'react';
import {
  Building2,
  KeyRound,
  Plus,
  Archive,
  Search,
  ChevronRight,
  Phone,
  Building,
  ArrowRightCircle,
  ArrowDownLeft,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, KeyItem } from '../../types';
import { formatDateTime } from '../../utils/exportUtils';

export const PropertiesView: React.FC = () => {
  const {
    properties,
    keys,
    searchQuery,
    setSearchQuery,
    setIsAddPropertyModalOpen,
    archiveProperty,
    setIsCheckoutModalOpen,
    setPreselectedKeyForCheckout,
    returnKey,
  } = useApp();

  // Selected property for detailed drawer/modal
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [archiveModalProp, setArchiveModalProp] = useState<Property | null>(null);
  const [archiveReason, setArchiveReason] = useState('Property sold / deeds transferred');

  // Active properties only
  const activeProperties = properties.filter((p) => !p.isArchived);

  // Filter properties
  const filteredProperties = activeProperties.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  // Helper: Keys belonging to a property
  const getKeysForProperty = (propId: string): KeyItem[] => {
    return keys.filter((k) => k.propertyId === propId && !k.isArchived);
  };

  const handleCheckoutFromProperty = (key: KeyItem) => {
    setPreselectedKeyForCheckout(key);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmArchive = () => {
    if (archiveModalProp) {
      archiveProperty(archiveModalProp.id, archiveReason);
      setArchiveModalProp(null);
      if (selectedProp?.id === archiveModalProp.id) {
        setSelectedProp(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Type Filter & Add Property */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search property name, address, or suburb..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-2xs"
            />
          </div>

          {/* Property Type Filter Tabs */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
            {['All', 'Apartment', 'House', 'Commercial', 'Villa', 'Townhouse'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterType === type
                    ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAddPropertyModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold text-xs rounded-xl transition-all shadow-xs whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProperties.map((prop) => {
          const propKeys = getKeysForProperty(prop.id);
          const inUseKeys = propKeys.filter((k) => k.status === 'Checked Out');
          const availableKeys = propKeys.filter((k) => k.status === 'Available');

          return (
            <div
              key={prop.id}
              className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with Type & Archive */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      {prop.type} {prop.unitNumber ? `• Unit ${prop.unitNumber}` : ''}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 truncate group-hover:text-[#00a2ea] transition-colors">
                      {prop.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setArchiveModalProp(prop);
                      setArchiveReason('Property sold or rented out');
                    }}
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Archive property (e.g. sold or rented out)"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{prop.address}</p>

                {/* Key Status Overview Bar for this property */}
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60 text-xs">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <KeyRound className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                      <span>{propKeys.length} Registered Keys</span>
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      {availableKeys.length} available · {inUseKeys.length} out
                    </span>
                  </div>

                  {/* Registered Keys List with Prominent Borrower Names */}
                  <div className="space-y-1.5 mt-2">
                    {propKeys.length === 0 ? (
                      <div className="text-[11px] text-slate-400 italic py-1">
                        No keys tagged yet for this property.
                      </div>
                    ) : (
                      propKeys.map((k) => (
                        <div
                          key={k.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-950/60 text-[11px] border border-slate-200/70 dark:border-slate-800/60 shadow-2xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300">{k.tag}</span>
                            <span className="text-slate-500 dark:text-slate-400">({k.keyType})</span>
                          </div>

                          {/* Requirement: prominently display who has the key */}
                          {k.status === 'Checked Out' ? (
                            <span className="text-amber-700 dark:text-amber-300 font-semibold truncate ml-2 text-right">
                              Out to <strong className="text-amber-800 dark:text-amber-200">{k.currentBorrowerName || 'Staff'}</strong>
                              {k.currentBorrowerCompany ? ` (${k.currentBorrowerCompany})` : ''}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium ml-2">
                              {k.pegLocation} (Available)
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action: Open Property Details Modal */}
              <button
                onClick={() => setSelectedProp(prop)}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-slate-800 text-xs font-semibold transition-colors shadow-2xs"
              >
                <span>View Full Key Handover Details</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <Building2 className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300">No properties found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or add a new property.</p>
        </div>
      )}

      {/* Property Key Details Drawer/Modal */}
      {selectedProp && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  {selectedProp.type} {selectedProp.unitNumber ? `• Unit ${selectedProp.unitNumber}` : ''}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{selectedProp.name}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedProp.address}</p>
              </div>
              <button
                onClick={() => setSelectedProp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
              {selectedProp.notes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-slate-200">Property Notes: </span>
                  {selectedProp.notes}
                </div>
              )}

              {/* Registered Keys with Full Borrower Information */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#00a2ea]" />
                    <span>Registered Property Keys ({getKeysForProperty(selectedProp.id).length})</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {getKeysForProperty(selectedProp.id).map((k) => (
                    <div
                      key={k.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">{k.tag}</span>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">({k.keyType})</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 dark:text-slate-400">{k.pegLocation}</span>
                        </div>

                        {/* Direct prominent display of who has the key */}
                        {k.status === 'Checked Out' ? (
                          <div className="space-y-0.5 pt-1">
                            <div className="text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                              <span>Currently held by:</span>
                              <span className="text-slate-900 dark:text-white font-bold underline decoration-amber-500/50">
                                {k.currentBorrowerName || 'Staff Member'}
                              </span>
                              {k.currentBorrowerCompany && (
                                <span className="text-slate-500 dark:text-slate-400 font-normal">
                                  ({k.currentBorrowerCompany})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                              {k.currentBorrowerPhone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{k.currentBorrowerPhone}</span>
                                </span>
                              )}
                              <span>·</span>
                              <span>Out since: {formatDateTime(k.checkedOutAt)}</span>
                              {k.expectedReturnAt && (
                                <>
                                  <span>·</span>
                                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                                    Due: {formatDateTime(k.expectedReturnAt)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-emerald-700 dark:text-emerald-400 font-medium pt-0.5">
                            Available in storage ({k.pegLocation}) · {k.copies} set(s) on ring
                          </div>
                        )}
                      </div>

                      {/* Quick Handover Button */}
                      <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                        {k.status === 'Checked Out' ? (
                          <button
                            onClick={() => {
                              returnKey({ keyId: k.id, notes: 'Returned via property details view' });
                            }}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 rounded-xl font-semibold transition-colors"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>Return Key</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCheckoutFromProperty(k)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#00a2ea] hover:bg-[#0092cc] text-white rounded-xl font-bold transition-colors shadow-xs"
                          >
                            <ArrowRightCircle className="w-3.5 h-3.5" />
                            <span>Checkout</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <button
                onClick={() => {
                  setArchiveModalProp(selectedProp);
                }}
                className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium flex items-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive This Property</span>
              </button>
              <button
                onClick={() => setSelectedProp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Property Confirmation Modal */}
      {archiveModalProp && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center">
                <Archive className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Archive Property</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{archiveModalProp.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Archiving a property marks it as sold or leased. As required, its past check-in/check-out history will be preserved intact.
            </p>

            <div className="mt-4 space-y-1.5 text-xs">
              <label className="text-slate-700 dark:text-slate-400 font-semibold">Archive Reason / Notes</label>
              <select
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Property sold / deeds transferred">Property sold / deeds transferred</option>
                <option value="Rented out long-term (tenant holds keys)">Rented out long-term (tenant holds keys)</option>
                <option value="Withdrawn from estate agency mandate">Withdrawn from estate agency mandate</option>
                <option value="Under full renovation / lock replaced">Under full renovation / lock replaced</option>
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setArchiveModalProp(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                Archive Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
