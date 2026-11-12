// Initial student mock data and models

export const INITIAL_USER = {
  name: "Aarav Sharma",
  college: "Tech Institute of Engineering (B.Tech CS)",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
  upiId: "aarav.sharma@okhdfcbank",
  monthlyBudgetLimit: 12000,
  currentBalance: 8450,
  joinedMonth: "November 2026"
};

export const CATEGORIES = {
  food: {
    id: "food",
    name: "Food & Canteen",
    icon: "Utensils",
    color: "#F59E0B", // Amber
    bg: "bg-amber-50 text-amber-600 border-amber-200",
    gradient: "from-amber-400 to-orange-500",
    emoji: "🍔"
  },
  travel: {
    id: "travel",
    name: "Travel & Fuel",
    icon: "Fuel",
    color: "#06B6D4", // Cyan
    bg: "bg-cyan-50 text-cyan-600 border-cyan-200",
    gradient: "from-cyan-400 to-teal-500",
    emoji: "⛽"
  },
  stationary: {
    id: "stationary",
    name: "Stationary & Study",
    icon: "BookOpen",
    color: "#6366F1", // Indigo
    bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
    gradient: "from-indigo-400 to-blue-500",
    emoji: "📚"
  },
  medicine: {
    id: "medicine",
    name: "Medicine & Health",
    icon: "Cross",
    color: "#EF4444", // Red
    bg: "bg-rose-50 text-rose-600 border-rose-200",
    gradient: "from-rose-400 to-red-500",
    emoji: "💊"
  },
  entertainment: {
    id: "entertainment",
    name: "Entertainment & OTT",
    icon: "Film",
    color: "#EC4899", // Pink
    bg: "bg-pink-50 text-pink-600 border-pink-200",
    gradient: "from-pink-400 to-rose-500",
    emoji: "🎬"
  },
  hostel: {
    id: "hostel",
    name: "Hostel & Utility",
    icon: "Home",
    color: "#10B981", // Emerald
    bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
    gradient: "from-emerald-400 to-teal-600",
    emoji: "🏠"
  },
  other: {
    id: "other",
    name: "Other & Personal",
    icon: "ShoppingBag",
    color: "#8B5CF6", // Purple
    bg: "bg-purple-50 text-purple-600 border-purple-200",
    gradient: "from-purple-400 to-violet-600",
    emoji: "🛍️"
  }
};

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-1",
    amount: 200,
    // Raw Bank Details (What the bank or UPI statement provides)
    accountHolder: "BALAJI FUELS & SERVICE STATION",
    upiId: "balajifuels@okhdfcbank",
    refId: "UPI/382910482091",
    bankAccount: "HDFC A/c **4021",
    // Note: Empty! Needs student to write "petrol bunk"
    note: "", 
    category: "travel",
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), // 3.5 hours ago
    status: "completed",
    paymentMethod: "UPI (Google Pay)",
    source: "upi",
    needsNoteReminder: true,
    splitId: null
  },
  {
    id: "tx-2",
    amount: 140,
    accountHolder: "M/S RAMESH CANTEEN & SNACKS",
    upiId: "rameshcanteen@okaxis",
    refId: "UPI/382919827104",
    bankAccount: "HDFC A/c **4021",
    note: "Samosa & cold coffee with batchmates",
    category: "food",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    paymentMethod: "UPI (PhonePe)",
    source: "upi",
    needsNoteReminder: false,
    splitId: null
  },
  {
    id: "tx-3",
    amount: 600,
    accountHolder: "PVR INOX LIMITED",
    upiId: "pvr.inox@paytm",
    refId: "UPI/382894719203",
    bankAccount: "HDFC A/c **4021",
    note: "Movie tickets (Interstellar Re-release)",
    category: "entertainment",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    paymentMethod: "UPI (Paytm)",
    source: "splitz",
    needsNoteReminder: false,
    splitId: "split-1"
  },
  {
    id: "tx-4",
    amount: 320,
    accountHolder: "SHREE GANESH ENTERPRISES",
    upiId: "ganeshxerox@ybl",
    refId: "UPI/382719284910",
    bankAccount: "HDFC A/c **4021",
    note: "Sem 5 Lab Manuals & Drawing sheets",
    category: "stationary",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    paymentMethod: "UPI (HDFC)",
    source: "upi",
    needsNoteReminder: false,
    splitId: null
  },
  {
    id: "tx-5",
    amount: 185,
    accountHolder: "APOLLO PHARMACIES LTD",
    upiId: "apolloretail@icici",
    refId: "UPI/382601928491",
    bankAccount: "HDFC A/c **4021",
    note: "Paracetamol & ORS hydration salts",
    category: "medicine",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    paymentMethod: "UPI (Google Pay)",
    source: "upi",
    needsNoteReminder: false,
    splitId: null
  },
  {
    id: "tx-6",
    amount: 450,
    accountHolder: "NIGHT RUNNER FOODS LLP",
    upiId: "burgerclub@okhdfcbank",
    refId: "UPI/382591029384",
    bankAccount: "HDFC A/c **4021",
    note: "Midnight coding study snack",
    category: "food",
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    paymentMethod: "UPI (PhonePe)",
    source: "upi",
    needsNoteReminder: false,
    splitId: null
  },
  {
    id: "tx-7",
    amount: 1500,
    accountHolder: "CAMPUS HOSTEL TRUST",
    upiId: "hostelwarden@sbi",
    refId: "UPI/382491029381",
    bankAccount: "HDFC A/c **4021",
    note: "Semester Wi-Fi & Laundry Card Recharge",
    category: "hostel",
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    paymentMethod: "UPI (NetBanking)",
    source: "upi",
    needsNoteReminder: false,
    splitId: null
  },
  {
    id: "tx-8",
    amount: 350,
    accountHolder: "METRO RAIL CORP LTD",
    upiId: "dmrc.smartcard@paytm",
    refId: "UPI/382391029384",
    bankAccount: "HDFC A/c **4021",
    note: "Monthly metro transit pass",
    category: "travel",
    timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    paymentMethod: "UPI (SBI)",
    source: "upi",
    needsNoteReminder: false,
    splitId: null
  }
];

export const INITIAL_FRIENDS = [
  { id: "f-1", name: "Rohan Varma", phone: "+91 98765 43210", upi: "rohanv@okicici", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" },
  { id: "f-2", name: "Priya Nair", phone: "+91 98123 45678", upi: "priyan@oksbi", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" },
  { id: "f-3", name: "Kabir Mehta", phone: "+91 97654 32109", upi: "kabir99@okaxis", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
  { id: "f-4", name: "Sneha Patel", phone: "+91 99234 56789", upi: "sneha.p@paytm", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80" },
  { id: "f-5", name: "Devansh Rao", phone: "+91 96543 21098", upi: "devansh@okhdfc", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" }
];

export const INITIAL_SPLITZ = [
  {
    id: "split-1",
    title: "Friday Movie & Popcorn (PVR)",
    totalAmount: 900,
    creator: "Aarav Sharma (You)",
    merchant: "PVR Cinemas Inox",
    isPaidToMerchant: true,
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    participants: [
      { id: "self", name: "Aarav (You)", share: 300, hasPaid: true, isCreator: true },
      { id: "f-1", name: "Rohan Varma", share: 300, hasPaid: true, phone: "+91 98765 43210" },
      { id: "f-2", name: "Priya Nair", share: 300, hasPaid: false, phone: "+91 98123 45678" }
    ],
    category: "entertainment"
  },
  {
    id: "split-2",
    title: "Campus Cafe Chillout",
    totalAmount: 480,
    creator: "Aarav Sharma (You)",
    merchant: "CCD / Campus Brews",
    isPaidToMerchant: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    participants: [
      { id: "self", name: "Aarav (You)", share: 160, hasPaid: true, isCreator: true },
      { id: "f-3", name: "Kabir Mehta", share: 160, hasPaid: false, phone: "+91 97654 32109" },
      { id: "f-4", name: "Sneha Patel", share: 160, hasPaid: true, phone: "+91 99234 56789" }
    ],
    category: "food"
  }
];

export const INITIAL_INVITED_SPLITZ = [
  {
    id: "inv-1",
    title: "Domino's Pizza Study Session",
    hostName: "Rohan Varma",
    hostUpi: "rohanv@okicici",
    hostPhone: "+91 98765 43210",
    totalBill: 1050,
    myShare: 260,
    hasPaid: false,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    membersCount: 4,
    note: "Extra cheese Margherita + Garlic Bread"
  },
  {
    id: "inv-2",
    title: "Goa Vacation Pre-Cab Booking",
    hostName: "Sneha Patel",
    hostUpi: "sneha.p@paytm",
    hostPhone: "+91 99234 56789",
    totalBill: 2400,
    myShare: 600,
    hasPaid: true,
    date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    membersCount: 4,
    note: "Airport to Baga Beach cab shared"
  }
];

export const INITIAL_SMS_INBOX = [
  {
    id: "sms-1",
    sender: "VK-HDFCBK",
    bank: "HDFC Bank",
    text: "Debited INR 200.00 from A/C **4021 on 12-Nov-26 to BALAJI FUELS & SERVICE STATION. UPI Ref: 382910482091.",
    amount: 200,
    accountHolder: "BALAJI FUELS & SERVICE STATION",
    upiId: "balajifuels@okhdfcbank",
    refId: "UPI/382910482091",
    categoryGuess: "travel",
    detectedTime: "3.5 hours ago",
    status: "unclassified",
    needsNote: true
  },
  {
    id: "sms-2",
    sender: "VM-SBIUPI",
    bank: "State Bank of India",
    text: "Rs. 180.00 debited from SBI A/C *7721 via UPI to M/S CAMPUS BITES on 12-Nov-26 09:15:20. UPI ID: campusbites@okaxis. Bal: Rs 8,450.00.",
    amount: 180,
    accountHolder: "M/S CAMPUS BITES",
    upiId: "campusbites@okaxis",
    refId: "UPI/382918274019",
    categoryGuess: "food",
    detectedTime: "1 hour ago",
    status: "unclassified",
    needsNote: true
  },
  {
    id: "sms-3",
    sender: "AX-ICICIB",
    bank: "ICICI Bank",
    text: "Dear Customer, INR 45.00 debited for UPI txn to SHREE XEROX PRINTS on 11-Nov-26. UPI ID: shreexerox@icici. Ref: 481920.",
    amount: 45,
    accountHolder: "SHREE XEROX PRINTS",
    upiId: "shreexerox@icici",
    refId: "UPI/382901827104",
    categoryGuess: "stationary",
    detectedTime: "Yesterday",
    status: "unclassified",
    needsNote: true
  }
];

export const WEEKLY_SPEND_DATA = [
  { day: "Mon", food: 220, travel: 80, others: 120, total: 420 },
  { day: "Tue", food: 180, travel: 200, others: 90, total: 470 },
  { day: "Wed", food: 310, travel: 50, others: 180, total: 540 },
  { day: "Thu", food: 190, travel: 90, others: 60, total: 340 },
  { day: "Fri", food: 450, travel: 120, others: 600, total: 1170 }, // movie & outing
  { day: "Sat", food: 380, travel: 150, others: 140, total: 670 },
  { day: "Sun (Today)", food: 240, travel: 200, others: 50, total: 490 }
];
