import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Send, 
  PieChart, 
  ShieldAlert, 
  Smartphone, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Sparkles, 
  RotateCcw,
  Edit3
} from 'lucide-react';

export default function Sidebar({ 
  isExpanded, 
  setIsExpanded, 
  activeTab, 
  setActiveTab, 
  pendingNotesCount, 
  onTriggerOverdueNote,
  onTriggerHighSpend,
  onOpenSmsSync,
  onOpenSplitzModal,
  onResetData,
  user,
  onOpenProfile
}) {
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [collapsedPopoverOpen, setCollapsedPopoverOpen] = useState(false);

  // Clean nav items without distracting number/text badges
  // Only a simple red dot if there are pending notes on UPI Pay & Tag
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      hasRedDot: false
    },
    {
      id: 'splitz',
      label: 'Splitz',
      icon: Receipt,
      hasRedDot: false
    },
    {
      id: 'quickpay',
      label: 'UPI Pay & Tag',
      icon: Send,
      hasRedDot: pendingNotesCount > 0
    },
    {
      id: 'analyst',
      label: 'Smart Analyst',
      icon: PieChart,
      hasRedDot: false
    },
    {
      id: 'budget-score',
      label: 'Limit & Score',
      icon: ShieldAlert,
      hasRedDot: false
    },
    {
      id: 'sms-sync',
      label: 'Bank & SMS Sync',
      icon: Smartphone,
      hasRedDot: false
    }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-[#FDFCF9] border-r border-[#EBE4D5] flex flex-col justify-between select-none ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Top Branding & Expand Toggle */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Header Bar */}
        <div className="h-20 border-b border-[#EBE4D5] shrink-0 relative flex items-center px-4">
          {isExpanded ? (
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-400/25 shrink-0 font-bold text-lg select-none">
                  ₹
                </div>
                <div className="flex flex-col transition-opacity duration-200">
                  <span className="font-extrabold text-xl tracking-tight text-slate-800 flex items-center gap-1">
                    RupRad <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700">Beta</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Student Spend & Split</span>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                title="Collapse Sidebar"
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Perfectly Centered Rupee Icon when Collapsed */
            <div className="w-full flex items-center justify-center relative">
              <div 
                onClick={() => setIsExpanded(true)}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-400/25 shrink-0 font-bold text-lg cursor-pointer hover:scale-105 transition-transform select-none"
                title="Click to expand sidebar"
              >
                ₹
              </div>
              
              <button
                onClick={() => setIsExpanded(true)}
                title="Expand Sidebar"
                className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-[#EBE4D5] shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all z-50 focus:outline-none"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation & Clean Demo Simulator Item */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          
          {/* Main Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-medium text-sm transition-all duration-150 relative group ${
                    isActive 
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-400/25 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  
                  {isExpanded && (
                    <div className="flex items-center justify-between flex-1 truncate">
                      <span className="truncate">{item.label}</span>
                      {item.hasRedDot && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Notes pending" />
                      )}
                    </div>
                  )}

                  {/* Red dot indicator when collapsed */}
                  {!isExpanded && item.hasRedDot && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
                  )}

                  {/* Floating tooltip when collapsed */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Simple Demo Simulator Menu Item */}
          <div className="pt-2">
            {isExpanded ? (
              <div className="space-y-1">
                <button
                  onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-medium text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                    isDemoDropdownOpen ? 'bg-slate-50 text-slate-900 font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-slate-500 shrink-0" />
                    <span>Demo Simulator</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isDemoDropdownOpen ? 'rotate-180 text-slate-700' : ''
                  }`} />
                </button>

                {/* Clean Dropdown Menu */}
                {isDemoDropdownOpen && (
                  <div className="ml-4 pl-3 border-l-2 border-slate-200 space-y-1 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={onTriggerOverdueNote}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
                    >
                      <span className="text-sm">⏰</span>
                      <span>3-4h Note Reminder</span>
                    </button>

                    <button
                      onClick={onOpenSmsSync}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
                    >
                      <span className="text-sm">📩</span>
                      <span>Simulate Bank SMS</span>
                    </button>

                    <button
                      onClick={onOpenSplitzModal}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
                    >
                      <span className="text-sm">🍕</span>
                      <span>Test Splitz</span>
                    </button>

                    <button
                      onClick={onTriggerHighSpend}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
                    >
                      <span className="text-sm">😭</span>
                      <span>Test Overspend (Score)</span>
                    </button>

                    <button
                      onClick={onResetData}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors text-left pt-1 border-t border-slate-100"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Collapsed State: Icon with Popover Menu */
              <div className="relative flex justify-center">
                <button
                  onClick={() => setCollapsedPopoverOpen(!collapsedPopoverOpen)}
                  title="Demo Simulator"
                  className={`w-full flex items-center justify-center p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                    collapsedPopoverOpen ? 'bg-slate-100 text-slate-900' : ''
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </button>

                {collapsedPopoverOpen && (
                  <div className="absolute left-full ml-3 top-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                    <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Demo Simulator
                    </div>
                    <button
                      onClick={() => { onTriggerOverdueNote(); setCollapsedPopoverOpen(false); }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 text-left"
                    >
                      <span>⏰</span> <span>3-4h Note Reminder</span>
                    </button>
                    <button
                      onClick={() => { onOpenSmsSync(); setCollapsedPopoverOpen(false); }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 text-left"
                    >
                      <span>📩</span> <span>Simulate Bank SMS</span>
                    </button>
                    <button
                      onClick={() => { onOpenSplitzModal(); setCollapsedPopoverOpen(false); }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 text-left"
                    >
                      <span>🍕</span> <span>Test Splitz</span>
                    </button>
                    <button
                      onClick={() => { onTriggerHighSpend(); setCollapsedPopoverOpen(false); }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 text-left"
                    >
                      <span>😭</span> <span>Test Overspend</span>
                    </button>
                    <button
                      onClick={() => { onResetData(); setCollapsedPopoverOpen(false); }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left pt-1 border-t border-slate-100"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> <span>Reset Data</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Profile & Student Campus Badge */}
      <div className="p-3 border-t border-[#EBE4D5] bg-[#F7F4EE]/50 shrink-0">
        {isExpanded ? (
          <button 
            onClick={onOpenProfile}
            title="Edit Profile (Name, Photo, UPI)"
            className="w-full p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 shadow-sm flex items-center gap-2.5 transition-all text-left group cursor-pointer"
          >
            <div className="relative shrink-0">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"} 
                alt="Avatar" 
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-sky-400/30 group-hover:ring-sky-400 transition-all" 
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-sky-500 rounded-full border-2 border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-2 h-2 text-white" />
              </span>
            </div>
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 group-hover:text-sky-600 truncate transition-colors">
                  {user?.name || "Aarav Sharma"}
                </p>
                <span className="text-[10px] text-sky-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.college || "BITS Pilani • CS '27"}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="UPI Active & Linked" />
          </button>
        ) : (
          <button 
            onClick={onOpenProfile}
            title={`Edit Profile (${user?.name || 'Aarav'})`}
            className="flex justify-center py-1 w-full group cursor-pointer focus:outline-none"
          >
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"} 
              alt="Avatar" 
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-sky-400/30 group-hover:ring-sky-400 group-hover:scale-105 transition-all shadow-sm" 
            />
          </button>
        )}
      </div>
    </aside>
  );
}
