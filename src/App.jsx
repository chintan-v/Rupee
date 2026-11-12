import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewCards from './components/OverviewCards';
import PendingNotesReminder from './components/PendingNotesReminder';
import SpendCharts from './components/SpendCharts';
import TransactionHistory from './components/TransactionHistory';
import SplitzView from './components/SplitzView';
import SplitzModal from './components/SplitzModal';
import QuickPayModal from './components/QuickPayModal';
import SmsBankSyncModal from './components/SmsBankSyncModal';
import SmartAnalyst from './components/SmartAnalyst';
import BudgetScoreView from './components/BudgetScoreView';
import ProfileModal from './components/ProfileModal';

import { 
  INITIAL_USER, 
  INITIAL_TRANSACTIONS, 
  INITIAL_FRIENDS, 
  INITIAL_SPLITZ, 
  INITIAL_INVITED_SPLITZ,
  INITIAL_SMS_INBOX,
  WEEKLY_SPEND_DATA,
  CATEGORIES 
} from './data/initialData';

export default function App() {
  // Sidebar expanded / collapsed
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Active navigation tab: 'dashboard', 'splitz', 'quickpay', 'analyst', 'budget-score', 'sms-sync'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Application Data States
  const [user, setUser] = useState(INITIAL_USER);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [splits, setSplits] = useState(INITIAL_SPLITZ);
  const [invitedSplits, setInvitedSplits] = useState(INITIAL_INVITED_SPLITZ);
  const [smsInbox, setSmsInbox] = useState(INITIAL_SMS_INBOX);

  // Modal open states
  const [isSplitzModalOpen, setIsSplitzModalOpen] = useState(false);
  const [isQuickPayModalOpen, setIsQuickPayModalOpen] = useState(false);
  const [isSmsSyncModalOpen, setIsSmsSyncModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Filter state for transactions
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Compute Total Spent
  const totalSpent = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions]);

  // Compute Daily & Weekly Average
  // Assuming 12 days in November so far (current date)
  const currentDayOfMonth = 12;
  const dailyAvg = Math.round(totalSpent / currentDayOfMonth);
  const weeklyAvg = Math.round(dailyAvg * 7);

  // Compute Pending Notes (missing note AND either flagged or >= 3 hours ago)
  const pendingTransactionsWithNote = useMemo(() => {
    return transactions.filter(tx => {
      const hasNoNote = !tx.note || tx.note.trim() === '';
      return hasNoNote;
    });
  }, [transactions]);

  // Compute Splitz Net Balance
  const splitzBalance = useMemo(() => {
    // What friends owe me (from splits I created where participant != creator and hasPaid == false)
    let youAreOwed = 0;
    splits.forEach(split => {
      split.participants.forEach(p => {
        if (!p.isCreator && !p.hasPaid) {
          youAreOwed += Number(p.share);
        }
      });
    });

    // What I owe friends (from invited splits where hasPaid == false)
    let youOwe = 0;
    invitedSplits.forEach(inv => {
      if (!inv.hasPaid) {
        youOwe += Number(inv.myShare);
      }
    });

    return {
      youAreOwed,
      youOwe,
      net: youAreOwed - youOwe
    };
  }, [splits, invitedSplits]);

  // Compute Financial Health Score (0 - 100)
  const budgetHealthScore = useMemo(() => {
    const limit = user.monthlyBudgetLimit;
    if (totalSpent > limit) {
      const overspendRatio = (totalSpent - limit) / limit;
      return Math.max(15, Math.round(45 - overspendRatio * 50));
    }
    const safeRatio = (limit - totalSpent) / limit;
    return Math.min(96, Math.round(52 + safeRatio * 44));
  }, [totalSpent, user.monthlyBudgetLimit]);

  // Counts for sidebar badges
  const pendingNotesCount = pendingTransactionsWithNote.length;
  const pendingSplitsCount = splits.reduce((acc, s) => acc + s.participants.filter(p => !p.hasPaid && !p.isCreator).length, 0);
  const pendingInvitedCount = invitedSplits.filter(i => !i.hasPaid).length;

  // Handlers
  const handleUpdateNote = (txId, newNote, newCategory) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        return {
          ...tx,
          note: newNote,
          category: newCategory || tx.category,
          needsNoteReminder: false
        };
      }
      return tx;
    }));
  };

  const handleMakePayment = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => ({
      ...prev,
      currentBalance: prev.currentBalance - newTx.amount
    }));
  };

  const handleCreateSplit = (newSplit) => {
    setSplits(prev => [newSplit, ...prev]);
  };

  const handleToggleFriendPaid = (splitId, friendId) => {
    setSplits(prev => prev.map(split => {
      if (split.id === splitId) {
        return {
          ...split,
          participants: split.participants.map(p => {
            if (p.id === friendId) {
              return { ...p, hasPaid: !p.hasPaid };
            }
            return p;
          })
        };
      }
      return split;
    }));
  };

  const handleMarkMerchantPaid = (splitId) => {
    setSplits(prev => prev.map(split => {
      if (split.id === splitId) {
        return { ...split, isPaidToMerchant: true };
      }
      return split;
    }));
  };

  const handleSettleInvitedSplit = (invitedSplitId, shareAmount, hostName, title) => {
    // 1. Mark invited split as paid
    setInvitedSplits(prev => prev.map(inv => {
      if (inv.id === invitedSplitId) {
        return { ...inv, hasPaid: true };
      }
      return inv;
    }));

    // 2. Add automatic transaction to feed
    const paymentTx = {
      id: `tx-settle-${Date.now()}`,
      amount: shareAmount,
      merchant: `Settlement to ${hostName}`,
      note: `Split settlement for ${title}`,
      category: "food",
      timestamp: new Date().toISOString(),
      status: "completed",
      paymentMethod: "UPI (Splitz)",
      source: "splitz",
      needsNoteReminder: false,
      splitId: null
    };

    setTransactions(prev => [paymentTx, ...prev]);
  };

  const handleImportSmsTransaction = (sms) => {
    const newTx = {
      id: `tx-sms-${Date.now()}`,
      amount: sms.amount,
      accountHolder: sms.accountHolder || sms.merchant || "UNKNOWN RECIPIENT",
      upiId: sms.upiId || "payee@upi",
      refId: sms.refId || `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      bankAccount: "HDFC A/c **4021",
      note: "", // Initially empty so user or reminder asks for note
      category: sms.categoryGuess || "other",
      timestamp: new Date().toISOString(),
      status: "completed",
      paymentMethod: `${sms.bank} (SMS Sync)`,
      source: "sms",
      needsNoteReminder: true,
      splitId: null
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  const handleUpdateBudgetLimit = (newLimit) => {
    setUser(prev => ({
      ...prev,
      monthlyBudgetLimit: newLimit
    }));
  };

  // Quick Demo Trigger Handlers
  const triggerDemoOverdueNote = () => {
    const demoTx = {
      id: `tx-demo-${Date.now()}`,
      amount: 200,
      accountHolder: "BALAJI FUELS & SERVICE STATION",
      upiId: "balajifuels@okhdfcbank",
      refId: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      bankAccount: "HDFC A/c **4021",
      note: "", // Empty note! Only raw bank account details exist!
      category: "travel",
      timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(), // 3.8h ago
      status: "completed",
      paymentMethod: "UPI (Google Pay)",
      source: "upi",
      needsNoteReminder: true,
      splitId: null
    };
    setTransactions(prev => [demoTx, ...prev]);
    setActiveTab('dashboard');
  };

  const triggerDemoHighSpend = () => {
    // Adds an expense to push total over limit to show 😭 low score
    const bigTx = {
      id: `tx-big-${Date.now()}`,
      amount: 5000,
      accountHolder: "APPLE RESELLER & CAMPUS TECH",
      upiId: "campustech@okhdfcbank",
      refId: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      bankAccount: "HDFC A/c **4021",
      note: "Tech accessories for semester coding",
      category: "stationary",
      timestamp: new Date().toISOString(),
      status: "completed",
      paymentMethod: "UPI (HDFC)",
      source: "upi",
      needsNoteReminder: false,
      splitId: null
    };
    setTransactions(prev => [bigTx, ...prev]);
  };

  const resetToInitialState = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setUser(INITIAL_USER);
  };

  const handleUpdateUser = (updatedFields) => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800">
      
      {/* Expandable and Collapsible Sidebar */}
      <Sidebar 
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingNotesCount={pendingNotesCount}
        pendingSplitsCount={pendingSplitsCount}
        invitedSplitsCount={pendingInvitedCount}
        score={budgetHealthScore}
        onTriggerOverdueNote={triggerDemoOverdueNote}
        onTriggerHighSpend={triggerDemoHighSpend}
        onOpenSmsSync={() => setIsSmsSyncModalOpen(true)}
        onOpenSplitzModal={() => {
          setActiveTab('splitz');
          setIsSplitzModalOpen(true);
        }}
        onResetData={resetToInitialState}
        user={user}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Header */}
        <Header 
          user={user}
          pendingNotesCount={pendingNotesCount}
          onOpenQuickPay={() => setIsQuickPayModalOpen(true)}
          onOpenSplitz={() => setIsSplitzModalOpen(true)}
          onOpenSmsSync={() => setIsSmsSyncModalOpen(true)}
          score={budgetHealthScore}
          onNavigateToTab={(tab) => setActiveTab(tab)}
        />

        {/* Page Content based on Active Tab */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* Overdue/Pending Note Reminder Banner (3-4h reminder) */}
              <PendingNotesReminder 
                pendingTransactions={pendingTransactionsWithNote}
                onUpdateNote={handleUpdateNote}
              />

              {/* 4 Hero KPI Metric Cards (Ref Image 1 & 2 inspired) */}
              <OverviewCards 
                totalSpent={totalSpent}
                monthlyLimit={user.monthlyBudgetLimit}
                dailyAvg={dailyAvg}
                weeklyAvg={weeklyAvg}
                splitzBalance={splitzBalance}
                score={budgetHealthScore}
                onOpenSplitz={() => setActiveTab('splitz')}
                onOpenQuickPay={() => setIsQuickPayModalOpen(true)}
                onOpenBudgetModal={() => setActiveTab('budget-score')}
              />

              {/* Visual Spending Charts & Top Categories (Ref Image 1 & 2 inspired) */}
              <SpendCharts 
                weeklyData={WEEKLY_SPEND_DATA}
                transactions={transactions}
                onFilterCategory={(catKey) => {
                  setCategoryFilter(catKey);
                  // Scroll to transactions
                  const txElement = document.getElementById('transactions-section');
                  if (txElement) txElement.scrollIntoView({ behavior: 'smooth' });
                }}
                onExploreAiInsights={() => setActiveTab('analyst')}
              />

              {/* Transaction History & Inline Note Tagger */}
              <div id="transactions-section">
                <TransactionHistory 
                  transactions={transactions}
                  onUpdateNote={handleUpdateNote}
                  onAddNewPayment={() => setIsQuickPayModalOpen(true)}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                />
              </div>
            </>
          )}

          {/* TAB 2: SPLITZ HUB (3-Tap Bill Splitter & Invited Bills) */}
          {activeTab === 'splitz' && (
            <SplitzView 
              splits={splits}
              invitedSplits={invitedSplits}
              user={user}
              onOpenCreateSplitModal={() => setIsSplitzModalOpen(true)}
              onToggleFriendPaid={handleToggleFriendPaid}
              onMarkMerchantPaid={handleMarkMerchantPaid}
              onSettleInvitedSplit={handleSettleInvitedSplit}
            />
          )}

          {/* TAB 3: QUICK PAY & NOTE TAGGER */}
          {activeTab === 'quickpay' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">UPI Payment Hub & Immediate Note Tagging</h2>
                  <p className="text-xs text-slate-300 mt-1">Make payments to merchants or friends and tag what it was for.</p>
                </div>
                <button
                  onClick={() => setIsQuickPayModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs shadow-md"
                >
                  + Launch UPI Pay Form
                </button>
              </div>

              <PendingNotesReminder 
                pendingTransactions={pendingTransactionsWithNote}
                onUpdateNote={handleUpdateNote}
              />

              <TransactionHistory 
                transactions={transactions}
                onUpdateNote={handleUpdateNote}
                onAddNewPayment={() => setIsQuickPayModalOpen(true)}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
            </div>
          )}

          {/* TAB 4: SMART ANALYST */}
          {activeTab === 'analyst' && (
            <SmartAnalyst 
              transactions={transactions}
              monthlyLimit={user.monthlyBudgetLimit}
              totalSpent={totalSpent}
            />
          )}

          {/* TAB 5: BUDGET LIMIT, REMINDERS & HEALTH SCORE */}
          {activeTab === 'budget-score' && (
            <BudgetScoreView 
              totalSpent={totalSpent}
              monthlyLimit={user.monthlyBudgetLimit}
              onUpdateLimit={handleUpdateBudgetLimit}
              score={budgetHealthScore}
            />
          )}

          {/* TAB 6: SMS & BANK AUTO-SYNC SIMULATOR */}
          {activeTab === 'sms-sync' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Direct SMS & Bank Sync Center</h2>
                  <p className="text-xs text-orange-100 mt-1">Simulates reading incoming bank SMS notifications and auto-creating transactions.</p>
                </div>
                <button
                  onClick={() => setIsSmsSyncModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs shadow-md"
                >
                  Open SMS Sync Console
                </button>
              </div>

              <TransactionHistory 
                transactions={transactions}
                onUpdateNote={handleUpdateNote}
                onAddNewPayment={() => setIsQuickPayModalOpen(true)}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
            </div>
          )}

          {/* TAB 7: THEME & COLOR CUSTOMIZER */}
          {activeTab === 'themes' && (
            <ThemeCustomizerView 
              currentThemeId={currentThemeId}
              onSelectTheme={handleSelectTheme}
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
              customPrimary={customPrimary}
              onUpdateCustomPrimary={handleUpdateCustomPrimary}
            />
          )}

        </main>
      </div>

      {/* Modals */}
      <SplitzModal 
        isOpen={isSplitzModalOpen}
        onClose={() => setIsSplitzModalOpen(false)}
        friends={friends}
        onCreateSplit={handleCreateSplit}
      />

      <QuickPayModal 
        isOpen={isQuickPayModalOpen}
        onClose={() => setIsQuickPayModalOpen(false)}
        onMakePayment={handleMakePayment}
      />

      <SmsBankSyncModal 
        isOpen={isSmsSyncModalOpen}
        onClose={() => setIsSmsSyncModalOpen(false)}
        smsList={smsInbox}
        onImportSmsTransaction={handleImportSmsTransaction}
      />

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />

    </div>
  );
}
