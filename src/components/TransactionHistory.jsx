import React, { useState } from 'react';
import { CATEGORIES } from '../data/initialData';
import { 
  Search, 
  Filter, 
  Tag, 
  Check, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Plus,
  CreditCard,
  User,
  Info
} from 'lucide-react';

export default function TransactionHistory({ 
  transactions, 
  onUpdateNote, 
  onAddNewPayment,
  categoryFilter,
  setCategoryFilter
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTxId, setEditingTxId] = useState(null);
  const [tempNote, setTempNote] = useState('');
  const [tempCategory, setTempCategory] = useState('travel');
  const [filterType, setFilterType] = useState('all'); // all, missing_notes, completed

  const quickChips = [
    { label: "⛽ Petrol Bunk", category: "travel" },
    { label: "☕ Campus Chai/Snack", category: "food" },
    { label: "📚 Xerox / Notes", category: "stationary" },
    { label: "💊 Medicines", category: "medicine" },
    { label: "🎬 Movie Ticket", category: "entertainment" },
    { label: "🚕 Hostel Cab / Auto", category: "travel" }
  ];

  const filteredTransactions = transactions.filter(tx => {
    // Category filter
    if (categoryFilter && categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

    // Filter type
    if (filterType === 'missing_notes' && tx.note && tx.note.trim() !== '') return false;
    
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchHolder = (tx.accountHolder || tx.merchant || '').toLowerCase().includes(q);
      const matchUpi = (tx.upiId || '').toLowerCase().includes(q);
      const matchNote = (tx.note || '').toLowerCase().includes(q);
      const matchAmount = tx.amount.toString().includes(q);
      if (!matchHolder && !matchUpi && !matchNote && !matchAmount) return false;
    }
    return true;
  });

  const handleStartEdit = (tx) => {
    setEditingTxId(tx.id);
    setTempNote(tx.note || '');
    setTempCategory(tx.category || 'travel');
  };

  const handleSaveNote = (txId) => {
    const finalNote = tempNote.trim() || 'General Expense';
    let cat = tempCategory;
    const lower = finalNote.toLowerCase();
    if (lower.includes('petrol') || lower.includes('fuel') || lower.includes('auto') || lower.includes('cab')) {
      cat = 'travel';
    } else if (lower.includes('chai') || lower.includes('food') || lower.includes('canteen') || lower.includes('pizza') || lower.includes('snack')) {
      cat = 'food';
    } else if (lower.includes('xerox') || lower.includes('print') || lower.includes('book') || lower.includes('study')) {
      cat = 'stationary';
    } else if (lower.includes('med') || lower.includes('pharmacy') || lower.includes('doctor')) {
      cat = 'medicine';
    } else if (lower.includes('movie') || lower.includes('film') || lower.includes('ott')) {
      cat = 'entertainment';
    }
    onUpdateNote(txId, finalNote, cat);
    setEditingTxId(null);
    setTempNote('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-card mb-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
              Transaction Feed & Note Tagger
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {transactions.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Raw banking transactions with Account Holder, UPI ID, and custom student notes
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Account Holder, UPI ID, Note..."
              className="text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 w-52 sm:w-72 bg-slate-50/50"
            />
          </div>

          {/* Filter toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => { setFilterType('all'); setCategoryFilter('all'); }}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                filterType === 'all' && categoryFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('missing_notes')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filterType === 'missing_notes'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <span>Missing Note</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            </button>
          </div>

          {/* Add Manual Payment Button */}
          <button
            onClick={onAddNewPayment}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pay & Tag</span>
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No transactions found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting search filters</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const cat = CATEGORIES[tx.category] || CATEGORIES.other;
            const hasNote = tx.note && tx.note.trim() !== '';
            const isEditing = editingTxId === tx.id;
            const hoursAgo = Math.round((Date.now() - new Date(tx.timestamp).getTime()) / (1000 * 60 * 60) * 10) / 10;
            const isOverdue = !hasNote && hoursAgo >= 3;
            const accountHolderName = tx.accountHolder || tx.merchant || "UNKNOWN RECIPIENT";
            const upiId = tx.upiId || "upi@bank";
            const refId = tx.refId || `UPI/${tx.id}`;

            return (
              <div 
                key={tx.id}
                className="py-3.5 px-3 rounded-2xl transition-all hover:bg-slate-50/80 border border-transparent hover:border-slate-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  
                  {/* Left: Category Icon & Details */}
                  <div className="flex items-start gap-3 flex-1">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-sm mt-0.5" 
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <span>{hasNote ? cat.emoji : '❓'}</span>
                    </div>

                    <div className="flex-1">
                      
                      {/* Main Title logic */}
                      {hasNote ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-800 tracking-tight">
                              {tx.note}
                            </h4>
                            <span 
                              onClick={() => handleStartEdit(tx)}
                              className="text-[10px] text-slate-400 hover:text-orange-600 font-bold underline cursor-pointer"
                            >
                              Edit Note
                            </span>
                          </div>

                          {/* Secondary: Raw Bank Details */}
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-medium">
                            <span>Paid to <strong className="text-slate-700">{accountHolderName}</strong></span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-slate-600">{upiId}</span>
                            <span>•</span>
                            <span className="text-[10px] text-slate-400">{refId}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* Raw Bank Details as primary because no note exists yet */}
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-800 tracking-tight font-mono">
                              {accountHolderName}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {tx.paymentMethod || 'UPI'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <span className="font-mono text-[11px] text-slate-600">UPI ID: {upiId}</span>
                            <span>•</span>
                            <span className="text-[10px] text-slate-400">{refId}</span>
                          </div>
                        </div>
                      )}

                      {/* Note display or Inline Editor */}
                      {isEditing ? (
                        <div className="mt-3 p-3 bg-white rounded-2xl border-2 border-orange-300 shadow-md animate-in fade-in space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-600 pb-1 border-b border-slate-100">
                            <Info className="w-3.5 h-3.5 text-orange-500" />
                            <span>
                              Bank details: <strong>{accountHolderName}</strong> ({upiId})
                            </span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              What was this ₹{tx.amount} spent on? (e.g. Petrol bunk, Canteen chai):
                            </label>

                            {/* Quick chips for 1-tap note */}
                            <div className="flex flex-wrap gap-1 mb-1.5">
                              {quickChips.map((chip, idx) => (
                                <button
                                  type="button"
                                  key={idx}
                                  onClick={() => {
                                    setTempNote(chip.label);
                                    setTempCategory(chip.category);
                                  }}
                                  className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-700 border border-slate-200"
                                >
                                  {chip.label}
                                </button>
                              ))}
                            </div>

                            <input
                              type="text"
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              placeholder="Type purpose, e.g. Petrol bunk..."
                              className="text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 w-full bg-slate-50/50"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveNote(tx.id);
                                if (e.key === 'Escape') setEditingTxId(null);
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => setEditingTxId(null)}
                              className="text-xs px-3 py-1.5 text-slate-400 hover:text-slate-600 font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(tx.id)}
                              className="text-xs px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
                            >
                              Save Note & Categorize
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {!hasNote ? (
                            <button
                              onClick={() => handleStartEdit(tx)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                            >
                              <Tag className="w-3 h-3 text-amber-600" />
                              <span>+ Add Note</span>
                              {isOverdue && <span className="text-[10px] text-amber-700 font-bold ml-0.5">• 3h ago</span>}
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Tagged in {cat.name}</span>
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400 font-medium">
                            • {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Category */}
                  <div className="text-right sm:self-center flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                    <span className="text-base font-black text-slate-900 tracking-tight">
                      -₹{tx.amount}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {hasNote ? cat.name : 'Uncategorized'}
                    </span>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
