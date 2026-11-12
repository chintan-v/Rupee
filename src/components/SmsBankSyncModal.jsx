import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Check, 
  Sparkles, 
  Download, 
  ArrowRight, 
  RefreshCw,
  ShieldCheck,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SmsBankSyncModal({ isOpen, onClose, smsList, onImportSmsTransaction }) {
  if (!isOpen) return null;

  const [localSmsList, setLocalSmsList] = useState(smsList);
  const [syncing, setSyncing] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const handleImport = (sms) => {
    onImportSmsTransaction(sms);
    setLocalSmsList(localSmsList.filter(s => s.id !== sms.id));

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  const handleSimulateNewSms = () => {
    setSyncing(true);
    setTimeout(() => {
      const newSms = {
        id: `sms-${Date.now()}`,
        sender: "VK-AXISBK",
        bank: "Axis Bank",
        text: `Rs. 250.00 debited from Axis A/c *8820 on 12-Nov-26 11:02 to CAMPUS JUICE & SNACKS. Bal: Rs 8,200.00`,
        amount: 250,
        merchant: "Campus Juice & Snacks",
        categoryGuess: "food",
        detectedTime: "Just now",
        status: "unclassified",
        needsNote: true
      };
      setLocalSmsList([newSms, ...localSmsList]);
      setSyncing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">Direct SMS & Bank Sync 📩</h3>
              <p className="text-xs text-orange-100">Auto-fetches debit alerts directly when app is standalone</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50 border border-orange-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-orange-950">SMS Reader Service Running</span>
            </div>
            <button
              onClick={handleSimulateNewSms}
              disabled={syncing}
              className="flex items-center gap-1 text-[11px] font-bold text-orange-700 hover:text-orange-900 bg-white px-2.5 py-1 rounded-xl border border-orange-200 shadow-sm"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              <span>Simulate New Bank SMS</span>
            </button>
          </div>

          <p className="text-xs text-slate-500">
            When you pay via any 3rd party bank app (GPay, PhonePe, Paytm, CRED), RupRad parses the debit SMS automatically and prompts you for the note.
          </p>

          {/* SMS List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {localSmsList.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">All SMS transactions synced!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click "Simulate New Bank SMS" to test receiving another.</p>
              </div>
            ) : (
              localSmsList.map((sms) => (
                <div 
                  key={sms.id}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-orange-400 bg-white shadow-sm space-y-2 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-lg bg-orange-100 text-orange-800">
                          {sms.bank}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{sms.detectedTime}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">
                        {sms.merchant}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-rose-600">-₹{sms.amount}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl font-mono leading-relaxed">
                    "{sms.text}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Suggested Category: <strong className="text-slate-700 uppercase">{sms.categoryGuess}</strong>
                    </span>

                    <button
                      onClick={() => handleImport(sms)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                    >
                      <Download className="w-3 h-3" />
                      <span>Import & Tag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Close Window
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
