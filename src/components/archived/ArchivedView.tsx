import React, { useState } from 'react';
import {
  Archive,
  Building2,
  KeyRound,
  Users,
  RotateCcw,
  ShieldCheck,
  Building,
  Phone,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/exportUtils';

export const ArchivedView: React.FC = () => {
  const {
    properties,
    keys,
    people,
    restoreProperty,
    restoreKey,
    restorePerson,
    deleteProperty,
    deleteKey,
    deletePerson,
    isAdmin,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'properties' | 'keys' | 'people'>('properties');

  const archivedProperties = properties.filter((p) => p.isArchived);
  const archivedKeys = keys.filter((k) => k.isArchived);
  const archivedPeople = people.filter((p) => p.isArchived);

  const propertyMap = new Map(properties.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      {/* Guiding Guarantee Banner */}
      <div className="bg-cyan-50/80 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/30 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-[#00a2ea] dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              Data Integrity Guarantee: Audit History Is Preserved
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
              Properties and contacts archived due to sales, lease terminations, or retirement remain permanently accessible in historical activity and handover reports.
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Subtabs: Properties, Keys, People */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'properties'
              ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Archived Properties ({archivedProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('keys')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'keys'
              ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Archived Keys ({archivedKeys.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('people')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'people'
              ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Archived People ({archivedPeople.length})</span>
        </button>
      </div>

      {/* Tab 1: Archived Properties */}
      {activeTab === 'properties' && (
        <div className="space-y-3">
          {archivedProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase text-[11px]">{prop.type}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">{prop.name}</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 mt-0.5">{prop.address}</div>
                <div className="text-amber-700 dark:text-amber-400/90 mt-1">
                  Archived reason: {prop.archivedReason || 'Property sold or leased out'} · {formatDateTime(prop.archivedAt)}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => restoreProperty(prop.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40 rounded-xl font-semibold transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Property</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`Permanently delete "${prop.name}"? Only do this if created by error.`)) {
                        deleteProperty(prop.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                    title="Permanent purge (Admin only)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {archivedProperties.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 shadow-2xs">
              <Archive className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <div className="text-xs">No archived properties in record. Active properties appear under Properties tab.</div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Archived Keys */}
      {activeTab === 'keys' && (
        <div className="space-y-3">
          {archivedKeys.map((k) => {
            const prop = propertyMap.get(k.propertyId);
            return (
              <div
                key={k.id}
                className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-400">{k.tag}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{prop?.name || 'Property'}</span>
                    <span className="text-slate-500 dark:text-slate-400">({k.keyType})</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">Peg: {k.pegLocation}</div>
                  <div className="text-amber-700 dark:text-amber-400/90 mt-1">
                    Archived: {k.archivedReason || 'Lock barrel retired'} · {formatDateTime(k.archivedAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => restoreKey(k.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40 rounded-xl font-semibold transition-colors shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Key</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`Permanently delete tag ${k.tag}?`)) {
                          deleteKey(k.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                      title="Permanent purge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {archivedKeys.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 shadow-2xs">
              <KeyRound className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <div className="text-xs">No keys currently archived.</div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Archived People */}
      {activeTab === 'people' && (
        <div className="space-y-3">
          {archivedPeople.map((person) => (
            <div
              key={person.id}
              className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-base">{person.name}</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold">({person.role})</span>
                </div>
                {person.company && (
                  <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>{person.company}</span>
                  </div>
                )}
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{person.phone}</span>
                </div>
                <div className="text-amber-700 dark:text-amber-400/90 mt-1">
                  Archived at: {formatDateTime(person.archivedAt)} · Past handover activity preserved
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => restorePerson(person.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40 rounded-xl font-semibold transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Contact</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`Permanently remove contact "${person.name}"?`)) {
                        deletePerson(person.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                    title="Permanent purge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {archivedPeople.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 shadow-2xs">
              <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <div className="text-xs">No contacts archived.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
