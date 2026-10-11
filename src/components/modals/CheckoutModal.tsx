import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  User,
  Plus,
  Calendar,
  Building,
  Phone,
  ArrowRightCircle,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KeyItem, PersonRole } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    keys,
    properties,
    people,
    checkoutKey,
    addPerson,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    preselectedKeyForCheckout,
    setPreselectedKeyForCheckout,
  } = useApp();

  // Active keys available for checkout
  const availableKeys = keys.filter((k) => !k.isArchived && k.status === 'Available');
  const propertyMap = new Map(properties.map((p) => [p.id, p]));

  // Selected key
  const [selectedKeyId, setSelectedKeyId] = useState<string>('');

  // Selected borrower
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');

  // Expected return time (defaults to today 17:00 or tomorrow)
  const [expectedReturnTime, setExpectedReturnTime] = useState(() => {
    const d = new Date();
    d.setHours(17, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  const [notes, setNotes] = useState('');

  // Inline "Add New Person" form mode (requirement: "I want to add a feature to add people when I checkout a key")
  const [isAddingNewPerson, setIsAddingNewPerson] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState(''); // Optional!
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<PersonRole>('Estate Agent');

  useEffect(() => {
    if (preselectedKeyForCheckout) {
      setSelectedKeyId(preselectedKeyForCheckout.id);
    } else if (availableKeys.length > 0 && !selectedKeyId) {
      setSelectedKeyId(availableKeys[0].id);
    }
  }, [preselectedKeyForCheckout, availableKeys, selectedKeyId]);

  useEffect(() => {
    if (people.length > 0 && !selectedPersonId) {
      const activeP = people.filter((p) => !p.isArchived);
      if (activeP.length > 0) {
        setSelectedPersonId(activeP[0].id);
      }
    }
  }, [people, selectedPersonId]);

  if (!isCheckoutModalOpen) return null;

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setPreselectedKeyForCheckout(null);
    setIsAddingNewPerson(false);
  };

  const handleCreateAndSelectPerson = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert('Please enter at least a name and phone number.');
      return;
    }

    const created = addPerson({
      name: newName.trim(),
      company: newCompany.trim() || undefined, // Optional!
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      role: newRole,
    });

    setSelectedPersonId(created.id);
    setIsAddingNewPerson(false);
    setNewName('');
    setNewCompany('');
    setNewPhone('');
    setNewEmail('');
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKeyId || !selectedPersonId) return;

    checkoutKey({
      keyId: selectedKeyId,
      personId: selectedPersonId,
      expectedReturnAt: expectedReturnTime ? new Date(expectedReturnTime).toISOString() : undefined,
      notes: notes.trim() || 'Key checked out for property viewing / service',
    });

    handleClose();
  };

  const activePeople = people.filter((p) => !p.isArchived);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-[#00a2ea] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Checkout Property Key</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Allocate physical key to agent, contractor, or tenant</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitCheckout} className="p-5 space-y-4 text-xs">
          {/* 1. Key Selection */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Select Key to Checkout</label>
            <select
              value={selectedKeyId}
              onChange={(e) => setSelectedKeyId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              required
            >
              {availableKeys.map((k) => {
                const prop = propertyMap.get(k.propertyId);
                return (
                  <option key={k.id} value={k.id}>
                    {k.tag} — {prop?.name || 'Unassigned'} ({k.keyType}) · {k.pegLocation}
                  </option>
                );
              })}
            </select>
            {availableKeys.length === 0 && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                No keys currently available in key cabinet.
              </p>
            )}
          </div>

          {/* 2. Borrower Selection OR Add Person Inline */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 dark:text-slate-300 font-semibold">Allocated To (Person)</label>
              {/* Feature requirement: Add people when checking out a key */}
              <button
                type="button"
                onClick={() => setIsAddingNewPerson(!isAddingNewPerson)}
                className="text-[11px] text-[#00a2ea] hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingNewPerson ? 'Choose Existing Person' : '+ Add Person Now'}</span>
              </button>
            </div>

            {!isAddingNewPerson ? (
              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              >
                {activePeople.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.company ? `(${p.company})` : ''} — {p.role} · {p.phone}
                  </option>
                ))}
              </select>
            ) : (
              /* Inline New Person Registration inside Checkout */
              <div className="p-3.5 bg-cyan-50/70 dark:bg-slate-900 rounded-xl border border-cyan-200 dark:border-slate-800 space-y-2.5 animate-in fade-in">
                <div className="text-[11px] font-bold text-[#00a2ea] flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Register Person During Checkout</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                  {/* Optional company name input */}
                  <input
                    type="text"
                    placeholder="Company Name (Optional)"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as PersonRole)}
                    className="p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Estate Agent">Estate Agent</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Tenant">Tenant</option>
                    <option value="Inspector">Inspector</option>
                    <option value="Cleaner">Cleaner</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleCreateAndSelectPerson}
                  className="w-full py-2 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save & Allocate To {newName ? newName : 'This Person'}</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Expected Return Time */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Expected Return Date & Time</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="datetime-local"
                value={expectedReturnTime}
                onChange={(e) => setExpectedReturnTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* 4. Notes */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Handover Notes / Purpose</label>
            <input
              type="text"
              placeholder="e.g. Weekend client viewings for Herrwood Drive"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableKeys.length === 0}
              className={`px-5 py-2.5 font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
                availableKeys.length > 0
                  ? 'bg-[#00a2ea] hover:bg-[#0092cc] text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ArrowRightCircle className="w-4 h-4" />
              <span>Confirm Key Checkout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
