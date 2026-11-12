import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  Receipt, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown, 
  Clock,
  Smartphone
} from 'lucide-react';

export default function Header({ 
  user, 
  pendingNotesCount, 
  onOpenQuickPay, 
  onOpenSplitz, 
  onOpenSmsSync,
  score,
  onNavigateToTab
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FDFCF9]/90 backdrop-blur-md border-b border-[#EBE4D5] px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Greeting & Date */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Welcome Back, {user.name.split(' ')[0]}!
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Student Money Hub • Tracking monthly expenses, campus splits & notes
          </p>
        </div>

        {/* Right: Actions, Notification Center */}
        <div className="flex items-center gap-3">
          {/* Quick Splitz Button */}
          <button
            onClick={onOpenSplitz}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold text-xs shadow-md shadow-sky-400/25 transition-all"
          >
            <Receipt className="w-4 h-4" />
            <span>Splitz</span>
          </button>

          {/* New UPI Payment Button */}
          <button
            onClick={onOpenQuickPay}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-semibold text-xs shadow-md shadow-slate-900/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Pay & Add Note</span>
          </button>

          {/* SMS / Bank Sync Button */}
          <button
            onClick={onOpenSmsSync}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-[#EBE4D5] relative transition-colors"
            title="Auto-fetch from Bank SMS"
          >
            <Smartphone className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingNotesCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold ring-2 ring-white animate-pulse">
                  {pendingNotesCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Campus Reminders</span>
                  <span className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
                    {pendingNotesCount} Urgent
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pendingNotesCount > 0 && (
                    <div 
                      onClick={() => { setShowNotifications(false); onNavigateToTab('quickpay'); }}
                      className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 cursor-pointer hover:bg-rose-50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-rose-800">Pending Note Reminder (3h+)</p>
                          <p className="text-[11px] text-rose-600 leading-tight mt-0.5">
                            You spent ₹200 at HP Petrol Pump 3.5 hrs ago. Add note now to classify!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Rohan settled split</p>
                        <p className="text-[11px] text-slate-500">₹300 received for Friday Movie split.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Split invite from Sneha</p>
                        <p className="text-[11px] text-slate-500">Domino's Pizza Study Session (Your share: ₹260).</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
