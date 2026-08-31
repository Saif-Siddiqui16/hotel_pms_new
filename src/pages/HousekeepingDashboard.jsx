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
  Plus,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { taskService } from '../services/taskService';
import { roomService } from '../services/roomService';
import { userService } from '../services/userService';

export const HousekeepingDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated, user, addWhatsAppLog } = useApp();
  const roleStr = user?.role?.toLowerCase() || '';
  const isStaff = !roleStr.includes('manager') && !roleStr.includes('admin');

  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({ title: '', detail: '', room: '', dueBy: '', department: 'Front Office', priority: 'Normal' });
  const [users, setUsers] = useState([]);

  React.useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    };
    loadUsers();
  }, []);

  const handleNewTask = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleCreateTask = async () => {
    if (!newTaskData.title || !newTaskData.room) return;
    try {
      const createdTask = await taskService.createTask({
        room: newTaskData.room,
        what: newTaskData.title,
        priority: newTaskData.priority,
        detail: newTaskData.detail || '',
        department: 'Housekeeping',
        due: newTaskData.dueBy || ''
      });
      
      const formattedTask = {
        ...createdTask,
        title: createdTask.what || createdTask.title,
        desc: createdTask.detail || createdTask.desc,
        meta: `📝 Manual entry · ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} · due ${newTaskData.dueBy || '--:--'} · User`,
      };
      
      setTasksList(prev => [...prev, formattedTask]);
      setIsNewTaskModalOpen(false);
      setNewTaskData({ title: '', detail: '', room: '', dueBy: '', department: 'Housekeeping', priority: 'Normal' });
    } catch (err) {
      console.error('Failed to create housekeeping task:', err);
      alert('Failed to create task');
    }
  };

  // Navigation view read from query params
  const searchParams = new URLSearchParams(location.search);
  const activeView = searchParams.get('tab') || 'dashboard';

  // Staff WhatsApp mock selection tab
  const hkStaff = users.filter(u => u.role === 'Housekeeping Staff');
  const [activeStaffTab, setActiveStaffTab] = useState('');

  React.useEffect(() => {
    if (hkStaff.length > 0 && !activeStaffTab) {
      setActiveStaffTab(hkStaff[0].id.toString());
    }
  }, [hkStaff, activeStaffTab]);

  // Master Rooms Data List
  const [roomsList, setRoomsList] = useState([]);

  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await roomService.getRooms();
        setRoomsList(rooms);
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      }
    };
    fetchRooms();
  }, []);

  // Master Housekeeping Tasks List
  const [tasksList, setTasksList] = useState([]);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const allTasks = await taskService.getTasks();
        let hkTasks = allTasks.filter(t => t.department === 'Housekeeping').map(t => ({
          ...t,
          title: t.what || t.title,
          desc: t.detail || t.desc,
          meta: `🤖 Backend Sync · ${t.status} · ${t.sendTo}`
        }));
        
        // Filter tasks for regular Housekeeping Staff so they only see tasks assigned to them
        if (user && isStaff) {
          hkTasks = hkTasks.filter(t => t.sendTo === user.name);
        }
        
        setTasksList(hkTasks);
      } catch (err) {
        console.error('Failed to fetch housekeeping tasks', err);
      }
    };
    fetchTasks();
  }, []);

  // Rooms Filter and Floor Filter States
  const [roomsFilter, setRoomsFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [attendantFilter, setAttendantFilter] = useState('all');
  const [showWhatsAppPanel, setShowWhatsAppPanel] = useState(false);
  const [waStaffTab, setWaStaffTab] = useState('');

  React.useEffect(() => {
    if (hkStaff.length > 0 && !waStaffTab) {
      setWaStaffTab(hkStaff[0].id.toString());
    }
  }, [hkStaff, waStaffTab]);

  // Action: Start Cleaning Room
  const handleStartRoom = async (id) => {
    try {
      await roomService.updateRoom(id, { status: 'Cleaning' });
      setRoomsList(prev => prev.map(room => room.id === id ? { ...room, status: 'Cleaning' } : room));
    } catch (err) {
      console.error('Failed to start cleaning room', err);
    }
  };

  // Action: Release Room / Mark Ready
  const handleReleaseRoom = async (id) => {
    try {
      await roomService.updateRoom(id, { status: 'Ready' });
      setRoomsList(prev => prev.map(room => room.id === id ? { ...room, status: 'Ready' } : room));
    } catch (err) {
      console.error('Failed to release room', err);
    }
  };

  // Action: Mark Dirty
  const handleMarkDirty = async (id) => {
    try {
      await roomService.updateRoom(id, { status: 'Dirty' });
      setRoomsList(prev => prev.map(room => room.id === id ? { ...room, status: 'Dirty' } : room));
    } catch (err) {
      console.error('Failed to mark room dirty', err);
    }
  };

  // Action: Inspect Room — marks as Inspected (verified clean)
  const handleInspectRoom = async (id) => {
    try {
      await roomService.updateRoom(id, { status: 'Inspected' });
      setRoomsList(prev => prev.map(room => room.id === id ? { ...room, status: 'Inspected' } : room));
    } catch (err) {
      console.error('Failed to inspect room', err);
    }
  };

  // Action: Toggle DND — stores previous status so Clear DND restores it
  const handleToggleDnd = async (id) => {
    try {
      const room = roomsList.find(r => r.id === id);
      if (!room) return;
      const newStatus = room.status === 'DND / Occupied' ? (room.prevStatus || 'Ready') : 'DND / Occupied';
      await roomService.updateRoom(id, { status: newStatus });
      setRoomsList(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Failed to toggle DND', err);
    }
  };

  // Action: Complete Task
  const handleCompleteTask = async (taskId) => {
    try {
      const updated = await taskService.updateTask(taskId, { status: 'Completed' });
      if (updated) {
        setTasksList(prev => prev.map(task => task.id === taskId ? { ...task, status: 'Completed' } : task));
      }
    } catch (err) {
      console.error('Failed to complete task', err);
    }
  };

  const handleAcceptTask = async (taskId) => {
    try {
      const updated = await taskService.updateTask(taskId, { status: 'In Progress' });
      if (updated) {
        setTasksList(prev => prev.map(task => task.id === taskId ? { ...task, status: 'In Progress' } : task));
      }
    } catch (err) {
      console.error('Failed to accept task', err);
    }
  };

  const handleRejectTask = async (taskId) => {
    try {
      const updated = await taskService.updateTask(taskId, { status: 'New', sendTo: null });
      if (updated) {
        // If staff rejects, it's no longer assigned to them, so we can remove it from their view or update it
        setTasksList(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (err) {
      console.error('Failed to reject task', err);
    }
  };

  const handleAssignTask = async (taskId, assigneeName) => {
    try {
      const isAssigned = assigneeName && assigneeName !== 'Leave unassigned';
      const updated = await taskService.updateTask(taskId, {
        sendTo: assigneeName,
        status: isAssigned ? 'Assigned' : 'New'
      });
      if (updated) {
        setTasksList(prev => prev.map(t => t.id === taskId ? { ...t, status: updated.status, sendTo: updated.sendTo, meta: `🤖 Backend Sync · ${updated.status} · ${updated.sendTo}` } : t));
      }
    } catch (err) {
      console.error('Failed to assign task', err);
    }
  };

  // Compute dynamic KPI stats for cards row
  const getKpiCounts = () => {
    const toClean = roomsList.filter(r => r.status === 'Dirty').length;
    const cleaning = roomsList.filter(r => r.status === 'Cleaning').length;
    // Inspected counts as released/ready
    const ready = roomsList.filter(r => r.status === 'Ready' || r.status === 'Inspected').length;
    const dnd = roomsList.filter(r => r.status === 'DND / Occupied' || r.status === 'Guest Inside').length;
    const maintenance = roomsList.filter(r => r.status === 'Maintenance').length;
    const vip = roomsList.filter(r => r.type && r.type.includes('VIP')).length;
    const early = roomsList.filter(r => r.note && (r.note.includes('Early') || r.note.includes('arrival 14:00') || r.note.includes('arrival 15:00'))).length;
    const departures = roomsList.filter(r => r.type && r.type.includes('Departure')).length;
    const late = roomsList.filter(r => r.note && (r.note.includes('Late') || r.note.toLowerCase().includes('priority'))).length;

    return { toClean, cleaning, ready, dnd, maintenance, vip, early, departures, late };
  };

  const kpis = getKpiCounts();

  // Filtered Rooms list for Rooms View
  const getFilteredRooms = () => {
    let result = roomsList;

    // Filter by type
    if (roomsFilter === 'dirty') result = result.filter(r => r.status === 'Dirty');
    else if (roomsFilter === 'cleaning') result = result.filter(r => r.status === 'Cleaning');
    else if (roomsFilter === 'ready') result = result.filter(r => r.status === 'Ready' || r.status === 'Inspected');
    else if (roomsFilter === 'dnd') result = result.filter(r => r.status === 'DND / Occupied' || r.status === 'Guest Inside');
    else if (roomsFilter === 'maintenance') result = result.filter(r => r.status === 'Maintenance');
    else if (roomsFilter === 'vip') result = result.filter(r => r.type.includes('VIP'));
    else if (roomsFilter === 'early') result = result.filter(r => r.note.includes('Early') || r.note.includes('arrival 14:00') || r.note.includes('arrival 15:00'));
    else if (roomsFilter === 'departures') result = result.filter(r => r.type.includes('Departure'));

    // Filter by floor
    if (floorFilter !== 'all') {
      result = result.filter(r => r.id.startsWith(floorFilter));
    }

    return result;
  };

  // Get Priority rooms specifically for Dashboard view (fixed subset)
  const getPriorityRooms = () => {
    // Dynamic priority: rooms that are Dirty or Cleaning, sorted to surface priority ones first
    const activeRooms = roomsList.filter(r => r.status !== 'Ready' && r.status !== 'Inspected');
    return activeRooms.slice(0, 6);
  };

  const getNextRoomForStaff = (staffName) => {
    if (!staffName) return null;
    const assigned = roomsList.filter(r => r.assignedTo === staffName);
    // Find next room that needs attention, or fallback to their first assigned room
    return assigned.find(r => r.status !== 'Ready' && r.status !== 'Inspected') || assigned[0];
  };

  // Compute Task KPIs
  const getTaskKpis = () => {
    const openTasks = tasksList.filter(t => t.status !== 'Completed').length;
    const completedTasks = tasksList.filter(t => t.status === 'Completed').length;
    const unassignedTasks = tasksList.filter(t => !t.sendTo || t.sendTo === 'Leave unassigned' || t.status === 'New').length;
    const fromGuestTasks = tasksList.filter(t => {
      const isGuest = t.source === 'guest' || t.source === 'Guest' || 
                      (t.desc && t.desc.toLowerCase().includes('guest')) || 
                      (t.title && t.title.toLowerCase().includes('guest')) ||
                      (t.meta && t.meta.toLowerCase().includes('guest'));
      return isGuest;
    }).length;
    return { openTasks, completedTasks, unassignedTasks, fromGuestTasks };
  };

  const taskKpis = getTaskKpis();

  return (
    <div className="h-screen bg-[#F7F6F3] flex min-w-0 font-sans text-left relative overflow-hidden">
      <style>{`
        #front-office-housekeeping-content,
        #front-office-housekeeping-content button,
        #front-office-housekeeping-content span,
        #front-office-housekeeping-content p,
        #front-office-housekeeping-content h1,
        #front-office-housekeeping-content h2,
        #front-office-housekeeping-content h3,
        #front-office-housekeeping-content h4,
        #front-office-housekeeping-content label,
        #front-office-housekeeping-content td,
        #front-office-housekeeping-content th {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
      `}</style>
      
      {/* 2. Main content page frame */}
      <div id="front-office-housekeeping-content" className="flex-1 flex flex-col h-screen min-w-0 bg-[#F7F6F3] overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-center px-8 py-5 border-b border-[#E7E4DD] bg-white shrink-0">
          <div className="text-left space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap font-sans">
              <span className="text-xs font-bold text-slate-800">Hotel Mercier</span>
              <span className="text-slate-350 text-xs">•</span>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Antwerp · 48 rooms</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {activeView === 'rooms' ? 'Rooms' : activeView === 'tasks' ? 'Housekeeping tasks' : 'Housekeeping — the floor at a glance'}
            </h1>
          </div>
        </header>

        {/* Dynamic View Switcher */}
        {activeView === 'dashboard' ? (
          /* ========================================================================= */
          /* VIEW 1: HOUSEKEEPING DASHBOARD (MAIN VIEW)                                */
          /* ========================================================================= */
          <div className="flex-1 p-8 space-y-8 min-h-0">
            
            {/* Main Dashboard Intro */}
            <div className="space-y-1.5 text-left select-none">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">GOOD AFTERNOON, ROSA</span>
              <h2 className="text-2xl font-bold text-slate-955 tracking-tight font-serif">{kpis.ready} of {roomsList.length} rooms released.</h2>
              <p className="text-xs text-slate-505 max-w-2xl font-medium leading-relaxed font-sans">
                Your team never has to open this. Everything here arrives from the buttons they tap on WhatsApp.
              </p>
            </div>

            {/* 7 KPI Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5 select-none">
              
              {/* Card 1: To clean */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between text-left relative min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans leading-tight">To clean</span>
                  <span className="text-slate-400">
                    <svg className="w-4 h-4 text-red-500/85" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                    </svg>
                  </span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{kpis.toClean}</span>
                  <span className="text-[10px] text-slate-400 font-bold font-sans block leading-tight">waiting to start</span>
                </div>
              </div>

              {/* Card 2: In progress */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between text-left relative min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans leading-tight">In progress</span>
                  <span className="text-slate-400">
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.452L21 9l-3.096-3.096-8.091 10.0z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{kpis.cleaning}</span>
                  <span className="text-[10px] text-slate-400 font-bold font-sans block leading-tight">being cleaned now</span>
                </div>
              </div>

              {/* Card 3: Cleaned */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between text-left relative min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans leading-tight">Cleaned</span>
                  <span className="text-slate-400">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{kpis.ready}</span>
                  <span className="text-[10px] text-slate-400 font-bold font-sans block leading-tight">released to reception</span>
                </div>
              </div>

              {/* Card 4: Late */}
              <div className="bg-white p-4 rounded-2xl border border-[#ffd6d6] shadow-sm flex flex-col justify-between text-left relative min-h-[110px] bg-red-50/20">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider font-sans leading-tight">Late</span>
                  <span className="text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-bold text-red-650 leading-none block font-serif">{kpis.late}</span>
                  <span className="text-[10px] text-red-500/85 font-bold font-sans block leading-tight">arrival before the room</span>
                </div>
              </div>

              {/* Card 5: DND / occupied */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between text-left relative min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans leading-tight">DND / occupied</span>
                  <span className="text-slate-400">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{kpis.dnd}</span>
                  <span className="text-[10px] text-slate-400 font-bold font-sans block leading-tight">cannot enter yet</span>
                </div>
              </div>

              {/* Card 6: VIP rooms */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between text-left relative min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans leading-tight">VIP rooms</span>
                  <span className="text-slate-400">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{kpis.vip}</span>
                  <span className="text-[10px] text-slate-400 font-bold font-sans block leading-tight">extra preparation</span>
                </div>
              </div>

              {/* Card 7: Early arrivals */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between text-left relative min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans leading-tight">Early arrivals</span>
                  <span className="text-slate-400">
                    <svg className="w-4 h-4 text-slate-505" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{kpis.early}</span>
                  <span className="text-[10px] text-slate-400 font-bold font-sans block leading-tight">before 15:00</span>
                </div>
              </div>

            </div>

            {/* Priority Rooms & WhatsApp Operations Layer Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Priority Rooms Card List (Left 2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-baseline select-none">
                  <div className="text-left space-y-0.5">
                    <h3 className="text-lg font-bold text-slate-955">Priority rooms</h3>
                    <p className="text-[11px] text-slate-500 font-medium font-sans">Sorted by arrival time and priority</p>
                  </div>
                  <button 
                    onClick={() => navigate('?tab=rooms')}
                    className="px-4 py-2 border border-[#E7E4DD] hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs transition-colors font-sans"
                  >
                    → All rooms
                  </button>
                </div>

                {/* Rooms List Panel */}
                <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden divide-y divide-slate-100">
                  {getPriorityRooms().map((room) => {
                    const isMaintenance = room.status === 'Maintenance';
                    const isDirty = room.status === 'Dirty';
                    const isGuestInside = room.status === 'Guest Inside';
                    const isReady = room.status === 'Ready';
                    const isInProgress = room.status === 'Cleaning' || room.status === 'In Progress';

                    let statusBadgeClass = 'bg-slate-50 text-slate-655 border-slate-150';
                    let statusDotClass = 'bg-slate-400';

                    if (isMaintenance || isDirty) {
                      statusBadgeClass = 'bg-red-50 text-red-700 border-red-200/60';
                      statusDotClass = 'bg-red-500';
                    } else if (isGuestInside) {
                      statusBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200/60';
                      statusDotClass = 'bg-amber-500';
                    } else if (isReady) {
                      statusBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
                      statusDotClass = 'bg-emerald-500';
                    } else if (isInProgress) {
                      statusBadgeClass = 'bg-blue-50 text-blue-700 border-blue-200/60';
                      statusDotClass = 'bg-blue-500 animate-pulse';
                    }

                    return (
                      <div key={room.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/30 transition-colors">
                        
                        {/* Room Number Circle */}
                        <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-sm text-slate-800 shrink-0 font-mono">
                          {room.id}
                        </div>

                        {/* Room Info Block */}
                        <div className="flex-1 min-w-0 text-left space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{room.type}</span>
                            {room.hasIcon && (
                              <span className="text-[11px]">👑</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium font-sans italic">
                            {room.subtitleInfo || `${room.assignedTo}`}
                          </p>
                          {room.note && (
                            <p className="text-[10px] text-amber-600 font-medium font-sans">
                              {room.note}
                            </p>
                          )}
                        </div>

                        {/* Status Pill badge */}
                        <div className="shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold border font-sans uppercase tracking-wider ${statusBadgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
                            {room.status === 'Maintenance' ? 'Maintenance' : room.status === 'Dirty' ? 'Dirty' : room.status === 'Guest Inside' ? 'Guest Inside' : room.status === 'Cleaning' ? 'Cleaning' : room.status}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 shrink-0 font-sans">
                          {!isReady && !isInProgress && (
                            <button 
                              onClick={() => handleStartRoom(room.id)}
                              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                            >
                              Start
                            </button>
                          )}
                          {isInProgress && (
                            <button 
                              onClick={() => handleStartRoom(room.id)}
                              disabled
                              className="px-3 py-1.5 border border-slate-200 rounded-xl text-[11px] font-bold bg-slate-50 text-slate-400 cursor-default shadow-xs"
                            >
                              Start
                            </button>
                          )}
                          {isReady ? (
                            <span className="text-[11px] font-bold text-emerald-600 px-4 font-mono select-none flex items-center">Released ✓</span>
                          ) : (
                            <button 
                              onClick={() => handleReleaseRoom(room.id)}
                              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                            >
                              Release
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp Operations Layer Panel (Right 1 col) */}
              <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs p-6 flex flex-col gap-5 text-left h-full min-h-[500px]">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">WHATSAPP OPERATIONS LAYER</span>
                  <p className="text-[11px] text-slate-550 font-medium leading-relaxed font-sans">
                    This is what your team sees on their phones. Tap a button as they would — the dashboards update immediately.
                  </p>
                </div>

                {/* Staff selection tab switcher */}
                <div className="flex gap-2 select-none shrink-0 font-sans flex-wrap">
                  {hkStaff.map(staff => (
                    <button 
                      key={staff.id}
                      onClick={() => setActiveStaffTab(staff.id.toString())}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeStaffTab === staff.id.toString() ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      {staff.name.split(' ')[0]}
                    </button>
                  ))}
                  {hkStaff.length === 0 && <span className="text-xs text-slate-400">No staff found</span>}
                </div>

                {/* Phone Mockup Frame */}
                <div className="border border-[#E7E4DD] rounded-2xl overflow-hidden flex flex-col flex-1 shadow-sm">
                  
                  {/* Chat header */}
                  {(() => {
                    const activeStaff = hkStaff.find(s => s.id.toString() === activeStaffTab) || hkStaff[0];
                    if (!activeStaff) return null;
                    const initials = activeStaff.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    
                    return (
                      <div className="bg-white p-3 border-b border-[#E7E4DD] flex justify-between items-center select-none font-sans">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-[#EBF6EE] rounded-lg flex items-center justify-center text-[#105F39] shrink-0 font-mono font-bold text-xs">
                            {initials}
                          </div>
                          <div className="text-left space-y-0.5">
                            <p className="text-xs font-bold text-slate-900">
                              {activeStaff.name}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono leading-none">
                              {activeStaff.phoneNumber || 'No Phone'} · Attendant
                            </p>
                          </div>
                        </div>
                        <button className="text-slate-455 hover:text-slate-600 cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Chat window body preview */}
                  {(() => {
                    const activeStaff = hkStaff.find(s => s.id.toString() === activeStaffTab) || hkStaff[0];
                    if (!activeStaff) return null;
                    const nextRoom = getNextRoomForStaff(activeStaff.name);
                    
                    return (
                      <div className="bg-[#efeae2] p-4 flex-1 overflow-y-auto min-h-[220px] flex flex-col justify-start">
                        {nextRoom ? (
                          <div className="bg-white rounded-2xl shadow-xs overflow-hidden max-w-[85%] text-left space-y-1.5 select-none font-sans">
                            <div className="p-4 pb-2 space-y-1.5">
                              <div className="space-y-1.5 text-xs text-slate-800 leading-normal font-semibold font-sans">
                                <p>Next room: {nextRoom.id} - {nextRoom.type}</p>
                                <p className="text-[9px] text-slate-400 font-bold text-right font-mono mt-1">Now</p>
                              </div>
                            </div>
                            <div className="border-t border-slate-100 divide-y divide-slate-100 flex flex-col font-sans">
                              <button onClick={() => handleStartRoom(nextRoom.id)} className="w-full text-center py-2.5 text-xs font-bold text-sky-650 hover:bg-slate-50 cursor-pointer transition-colors">Start Cleaning</button>
                              <button onClick={() => setRoomsList(prev => prev.map(r => r.id === nextRoom.id ? { ...r, status: 'Guest Inside' } : r))} className="w-full text-center py-2.5 text-xs font-bold text-sky-650 hover:bg-slate-50 cursor-pointer transition-colors">Guest Inside</button>
                              <button onClick={() => handleToggleDnd(nextRoom.id)} className="w-full text-center py-2.5 text-xs font-bold text-sky-655 hover:bg-slate-50 cursor-pointer transition-colors">DND</button>
                              <button onClick={() => setRoomsList(prev => prev.map(r => r.id === nextRoom.id ? { ...r, status: 'Maintenance' } : r))} className="w-full text-center py-2.5 text-xs font-bold text-sky-650 hover:bg-slate-50 cursor-pointer transition-colors">Maintenance Issue</button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-slate-500 text-xs mt-10">No rooms assigned.</div>
                        )}
                      </div>
                    );
                  })()}

                </div>

                {/* Informational footer message */}
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold font-sans">
                  Interactive buttons, lists and Flows are sent from your WhatsApp Business number. Staff never open the dashboard to update a room.
                </p>

              </div>

            </div>

            {/* Team Today Grid section */}
            <div className="space-y-4">
              <div className="text-left select-none space-y-0.5">
                <h3 className="text-lg font-bold text-slate-955 font-serif">Team today</h3>
                <p className="text-[11px] text-slate-505 font-medium font-sans">Rooms assigned per attendant</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
                {hkStaff.length > 0 ? hkStaff.map(staff => {
                  const assignedRooms = roomsList.filter(r => r.assignedTo === staff.name);
                  const released = assignedRooms.filter(r => r.status === 'Ready' || r.status === 'Inspected').length;
                  return (
                    <div key={staff.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">{staff.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">{released}/{assignedRooms.length || 5} released</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {assignedRooms.length > 0 ? assignedRooms.map((room) => (
                          <span key={room.id} className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[10px] font-bold text-slate-550 font-mono">
                            {room.id}
                          </span>
                        )) : (
                          <span className="text-slate-400 text-xs italic">None</span>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full py-8 text-center text-slate-500 text-sm">No housekeeping staff found. Add them in Users Management.</div>
                )}
              </div>
            </div>

            {/* Open Housekeeping Tasks Section */}
            <div className="space-y-4 pb-8">
              <div className="text-left select-none space-y-0.5">
                <h3 className="text-lg font-bold text-slate-955 font-serif">Open housekeeping tasks</h3>
                <p className="text-[11px] text-slate-505 font-medium font-sans">Guest requests routed automatically</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E7E4DD] shadow-xs p-4 flex items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors text-left">
                
                {/* Room Badge */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-sm text-slate-800 shrink-0 font-mono select-none">
                    208
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-905">Baby cot in 208 before 14:00</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono font-sans leading-none">
                      Inès Duarte · due 13:30
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 font-sans">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 uppercase tracking-wider font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Assigned
                  </span>
                </div>
              </div>
            </div>

          </div>
        ) : activeView === 'rooms' ? (
          /* ========================================================================= */
          /* VIEW 2: ROOMS LIST VIEW (IMAGE 2 STYLE)                                   */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 text-left overflow-hidden relative">

            {/* Main content column */}
            <div className={`flex flex-col overflow-y-auto ${showWhatsAppPanel ? 'flex-none lg:flex-1' : 'flex-1'}`}>
              <div className="p-4 sm:p-8 space-y-5">

                {/* Header */}
                <div className="flex flex-wrap md:flex-row items-start justify-between gap-4 select-none">
                  <div className="space-y-1 max-w-[50%] sm:max-w-none">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">ROOMS</span>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-serif">
                      {kpis.ready} released, {kpis.toClean + kpis.cleaning} still to clean.
                    </h2>
                    <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed hidden sm:block">
                      Every line here can be changed from a phone.{' '}
                      <span className="text-[#105F39] font-semibold">Releasing a room tells reception and the guest automatically.</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWhatsAppPanel(v => !v)}
                    className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold border transition-all cursor-pointer shrink-0 font-sans shadow-xs ${
                      showWhatsAppPanel
                        ? 'bg-[#105F39] text-white border-[#105F39]'
                        : 'bg-white text-slate-700 border-[#E7E4DD] hover:bg-slate-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {showWhatsAppPanel ? 'Hide WhatsApp view' : 'Show WhatsApp view'}
                  </button>
                </div>

                <div className={`${showWhatsAppPanel ? 'hidden lg:block' : 'block'}`}>
                {/* Status filter pills */}
                <div className="flex flex-wrap gap-1.5 select-none font-sans">
                  {[
                    { key: 'all', label: 'All', count: roomsList.length },
                    { key: 'dirty', label: 'Dirty', count: roomsList.filter(r => r.status === 'Dirty').length },
                    { key: 'cleaning', label: 'Cleaning', count: roomsList.filter(r => r.status === 'Cleaning').length },
                    { key: 'ready', label: 'Clean', count: roomsList.filter(r => r.status === 'Ready').length },
                    { key: 'inspected', label: 'Inspected', count: roomsList.filter(r => r.status === 'Inspected').length },
                    { key: 'dnd', label: 'DND', count: roomsList.filter(r => r.status === 'DND / Occupied').length },
                    { key: 'guest', label: 'Guest Inside', count: roomsList.filter(r => r.status === 'Guest Inside').length },
                    { key: 'maintenance', label: 'Maintenance', count: roomsList.filter(r => r.status === 'Maintenance').length },
                  ].map(pill => (
                    <button
                      key={pill.key}
                      onClick={() => setRoomsFilter(pill.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        roomsFilter === pill.key
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-[#E7E4DD] hover:bg-slate-50'
                      }`}
                    >
                      {pill.label}
                      <span className={`text-[10px] font-black font-mono rounded-full px-1.5 leading-5 ${
                        roomsFilter === pill.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>{pill.count}</span>
                    </button>
                  ))}
                </div>

                {/* Attendant + Floor filter row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-sans select-none border-b border-[#E7E4DD] pb-4 mt-5">
                  {/* Attendants */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setAttendantFilter('all')}
                      className={`text-xs font-bold cursor-pointer transition-colors ${
                        attendantFilter === 'all' ? 'text-slate-900 underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      All attendants
                    </button>
                    {hkStaff.map(staff => (
                      <button
                        key={staff.id}
                        onClick={() => setAttendantFilter(staff.id.toString())}
                        className={`text-xs font-bold cursor-pointer transition-colors ${
                          attendantFilter === staff.id.toString() ? 'text-slate-900 underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {staff.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <div className="w-px h-4 bg-[#E7E4DD] hidden sm:block" />

                  {/* Floors */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {['all', '1', '2', '3', '4'].map(floor => (
                      <button
                        key={floor}
                        onClick={() => setFloorFilter(floor)}
                        className={`text-xs font-bold cursor-pointer transition-colors ${
                          floorFilter === floor ? 'text-slate-900 underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {floor === 'all' ? 'All floors' : `Floor ${floor}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rooms List */}
                <div className="space-y-2 font-sans mt-4">
                  {(() => {
                    let result = roomsList;
                    // Status filter
                    if (roomsFilter === 'dirty') result = result.filter(r => r.status === 'Dirty');
                    else if (roomsFilter === 'cleaning') result = result.filter(r => r.status === 'Cleaning');
                    else if (roomsFilter === 'ready') result = result.filter(r => r.status === 'Ready');
                    else if (roomsFilter === 'inspected') result = result.filter(r => r.status === 'Inspected');
                    else if (roomsFilter === 'dnd') result = result.filter(r => r.status === 'DND / Occupied');
                    else if (roomsFilter === 'guest') result = result.filter(r => r.status === 'Guest Inside');
                    else if (roomsFilter === 'maintenance') result = result.filter(r => r.status === 'Maintenance');
                    // Attendant filter
                    if (attendantFilter !== 'all') {
                      const selectedStaff = hkStaff.find(s => s.id.toString() === attendantFilter);
                      if (selectedStaff) {
                        result = result.filter(r => r.assignedTo === selectedStaff.name);
                      }
                    }
                    // Floor filter
                    if (floorFilter !== 'all') result = result.filter(r => r.id.startsWith(floorFilter));

                    if (result.length === 0) return (
                      <div className="py-16 text-center text-slate-400 text-xs font-semibold select-none">No rooms match your active filters.</div>
                    );

                    return result.map(room => {
                      const isMaintenance = room.status === 'Maintenance';
                      const isDirty = room.status === 'Dirty';
                      const isGuestInside = room.status === 'Guest Inside';
                      const isReady = room.status === 'Ready';
                      const isInspected = room.status === 'Inspected';
                      const isDnd = room.status === 'DND / Occupied';
                      const isInProgress = room.status === 'Cleaning';

                      // Status badge config
                      let dotColor = 'bg-slate-400';
                      let badgeText = room.status;
                      if (isMaintenance) dotColor = 'bg-orange-500';
                      else if (isDirty) dotColor = 'bg-red-500';
                      else if (isInProgress) dotColor = 'bg-blue-500 animate-pulse';
                      else if (isDnd || isGuestInside) dotColor = 'bg-amber-500';
                      else if (isInspected) dotColor = 'bg-teal-500';
                      else if (isReady) dotColor = 'bg-emerald-500';

                      // Occupancy label
                      const occupancy = isGuestInside ? 'Occupied' : isDnd ? 'DND' : (room.subtitleInfo?.startsWith('In house') ? 'In house' : 'Vacant');

                      // Priority based on type
                      const priority = room.type.includes('VIP') ? 'High' : (room.type.includes('Departure') ? 'Normal' : 'Low');
                      const priorityColor = priority === 'High' ? 'text-red-600' : priority === 'Normal' ? 'text-slate-600' : 'text-slate-400';

                      // Time based on subtitleInfo
                      const timeMatch = room.subtitleInfo?.match(/(\d{2}:\d{2})/);
                      const displayTime = timeMatch ? timeMatch[1] : '—';

                      return (
                        <div key={room.id} className="bg-white border border-[#E7E4DD] rounded-2xl px-6 py-4 hover:shadow-sm transition-all">
                          <div className="flex items-start justify-between gap-4">

                            {/* Left: Room info */}
                            <div className="flex-1 min-w-0 space-y-2">
                              {/* Room number + status badge */}
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="text-xl font-bold text-slate-900 font-mono leading-none">
                                  {room.id}{room.hasIcon && ' 👑'}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                                  {(isDnd || isGuestInside) ? (
                                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                  ) : isMaintenance ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                  ) : isDirty ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  ) : isInProgress ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                  ) : isInspected ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  )}
                                  <span className={`${
                                    isMaintenance ? 'text-orange-700' :
                                    isDirty ? 'text-red-700' :
                                    isInProgress ? 'text-blue-700' :
                                    isDnd || isGuestInside ? 'text-amber-700' :
                                    isInspected ? 'text-teal-700' : 'text-emerald-700'
                                  }`}>{room.status}</span>
                                </span>
                              </div>

                              {/* Type · Occupancy · Priority */}
                              <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                                <span className="font-semibold">{room.type}</span>
                                <span className="text-slate-300">·</span>
                                <span className="text-slate-500">{occupancy}</span>
                                <span className="text-slate-300">—</span>
                                <span className={`font-semibold ${priorityColor}`}>{priority}</span>
                              </div>

                              {/* Note */}
                              {room.note && (
                                <p className="text-[11px] text-amber-600 font-medium">{room.note}</p>
                              )}

                              {/* Attendant + time */}
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span className="font-semibold text-slate-600">{room.assignedTo}</span>
                                {displayTime !== '—' && (
                                  <><span className="text-slate-300">·</span><span className="font-mono">{displayTime}</span></>
                                )}
                              </div>

                              {/* Action buttons — WhatsApp-style status changers */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {/* Cleaning */}
                                <button
                                  onClick={() => handleStartRoom(room.id)}
                                  disabled={isInProgress}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                    isInProgress
                                      ? 'bg-blue-50 text-blue-700 border-blue-200 cursor-default'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                                  }`}
                                >
                                  Cleaning
                                </button>

                                {/* Clean */}
                                <button
                                  onClick={() => handleReleaseRoom(room.id)}
                                  disabled={isReady}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                    isReady
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                                  }`}
                                >
                                  Clean
                                </button>

                                {/* Inspected */}
                                <button
                                  onClick={() => handleInspectRoom(room.id)}
                                  disabled={isInspected}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                    isInspected
                                      ? 'bg-teal-50 text-teal-700 border-teal-200 cursor-default'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200'
                                  }`}
                                >
                                  Inspected
                                </button>

                                {/* Guest Inside */}
                                <button
                                  onClick={() => setRoomsList(prev => prev.map(r => r.id === room.id ? { ...r, status: 'Guest Inside' } : r))}
                                  disabled={isGuestInside}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                    isGuestInside
                                      ? 'bg-amber-50 text-amber-700 border-amber-200 cursor-default'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                                  }`}
                                >
                                  Guest Inside
                                </button>

                                {/* Maintenance */}
                                <button
                                  onClick={() => setRoomsList(prev => prev.map(r => r.id === room.id ? { ...r, status: 'Maintenance' } : r))}
                                  disabled={isMaintenance}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                    isMaintenance
                                      ? 'bg-orange-50 text-orange-700 border-orange-200 cursor-default'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200'
                                  }`}
                                >
                                  Maintenance
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                </div>

              </div>
            </div>

            {/* WhatsApp Side Panel */}
            {showWhatsAppPanel && (
              <div className="w-full lg:w-80 shrink-0 bg-white lg:border-l border-[#E7E4DD] flex flex-col flex-1 lg:flex-none lg:h-full overflow-y-auto">
                <div className="p-5 border-b border-[#E7E4DD] space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono block">WHATSAPP OPERATIONS LAYER</span>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                    This is what your team sees on their phones. Tap a button as they would — the dashboard updates immediately.
                  </p>
                </div>

                {/* Staff tab switcher */}
                <div className="flex gap-2 p-4 border-b border-[#E7E4DD] font-sans flex-wrap">
                  {hkStaff.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setWaStaffTab(s.id.toString())}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        waStaffTab === s.id.toString() ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      {s.name.split(' ')[0]}
                    </button>
                  ))}
                  {hkStaff.length === 0 && <span className="text-xs text-slate-400">No staff</span>}
                </div>

                  {/* Chat area */}
                  <div className="flex flex-col flex-1">
                    {(() => {
                      const selected = hkStaff.find(s => s.id.toString() === waStaffTab) || hkStaff[0];
                      if (!selected) return null;
                      const initials = selected.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                      const nextRoom = getNextRoomForStaff(selected.name);

                      return (
                        <>
                          {/* Chat header */}
                          <div className="bg-white px-4 py-3 border-b border-[#E7E4DD] flex items-center gap-2.5 font-sans">
                            <div className="w-8 h-8 bg-[#EBF6EE] rounded-lg flex items-center justify-center text-[#105F39] font-bold text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-slate-900 leading-tight">{selected.name}</p>
                              <p className="text-[10px] text-[#105F39] font-semibold">Online</p>
                            </div>
                          </div>

                          <div className="bg-[#efeae2] flex-1 p-4 space-y-3 overflow-y-auto min-h-[200px]">
                            {/* System message */}
                            {nextRoom ? (
                              <div className="bg-white rounded-2xl shadow-xs overflow-hidden max-w-[90%] font-sans">
                                <div className="p-3.5 pb-2 space-y-1">
                                  <p className="text-xs text-slate-800 font-semibold leading-normal">
                                    Next room: {nextRoom.id} - {nextRoom.type}
                                  </p>
                                  <p className="text-[9px] text-slate-400 font-bold text-right font-mono">
                                    Now
                                  </p>
                                </div>
                                {/* WhatsApp action buttons */}
                                <div className="border-t border-slate-100 divide-y divide-slate-100 flex flex-col">
                                  {['Cleaning', 'Clean', 'Inspected', 'Guest Inside', 'Maintenance'].map(action => {
                                    const roomId = nextRoom.id;
                                    return (
                                      <button
                                        key={action}
                                        onClick={() => {
                                          let logMessage = '';
                                          if (action === 'Cleaning') {
                                            handleStartRoom(roomId);
                                            logMessage = `${waStaffTab || 'Staff'} replied "Cleaning" for room ${roomId}`;
                                          }
                                          else if (action === 'Clean') {
                                            handleReleaseRoom(roomId);
                                            logMessage = `${waStaffTab || 'Staff'} marked ${roomId} as Clean`;
                                          }
                                          else if (action === 'Inspected') {
                                            handleInspectRoom(roomId);
                                            logMessage = `${waStaffTab || 'Staff'} marked ${roomId} as Inspected`;
                                          }
                                          else if (action === 'Guest Inside') {
                                            setRoomsList(prev => prev.map(r => r.id === roomId ? { ...r, status: 'Guest Inside' } : r));
                                            logMessage = `${waStaffTab || 'Staff'} reported DND / Guest Inside on ${roomId}`;
                                          }
                                          else if (action === 'Maintenance') {
                                            setRoomsList(prev => prev.map(r => r.id === roomId ? { ...r, status: 'Maintenance' } : r));
                                            logMessage = `${waStaffTab || 'Staff'} reported Maintenance issue on ${roomId}`;
                                          }
                                          
                                          if (logMessage && typeof addWhatsAppLog === 'function') {
                                            addWhatsAppLog({ text: logMessage, source: 'WhatsApp', icon: '📱' });
                                          }
                                        }}
                                        className="w-full text-center py-2.5 text-xs font-bold text-[#0a7cff] hover:bg-slate-50 cursor-pointer transition-colors"
                                      >
                                        {action}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-slate-500 text-xs mt-10">No rooms assigned.</div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                <p className="p-4 text-[10px] text-slate-400 leading-relaxed font-semibold font-sans border-t border-[#E7E4DD]">
                  Interactive buttons, lists and Flows are sent from your WhatsApp Business number. Staff never open the dashboard to update a room.
                </p>
              </div>
            )}

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 3: GUEST REQUESTS, ROUTED TO A FLOOR (TASKS PAGE VIEW)                */
          /* ========================================================================= */
          <div className="flex-1 p-8 space-y-8 min-h-0 text-left">
            
            {/* Main Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">TASKS</span>
                <h2 className="text-2xl font-bold text-slate-955 tracking-tight font-serif">Guest requests, routed to a floor</h2>
                <p className="text-xs text-slate-505 max-w-2xl font-medium leading-relaxed font-sans">
                  Towels, cots, extra pillows and turndowns arrive here the moment a guest asks — in any language, on any channel.
                </p>
              </div>
              {!isStaff && (
                <button
                  onClick={handleNewTask}
                  className="flex items-center gap-2 bg-[#105F39] hover:bg-[#0b4227] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#105F39]/20 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>New task</span>
                </button>
              )}
            </div>

            {/* 4 Task KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none font-sans">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-505 uppercase tracking-wider leading-none">Open</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{taskKpis.openTasks}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Unassigned</span>
                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{taskKpis.unassignedTasks}</span>
                  <span className="text-[10px] text-slate-400 font-bold block leading-none">nobody has it yet</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Completed</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{taskKpis.completedTasks}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">From guests</span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">{taskKpis.fromGuestTasks}</span>
                </div>
              </div>

            </div>

            {/* List of Tasks Panel */}
            <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden divide-y divide-slate-100">
              {tasksList.map((task) => {
                const isCompleted = task.status === 'Completed';

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
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider border font-mono ${
                            task.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200/50' : 'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.desc && (
                          <p className={`text-[10px] font-medium leading-relaxed ${isCompleted ? 'text-slate-350' : 'text-slate-500'}`}>
                            {task.desc}
                          </p>
                        )}
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          {task.meta}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 font-sans flex flex-col items-end gap-2">
                      <div className="flex flex-col gap-1.5 items-end">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider font-mono ${
                          isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {task.status}
                        </span>

                        {!isStaff && !isCompleted && (
                          <button onClick={() => handleCompleteTask(task.id)} className="text-[10px] text-slate-400 hover:text-emerald-600 font-bold underline cursor-pointer">
                            Force Complete
                          </button>
                        )}
                      </div>

                      {!isStaff && !isCompleted && (
                        <select
                          value={task.sendTo || 'Leave unassigned'}
                          onChange={(e) => handleAssignTask(task.id, e.target.value)}
                          className="px-2 py-1 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 bg-white shadow-xs focus:outline-none cursor-pointer"
                        >
                          <option value="Leave unassigned">Assign to...</option>
                          {hkStaff.map(u => (
                            <option key={u.id} value={u.name}>{u.name}</option>
                          ))}
                        </select>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl flex flex-col font-sans">
              
              {/* Header */}
              <div className="flex justify-between items-center p-6 pb-4">
                <h2 className="text-[19px] font-bold text-slate-900">New task</h2>
                <button 
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 pt-0 space-y-5 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">What needs doing?</label>
                  <input
                    type="text"
                    placeholder="e.g. Extra pillows for 208"
                    value={newTaskData.title}
                    onChange={e => setNewTaskData({...newTaskData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-[#F7F6F3] border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Detail (optional)</label>
                  <textarea
                    placeholder="Add context..."
                    value={newTaskData.detail}
                    onChange={e => setNewTaskData({...newTaskData, detail: e.target.value})}
                    className="w-full px-4 py-3 bg-[#F7F6F3] border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 transition-all placeholder:text-slate-400 min-h-[90px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Room</label>
                    <input
                      type="text"
                      placeholder="e.g. 302"
                      value={newTaskData.room}
                      onChange={e => setNewTaskData({...newTaskData, room: e.target.value})}
                      className="w-full px-4 py-3 bg-[#F7F6F3] border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Due by</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={newTaskData.dueBy}
                        onChange={e => setNewTaskData({...newTaskData, dueBy: e.target.value})}
                        className="w-full pl-4 pr-10 py-3 bg-[#F7F6F3] border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 transition-all placeholder:text-slate-400"
                        style={{ colorScheme: 'light' }}
                      />
                      <Clock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Department</label>
                    <div className="relative">
                      <select
                        value={newTaskData.department}
                        onChange={e => setNewTaskData({...newTaskData, department: e.target.value})}
                        className="w-full pl-4 pr-10 py-3 bg-[#F7F6F3] border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Front Office">Front Office</option>
                        <option value="Housekeeping">Housekeeping</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Priority</label>
                    <div className="relative">
                      <select
                        value={newTaskData.priority}
                        onChange={e => setNewTaskData({...newTaskData, priority: e.target.value})}
                        className="w-full pl-4 pr-10 py-3 bg-[#F7F6F3] border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsNewTaskModalOpen(false)}
                    className="flex-1 py-3 bg-white border border-[#E7E4DD] hover:bg-slate-50 text-slate-700 rounded-[14px] text-sm font-bold transition-all cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTask}
                    className="flex-1 py-3 bg-[#0F5132] hover:bg-[#0b4227] text-white rounded-[14px] text-sm font-bold shadow-sm transition-all cursor-pointer font-sans"
                  >
                    Create task
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      </div>
    </div>
  );
};

export default HousekeepingDashboard;
