import React, { useState } from 'react';
import { X, KeyRound, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KeyType } from '../../types';

export const AddKeyModal: React.FC = () => {
  const {
    properties,
    addKey,
    isAddKeyModalOpen,
    setIsAddKeyModalOpen,
  } = useApp();

  const activeProperties = properties.filter((p) => !p.isArchived);

  const [tag, setTag] = useState('');
  const [propertyId, setPropertyId] = useState(activeProperties[0]?.id || '');
  const [keyType, setKeyType] = useState<KeyType>('Front Door');
  const [pegLocation, setPegLocation] = useState('Hook A-01');
  const [copies, setCopies] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isAddKeyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim() || !propertyId) return;

    addKey({
      tag: tag.trim().toUpperCase(),
      propertyId,
      keyType,
      pegLocation: pegLocation.trim(),
      copies: Number(copies) || 1,
      notes: notes.trim(),
    });

    // Reset and close
    setTag('');
    setNotes('');
    setIsAddKeyModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-[#00a2ea] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Capture New Property Key</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tag and register physical key into the system</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddKeyModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
              Key Tag Identifier Code (e.g. H0015, T09, M016)
            </label>
            <input
              type="text"
              placeholder="e.g. H0015"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono font-bold uppercase tracking-wider"
              required
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Associated Property</label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            >
              {activeProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.address}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Key Type</label>
              <select
                value={keyType}
                onChange={(e) => setKeyType(e.target.value as KeyType)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Front Door">Front Door</option>
                <option value="Master Key">Master Key</option>
                <option value="Back Door">Back Door</option>
                <option value="Security Gate">Security Gate</option>
                <option value="Garage / Remote">Garage / Remote</option>
                <option value="Mailbox">Mailbox</option>
                <option value="Full Set">Full Set</option>
                <option value="Storage / Utility">Storage / Utility</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Peg / Cabinet Location</label>
              <input
                type="text"
                placeholder="e.g. Hook A-14"
                value={pegLocation}
                onChange={(e) => setPegLocation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Copies / Sets Count</label>
            <input
              type="number"
              min={1}
              max={10}
              value={copies}
              onChange={(e) => setCopies(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Optional Notes</label>
            <input
              type="text"
              placeholder="e.g. Includes gate remote and security fob"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddKeyModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Capture Key</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
