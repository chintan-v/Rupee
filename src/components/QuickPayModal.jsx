import React, { useState } from 'react';
import { 
  X, 
  Send, 
  QrCode, 
  Tag, 
  Clock, 
  Sparkles, 
  Check, 
  HelpCircle,
  Building,
  Smartphone,
  User,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES } from '../data/initialData';

export default function QuickPayModal({ isOpen, onClose, onMakePayment }) {
  if (!isOpen) return null;

  const [amount, setAmount] = useState('200');
  const [accountHolder, setAccountHolder] = useState('BALAJI FUELS & SERVICE STATION');
  const [upiId, setUpiId] = useState('balajifuels@okhdfcbank');
  const [note, setNote] = useState('Petrol Bunk');
  const [category, setCategory] = useState('travel');
  const [addNoteLater, setAddNoteLater] = useState(false);
  const [simulate3hAgo, setSimulate3hAgo] = useState(false);

  const quickRecipients = [
    { 
      accountHolder: "BALAJI FUELS & SERVICE STATION", 
      upiId: "balajifuels@okhdfcbank", 
      defaultNote: "Petrol Bunk", 
      category: "travel", 
      short: "Balaji Fuels (Petrol)" 
    },
    { 
      accountHolder: "M/S RAMESH CANTEEN & SNACKS", 
      upiId: "rameshcanteen@okaxis", 
      defaultNote: "Chai & Samosa", 
      category: "food", 
      short: "Campus Canteen" 
    },
    { 
      accountHolder: "SHREE GANESH ENTERPRISES", 
      upiId: "ganeshxerox@ybl", 
      defaultNote: "Lab manual printout", 
      category: "stationary", 
      short: "Ganesh Xerox" 
    },
    { 
      accountHolder: "APOLLO PHARMACIES LTD", 
      upiId: "apolloretail@icici", 
      defaultNote: "Bandage & Paracetamol", 
      category: "medicine", 
      short: "Apollo Pharmacy" 
    }
  ];

  const quickChips = [
    { label: "⛽ Petrol Bunk", category: "travel" },
    { label: "☕ Chai & Snack", category: "food" },
    { label: "📚 Xerox / Notes", category: "stationary" },
    { label: "💊 Medicines", category: "medicine" },
    { label: "🎬 Movie Ticket", category: "entertainment" },
    { label: "🚕 Hostel Cab", category: "travel" }
  ];

  const handleSelectRecipient = (r) => {
    setAccountHolder(r.accountHolder);
    setUpiId(r.upiId);
    if (!addNoteLater) {
      setNote(r.defaultNote);
      setCategory(r.category);
    }
  };

  const handleSelectChip = (chip) => {
    setNote(chip.label);
    setCategory(chip.category);
    setAddNoteLater(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    // If simulate3hAgo is checked or addNoteLater is true, we set timestamp to 3.5 hours ago so user can test the reminder
    const timestamp = (addNoteLater && simulate3hAgo)
      ? new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString()
      : new Date().toISOString();

    const newTx = {
      id: `tx-${Date.now()}`,
      amount: Number(amount),
      accountHolder: accountHolder.trim() || 'MERCHANT RECIPIENT',
      upiId: upiId.trim() || 'payee@upi',
      refId: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      bankAccount: "HDFC A/c **4021",
      note: addNoteLater ? '' : note.trim(),
      category: category,
      timestamp: timestamp,
      status: "completed",
      paymentMethod: "UPI (Google Pay)",
      source: "upi",
      needsNoteReminder: addNoteLater,
      splitId: null
    };

    onMakePayment(newTx);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFCF9] w-full max-w-lg rounded-3xl shadow-2xl border border-[#EBE4D5] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-sky-500 to-sky-400 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">Pay via UPI & Add Note 💸</h3>
              <p className="text-xs text-sky-100">Specify transaction purpose before or after payment</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Quick Payee Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Select or Type Payee
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickRecipients.map((r, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectRecipient(r)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all ${
                    accountHolder === r.accountHolder
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {r.short}
                </button>
              ))}
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Account Holder Name (e.g. BALAJI FUELS & SERVICE)"
                  className="w-full text-xs font-mono pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50/50"
                  required
                />
              </div>

              {/* UPI ID */}
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="UPI ID (e.g. balajifuels@okhdfcbank)"
                  className="w-full text-xs font-mono pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50/50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Payment Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-lg">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="200"
                min="1"
                className="w-full text-xl font-black pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50/50 text-slate-800"
                required
              />
            </div>
          </div>

          {/* Feature: What are we doing this transaction for? */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-extrabold uppercase tracking-wide text-sky-950">
                  Transaction Purpose Note
                </span>
              </div>
              
              {/* Option to defer note */}
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={addNoteLater}
                  onChange={(e) => setAddNoteLater(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-400 accent-sky-500"
                />
                <span>Add note after payment</span>
              </label>
            </div>

            {!addNoteLater ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {quickChips.map((chip, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectChip(chip)}
                      className={`text-xs font-medium px-2 py-1 rounded-lg border transition-all ${
                        note === chip.label
                          ? 'bg-sky-500 text-white border-sky-500'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Petrol bunk, canteen chai, physics xerox..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                  required={!addNoteLater}
                />
              </div>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-sky-200 text-xs space-y-2">
                <div className="flex items-start gap-2 text-sky-900">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>3-4h Auto-Reminder Activated:</strong> The bank will record the recipient as <em>{accountHolder}</em>. If not tagged within 3-4 hours, RupRad will ask you what you spent it on.
                  </p>
                </div>
                
                {/* Simulation helper checkbox */}
                <label className="flex items-center gap-2 pt-1.5 border-t border-sky-100 text-[11px] text-sky-900 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulate3hAgo}
                    onChange={(e) => setSimulate3hAgo(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-400 accent-sky-500"
                  />
                  <span>⚡ Simulate "Paid 3.5h ago" (Triggers 3-4h reminder banner immediately for demo!)</span>
                </label>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-xl shadow-sky-400/25 flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-4 h-4 text-white" />
            <span>Complete UPI Payment of ₹{amount}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
