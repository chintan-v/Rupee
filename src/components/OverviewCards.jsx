import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft,
  CircleDollarSign,
  PieChart
} from 'lucide-react';

export default function OverviewCards({ 
  totalSpent, 
  monthlyLimit, 
  dailyAvg, 
  weeklyAvg, 
  splitzBalance, 
  score,
  onOpenSplitz,
  onOpenQuickPay,
  onOpenBudgetModal
}) {
  const percentSpent = Math.min(100, Math.round((totalSpent / monthlyLimit) * 100));
  const remainingBudget = monthlyLimit - totalSpent;
  const isBudgetExceeded = totalSpent > monthlyLimit;

  // Score config
  const getScoreStatus = (val) => {
    if (val >= 80) return { emoji: "🌟", label: "Budget Boss", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (val >= 60) return { emoji: "😐", label: "Safe Zone", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { emoji: "😭", label: "Broke Alert", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
  };

  const scoreInfo = getScoreStatus(score);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Card 1: Monthly Money Spent */}
      <div className="bg-white rounded-3xl p-5 border border-[#EBE4D5] shadow-soft-card hover:shadow-lg transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Monthly Spend
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBudgetModal}
              className="text-[11px] font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 px-2.5 py-1 rounded-xl transition-colors"
              title="Set or change your monthly spending limit"
            >
              Set Limit ⚙️
            </button>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            ₹{totalSpent.toLocaleString('en-IN')}
          </h3>
          <span className="text-xs text-slate-400 font-semibold">
            / ₹{monthlyLimit.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-semibold mb-1">
            <span className={percentSpent > 90 ? 'text-rose-600' : 'text-slate-500'}>
              {percentSpent}% Used
            </span>
            <span className="text-slate-400">
              ₹{remainingBudget > 0 ? remainingBudget.toLocaleString('en-IN') : 0} left
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentSpent > 90 
                  ? 'bg-rose-500' 
                  : percentSpent > 70 
                    ? 'bg-amber-500' 
                    : 'bg-gradient-to-r from-sky-400 to-sky-500'
              }`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="font-bold text-emerald-600 flex items-center">
            <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> 8% less
          </span>
          <span>than last month's pace</span>
        </div>
      </div>

      {/* Card 2: Average Spendings */}
      <div className="bg-white rounded-3xl p-5 border border-[#EBE4D5] shadow-soft-card hover:shadow-lg transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Average Spendings
          </span>
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            ₹{dailyAvg}
          </h3>
          <span className="text-xs text-slate-400 font-semibold">/ day</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
          <div>
            <span className="text-slate-400 block font-medium">Weekly Run Rate</span>
            <span className="font-bold text-slate-700">₹{weeklyAvg} / wk</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Daily Safe Burn</span>
            <span className="font-bold text-emerald-600">₹{Math.round(remainingBudget / 18)} / day</span>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
          <span>Optimal student allowance pace</span>
        </div>
      </div>

      {/* Card 3: Splitz Net Position */}
      <div className="bg-white rounded-3xl p-5 border border-[#EBE4D5] shadow-soft-card hover:shadow-lg transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Splitz Balance
          </span>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className={`text-2xl font-black tracking-tight ${splitzBalance.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {splitzBalance.net >= 0 ? `+₹${splitzBalance.net}` : `-₹${Math.abs(splitzBalance.net)}`}
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Net position</span>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
          <div className="flex items-center gap-1 text-emerald-700">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>You're owed: <strong>₹{splitzBalance.youAreOwed}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-rose-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>You owe: <strong>₹{splitzBalance.youOwe}</strong></span>
          </div>
        </div>

        <button 
          onClick={onOpenSplitz}
          className="mt-2 w-full text-center text-xs font-bold text-orange-600 hover:text-orange-700 pt-1 block"
        >
          View active campus splits →
        </button>
      </div>

      {/* Card 4: Financial Health Score & Limit with Emojis */}
      <div 
        onClick={onOpenBudgetModal}
        className="bg-white rounded-3xl p-5 border border-[#EBE4D5] shadow-soft-card hover:shadow-lg transition-all relative overflow-hidden cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Budget Health Score
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl filter drop-shadow">{scoreInfo.emoji}</span>
          <div>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {score}
              </h3>
              <span className="text-xs text-slate-400 font-bold">/ 100</span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${scoreInfo.bg} ${scoreInfo.color}`}>
              {scoreInfo.label}
            </span>
          </div>
        </div>

        {/* Emoji gauge bar (inspired by Image 2 NPS / Review Qualification) */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
            <span>Critical 😭</span>
            <span>Warning 😐</span>
            <span>Boss 🌟</span>
          </div>
          <div className="grid grid-cols-3 gap-1 h-2 rounded-full overflow-hidden bg-slate-100 p-0.5">
            <div className={`h-full rounded-sm ${score < 50 ? 'bg-rose-500' : 'bg-rose-200'}`} />
            <div className={`h-full rounded-sm ${score >= 50 && score < 75 ? 'bg-amber-500' : 'bg-amber-200'}`} />
            <div className={`h-full rounded-sm ${score >= 75 ? 'bg-emerald-500' : 'bg-emerald-200'}`} />
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tap to adjust limit</span>
          <span className="font-bold text-slate-600 group-hover:text-orange-600">Settings ⚙️</span>
        </div>
      </div>

    </div>
  );
}
