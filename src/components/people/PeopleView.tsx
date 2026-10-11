import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Building,
  Phone,
  Mail,
  Archive,
  Trash2,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Person } from '../../types';

export const PeopleView: React.FC = () => {
  const {
    people,
    keys,
    searchQuery,
    setSearchQuery,
    setIsAddPersonModalOpen,
    archivePerson,
    deletePerson,
    setSelectedKeyId,
    setCurrentTab,
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [deleteConfirmPerson, setDeleteConfirmPerson] = useState<Person | null>(null);

  // Active people only
  const activePeople = people.filter((p) => !p.isArchived);

  // Filter
  const filteredPeople = activePeople.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.company && p.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Helper: Find keys currently held by a person
  const getKeysHeldByPerson = (personId: string) => {
    return keys.filter(
      (k) => !k.isArchived && k.status === 'Checked Out' && k.currentBorrowerId === personId
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, or phone number..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-2xs"
            />
          </div>

          {/* Role Filter */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
            {['All', 'Estate Agent', 'Contractor', 'Inspector', 'Cleaner'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  roleFilter === role
                    ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAddPersonModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold text-xs rounded-xl transition-all shadow-xs whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Person</span>
        </button>
      </div>

      {/* People Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPeople.map((person) => {
          const heldKeys = getKeysHeldByPerson(person.id);

          return (
            <div
              key={person.id}
              className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20 shrink-0">
                      {person.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{person.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">{person.role}</span>
                        {person.company && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1 font-medium truncate">
                              <Building className="w-3 h-3 text-slate-400" />
                              <span>{person.company}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Archive Button */}
                    <button
                      onClick={() => archivePerson(person.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                      title="Archive person (preserve historical checkout logs)"
                    >
                      <Archive className="w-4 h-4" />
                    </button>

                    {/* Delete Option */}
                    <button
                      onClick={() => setDeleteConfirmPerson(person)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                      title="Permanently delete person"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{person.phone}</span>
                  </div>
                  {person.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 dark:text-slate-400 truncate">{person.email}</span>
                    </div>
                  )}
                </div>

                {/* Currently Borrowed Keys Badge */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Currently Holding Keys:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                        heldKeys.length > 0
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {heldKeys.length} {heldKeys.length === 1 ? 'key' : 'keys'}
                    </span>
                  </div>

                  {heldKeys.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {heldKeys.map((k) => (
                        <button
                          key={k.id}
                          onClick={() => {
                            setSelectedKeyId(k.id);
                            setCurrentTab('keys');
                          }}
                          className="flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-amber-200 dark:border-amber-500/40 rounded-lg text-xs font-mono font-bold text-amber-800 dark:text-amber-300 transition-colors"
                          title="Click to view key details in Keys view"
                        >
                          <KeyRound className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>{k.tag}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <Users className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300">No people found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or add a new person.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmPerson && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Person</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{deleteConfirmPerson.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Are you sure you want to permanently delete this person? If you prefer to keep their contact for historical checkout logs, select <strong>Archive</strong> instead.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteConfirmPerson(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  archivePerson(deleteConfirmPerson.id);
                  setDeleteConfirmPerson(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors shadow-xs"
              >
                Archive Instead
              </button>
              <button
                onClick={() => {
                  deletePerson(deleteConfirmPerson.id);
                  setDeleteConfirmPerson(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
