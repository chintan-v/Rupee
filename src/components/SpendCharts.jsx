import React, { useState } from 'react';
import { CATEGORIES } from '../data/initialData';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Layers, 
  ArrowUpRight, 
  Sparkles,
  PieChart as PieIcon,
  HelpCircle
} from 'lucide-react';

export default function SpendCharts({ weeklyData, transactions, onFilterCategory, onExploreAiInsights }) {
  const [activeView, setActiveView] = useState('weekly'); // 'weekly' or 'category'
  const [hoveredDay, setHoveredDay] = useState(null);

  // Calculate highest spend day for scaling
  const maxWeeklySpend = Math.max(...weeklyData.map(d => d.total));

  // Calculate category aggregates from all transactions
  const categoryTotals = transactions.reduce((acc, tx) => {
    const cat = tx.category || 'other';
    acc[cat] = (acc[cat] || 0) + Number(tx.amount);
    return acc;
  }, {});

  const totalAllCategories = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;

  // Sorted categories
  const sortedCategories = Object.entries(categoryTotals)
    .map(([catKey, total]) => {
      const config = CATEGORIES[catKey] || CATEGORIES.other;
      const percentage = Math.round((total / totalAllCategories) * 100);
      return {
        key: catKey,
        ...config,
        total,
        percentage
      };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      {/* 2 Cols: Weekly Spending Trend */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#EBE4D5] shadow-soft-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Spending Velocity & Trends
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +14% Fri Peak
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Daily money outflow across Food 🍔, Travel ⛽, and Study 📚
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-semibold self-start sm:self-auto">
            <button 
              onClick={() => setActiveView('weekly')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'weekly' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              7-Day Stacked
            </button>
            <button 
              onClick={() => setActiveView('comparison')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'comparison' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Category Split
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 mb-6">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span>Food & Canteen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <span>Travel & Fuel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
            <span>Study & Leisure</span>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 pb-2 border-b border-slate-100">
          {weeklyData.map((item, idx) => {
            const foodH = (item.food / maxWeeklySpend) * 100;
            const travelH = (item.travel / maxWeeklySpend) * 100;
            const otherH = (item.others / maxWeeklySpend) * 100;
            const totalH = (item.total / maxWeeklySpend) * 100;
            const isHovered = hoveredDay === item.day;

            return (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredDay(item.day)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Floating tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-14 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-xl shadow-xl z-20 whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
                    <div className="font-bold">{item.day}: ₹{item.total}</div>
                    <div className="text-[10px] text-slate-300">Food ₹{item.food} • Travel ₹{item.travel}</div>
                  </div>
                )}

                {/* Stacked Bar with smooth transitions */}
                <div 
                  className={`w-full max-w-[38px] rounded-xl overflow-hidden flex flex-col-reverse transition-all duration-300 ${
                    isHovered ? 'scale-105 shadow-md shadow-sky-400/20 ring-2 ring-sky-400' : ''
                  }`}
                  style={{ height: `${Math.max(12, totalH)}%` }}
                >
                  {/* Bottom segment: Food */}
                  <div 
                    style={{ height: `${(item.food / item.total) * 100}%` }} 
                    className="bg-amber-400 group-hover:bg-amber-500 transition-colors"
                    title={`Food: ₹${item.food}`}
                  />
                  {/* Middle segment: Travel */}
                  <div 
                    style={{ height: `${(item.travel / item.total) * 100}%` }} 
                    className="bg-cyan-400 group-hover:bg-cyan-500 transition-colors"
                    title={`Travel: ₹${item.travel}`}
                  />
                  {/* Top segment: Others */}
                  <div 
                    style={{ height: `${(item.others / item.total) * 100}%` }} 
                    className="bg-indigo-400 group-hover:bg-indigo-500 transition-colors"
                    title={`Others: ₹${item.others}`}
                  />
                </div>

                {/* Day label */}
                <span className={`text-[11px] font-bold mt-3 transition-colors ${
                  item.day.includes('Today') ? 'text-sky-600' : isHovered ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {item.day.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  ₹{item.total}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Insight */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Friday spikes due to Weekend Movie ticket & Night Canteen treats.</span>
          </div>
          <span className="font-bold text-slate-700">Projected Month-End: ₹8,900 (Within limit)</span>
        </div>
      </div>

      {/* 1 Col: Smart Category Breakdown (Inspired by Image 2's Top Sellers Donut / Gauge) */}
      <div className="bg-white rounded-3xl p-6 border border-[#EBE4D5] shadow-soft-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Top Categories
              </h3>
              <p className="text-xs text-slate-400">Where your rupees went</p>
            </div>
            <div className="p-2 rounded-2xl bg-sky-50 text-sky-600">
              <PieIcon className="w-5 h-5" />
            </div>
          </div>

          {/* Semi-circular visual preview or progress stacks */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 mb-4 flex items-center justify-around">
            <div className="text-center">
              <span className="text-2xl font-black text-slate-800">
                ₹{totalAllCategories.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">Tracked Outflow</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-2xl font-black text-sky-600">
                {sortedCategories.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">Categories</span>
            </div>
          </div>

          {/* List of categories with percentage bars */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {sortedCategories.slice(0, 5).map((cat) => (
              <div 
                key={cat.key}
                onClick={() => onFilterCategory && onFilterCategory(cat.key)}
                className="p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.emoji}</span>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">
                      {cat.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-800">
                      ₹{cat.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5 font-semibold">
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={onExploreAiInsights}
            className="text-[11px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer hover:underline transition-all"
          >
            Explore Detailed AI Insights →
          </button>
        </div>
      </div>

    </div>
  );
}
