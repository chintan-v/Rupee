import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Sliders, 
  TrendingUp, 
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BudgetScoreView({ 
  totalSpent, 
  monthlyLimit, 
  onUpdateLimit, 
  score 
}) {
  const [sliderLimit, setSliderLimit] = useState(monthlyLimit);
  const [reminderAt80, setReminderAt80] = useState(true);
  const [reminderDailyOverspend, setReminderDailyOverspend] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const numericLimit = sliderLimit === '' || isNaN(sliderLimit) ? 0 : Number(sliderLimit);
  const percentSpent = numericLimit > 0 ? Math.round((totalSpent / numericLimit) * 100) : 100;
  const remaining = numericLimit - totalSpent;

  // Calculate dynamic simulated score based on slider
  const calculateSimulatedScore = (spent, limit) => {
    if (limit <= 0) return 15;
    if (spent > limit) {
      const overspendRatio = (spent - limit) / limit;
      return Math.max(10, Math.round(45 - overspendRatio * 50));
    }
    const safeRatio = (limit - spent) / limit;
    return Math.min(98, Math.round(55 + safeRatio * 43));
  };

  const previewScore = calculateSimulatedScore(totalSpent, numericLimit);

  const getScoreDetails = (val) => {
    if (val >= 85) return {
      emoji: "🌟",
      title: "Budget Legend",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      description: "Exceptional discipline! You are comfortably pacing under your student budget."
    };
    if (val >= 70) return {
      emoji: "😊",
      title: "Healthy Saver",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      description: "Great balance. Your daily run-rate is well within safe campus margins."
    };
    if (val >= 50) return {
      emoji: "😐",
      title: "Caution Zone",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      description: "Over 70% of allowance utilized. Slow down on dining out and weekend outings."
    };
    return {
      emoji: "😭",
      title: "Broke Alert / Exceeded",
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      description: "Budget limit breached! Urgent reminder: halt non-essential discretionary spends."
    };
  };

  const currentDetails = getScoreDetails(previewScore);

  const handleSave = () => {
    const finalVal = sliderLimit === '' || isNaN(sliderLimit) ? 0 : Number(sliderLimit);
    onUpdateLimit(finalVal);
    setSliderLimit(finalVal);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const presetLimits = [5000, 8000, 10000, 12000, 15000, 20000];

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Brand Orange Theme (No extra score box inside banner) */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-blue-400 rounded-3xl p-6 text-white shadow-xl shadow-sky-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Student Financial Health & Limits</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Monthly Limit & Discipline Score
            </h2>
            <p className="text-xs md:text-sm text-sky-100 max-w-2xl mt-1">
              Set your target allowance ceiling, configure spend reminders, and track your campus discipline score.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Emoji Score Meter Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE4D5] shadow-soft-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                  Discipline Qualification Meter
                </h3>
                <p className="text-xs text-slate-400">Real-time emoji score analysis</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${currentDetails.bg} ${currentDetails.color} border ${currentDetails.border}`}>
                {currentDetails.title}
              </span>
            </div>

            {/* Static Score Display (No Bounce) */}
            <div className="text-center py-6 bg-slate-50/70 rounded-3xl border border-slate-100 mb-6">
              <span className="text-6xl inline-block mb-2">{currentDetails.emoji}</span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-black text-slate-800 tracking-tight">{previewScore}</span>
                <span className="text-base text-slate-400 font-bold">/ 100</span>
              </div>
              <p className="text-xs text-slate-600 max-w-xs mx-auto mt-2 font-medium">
                {currentDetails.description}
              </p>
            </div>

            {/* 3 Tier Segment Bar */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Score Tiers & Emoji Breakdown
              </span>

              <div className="grid grid-cols-3 gap-2">
                {/* Critical */}
                <div className={`p-3 rounded-2xl border text-center transition-all ${
                  previewScore < 50 ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/30' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xl">😭</span>
                  <span className="text-xs font-extrabold block text-rose-700 mt-1">Exceeded</span>
                  <span className="text-[10px] text-slate-400">&lt; 50 pts</span>
                </div>

                {/* Neutral */}
                <div className={`p-3 rounded-2xl border text-center transition-all ${
                  previewScore >= 50 && previewScore < 70 ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xl">😐</span>
                  <span className="text-xs font-extrabold block text-amber-700 mt-1">Warning</span>
                  <span className="text-[10px] text-slate-400">50 - 69 pts</span>
                </div>

                {/* Positive */}
                <div className={`p-3 rounded-2xl border text-center transition-all ${
                  previewScore >= 70 ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-400/30' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xl">🌟</span>
                  <span className="text-xs font-extrabold block text-sky-700 mt-1">Healthy</span>
                  <span className="text-[10px] text-slate-400">70 - 100 pts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Spent so far: <strong>₹{totalSpent.toLocaleString('en-IN')}</strong></span>
            <span>Ratio: <strong>{percentSpent}%</strong></span>
          </div>
        </div>

        {/* Right Column: Direct Option to Set Limit */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE4D5] shadow-soft-card flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Set Your Monthly Budget Limit
              </h3>
              <p className="text-xs text-slate-400">
                Type your budget or pick a preset student limit
              </p>
            </div>

            {/* Direct Number Input Field without leading zero bug */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-3">
              <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">
                Target Monthly Limit (₹)
              </span>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-xl">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={sliderLimit === '' ? '' : sliderLimit}
                  onChange={(e) => {
                    const raw = e.target.value;
                    // Allow only digits
                    const digitsOnly = raw.replace(/\D/g, '');
                    if (digitsOnly === '') {
                      setSliderLimit('');
                    } else {
                      // Strip leading zeros unless it's just "0"
                      const noLeadingZero = digitsOnly.replace(/^0+(?=\d)/, '');
                      setSliderLimit(Number(noLeadingZero));
                    }
                  }}
                  onBlur={() => {
                    if (sliderLimit === '' || isNaN(sliderLimit)) {
                      setSliderLimit(0);
                    }
                  }}
                  placeholder="e.g. 10000"
                  className="w-full text-2xl font-black pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white text-slate-800"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
                {presetLimits.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSliderLimit(preset)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl border transition-all ${
                      numericLimit === preset
                        ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider starting from 0 */}
            <div className="space-y-1.5">
              <input
                type="range"
                min="0"
                max="30000"
                step="500"
                value={numericLimit}
                onChange={(e) => setSliderLimit(Number(e.target.value))}
                className="w-full accent-sky-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>₹0</span>
                <span>₹15,000</span>
                <span>₹30,000</span>
              </div>
            </div>

            {/* Reminders Toggle Section */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Spending Reminders
              </span>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-sky-100 text-sky-700">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">80% Budget Alert</span>
                    <span className="text-[11px] text-slate-400">Notify when spending crosses ₹{Math.round(numericLimit * 0.8)}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reminderAt80}
                  onChange={(e) => setReminderAt80(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-400 w-4 h-4 accent-sky-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Daily Velocity Alert</span>
                    <span className="text-[11px] text-slate-400">Warn if day's spend exceeds ₹{Math.round(numericLimit / 30 * 1.5)}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reminderDailyOverspend}
                  onChange={(e) => setReminderDailyOverspend(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-400 w-4 h-4 accent-sky-500"
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-sky-400/25 flex items-center justify-center gap-2 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Limit Updated to ₹{numericLimit.toLocaleString('en-IN')}!</span>
                </>
              ) : (
                <>
                  <Sliders className="w-4 h-4 text-white" />
                  <span>Save Limit (₹{numericLimit.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
