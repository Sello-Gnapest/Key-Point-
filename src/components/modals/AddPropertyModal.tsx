import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';

export const AddPropertyModal: React.FC = () => {
  const { addProperty, isAddPropertyModalOpen, setIsAddPropertyModalOpen } = useApp();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<Property['type']>('Apartment');
  const [unitNumber, setUnitNumber] = useState('');
  const [notes, setNotes] = useState('');

  if (!isAddPropertyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    addProperty({
      name: name.trim(),
      address: address.trim(),
      type,
      unitNumber: unitNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setName('');
    setAddress('');
    setUnitNumber('');
    setNotes('');
    setIsAddPropertyModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-[#0082f4] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Property</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Register new building, residence or unit</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddPropertyModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
              Property Name / Building Title
            </label>
            <input
              type="text"
              placeholder="e.g. Oakwood Heights Villa 101"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold"
              required
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Full Street Address</label>
            <input
              type="text"
              placeholder="e.g. 101 Oakwood Boulevard, Pinecrest Valley"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Property['type'])}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Commercial">Commercial</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Unit Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Unit 4B or Villa 101"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Access Notes / Security Details</label>
            <input
              type="text"
              placeholder="e.g. Intercom buzzer 42, lockbox code at main entrance gate"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddPropertyModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Property</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
