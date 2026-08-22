import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  MessageSquare, 
  Clock, 
  LayoutDashboard, 
  Bell, 
  Sparkles,
  Smartphone,
  Wrench,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MaintenanceDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useApp();

  // Navigation view read from query params
  const searchParams = new URLSearchParams(location.search);
  const activeView = searchParams.get('tab') || 'dashboard';

  // Simulated operational state variables for Dashboard
  const [openIssuesCount, setOpenIssuesCount] = useState(5);
  const [activeCount, setActiveCount] = useState(1);
  const [inProgressCount, setInProgressCount] = useState(3);
  const [completedTodayCount, setCompletedTodayCount] = useState(1);
  const [activeTechnicianTab, setActiveTechnicianTab] = useState('peter'); // 'peter', 'milan'

  // Simulated operational state variables for Issues Log Page
  const [issuesFilter, setIssuesFilter] = useState('open'); // 'open', 'mine', 'urgent', 'parts', 'completed', 'all'
  const [tasksFilter, setTasksFilter] = useState('open'); // 'mine', 'open', 'completed', 'all'

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // New Task Form states
  const [taskForm, setTaskForm] = useState({
    what: 'Extra pillows for 208',
    detail: '',
    room: '302',
    due: '13:00',
    department: 'Maintenance',
    priority: 'Normal',
    sendTo: 'Leave unassigned'
  });

  // New Issue Form states
  const [issueForm, setIssueForm] = useState({
    what: 'Radiator not heating',
    detail: '',
    room: '115',
    urgency: 'Normal'
  });

  // Master ticket data lists for Dashboard
  const [dashboardTickets, setDashboardTickets] = useState([
    { 
      id: 'MT-116', 
      room: 'Room 307', 
      isUrgent: true, 
      status: 'In Progress', 
      isHousekeeping: true,
      title: 'Shower drain leaking into 207 ceiling',
      desc: 'Water leaking through ceiling. Assigned to Milan Novák.',
      meta: 'WhatsApp · Rosa Fernandes · 09:05',
      history: [
        '09:05 · Front Office says: We have reported 307 shower leak',
        '09:06 · Milan accepted on WhatsApp',
        '09:11 · Milan Novák accepted the 307 shower leak'
      ]
    },
    { 
      id: 'MT-115', 
      room: 'Room 302', 
      isHigh: true, 
      status: 'In Progress', 
      title: 'Air conditioning not cooling',
      desc: 'AC is blowing room-temperature air. Checked condenser check in progress.',
      meta: 'Guest WhatsApp · Clara Bertrand · 08:31',
      history: [
        '08:32 · Clara Bertrand: Guest complains AC not working.',
        '09:35 · Peter Janssens accepted AC check.',
        '09:36 · AC condenser check in progress.'
      ]
    },
    { 
      id: 'MT-113', 
      room: 'Room Lobby', 
      isNormal: true, 
      status: 'Waiting Parts', 
      title: 'Automated door sensor malfunctioning',
      desc: 'Door opens with no one present. Trigger every 10 minutes.',
      meta: 'PMS Event · Front Office · 07:15',
      history: [
        '07:15 · PMS Alert: Automated sensor malfunctioning.'
      ]
    },
    { 
      id: 'MT-114', 
      room: 'Room 216', 
      isNormal: true, 
      status: 'Waiting Parts', 
      title: 'Bathroom light flickering',
      desc: 'Light flickering in bathroom.',
      meta: 'Housekeeping · Maria Silva · 07:12',
      history: [
        '07:12 · Reported during departure clean.',
        '07:15 · Assigned on WhatsApp.'
      ]
    },
    { 
      id: 'MT-112', 
      room: 'Room 205', 
      isLow: true, 
      status: 'In Progress', 
      isMaintenance: true,
      title: 'Repainting after water damage',
      desc: 'Plaster work completed. Repainting scheduled.',
      meta: 'PMS Event · Maintenance · yesterday',
      history: [
        'yesterday · Plaster work finished.'
      ]
    }
  ]);

  // Master ticket data lists for Issues Log Page
  const [issuesList, setIssuesList] = useState([
    {
      id: 'MT-114',
      room: 'Room 302',
      isHigh: true,
      status: 'In Progress',
      title: 'Air conditioning not cooling',
      desc: 'Split unit runs, fan fine, air stays warm. Suspect condenser fan or low refrigerant.',
      meta: '08:32 · Clara Bertrand · Guest via WhatsApp · Peter Janssens',
      history: [
        { time: '09:20', type: 'accepted', text: 'Accepted on WhatsApp' },
        { time: '09:25', type: 'accepted', text: 'Roof condenser fan not spinning — checking capacitor' }
      ]
    },
    {
      id: 'MT-115',
      room: 'Room 307',
      isUrgent: true,
      status: 'In Progress',
      isOutOfService: true,
      title: 'Shower drain leaking into 207 ceiling',
      desc: 'Water tracking through the slab into 207. Seal or waste trap failure.',
      meta: '09:05 · Rosa Ferreira · Housekeeping via WhatsApp · Milan Novak',
      history: [
        { time: '09:07', type: 'bullet', text: 'Front Office warned — VIP arrival 14:00 for this room' },
        { time: '09:11', type: 'accepted', text: 'Accepted on WhatsApp' },
        { time: '09:48', type: 'accepted', text: 'Waste trap cracked. Replacement in the van, 30 min' }
      ]
    },
    {
      id: 'MT-116',
      room: 'Room 118',
      isNormal: true,
      status: 'Waiting Parts',
      title: 'Bathroom light flickering',
      desc: 'LED driver buzzing when dimmed.',
      meta: '09:05 · Alina Popescu · Housekeeping via WhatsApp · unassigned',
      history: [
        { time: '09:05', type: 'accepted', text: 'Reported during departure clean' },
        { time: '11:55', type: 'accepted', text: 'Status set to Waiting Parts' }
      ]
    },
    {
      id: 'MT-117',
      room: 'Room Lobby',
      isNormal: true,
      status: 'Waiting Parts',
      title: 'Automatic door sensor mistriggering',
      desc: 'Door opens with no one present, roughly every ten minutes.',
      meta: '08:15 · Amélie Duprez · Front Office · Peter Janssens',
      history: [
        { time: '08:44', type: 'accepted', text: 'Sensor ordered, arrives Wednesday. Reduced range in the meantime' }
      ]
    },
    {
      id: 'MT-118',
      room: 'Room 318',
      isLow: true,
      status: 'In Progress',
      isOutOfService: true,
      title: 'Repainting after water damage',
      desc: 'Planned works, room blocked in PMS until 20 Aug.',
      meta: 'yesterday 16:28 · Jonas Verhaeghe · AI Detection · Milan Novak',
      history: [
        { time: 'yesterday 16:22', type: 'accepted', text: 'Room blocked in PMS until 20 Aug' }
      ]
    }
  ]);

  // Master Maintenance Tasks List
  const [tasksList, setTasksList] = useState([
    {
      id: 'task-1',
      room: '302',
      title: 'Air conditioning not cooling',
      priority: 'High',
      desc: 'Split unit runs but blows warm. Guest in house until 19 Aug.',
      meta: '💬 Guest WhatsApp · 08:32 · 📅 due 11:00 · Clara Bertrand · Peter Janssens',
      status: 'In Progress'
    },
    {
      id: 'task-2',
      room: '307',
      title: 'Shower drain leaking into 207 ceiling',
      priority: 'Urgent',
      desc: 'Reported by housekeeping during stayover clean.',
      meta: '📋 Housekeeping · 09:06 · Milan Novák',
      status: 'In Progress'
    }
  ]);

  // WhatsApp Reports mock list (bottom of Tasks view)
  const whatsappReports = [
    { text: 'Waste trap cracked. Replacement in the van, 30 min', meta: '09:48 · MT-115 · Room 307' },
    { text: 'Roof condenser fan not spinning — checking capacitor', meta: '09:35 · MT-114 · Room 302' },
    { text: 'Accepted on WhatsApp', meta: '09:20 · MT-114 · Room 302' },
    { text: 'Accepted on WhatsApp', meta: '09:11 · MT-115 · Room 307' },
    { text: 'Reported during departure clean', meta: '09:05 · MT-116 · Room 118' },
    { text: 'Completed on WhatsApp — guest informed automatically', meta: '08:02 · MT-113 · Room 409' }
  ];

  // Actions for Sign Out
  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Actions for Dashboard
  const handleStartWork = (id) => {
    setDashboardTickets(prev => prev.map(t => {
      if (t.id === id) {
        if (t.status === 'Waiting Parts') {
          setInProgressCount(c => c + 1);
        }
        return { ...t, status: 'In Progress' };
      }
      return t;
    }));
  };

  const handleCompleteWork = (id) => {
    setDashboardTickets(prev => prev.map(t => {
      if (t.id === id) {
        if (t.status === 'In Progress') {
          setInProgressCount(c => Math.max(0, c - 1));
        }
        setCompletedTodayCount(c => c + 1);
        setOpenIssuesCount(c => Math.max(0, c - 1));
        return { ...t, status: 'Fixed' };
      }
      return t;
    }));
  };

  const handlePartsRequired = (id) => {
    setDashboardTickets(prev => prev.map(t => {
      if (t.id === id) {
        if (t.status === 'In Progress') {
          setInProgressCount(c => Math.max(0, c - 1));
        }
        return { ...t, status: 'Waiting Parts' };
      }
      return t;
    }));
  };

  // Actions for Issues Page
  const handleStartIssueWork = (id) => {
    setIssuesList(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'In Progress' };
      }
      return t;
    }));
  };

  const handleCompleteIssueWork = (id) => {
    setIssuesList(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'Fixed' };
      }
      return t;
    }));
  };

  const handleIssuePartsRequired = (id) => {
    setIssuesList(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'Waiting Parts' };
      }
      return t;
    }));
  };

  // Filter Issues List based on sub-tabs
  const getFilteredIssues = () => {
    if (issuesFilter === 'mine') return issuesList.filter(t => t.meta.includes('Peter Janssens'));
    if (issuesFilter === 'urgent') return issuesList.filter(t => t.isUrgent);
    if (issuesFilter === 'parts') return issuesList.filter(t => t.status === 'Waiting Parts');
    if (issuesFilter === 'completed') return issuesList.filter(t => t.status === 'Fixed');
    if (issuesFilter === 'open') return issuesList.filter(t => t.status !== 'Fixed');
    return issuesList;
  };

  // Actions for Tasks View
  const handleCompleteTask = (id) => {
    setTasksList(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'Completed' };
      }
      return t;
    }));
  };

  // Filter Tasks List based on sub-tabs
  const getFilteredTasks = () => {
    let result = tasksList;
    if (tasksFilter === 'mine') result = result.filter(t => t.meta.includes('Peter Janssens'));
    else if (tasksFilter === 'open') result = result.filter(t => t.status !== 'Completed');
    else if (tasksFilter === 'completed') result = result.filter(t => t.status === 'Completed');
    return result;
  };

  // Submit Handler for New Task Modal
  const submitNewTask = (e) => {
    e.preventDefault();
    if (!taskForm.what.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      room: taskForm.room,
      title: taskForm.what,
      priority: taskForm.priority,
      desc: taskForm.detail || 'Manual task description.',
      meta: `💬 ${taskForm.department} · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · due ${taskForm.due} · ${taskForm.sendTo}`,
      status: 'In Progress'
    };

    setTasksList(prev => [...prev, newTask]);
    setIsTaskModalOpen(false);
  };

  // Submit Handler for New Issue Modal
  const submitNewIssue = (e) => {
    e.preventDefault();
    if (!issueForm.what.trim()) return;

    const isUrgent = issueForm.urgency === 'Urgent';
    const isHigh = issueForm.urgency === 'High';
    const isNormal = issueForm.urgency === 'Normal';
    const isLow = issueForm.urgency === 'Low';

    const newIssue = {
      id: `MT-${119 + issuesList.length}`,
      room: `Room ${issueForm.room}`,
      isUrgent: isUrgent,
      isHigh: isHigh,
      isNormal: isNormal,
      isLow: isLow,
      status: 'In Progress',
      isOutOfService: isUrgent,
      title: issueForm.what,
      desc: issueForm.detail || 'Radiator checks scheduled.',
      meta: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Front Office · Guest via WhatsApp · Peter Janssens`,
      history: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'accepted', text: 'Ticket opened via dashboard' }
      ]
    };

    setIssuesList(prev => [...prev, newIssue]);
    setOpenIssuesCount(c => c + 1);
    setIsIssueModalOpen(false);
  };

  return (
    <div className="h-screen bg-[#F7F6F3] flex min-w-0 font-sans text-left relative overflow-hidden">
      <style>{`
        #front-office-maintenance-content,
        #front-office-maintenance-content button,
        #front-office-maintenance-content span,
        #front-office-maintenance-content p,
        #front-office-maintenance-content h1,
        #front-office-maintenance-content h2,
        #front-office-maintenance-content h3,
        #front-office-maintenance-content h4,
        #front-office-maintenance-content label,
        #front-office-maintenance-content td,
        #front-office-maintenance-content th {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
      `}</style>

      {/* 2. Main content page frame */}
      <div id="front-office-maintenance-content" className="flex-1 flex flex-col h-screen min-w-0 bg-[#F7F6F3] overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-center px-8 py-5 border-b border-[#E7E4DD] bg-white shrink-0">
          <div className="text-left space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap font-sans">
              <span className="text-xs font-bold text-slate-800">Hotel Mercier</span>
              <span className="text-slate-350 text-xs">•</span>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Antwerp · 48 rooms</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {activeView === 'issues' ? 'Issues' : activeView === 'tasks' ? 'Maintenance tasks' : 'Maintenance — the floor at a glance'}
            </h1>
          </div>

        </header>

        {/* Dynamic View Switcher */}
        {activeView === 'dashboard' ? (
          /* ========================================================================= */
          /* VIEW 1: MAINTENANCE DASHBOARD (MAIN VIEW)                                 */
          /* ========================================================================= */
          <div className="flex-1 p-8 space-y-8 min-h-0">
            
            {/* Main Dashboard Intro */}
            <div className="space-y-1.5 text-left select-none">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">GOOD AFTERNOON, PETER</span>
              <h2 className="text-2xl font-bold text-slate-955 tracking-tight font-serif">Technical Department</h2>
              <p className="text-xs text-slate-505 max-w-2xl font-medium leading-relaxed font-sans">
                Manage active maintenance tickets, technician workloads, and communicate directly with staff via automated WhatsApp layers.
              </p>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[110px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Open issues</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{openIssuesCount}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[110px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-555 uppercase tracking-wider leading-none">Active</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{activeCount}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[110px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-555 uppercase tracking-wider leading-none">In progress</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{inProgressCount}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[110px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-555 uppercase tracking-wider leading-none">Completed today</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{completedTodayCount}</span>
                </div>
              </div>
            </div>

            {/* Dashboard active tickets list panel */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline select-none">
                <div className="text-left space-y-0.5">
                  <h3 className="text-lg font-bold text-slate-955">Active tickets</h3>
                  <p className="text-[11px] text-slate-500 font-medium font-sans">Current issues being handled by technical staff</p>
                </div>
                <button 
                  onClick={() => navigate('?tab=issues')}
                  className="px-4 py-2 border border-[#E7E4DD] hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs transition-colors font-sans"
                >
                  → View issues log
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden divide-y divide-slate-100">
                {dashboardTickets.map((ticket) => {
                  const isFixed = ticket.status === 'Fixed';

                  return (
                    <div key={ticket.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap font-sans">
                          <span className="text-xs font-bold text-slate-400 font-mono">{ticket.id}</span>
                          <span className="text-slate-350">•</span>
                          <span className="text-xs font-bold text-slate-800">{ticket.room}</span>
                          <span className="text-slate-350">•</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider font-mono ${
                            ticket.isUrgent ? 'bg-red-50 text-red-700 border border-red-200/50' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ticket.isUrgent ? 'Urgent' : ticket.isHigh ? 'High' : 'Normal'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-serif">{ticket.title}</h4>
                        <p className="text-xs text-slate-505 leading-relaxed font-sans">{ticket.desc}</p>
                      </div>

                      <div className="flex gap-2 shrink-0 font-sans items-center">
                        {isFixed ? (
                          <span className="text-xs font-bold text-emerald-600 px-4 py-1.5 font-mono select-none">Fixed ✓</span>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleStartWork(ticket.id)}
                              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                            >
                              Start
                            </button>
                            <button 
                              onClick={() => handlePartsRequired(ticket.id)}
                              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                            >
                              Parts required
                            </button>
                            <button 
                              onClick={() => handleCompleteWork(ticket.id)}
                              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                            >
                              Complete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : activeView === 'issues' ? (
          /* ========================================================================= */
          /* VIEW 2: EVERY TICKET, AND WHERE IT CAME FROM (ISSUES LOG PAGE)            */
          /* ========================================================================= */
          <div className="flex-1 p-8 space-y-8 min-h-0 text-left">
            
            {/* Main Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">ISSUE LOG</span>
                <h2 className="text-2xl font-bold text-slate-955 tracking-tight font-serif">Every ticket, and where it came from</h2>
                <p className="text-xs text-slate-500 max-w-2xl font-medium leading-relaxed font-sans">
                  Guests report through WhatsApp or email, housekeeping reports with a button, the AI opens the ticket and picks the department.
                </p>
              </div>
              <button 
                onClick={() => setIsIssueModalOpen(true)}
                className="px-5 py-2.5 bg-[#0F5132] hover:bg-[#0b4227] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0 font-sans flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Report issue</span>
              </button>
            </div>

            {/* Filter pills switcher row */}
            <div className="flex flex-wrap gap-2 select-none shrink-0 font-sans">
              <button 
                onClick={() => setIssuesFilter('open')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  issuesFilter === 'open' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                Open <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${issuesFilter === 'open' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>5</span>
              </button>
              <button 
                onClick={() => setIssuesFilter('mine')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  issuesFilter === 'mine' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                Mine <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${issuesFilter === 'mine' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>2</span>
              </button>
              <button 
                onClick={() => setIssuesFilter('urgent')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  issuesFilter === 'urgent' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                Urgent <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${issuesFilter === 'urgent' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>1</span>
              </button>
              <button 
                onClick={() => setIssuesFilter('parts')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  issuesFilter === 'parts' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                Waiting Parts <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${issuesFilter === 'parts' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>2</span>
              </button>
              <button 
                onClick={() => setIssuesFilter('completed')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  issuesFilter === 'completed' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                Completed <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${issuesFilter === 'completed' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>1</span>
              </button>
              <button 
                onClick={() => setIssuesFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  issuesFilter === 'all' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                All <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${issuesFilter === 'all' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>6</span>
              </button>
            </div>

            {/* List of active issue cards */}
            <div className="space-y-4">
              {getFilteredIssues().map((t) => {
                const isUrgent = t.isUrgent;
                const isHigh = t.isHigh;
                const isNormal = t.isNormal;
                const isFixed = t.status === 'Fixed';

                let priorityClass = 'bg-slate-100 text-slate-600 border-slate-200/60';
                if (isUrgent) priorityClass = 'bg-red-50 text-red-700 border-red-200/60';
                else if (isHigh) priorityClass = 'bg-orange-50 text-orange-700 border-orange-200/60';
                else if (isNormal) priorityClass = 'bg-amber-50 text-amber-700 border-amber-200/60';

                return (
                  <div key={t.id} className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs p-6 text-left space-y-4 relative">
                    
                    {/* Ticket top tags row */}
                    <div className="flex justify-between items-center select-none font-sans">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 font-mono">{t.id}</span>
                        <span className="text-slate-350 text-xs font-mono">•</span>
                        <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider font-mono">{t.room}</span>
                        <span className="text-slate-350 text-xs font-mono">•</span>
                        
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border font-mono ${priorityClass}`}>
                          {isUrgent ? 'Urgent' : isHigh ? 'High' : isNormal ? 'Normal' : 'Low'}
                        </span>
                        
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 text-[9px] font-black uppercase tracking-wider font-mono">
                          {t.status}
                        </span>

                        {t.isOutOfService && (
                          <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200/50 text-[9px] font-black uppercase tracking-wider font-mono">
                            Out of service
                          </span>
                        )}
                      </div>

                      <span className="text-slate-400">
                        <Wrench size={14} />
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-slate-955 leading-tight font-serif">{t.title}</h4>
                      <p className="text-xs text-slate-650 leading-relaxed font-semibold">{t.desc}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                        {t.meta}
                      </p>
                    </div>

                    {/* History logs with WhatsApp circle indicator or bullet */}
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-4 space-y-2.5 font-semibold">
                      {t.history.map((log, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-2.5 text-[10px] leading-relaxed text-slate-600">
                          <span className="w-24 text-slate-400 font-mono text-left shrink-0">{log.time}</span>
                          <div className="flex items-center justify-center shrink-0 w-4 h-4">
                            {log.type === 'bullet' ? (
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                            ) : (
                              <span className="w-2 h-2 border border-emerald-500 rounded-full shrink-0" />
                            )}
                          </div>
                          <p className="text-slate-700 font-medium font-sans flex-1 text-left">{log.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2.5 pt-1 font-sans items-center justify-between">
                      <div className="flex flex-wrap gap-2.5">
                        {!isFixed && (
                          <button 
                            onClick={() => handleStartIssueWork(t.id)}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                          >
                            Start work
                          </button>
                        )}
                        {!isFixed && (
                          <button 
                            onClick={() => alert(`Update logged for ${t.id}`)}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                          >
                            Update
                          </button>
                        )}
                        {!isFixed && (
                          <button 
                            onClick={() => handleIssuePartsRequired(t.id)}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                          >
                            Parts required
                          </button>
                        )}
                        {!isFixed ? (
                          <button 
                            onClick={() => handleCompleteIssueWork(t.id)}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                          >
                            Complete
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 px-4 py-1.5 font-mono select-none">Fixed ✓</span>
                        )}
                        {!isFixed && (
                          <button 
                            onClick={() => alert(`Escalated ticket ${t.id}`)}
                            className="px-3.5 py-1.5 bg-white hover:bg-red-50 border border-red-200/60 text-red-655 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1"
                          >
                            <span>Escalate</span>
                            <span>↗</span>
                          </button>
                        )}
                      </div>

                      {/* Attendee indicators */}
                      {t.id === 'MT-116' && (
                        <div className="flex items-center gap-2 font-sans select-none text-[10px] font-bold">
                          <span className="text-amber-600">⚠</span>
                          <button onClick={() => alert('Assigned to Peter')} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 hover:bg-slate-200 cursor-pointer">Peter</button>
                          <button onClick={() => alert('Assigned to Milan')} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 hover:bg-slate-200 cursor-pointer">Milan</button>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>

            {/* How a ticket travels section */}
            <div className="space-y-4 pt-4">
              <div className="text-left select-none space-y-0.5">
                <h3 className="text-lg font-bold text-slate-955 font-serif">How a ticket travels</h3>
                <p className="text-[11px] text-slate-550 font-medium font-sans">the same flow whether it starts with a guest or a cleaner</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
                
                {/* Step 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">01</span>
                    <h4 className="text-xs font-bold text-slate-900">Reported</h4>
                  </div>
                  <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
                    Guest message, or a housekeeper tapping "Maintenance Required" on the room card.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">02</span>
                    <h4 className="text-xs font-bold text-slate-900">Ticket opened</h4>
                  </div>
                  <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
                    The AI writes the ticket, sets urgency and sends it to the technical WhatsApp group.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">03</span>
                    <h4 className="text-xs font-bold text-slate-900">Worked</h4>
                  </div>
                  <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
                    Accept · Unable to handle · Parts required · External technician — all buttons, no typing.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">04</span>
                    <h4 className="text-xs font-bold text-slate-900">Closed</h4>
                  </div>
                  <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
                    The room goes back to housekeeping for a recheck and the guest is told it is fixed.
                  </p>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 3: PARTS, CHECKS AND FOLLOW-UPS (TASKS PAGE VIEW)                    */
          /* ========================================================================= */
          <div className="flex-1 p-8 space-y-8 min-h-0 text-left">
            
            {/* Main Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">TASKS</span>
                <h2 className="text-2xl font-bold text-slate-955 tracking-tight font-serif">Parts, checks and follow-ups</h2>
                <p className="text-xs text-slate-505 max-w-2xl font-medium leading-relaxed font-sans">
                  Anything that is not a room fault but still needs doing — ordering parts, booking an external technician, rechecking a repair.
                </p>
              </div>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="px-5 py-2.5 bg-[#0F5132] hover:bg-[#0b4227] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0 font-sans flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>New task</span>
              </button>
            </div>

            {/* 4 Task KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none font-sans">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Assigned to me</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">
                    {getFilteredTasks().filter(t => t.meta.includes('Peter Janssens') && t.status !== 'Completed').length}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Open</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">
                    {getFilteredTasks().filter(t => t.status !== 'Completed').length}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Waiting</span>
                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">0</span>
                  <span className="text-[10px] text-slate-400 font-bold block leading-none">parts or third parties</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Completed</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">
                    {getFilteredTasks().filter(t => t.status === 'Completed').length}
                  </span>
                </div>
              </div>

            </div>

            {/* Filter pills row */}
            <div className="flex gap-2 select-none shrink-0 font-sans">
              <button 
                onClick={() => setTasksFilter('mine')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tasksFilter === 'mine' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                Mine
              </button>
              <button 
                onClick={() => setTasksFilter('open')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tasksFilter === 'open' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-655'
                }`}
              >
                Open
              </button>
              <button 
                onClick={() => setTasksFilter('completed')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tasksFilter === 'completed' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-655'
                }`}
              >
                Completed
              </button>
              <button 
                onClick={() => setTasksFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tasksFilter === 'all' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-655'
                }`}
              >
                All
              </button>
            </div>

            {/* List of Tasks Panel */}
            <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden divide-y divide-slate-100">
              {getFilteredTasks().map((task) => {
                const isCompleted = task.status === 'Completed';

                let priorityClass = 'bg-slate-100 text-slate-600 border-slate-200/60';
                if (task.priority === 'Urgent') priorityClass = 'bg-red-50 text-red-700 border-red-200/50';
                else if (task.priority === 'High') priorityClass = 'bg-orange-50 text-orange-700 border-orange-200/50';

                return (
                  <div key={task.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors">
                    
                    {/* Room Badge */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-sm text-slate-800 shrink-0 font-mono select-none">
                        {task.room}
                      </div>

                      <div className="text-left space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-xs font-bold leading-tight ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {task.title}
                          </h4>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider border font-mono ${priorityClass}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.desc && (
                          <p className={`text-[10px] font-medium leading-relaxed ${isCompleted ? 'text-slate-350' : 'text-slate-500'}`}>
                            {task.desc}
                          </p>
                        )}
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono font-sans leading-none">
                          {task.meta}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge clickable action to trigger completion */}
                    <div className="shrink-0 font-sans cursor-pointer" onClick={() => handleCompleteTask(task.id)}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider font-mono ${
                        isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {task.status}
                      </span>
                    </div>

                  </div>
                );
              })}

              {getFilteredTasks().length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs font-bold select-none font-sans">
                  No tasks match your active filter.
                </div>
              )}
            </div>

            {/* Bottom section: Reported from WhatsApp */}
            <div className="space-y-4 pt-4">
              <div className="text-left select-none space-y-0.5">
                <h3 className="text-lg font-bold text-slate-955 font-serif">Reported from WhatsApp</h3>
                <p className="text-[11px] text-slate-550 font-medium font-sans">what you and the team sent in today</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden divide-y divide-slate-100 font-sans text-left">
                {whatsappReports.map((report, idx) => (
                  <div key={idx} className="p-4 flex items-start gap-3.5 hover:bg-slate-50/20 transition-colors">
                    <span className="text-[#105F39] shrink-0 mt-0.5 select-none">💬</span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{report.text}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">{report.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 3. MODAL OVERLAY: SEND WORK TO A DEPARTMENT (NEW TASK) */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-[1px]">
          <div className="bg-white rounded-[24px] md:rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-5 relative shadow-2xl border border-slate-100 font-sans text-left max-h-[90vh] overflow-y-auto">
            {/* Header / Title */}
            <button 
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">NEW TASK</span>
              <h3 className="text-xl font-bold text-slate-900 font-serif leading-none">Send work to a department</h3>
            </div>

            <form onSubmit={submitNewTask} className="space-y-4">
              {/* What needs doing */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">What needs doing</label>
                <input 
                  type="text" 
                  value={taskForm.what}
                  onChange={(e) => setTaskForm({ ...taskForm, what: e.target.value })}
                  placeholder="Extra pillows for 208"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans"
                  required
                />
              </div>

              {/* Detail optional */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">Detail (optional)</label>
                <textarea 
                  value={taskForm.detail}
                  onChange={(e) => setTaskForm({ ...taskForm, detail: e.target.value })}
                  placeholder="Additional details..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm h-24 focus:outline-none focus:border-[#105F39] text-slate-700 font-sans resize-none"
                />
              </div>

              {/* Room and Due Row */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">Room</label>
                  <input 
                    type="text" 
                    value={taskForm.room}
                    onChange={(e) => setTaskForm({ ...taskForm, room: e.target.value })}
                    placeholder="302"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">Due</label>
                  <input 
                    type="text" 
                    value={taskForm.due}
                    onChange={(e) => setTaskForm({ ...taskForm, due: e.target.value })}
                    placeholder="13:00"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans"
                    required
                  />
                </div>
              </div>

              {/* Department and Priority Row */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">Department</label>
                  <select 
                    value={taskForm.department}
                    onChange={(e) => setTaskForm({ ...taskForm, department: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans cursor-pointer"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Front Office">Front Office</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">Priority</label>
                  <select 
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Send to */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">Send to</label>
                <select 
                  value={taskForm.sendTo}
                  onChange={(e) => setTaskForm({ ...taskForm, sendTo: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans cursor-pointer"
                >
                  <option value="Leave unassigned">Leave unassigned</option>
                  <option value="Peter Janssens">Peter Janssens</option>
                  <option value="Milan Novak">Milan Novak</option>
                </select>
              </div>

              <p className="text-[10px] text-slate-400 font-medium font-sans leading-relaxed text-left pt-1">
                Assigned tasks are delivered as an interactive WhatsApp card. The status the person taps comes straight back into these dashboards.
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-6 py-2.5 bg-[#F5F3ED] hover:bg-[#eae8e2] rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#83978D] hover:bg-[#71867c] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Create task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL OVERLAY: OPEN A MAINTENANCE TICKET (NEW ISSUE) */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-[1px]">
          <div className="bg-white rounded-[24px] md:rounded-3xl w-full max-w-md p-6 md:p-8 space-y-5 relative shadow-2xl border border-slate-100 font-sans text-left max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setIsIssueModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">NEW ISSUE</span>
              <h3 className="text-xl font-bold text-slate-900 font-serif leading-none">Open a maintenance ticket</h3>
            </div>

            <form onSubmit={submitNewIssue} className="space-y-4">
              {/* What is wrong */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">What is wrong</label>
                <input 
                  type="text" 
                  value={issueForm.what}
                  onChange={(e) => setIssueForm({ ...issueForm, what: e.target.value })}
                  placeholder="Radiator not heating"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans"
                  required
                />
              </div>

              {/* Detail */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">Detail</label>
                <textarea 
                  value={issueForm.detail}
                  onChange={(e) => setIssueForm({ ...issueForm, detail: e.target.value })}
                  placeholder="Additional details..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm h-24 focus:outline-none focus:border-[#105F39] text-slate-700 font-sans resize-none"
                />
              </div>

              {/* Room and Urgency Row */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">Room</label>
                  <select 
                    value={issueForm.room}
                    onChange={(e) => setIssueForm({ ...issueForm, room: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans cursor-pointer"
                  >
                    <option value="115">115</option>
                    <option value="302">302</option>
                    <option value="307">307</option>
                    <option value="118">118</option>
                    <option value="318">318</option>
                    <option value="Lobby">Lobby</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block">Urgency</label>
                  <select 
                    value={issueForm.urgency}
                    onChange={(e) => setIssueForm({ ...issueForm, urgency: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-medium font-sans leading-relaxed text-left pt-1">
                Urgent tickets mark the room out of service and warn front office straight away.
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-6 py-2.5 bg-[#F5F3ED] hover:bg-[#eae8e2] rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#83978D] hover:bg-[#71867c] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Open ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenanceDashboard;
