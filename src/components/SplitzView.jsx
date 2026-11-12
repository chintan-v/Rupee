import React, { useState } from 'react';
import { 
  Receipt, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Share2, 
  MessageCircle, 
  ArrowUpRight, 
  Check, 
  Send,
  AlertCircle,
  Copy,
  Building2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SplitzView({ 
  splits, 
  invitedSplits, 
  user,
  onOpenCreateSplitModal, 
  onToggleFriendPaid, 
  onMarkMerchantPaid,
  onSettleInvitedSplit
}) {
  const [activeTab, setActiveTab] = useState('my-splits'); // 'my-splits' or 'invited'
  const [copiedSplitId, setCopiedSplitId] = useState(null);

  const handleShareWhatsApp = (split, friend) => {
    const text = `Hey ${friend.name.split(' ')[0]}! Aarav created a bill split for *${split.title}* (Total: ₹${split.totalAmount}). Your share is *₹${friend.share}*. Please pay via UPI to *${user.upiId}*. Thanks! ✨`;
    const encoded = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleShareGroupWhatsApp = (split) => {
    const text = `📢 *Splitz Bill Summary: ${split.title}*\n` +
      `Total Bill: ₹${split.totalAmount} at ${split.merchant}\n` +
      `Each share: ₹${split.participants[0]?.share}\n\n` +
      `Status:\n` +
      split.participants.map(p => `${p.hasPaid ? '✅' : '⏳'} ${p.name}: ₹${p.share} (${p.hasPaid ? 'Paid' : 'Pending'})`).join('\n') +
      `\n\nPay to Aarav via UPI: ${user.upiId}`;
    
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyLink = (split) => {
    const text = `Splitz: ${split.title} • Pay ₹${split.participants[0]?.share} to ${user.upiId}`;
    navigator.clipboard?.writeText(text);
    setCopiedSplitId(split.id);
    setTimeout(() => setCopiedSplitId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Tab Navigation */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-blue-400 rounded-3xl p-6 text-white shadow-lg shadow-sky-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Split Bills with Friends</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Splitz Hub & Campus Accounts
            </h2>
            <p className="text-xs md:text-sm text-sky-100 max-w-xl mt-1">
              Never chase hostel friends for movie tickets or canteen snacks. Instant WhatsApp payment pings with linked UPI.
            </p>
          </div>

          <button
            onClick={onOpenCreateSplitModal}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 active:scale-95 font-extrabold text-sm shadow-xl shadow-black/10 transition-all self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Splitz</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/20">
          <button
            onClick={() => setActiveTab('my-splits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my-splits'
                ? 'bg-white text-sky-700 shadow-md'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            My Splits ({splits.length})
          </button>
          <button
            onClick={() => setActiveTab('invited')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'invited'
                ? 'bg-white text-sky-700 shadow-md'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <span>Invited by Friends</span>
            <span className="px-1.5 py-0.2 rounded-full bg-sky-700 text-[10px] text-white">
              {invitedSplits.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: My Splits */}
      {activeTab === 'my-splits' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {splits.map((split) => {
            const paidMembersCount = split.participants.filter(p => p.hasPaid).length;
            const totalMembersCount = split.participants.length;
            const isFullySettled = paidMembersCount === totalMembersCount;

            return (
              <div 
                key={split.id}
                className="bg-white rounded-3xl p-6 border border-[#EBE4D5] shadow-soft-card hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Split Title & Status Badges */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-800">
                          {split.title}
                        </h3>
                        {isFullySettled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Fully Settled ✅
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            {paidMembersCount}/{totalMembersCount} Paid
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Merchant: {split.merchant}</span>
                        <span>•</span>
                        <span>{new Date(split.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Total Bill</span>
                      <span className="text-lg font-black text-slate-900">₹{split.totalAmount}</span>
                    </div>
                  </div>

                  {/* Merchant Payment Status */}
                  <div className={`p-3 rounded-2xl mb-4 flex items-center justify-between text-xs ${
                    split.isPaidToMerchant 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${split.isPaidToMerchant ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                      <span className="font-semibold">
                        {split.isPaidToMerchant 
                          ? `Paid ₹${split.totalAmount} to merchant via UPI` 
                          : `Merchant payment pending`}
                      </span>
                    </div>
                    {!split.isPaidToMerchant && (
                      <button
                        onClick={() => onMarkMerchantPaid(split.id)}
                        className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-[11px] shadow-sm"
                      >
                        Pay Merchant via UPI
                      </button>
                    )}
                  </div>

                  {/* Members Split Breakdown */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Participants & Payment Status
                    </span>

                    {split.participants.map((p) => {
                      return (
                        <div 
                          key={p.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">
                                {p.name} {p.isCreator && <span className="text-[10px] text-slate-400">(Host)</span>}
                              </p>
                              <p className="text-[10px] text-slate-400">Share: ₹{p.share}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {p.hasPaid ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" /> Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}

                            {/* Mark Paid Toggle Button */}
                            {!p.isCreator && (
                              <button
                                onClick={() => onToggleFriendPaid(split.id, p.id)}
                                title={p.hasPaid ? "Mark as yet to pay" : "Mark as paid"}
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                                  p.hasPaid 
                                    ? 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100' 
                                    : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                                }`}
                              >
                                {p.hasPaid ? 'Undo' : 'Mark Paid'}
                              </button>
                            )}

                            {/* WhatsApp Direct Reminder */}
                            {!p.isCreator && !p.hasPaid && (
                              <button
                                onClick={() => handleShareWhatsApp(split, p)}
                                title="Send reminder via WhatsApp"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Group WhatsApp Share & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleShareGroupWhatsApp(split)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Group Summary</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(split)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                    title="Copy UPI split breakdown"
                  >
                    {copiedSplitId === split.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Invited Splits (Friends invited me to split a bill) */}
      {activeTab === 'invited' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {invitedSplits.map((inv) => {
            return (
              <div 
                key={inv.id}
                className="bg-white rounded-3xl p-6 border border-[#EBE4D5] shadow-soft-card hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-800">
                        {inv.title}
                      </h3>
                      {inv.hasPaid ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          You Paid ✅
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                          Pending Your Payment
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hosted by <strong className="text-slate-700">{inv.hostName}</strong> ({inv.hostPhone})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Your Share</span>
                    <span className="text-xl font-black text-rose-600">₹{inv.myShare}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-4 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Total bill:</span>
                    <span className="font-bold">₹{inv.totalBill} ({inv.membersCount} people)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Host UPI ID:</span>
                    <span className="font-mono font-semibold text-slate-800">{inv.hostUpi}</span>
                  </div>
                  {inv.note && (
                    <div className="pt-1 text-slate-500 italic">
                      Note from {inv.hostName.split(' ')[0]}: "{inv.note}"
                    </div>
                  )}
                </div>

                {/* Settle via UPI Button */}
                <div className="flex items-center gap-3">
                  {inv.hasPaid ? (
                    <div className="w-full py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-xs text-center border border-emerald-200">
                      Paid to {inv.hostName} on {new Date(inv.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  ) : (
                    <button
                      onClick={() => onSettleInvitedSplit(inv.id, inv.myShare, inv.hostName, inv.title)}
                      className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-slate-900/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Pay ₹{inv.myShare} to {inv.hostName.split(' ')[0]} via UPI</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
