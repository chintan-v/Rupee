import React, { useState } from 'react';
import { CATEGORIES } from '../data/initialData';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  ShieldAlert, 
  Target, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function SmartAnalyst({ transactions, monthlyLimit, totalSpent }) {
  const [selectedCatKey, setSelectedCatKey] = useState(null);

  // Calculate totals per category
  const categoryStats = transactions.reduce((acc, tx) => {
    const cat = tx.category || 'other';
    if (!acc[cat]) {
      acc[cat] = { total: 0, count: 0, transactions: [] };
    }
    acc[cat].total += Number(tx.amount);
    acc[cat].count += 1;
    acc[cat].transactions.push(tx);
    return acc;
  }, {});

  const totalAll = totalSpent || 1;

  const categoriesList = Object.entries(CATEGORIES).map(([key, config]) => {
    const stat = categoryStats[key] || { total: 0, count: 0, transactions: [] };
    const percentage = Math.round((stat.total / totalAll) * 100);
    return {
      key,
      ...config,
      total: stat.total,
      count: stat.count,
      percentage,
      transactions: stat.transactions
    };
  }).sort((a, b) => b.total - a.total);

  const topCategory = categoriesList[0];

  return (
    <div className="space-y-6">
      
      {/* Hero Smart Analyst Banner - Brand Orange Theme */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-blue-400 rounded-3xl p-6 text-white shadow-xl shadow-sky-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Spending Intelligence • Sem 5 Analysis</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Smart Category Analyst
            </h2>
            <p className="text-xs md:text-sm text-sky-100 max-w-xl mt-1">
              Deep auto-categorization across Food 🍔, Travel ⛽, Medicine 💊, and Stationary 📚 from your UPI transactions.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right">
            <span className="text-xs text-sky-100 font-medium block">Top Expense Category</span>
            <span className="text-xl font-black text-white flex items-center justify-end gap-1.5 mt-0.5">
              <span>{topCategory?.emoji}</span>
              <span>{topCategory?.name}</span>
            </span>
            <span className="text-[11px] text-sky-100">
              ₹{topCategory?.total.toLocaleString('en-IN')} ({topCategory?.percentage}% of total)
            </span>
          </div>
        </div>
      </div>

      {/* AI Smart Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-[#EBE4D5] shadow-soft-card">
          <div className="flex items-center gap-2 mb-2 text-amber-600">
            <Lightbulb className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Canteen & Dining Insight</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Food represents <strong>{categoriesList.find(c => c.key === 'food')?.percentage || 0}%</strong> of your allowance. Quick hostel meals could save ₹650 this week.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#EBE4D5] shadow-soft-card">
          <div className="flex items-center gap-2 mb-2 text-cyan-600">
            <TrendingDown className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Travel & Fuel Efficiency</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Petrol bunk spends are consistent at ₹200 refills. Your metro card recharge keeps transit 35% cheaper than auto cabs.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#EBE4D5] shadow-soft-card">
          <div className="flex items-center gap-2 mb-2 text-indigo-600">
            <Target className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Stationary & Study</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Stationary and lab printouts peaked around assignment submission. Sharing digital PDF notes with batchmates cuts print costs.
          </p>
        </div>

      </div>

      {/* Grid of All Categories */}
      <div className="bg-white rounded-3xl p-6 border border-[#EBE4D5] shadow-soft-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
              All Category Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Click any category card to inspect specific transactions
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            {categoriesList.length} Categories Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesList.map((cat) => {
            const isSelected = selectedCatKey === cat.key;
            return (
              <div
                key={cat.key}
                onClick={() => setSelectedCatKey(isSelected ? null : cat.key)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-sky-400 bg-sky-50/30 shadow-md ring-2 ring-sky-400/30' 
                    : 'border-[#EBE4D5] hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm" style={{ backgroundColor: `${cat.color}20` }}>
                      {cat.emoji}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">{cat.name}</h4>
                      <span className="text-[11px] text-slate-400">{cat.count} transaction{cat.count !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <span className="text-base font-black text-slate-900">
                    ₹{cat.total.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Share of budget</span>
                    <span style={{ color: cat.color }}>{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, cat.percentage)}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{isSelected ? 'Hide Transactions' : 'View Transactions'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Category Drill-down list */}
        {selectedCatKey && (
          <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span>Transactions in {CATEGORIES[selectedCatKey]?.emoji} {CATEGORIES[selectedCatKey]?.name}</span>
              </h4>
              <button 
                onClick={() => setSelectedCatKey(null)}
                className="text-xs text-sky-600 font-bold hover:underline"
              >
                Close drill-down
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {(categoryStats[selectedCatKey]?.transactions || []).map(tx => (
                <div key={tx.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{tx.merchant}</span>
                    <p className="text-[11px] text-slate-500">Note: "{tx.note || 'No note added'}"</p>
                  </div>
                  <span className="font-extrabold text-slate-900">-₹{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
