// Centralized Mock Data for HOTELOGX CONNECT Operational System

export const initialDashboardData = {
  hotelName: "Mercier Hotel",
  managerName: "John",
  managerRole: "Manager",
  arrivals: 24,
  departures: 18,
  guestRequests: 9,
  escalations: 2,
  
  aiSummary: [
    "2 guests requested early check-in (Room 401 & 205)",
    "Room 302 maintenance ticket is still open (AC failure)",
    "One VIP guest (Sarah Johnson) arriving today at 14:00",
    "3 unpaid departure bills detected requiring front office review",
    "AI resolved 84% of guest conversations automatically today"
  ],

  revenueOpportunities: [
    { id: "rev-1", title: "Breakfast Upsell", amount: 160, currency: "€", count: 8 },
    { id: "rev-2", title: "Late Checkout", amount: 120, currency: "€", count: 4 },
    { id: "rev-3", title: "Parking", amount: 75, currency: "€", count: 5 },
    { id: "rev-4", title: "Airport Transfer", amount: 90, currency: "€", count: 2 }
  ],

  departmentStatus: [
    { id: "dept-1", name: "Front Office", status: "ok", text: "Operational", icon: "CheckCircle2", link: "/app/conversations" },
    { id: "dept-2", name: "Housekeeping", status: "warning", text: "2 delayed rooms", icon: "AlertTriangle", link: "/app/housekeeping" },
    { id: "dept-3", name: "Maintenance", status: "urgent", text: "1 open issue", icon: "Wrench", link: "/app/maintenance" },
    { id: "dept-4", name: "Restaurant", status: "ok", text: "Operational", icon: "CheckCircle2", link: "/app" }
  ],

  priorityActions: [
    { id: "act-1", title: "Call VIP guest about airport pickup", status: "pending", category: "Front Office", target: "/app/conversations" },
    { id: "act-2", title: "Approve late checkout request", status: "pending", category: "Front Office", target: "/app/conversations" },
    { id: "act-3", title: "Review unresolved maintenance ticket", status: "pending", category: "Maintenance", target: "/app/maintenance" },
    { id: "act-4", title: "Send housekeeping alert", status: "pending", category: "Housekeeping", target: "/app/housekeeping" }
  ]
};

export const initialHousekeepingData = {
  roomsReady: 42,
  roomsToClean: 18,
  lateRooms: 3,
  dndRooms: 5,
  vipRooms: 2,

  hotlineNumber: "+1 (555) 468-7300",
  hotlineName: "Housekeeping Central Mobile Dispatch",

  activeStaff: [
    { id: "hk-st-1", name: "Elena Rostova", role: "Housekeeping Supervisor", phone: "+1 (555) 468-7351", extension: "Ext 201", floor: "All Floors", activeRooms: 6, status: "Active (On Floor)", avatarColor: "bg-purple-600" },
    { id: "hk-st-2", name: "Anna Vance", role: "Senior Housekeeper", phone: "+1 (555) 468-7352", extension: "Ext 202", floor: "Floor 3 & 4 (VIP Wing)", activeRooms: 4, status: "Active (Cleaning)", avatarColor: "bg-indigo-600" },
    { id: "hk-st-3", name: "David Miller", role: "Housekeeper", phone: "+1 (555) 468-7353", extension: "Ext 203", floor: "Floor 3", activeRooms: 3, status: "Active (On Floor)", avatarColor: "bg-emerald-600" },
    { id: "hk-st-4", name: "Maria Santos", role: "Housekeeper", phone: "+1 (555) 468-7354", extension: "Ext 204", floor: "Floor 2", activeRooms: 5, status: "On Break", avatarColor: "bg-amber-600" }
  ],

  cleaningList: [
    { id: "hk-301", roomNumber: "301", type: "Departure", status: "Cleaning", priority: "Normal", assignedTo: "Anna Vance", floor: 3, notes: "Standard checkout clean" },
    { id: "hk-305", roomNumber: "305", type: "Stayover", status: "To Clean", priority: "Normal", assignedTo: "David Miller", floor: 3, notes: "Fresh towels requested" },
    { id: "hk-307", roomNumber: "307", type: "VIP", status: "To Clean", priority: "High", assignedTo: "Anna Vance", floor: 3, notes: "VIP arriving at 14:00. Extra fruit basket" },
    { id: "hk-312", roomNumber: "312", type: "Deep Clean", status: "To Clean", priority: "High", assignedTo: "David Miller", floor: 3, notes: "Monthly carpet deep clean" },
    { id: "hk-401", roomNumber: "401", type: "Early Arrival", status: "To Clean", priority: "High", assignedTo: "Anna Vance", floor: 4, notes: "Early arrival expected at 12:30" },
    { id: "hk-205", roomNumber: "205", type: "Early Arrival", status: "Cleaning", priority: "Normal", assignedTo: "Elena Rostova", floor: 2, notes: "Guest requested 11:30 checkin" }
  ],

  operationalAlerts: [
    "Prioritize room 401 (Early check-in at 12:30)",
    "Linen shortage reported on Floor 3 laundry station",
    "Room 307 VIP arrival scheduled at 14:00 sharp"
  ]
};

export const initialMaintenanceData = {
  openTickets: 5,
  urgentTickets: 2,
  completedToday: 7,

  hotlineNumber: "+1 (555) 871-3400",
  hotlineName: "Engineering & Maintenance Dispatch",

  activeStaff: [
    { id: "mnt-st-1", name: "Peter Hansen", role: "Maintenance Lead", phone: "+1 (555) 871-3401", extension: "Ext 301", specialty: "HVAC & Refrigeration", activeTickets: 3, status: "In Room 302", avatarColor: "bg-rose-600" },
    { id: "mnt-st-2", name: "Mike Alvarez", role: "Senior Technician", phone: "+1 (555) 871-3402", extension: "Ext 302", specialty: "Plumbing & Electrical", activeTickets: 2, status: "Available", avatarColor: "bg-teal-600" },
    { id: "mnt-st-3", name: "Carlos Gomez", role: "General Maintenance Tech", phone: "+1 (555) 871-3403", extension: "Ext 303", specialty: "Carpentry & Hardware", activeTickets: 1, status: "On Dispatch", avatarColor: "bg-amber-600" }
  ],

  tickets: [
    { 
      id: "mnt-102", 
      ticketNo: "#102",
      roomNumber: "302", 
      issue: "Air conditioning failure", 
      details: "Unit blowing warm air, compressor squeaking. Needs refrigerant check.",
      priority: "HIGH", 
      assignedTo: "Peter Hansen", 
      estimatedMinutes: 30,
      status: "OPEN",
      createdAt: "08:15 AM",
      reporter: "Front Desk"
    },
    { 
      id: "mnt-103", 
      ticketNo: "#103",
      roomNumber: "214", 
      issue: "Bathroom sink pipe leaking", 
      details: "Slow drip under drain joint.",
      priority: "MEDIUM", 
      assignedTo: "Mike Alvarez", 
      estimatedMinutes: 20,
      status: "IN_PROGRESS",
      createdAt: "09:30 AM",
      reporter: "Housekeeping"
    },
    { 
      id: "mnt-104", 
      ticketNo: "#104",
      roomNumber: "501", 
      issue: "TV Remote battery replacement & pairing", 
      details: "Remote unresponsive.",
      priority: "LOW", 
      assignedTo: "Peter Hansen", 
      estimatedMinutes: 10,
      status: "OPEN",
      createdAt: "10:05 AM",
      reporter: "Guest Request"
    },
    { 
      id: "mnt-105", 
      ticketNo: "#105",
      roomNumber: "108", 
      issue: "Balcony door latch loose", 
      details: "Safety latch loose screws.",
      priority: "HIGH", 
      assignedTo: "Mike Alvarez", 
      estimatedMinutes: 25,
      status: "OPEN",
      createdAt: "10:45 AM",
      reporter: "Housekeeping"
    },
    { 
      id: "mnt-106", 
      ticketNo: "#106",
      roomNumber: "410", 
      issue: "Mini-fridge not cooling", 
      details: "Power connected but temperature high.",
      priority: "MEDIUM", 
      assignedTo: "Carlos Gomez", 
      estimatedMinutes: 40,
      status: "OPEN",
      createdAt: "11:15 AM",
      reporter: "Guest Request"
    }
  ]
};

export const initialUsersData = [
  { id: "usr-1", name: "John", email: "john.manager@mercierhotel.com", role: "Manager", status: "Active", joinedDate: "2024-01-15", avatarColor: "bg-[#6D4AFF]" },
  { id: "usr-2", name: "Anna", email: "anna.frontdesk@mercierhotel.com", role: "Front Office", status: "Active", joinedDate: "2024-03-10", avatarColor: "bg-blue-600" },
  { id: "usr-3", name: "David", email: "david.frontdesk@mercierhotel.com", role: "Front Office", status: "Active", joinedDate: "2024-04-01", avatarColor: "bg-indigo-600" },
  { id: "usr-4", name: "Elena", email: "elena.hk@mercierhotel.com", role: "Housekeeping Manager", status: "Active", joinedDate: "2024-02-20", avatarColor: "bg-amber-600" },
  { id: "usr-5", name: "Maria", email: "maria.hk@mercierhotel.com", role: "Housekeeping Staff", status: "Active", joinedDate: "2024-05-12", avatarColor: "bg-emerald-600" },
  { id: "usr-6", name: "Peter", email: "peter.maintenance@mercierhotel.com", role: "Maintenance Manager", status: "Active", joinedDate: "2024-02-01", avatarColor: "bg-rose-600" },
  { id: "usr-7", name: "Mike", email: "mike.maintenance@mercierhotel.com", role: "Maintenance Staff", status: "Active", joinedDate: "2024-06-18", avatarColor: "bg-teal-600" }
];

export const initialConversationData = {
  activeGuest: {
    name: "Sarah Johnson",
    bookingNo: "#45874",
    room: "Deluxe King (Room 307)",
    arrival: "29 July",
    departure: "31 July",
    guestsCount: 2,
    isVip: true,
    avatar: "SJ"
  },
  messages: [
    { id: "msg-1", sender: "guest", text: "Can I check in earlier?", time: "10:14 AM" },
    { 
      id: "msg-2", 
      sender: "ai", 
      text: "Yes. Your room is expected to be ready around 12:30.\n\nAn early check-in can be arranged for €20.\n\nWould you like me to add this?", 
      time: "10:15 AM",
      isAi: true 
    }
  ],
  suggestedActions: [
    { id: "sug-1", name: "+ Add Breakfast", price: "€25" },
    { id: "sug-2", name: "+ Late Checkout", price: "€30" },
    { id: "sug-3", name: "+ Airport Taxi", price: "€45" },
    { id: "sug-4", name: "+ Parking", price: "€15" }
  ]
};
