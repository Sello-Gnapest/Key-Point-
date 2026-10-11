import React, { useState } from 'react';
import { X, Users, Plus, Building, Phone, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PersonRole } from '../../types';

export const AddPersonModal: React.FC = () => {
  const { addPerson, isAddPersonModalOpen, setIsAddPersonModalOpen } = useApp();

  const [name, setName] = useState('');
  const [company, setCompany] = useState(''); // Optional!
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<PersonRole>('Estate Agent');

  if (!isAddPersonModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addPerson({
      name: name.trim(),
      company: company.trim() || undefined, // Optional company as requested!
      phone: phone.trim(),
      email: email.trim() || undefined,
      role,
    });

    setName('');
    setCompany('');
    setPhone('');
    setEmail('');
    setIsAddPersonModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Person / Contact</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Register agent, contractor, or tenant</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddPersonModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Jordan Vance or Emily Taylor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold"
              required
            />
          </div>

          {/* User Request: "Also when I add people give me an optional option to type the companys name they are from" */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 dark:text-slate-300 font-semibold">Company Name</label>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </div>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Apex Realty, Blue Horizon, or Sparkle Clean"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank if the person is an independent contractor, tenant, or visitor.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="e.g. +27 82 555 0192"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Role / Affiliation</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as PersonRole)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Estate Agent">Estate Agent</option>
                <option value="Contractor">Contractor</option>
                <option value="Tenant">Tenant</option>
                <option value="Inspector">Inspector</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Property Manager">Property Manager</option>
                <option value="Appraiser">Appraiser</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Email Address (Optional)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. jordan.vance@apexrealty.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddPersonModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Contact</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
