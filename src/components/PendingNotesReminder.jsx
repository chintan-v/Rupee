import React, { useState } from 'react';
import { Clock, ArrowRight, Tag, Sparkles } from 'lucide-react';

export default function PendingNotesReminder({ pendingTransactions, onUpdateNote }) {
  if (!pendingTransactions || pendingTransactions.length === 0) return null;

  const activeTx = pendingTransactions[0];
  const [customNote, setCustomNote] = useState('');

  const quickChips = [
    { label: "⛽ Petrol Bunk", category: "travel" },
    { label: "☕ Campus Chai/Snack", category: "food" },
    { label: "📚 Xerox / Notes", category: "stationary" },
    { label: "💊 Medicines", category: "medicine" },
    { label: "🚕 Auto / Cab", category: "travel" }
  ];

  const handleApplyNote = (noteText, category) => {
    const finalNote = noteText || customNote || "Petrol Bunk";
    let finalCategory = category;
    const lower = finalNote.toLowerCase();
    if (lower.includes('petrol') || lower.includes('fuel')) {
      finalCategory = 'travel';
    } else if (lower.includes('chai') || lower.includes('food') || lower.includes('canteen')) {
      finalCategory = 'food';
    } else if (lower.includes('xerox') || lower.includes('print')) {
      finalCategory = 'stationary';
    } else if (lower.includes('med') || lower.includes('pharmacy')) {
      finalCategory = 'medicine';
    } else {
      finalCategory = category || 'travel';
    }

    onUpdateNote(activeTx.id, finalNote, finalCategory);
    setCustomNote('');
  };

  const accountHolder = activeTx.accountHolder || activeTx.merchant || "BALAJI FUELS & SERVICE STATION";
  const upiId = activeTx.upiId || "balajifuels@okhdfcbank";

  return (
    <div className="bg-white rounded-2xl border border-red-200 hover:border-red-300 shadow-soft-card p-4 sm:p-5 mb-6 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Transaction Information */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>REMINDER</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {upiId}
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            What was this <span className="text-red-600 font-black">₹{activeTx.amount}</span> transaction for?
          </h3>

          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Account Holder:</span> {accountHolder}
          </p>
          <p className="text-[11px] text-slate-400">
            The bank only shows the account name. Add your personal note (e.g., <em>"petrol bunk"</em>) to categorize it.
          </p>
        </div>

        {/* Right: Input and Quick Suggestions */}
        <div className="space-y-2 lg:w-96 shrink-0">
          
          {/* Simple input and save button */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Petrol bunk..."
              className="text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 flex-1 bg-slate-50/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplyNote(customNote);
              }}
            />
            <button
              onClick={() => handleApplyNote(customNote)}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-sky-400/20 transition-all whitespace-nowrap"
            >
              Save Note
            </button>
          </div>

          {/* Clean Quick Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Quick:</span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyNote(chip.label, chip.category)}
                className="text-[11px] font-medium px-2 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 text-slate-700 border border-slate-200/60 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {pendingTransactions.length > 1 && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>{pendingTransactions.length} transactions pending note tagging</span>
          <span className="text-sky-600 font-medium">Tag them to keep your monthly analytics accurate</span>
        </div>
      )}
    </div>
  );
}
