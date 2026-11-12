import React, { useState } from 'react';
import { X, Sparkles, Plus, Check, Receipt, Users, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SplitzModal({ isOpen, onClose, friends, onCreateSplit }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [selectedFriendIds, setSelectedFriendIds] = useState(['f-1', 'f-2']); // Default 2 friends + Me = 3 people
  const [category, setCategory] = useState('food');

  const titlePresets = [
    { title: "☕ Campus Cafe", category: "food" },
    { title: "🎬 Movie & Popcorn", category: "entertainment" },
    { title: "🍕 Pizza Night", category: "food" },
    { title: "⛽ Long Drive Petrol", category: "travel" },
    { title: "🚕 Auto / Cab Share", category: "travel" },
    { title: "📚 Group Assignment Xerox", category: "stationary" }
  ];

  const handleSelectPreset = (preset) => {
    setTitle(preset.title);
    setCategory(preset.category);
    if (!merchant) {
      setMerchant(preset.title.split(' ')[1] || 'Merchant');
    }
  };

  const toggleFriend = (id) => {
    if (selectedFriendIds.includes(id)) {
      if (selectedFriendIds.length > 1) {
        setSelectedFriendIds(selectedFriendIds.filter(fId => fId !== id));
      }
    } else {
      setSelectedFriendIds([...selectedFriendIds, id]);
    }
  };

  const totalParticipants = selectedFriendIds.length + 1; // including me
  const splitShare = totalAmount && !isNaN(totalAmount) 
    ? Math.round(Number(totalAmount) / totalParticipants) 
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !totalAmount || Number(totalAmount) <= 0) return;

    // Build participants
    const participants = [
      { id: "self", name: "Aarav (You)", share: splitShare, hasPaid: true, isCreator: true }
    ];

    selectedFriendIds.forEach(fId => {
      const friendObj = friends.find(f => f.id === fId);
      if (friendObj) {
        participants.push({
          id: friendObj.id,
          name: friendObj.name,
          phone: friendObj.phone,
          upi: friendObj.upi,
          share: splitShare,
          hasPaid: false
        });
      }
    });

    const newSplit = {
      id: `split-${Date.now()}`,
      title: title.trim(),
      totalAmount: Number(totalAmount),
      merchant: merchant.trim() || title.trim(),
      isPaidToMerchant: false,
      createdAt: new Date().toISOString(),
      category: category,
      participants
    };

    onCreateSplit(newSplit);

    try {
      confetti({
        particleCount: 80,
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
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">Splitz ⚡</h3>
              <p className="text-xs text-orange-100">Select title • Enter amount • Add friends</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Title Presets or Custom */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              What are you splitting?
            </label>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {titlePresets.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all ${
                    title === p.title 
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Or type title, e.g. Friday Cafe bill"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50/50"
              required
            />
          </div>

          {/* Total Bill Amount & Merchant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Total Bill (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="e.g. 900"
                  min="1"
                  className="w-full text-base font-extrabold pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50/50 text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Merchant / Place
              </label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. CCD Campus"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Add/Toggle Splitting Friends */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Splitting with ({totalParticipants} friends including you)
              </label>
              <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                ₹{splitShare} each
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* You (Locked) */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-800">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span>You (Aarav)</span>
              </div>

              {/* Friends selectable */}
              {friends.map((f) => {
                const isSelected = selectedFriendIds.includes(f.id);
                return (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() => toggleFriend(f.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-emerald-400 text-slate-900' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isSelected ? '✓' : '+'}
                    </div>
                    <span className="truncate">{f.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Box */}
          {totalAmount > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Total bill split:</span>
                <span className="font-extrabold text-slate-800 text-sm">₹{totalAmount} ÷ {totalParticipants} members</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Each person pays:</span>
                <span className="font-black text-emerald-600 text-base">₹{splitShare}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>Create Splitz & Send WhatsApp Links</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
}
