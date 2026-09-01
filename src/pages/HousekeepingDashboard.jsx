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
  ChevronDown,
  BedDouble,
  CheckCircle2,
  ArrowRight,
  Phone,
  ClipboardList
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
    <div className="flex min-w-0 font-sans text-left relative">
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
      <div id="front-office-housekeeping-content" className="flex-1 flex flex-col min-w-0 bg-[#F7F6F3]">
        


        {/* Dynamic View Switcher */}
        {activeView === 'dashboard' ? (
          /* ========================================================================= */
          /* VIEW 1: HOUSEKEEPING DASHBOARD (MAIN VIEW)                                */
          /* ========================================================================= */
          <div className="flex-1 p-8 space-y-10 min-h-0 bg-[#FBF9F6]">
            
            {/* Main Dashboard Intro */}
            <div className="space-y-1.5 text-left select-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] font-sans block">GOOD AFTERNOON, ROSA</span>
              <h2 className="text-[28px] font-bold text-slate-900 tracking-tight font-serif leading-tight">5 of 18 rooms released.</h2>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed font-sans">
                Your team never has to open this. Everything here arrives from the buttons they tap on WhatsApp.
              </p>
            </div>

            {/* 7 KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 select-none">
              {/* To clean */}
              <div className="bg-white p-4 rounded-xl border border-[#E7E4DD] shadow-sm flex flex-col justify-between text-left min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-medium text-slate-500 font-sans leading-tight">To clean</span>
                  <span className="text-red-500/70"><BedDouble size={16} strokeWidth={1.5}/></span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-[28px] font-normal text-slate-900 leading-none block font-serif">5</span>
                  <span className="text-[10px] text-slate-400 font-medium font-sans block leading-tight">waiting to start</span>
                </div>
              </div>
              {/* In progress */}
              <div className="bg-white p-4 rounded-xl border border-[#E7E4DD] shadow-sm flex flex-col justify-between text-left min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-medium text-slate-500 font-sans leading-tight">In progress</span>
                  <span className="text-amber-600"><Sparkles size={16} strokeWidth={1.5}/></span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-[28px] font-normal text-slate-900 leading-none block font-serif">2</span>
                  <span className="text-[10px] text-slate-400 font-medium font-sans block leading-tight">being cleaned now</span>
                </div>
              </div>
              {/* Cleaned */}
              <div className="bg-white p-4 rounded-xl border border-[#E7E4DD] shadow-sm flex flex-col justify-between text-left min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-medium text-slate-500 font-sans leading-tight">Cleaned</span>
                  <span className="text-emerald-600"><CheckCircle2 size={16} strokeWidth={1.5}/></span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-[28px] font-normal text-slate-900 leading-none block font-serif">5</span>
                  <span className="text-[10px] text-slate-400 font-medium font-sans block leading-tight">released to reception</span>
                </div>
              </div>
              {/* Late (Red Box) */}
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between text-left min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-medium text-red-700 font-sans leading-tight">Late</span>
                  <span className="text-red-600"><Clock size={16} strokeWidth={1.5}/></span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-[28px] font-normal text-red-700 leading-none block font-serif">2</span>
                  <span className="text-[10px] text-red-500/80 font-medium font-sans block leading-tight">arrival before the room</span>
                </div>
              </div>
              {/* DND / occupied */}
              <div className="bg-white p-4 rounded-xl border border-[#E7E4DD] shadow-sm flex flex-col justify-between text-left min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-medium text-slate-500 font-sans leading-tight">DND / occupied</span>
                  <span className="text-slate-500"><Smartphone size={16} strokeWidth={1.5}/></span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-[28px] font-normal text-slate-900 leading-none block font-serif">3</span>
                  <span className="text-[10px] text-slate-400 font-medium font-sans block leading-tight">cannot enter yet</span>
                </div>
              </div>
              {/* VIP rooms */}
              <div className="bg-white p-4 rounded-xl border border-[#E7E4DD] shadow-sm flex flex-col justify-between text-left min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-medium text-slate-500 font-sans leading-tight">VIP rooms</span>
                  <span className="text-slate-500"><Building2 size={16} strokeWidth={1.5}/></span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-[28px] font-normal text-slate-900 leading-none block font-serif">1</span>
                  <span className="text-[10px] text-slate-400 font-medium font-sans block leading-tight">extra preparation</span>
                </div>
              </div>
              {/* Early arrivals */}
              <div className="bg-white p-4 rounded-xl border border-[#E7E4DD] shadow-sm flex flex-col justify-between text-left min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-medium text-slate-500 font-sans leading-tight">Early arrivals</span>
                  <span className="text-slate-500"><ArrowRight size={16} strokeWidth={1.5}/></span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <span className="text-[28px] font-normal text-slate-900 leading-none block font-serif">3</span>
                  <span className="text-[10px] text-slate-400 font-medium font-sans block leading-tight">before 15:00</span>
                </div>
              </div>
            </div>

            {/* Priority Rooms & WhatsApp Operations Layer Layout */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Priority Rooms Card List (Left Column) */}
              <div className="flex-1 space-y-8 w-full">
                <div className="flex justify-between items-baseline select-none">
                  <div className="text-left space-y-0.5">
                    <h3 className="text-[19px] font-bold text-slate-900 font-serif">Priority rooms</h3>
                    <p className="text-xs text-slate-500 font-medium font-sans">Sorted by arrival time and priority</p>
                  </div>
                  <button 
                    onClick={() => navigate('?tab=rooms')}
                    className="px-4 py-1.5 border border-[#E7E4DD] hover:bg-slate-50 rounded-xl text-[11px] font-bold text-slate-700 cursor-pointer shadow-sm transition-colors font-sans flex items-center gap-1.5 bg-white"
                  >
                    <ArrowRight size={14}/> All rooms
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Room 307 */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] shadow-sm p-4 flex gap-4 transition-colors">
                    <div className="bg-[#FAF9F6] rounded-xl px-3 py-1.5 h-fit border border-[#E7E4DD] shrink-0">
                      <span className="font-mono text-slate-600 font-bold text-xs">307</span>
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-center gap-4">
                        <div className="space-y-0.5 text-left">
                          <h4 className="text-[13px] font-bold text-slate-900 flex items-center gap-1">VIP Arrival <Building2 size={12} className="text-slate-400"/></h4>
                          <p className="text-[11px] text-slate-400 font-medium">Vacant · arrival 14:00 · Inês Duarte</p>
                          <p className="text-[11px] text-amber-700 font-medium">Shower leak — VIP arrival at 14:00</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border bg-red-50 text-red-700 border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Maintenance
                          </span>
                          <button className="px-4 py-1.5 bg-[#FAF9F6] text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Start</button>
                          <button className="px-4 py-1.5 bg-white text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Release</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room 208 */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] shadow-sm p-4 flex gap-4 transition-colors">
                    <div className="bg-[#FAF9F6] rounded-xl px-3 py-1.5 h-fit border border-[#E7E4DD] shrink-0">
                      <span className="font-mono text-slate-600 font-bold text-xs">208</span>
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-center gap-4">
                        <div className="space-y-0.5 text-left">
                          <h4 className="text-[13px] font-bold text-slate-900">Departure</h4>
                          <p className="text-[11px] text-slate-400 font-medium">Vacant · arrival 14:00 · Inês Duarte</p>
                          <p className="text-[11px] text-amber-700 font-medium">Baby cot required</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border bg-red-50 text-red-700 border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Dirty
                          </span>
                          <button className="px-4 py-1.5 bg-[#FAF9F6] text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Start</button>
                          <button className="px-4 py-1.5 bg-white text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Release</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room 207 */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] shadow-sm p-4 flex gap-4 transition-colors">
                    <div className="bg-[#FAF9F6] rounded-xl px-3 py-1.5 h-fit border border-[#E7E4DD] shrink-0">
                      <span className="font-mono text-slate-600 font-bold text-xs">207</span>
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-center gap-4">
                        <div className="space-y-0.5 text-left">
                          <h4 className="text-[13px] font-bold text-slate-900">Departure</h4>
                          <p className="text-[11px] text-slate-400 font-medium">Vacant · arrival 15:00 · Maria Silva</p>
                          <p className="text-[11px] text-amber-700 font-medium">Ceiling stain — leak from 307</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border bg-red-50 text-red-700 border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Maintenance
                          </span>
                          <button className="px-4 py-1.5 bg-[#FAF9F6] text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Start</button>
                          <button className="px-4 py-1.5 bg-white text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Release</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room 302 */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] shadow-sm p-4 flex gap-4 transition-colors">
                    <div className="bg-[#FAF9F6] rounded-xl px-3 py-1.5 h-fit border border-[#E7E4DD] shrink-0">
                      <span className="font-mono text-slate-600 font-bold text-xs">302</span>
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-center gap-4">
                        <div className="space-y-0.5 text-left">
                          <h4 className="text-[13px] font-bold text-slate-900">Stayover + Linen</h4>
                          <p className="text-[11px] text-slate-400 font-medium">In house — unhappy · Inês Duarte</p>
                          <p className="text-[11px] text-amber-700 font-medium">AC issue open, guest may move to 310</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Guest Inside
                          </span>
                          <button className="px-4 py-1.5 bg-[#FAF9F6] text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Start</button>
                          <button className="px-4 py-1.5 bg-white text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Release</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room 201 */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] shadow-sm p-4 flex gap-4 transition-colors">
                    <div className="bg-[#FAF9F6] rounded-xl px-3 py-1.5 h-fit border border-[#E7E4DD] shrink-0">
                      <span className="font-mono text-slate-600 font-bold text-xs">201</span>
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-center gap-4">
                        <div className="space-y-0.5 text-left">
                          <h4 className="text-[13px] font-bold text-slate-900">Departure</h4>
                          <p className="text-[11px] text-slate-400 font-medium">Checked out 08:12 · arrival 16:00 · Maria Silva</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Cleaning
                          </span>
                          <button className="px-4 py-1.5 bg-white text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Release</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room 405 */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] shadow-sm p-4 flex gap-4 transition-colors">
                    <div className="bg-[#FAF9F6] rounded-xl px-3 py-1.5 h-fit border border-[#E7E4DD] shrink-0">
                      <span className="font-mono text-slate-600 font-bold text-xs">405</span>
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-center gap-4">
                        <div className="space-y-0.5 text-left">
                          <h4 className="text-[13px] font-bold text-slate-900">Departure</h4>
                          <p className="text-[11px] text-slate-400 font-medium">Checked out 09:40 · arrival 17:30 · Maria Silva</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border bg-red-50 text-red-700 border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Dirty
                          </span>
                          <button className="px-4 py-1.5 bg-[#FAF9F6] text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Start</button>
                          <button className="px-4 py-1.5 bg-white text-slate-700 border border-[#E7E4DD] rounded-full text-[11px] font-bold hover:bg-slate-50">Release</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              {/* Team Today Grid section */}
              <div className="space-y-4">
                <div className="text-left select-none space-y-0.5">
                  <h3 className="text-[19px] font-bold text-slate-900 font-serif">Team today</h3>
                  <p className="text-xs text-slate-500 font-medium font-sans">Rooms assigned per attendant</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans max-w-4xl">
                  {/* Maria */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] p-5 shadow-sm text-left space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-slate-900">Maria Silva</h4>
                      <span className="text-[11px] text-slate-400 font-bold font-mono">1/5 released</span>
                    </div>
                    <div className="flex gap-2">
                      {['201', '206', '207', '401', '405'].map(r => (
                        <span key={r} className="px-2 py-1 bg-[#FAF9F6] border border-[#E7E4DD] rounded text-[11px] font-bold text-slate-600 font-mono">{r}</span>
                      ))}
                    </div>
                  </div>
                  {/* Inês */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] p-5 shadow-sm text-left space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-slate-900">Inês Duarte</h4>
                      <span className="text-[11px] text-slate-400 font-bold font-mono">0/4 released</span>
                    </div>
                    <div className="flex gap-2">
                      {['208', '302', '307', '310'].map(r => (
                        <span key={r} className="px-2 py-1 bg-[#FAF9F6] border border-[#E7E4DD] rounded text-[11px] font-bold text-slate-600 font-mono">{r}</span>
                      ))}
                    </div>
                  </div>
                  {/* Kadir */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] p-5 shadow-sm text-left space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-slate-900">Kadir Yilmaz</h4>
                      <span className="text-[11px] text-slate-400 font-bold font-mono">1/3 released</span>
                    </div>
                    <div className="flex gap-2">
                      {['212', '216', '312'].map(r => (
                        <span key={r} className="px-2 py-1 bg-[#FAF9F6] border border-[#E7E4DD] rounded text-[11px] font-bold text-slate-600 font-mono">{r}</span>
                      ))}
                    </div>
                  </div>
                  {/* Alina */}
                  <div className="bg-white rounded-xl border border-[#E7E4DD] p-5 shadow-sm text-left space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-slate-900">Alina Popescu</h4>
                      <span className="text-[11px] text-slate-400 font-bold font-mono">3/5 released</span>
                    </div>
                    <div className="flex gap-2">
                      {['115', '118', '121', '409', '411'].map(r => (
                        <span key={r} className="px-2 py-1 bg-[#FAF9F6] border border-[#E7E4DD] rounded text-[11px] font-bold text-slate-600 font-mono">{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Housekeeping Tasks Section */}
              <div className="space-y-4 pb-8">
                <div className="text-left select-none space-y-0.5">
                  <h3 className="text-[19px] font-bold text-slate-900 font-serif">Open housekeeping tasks</h3>
                  <p className="text-xs text-slate-500 font-medium font-sans">Guest requests routed automatically</p>
                </div>

                <div className="bg-white rounded-xl border border-[#E7E4DD] shadow-sm p-4 flex items-center justify-between gap-4 text-left max-w-2xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FAF9F6] rounded-xl px-4 py-2.5 h-fit border border-[#E7E4DD] shrink-0 font-bold text-[13px] text-slate-600 font-mono">
                      208
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-slate-900">Baby cot in 208 before 14:00</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Inês Duarte · due 13:30</p>
                    </div>
                  </div>
                  <div className="shrink-0 font-sans">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#FAF9F6] text-amber-700 border border-[#E7E4DD]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Assigned
                    </span>
                  </div>
                </div>
              </div>


              </div>

              {/* WhatsApp Operations Layer Panel (Right Column) */}
              <div className="w-full lg:w-[380px] shrink-0 space-y-4 lg:sticky lg:top-8 self-start">
                <div className="bg-white rounded-2xl border border-[#E7E4DD] shadow-sm p-5 flex flex-col gap-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] font-sans block">WHATSAPP OPERATIONS LAYER</span>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                      This is what your team sees on their phones. Tap a button as they would — the dashboards update immediately.
                    </p>
                  </div>

                  {/* Staff selection tab switcher */}
                  <div className="flex gap-2 select-none shrink-0 font-sans">
                    <button className="px-4 py-1 rounded-full text-[11px] font-bold bg-[#1a5641] text-white shadow-sm transition-all cursor-pointer">Maria</button>
                    <button className="px-4 py-1 rounded-full text-[11px] font-bold bg-white border border-[#E7E4DD] hover:bg-slate-50 text-slate-600 transition-all cursor-pointer">Inês</button>
                  </div>

                  {/* Phone Mockup Frame */}
                  <div className="border border-[#E7E4DD] rounded-xl overflow-hidden shadow-sm bg-[#F5F2EC]">
                    <div className="bg-[#EAE6DF] p-3 border-b border-[#E7E4DD] flex justify-between items-center select-none font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#D3E5DE] rounded-[10px] flex items-center justify-center text-[#1a5641] shrink-0 font-mono font-bold text-xs">
                          <Smartphone size={16}/>
                        </div>
                        <div className="text-left space-y-0.5">
                          <p className="text-[13px] font-bold text-slate-900 leading-none">Maria Silva</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono leading-none">
                            +32 468 22 74 91 · Room Attendant · Floors 2 & 4
                          </p>
                        </div>
                      </div>
                      <Phone size={14} className="text-slate-400" />
                    </div>

                    <div className="p-4 space-y-4 font-sans text-[12px] bg-[#EFEAE2]">
                      {/* Grey bubble */}
                      <div className="bg-white border border-[#E7E4DD] rounded-xl rounded-tr-sm p-3 max-w-[85%] ml-auto text-sky-700 font-medium">
                        Maintenance Issue
                      </div>
                      
                      {/* White bubble */}
                      <div className="bg-white rounded-xl rounded-tl-sm p-4 shadow-sm max-w-[90%] space-y-2 border border-[#E7E4DD]">
                        <p className="text-[11px] text-[#1a5641] font-bold">Hotelogx Connect</p>
                        <p className="text-slate-900 font-medium">Room 201 — cleaning in progress.</p>
                        <p className="text-slate-900 font-medium mt-2">When you are done:</p>
                        <p className="text-[9px] text-slate-400 text-right pt-1 font-mono">09:44</p>
                        
                        <div className="pt-2 border-t border-slate-100 flex flex-col font-sans">
                          <button className="text-sky-600 font-bold py-2 text-center w-full hover:bg-slate-50 transition-colors">Cleaned</button>
                          <button className="text-sky-600 font-bold py-2 text-center w-full hover:bg-slate-50 transition-colors">Needs Inspection</button>
                          <button className="text-sky-600 font-bold py-2 text-center w-full hover:bg-slate-50 transition-colors">Maintenance Issue</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium font-sans">
                    Interactive buttons, lists and Flows are sent from your WhatsApp Business number. Staff never open the dashboard to update a room.
                  </p>
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
                <div className="flex overflow-x-auto hide-scrollbar gap-1.5 select-none font-sans pb-2 snap-x">
                  {[
                    { key: 'all', label: 'All', count: roomsList.length },
                    { key: 'dirty', label: 'Dirty', count: roomsList.filter(r => r.status === 'Dirty').length },
                    { key: 'cleaning', label: 'Cleaning', count: roomsList.filter(r => r.status === 'Cleaning').length },
                    { key: 'ready', label: 'Clean', count: roomsList.filter(r => r.status === 'Ready').length },
                    { key: 'inspected', label: 'Inspected', count: roomsList.filter(r => r.status === 'Inspected').length },
                    { key: 'dnd', label: 'DND', count: roomsList.filter(r => r.status === 'DND / Occupied').length },
                    { key: 'guest', label: 'Guest Inside', count: roomsList.filter(r => r.status === 'Guest Inside').length },
                    { key: 'maintenance', label: 'Maintenance', count: roomsList.filter(r => r.status === 'Maintenance').length },
                    { key: 'blocked', label: 'Blocked', count: roomsList.filter(r => r.status === 'Blocked').length },
                  ].map(pill => (
                    <button
                      key={pill.key}
                      onClick={() => setRoomsFilter(pill.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold border transition-all cursor-pointer whitespace-nowrap snap-start ${
                        roomsFilter === pill.key
                          ? 'bg-[#105F39] text-white border-[#105F39]'
                          : 'bg-white text-slate-600 border-[#E7E4DD] hover:bg-slate-50'
                      }`}
                    >
                      {pill.label}
                      <span className={`text-[11px] font-semibold ${
                        roomsFilter === pill.key ? 'text-white/80' : 'text-slate-400'
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

                {/* Rooms List Table */}
                <div className="mt-6 font-sans bg-white border border-[#E7E4DD] rounded-[16px] overflow-hidden shadow-sm">
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
                    else if (roomsFilter === 'blocked') result = result.filter(r => r.status === 'Blocked');
                    // Attendant filter
                    if (attendantFilter !== 'all') {
                      const selectedStaff = hkStaff.find(s => s.id.toString() === attendantFilter);
                      if (selectedStaff) {
                        result = result.filter(r => r.assignedTo === selectedStaff.name);
                      }
                    }
                    // Floor filter
                    if (floorFilter !== 'all') result = result.filter(r => r.id.startsWith(floorFilter));

                    return (
                      <div className="w-full">
                        {/* Table Header */}
                        <div className="grid grid-cols-[70px_1.2fr_1.5fr_1.5fr_1fr_1fr_1.5fr_80px] gap-4 px-6 py-4 border-b border-[#E7E4DD] bg-[#FAF9F6] text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none items-center">
                          <div>Room</div>
                          <div>Status</div>
                          <div>Cleaning Type</div>
                          <div>Guest Status</div>
                          <div>Arrival</div>
                          <div>Priority</div>
                          <div>Attendant</div>
                          <div className="text-right">Updated</div>
                        </div>

                        {/* Table Body */}
                        <div className="flex flex-col">
                          {result.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 text-[13px] font-semibold select-none bg-white">
                              No rooms match your active filters.
                            </div>
                          ) : (
                            result.map((room, index) => {
                              const isMaintenance = room.status === 'Maintenance';
                            const isDirty = room.status === 'Dirty';
                            const isGuestInside = room.status === 'Guest Inside';
                            const isReady = room.status === 'Ready';
                            const isInspected = room.status === 'Inspected';
                            const isDnd = room.status === 'DND / Occupied';
                            const isInProgress = room.status === 'Cleaning';

                            let dotColor = 'bg-slate-400';
                            let badgeStyle = 'bg-slate-50 text-slate-700 border-slate-200';
                            if (isMaintenance) { dotColor = 'bg-orange-500'; badgeStyle = 'bg-orange-50 text-orange-700 border-orange-200/60'; }
                            else if (isDirty) { dotColor = 'bg-red-500'; badgeStyle = 'bg-red-50 text-red-700 border-red-200/60'; }
                            else if (isInProgress) { dotColor = 'bg-amber-500'; badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200/60'; }
                            else if (isDnd || isGuestInside) { dotColor = 'bg-amber-500'; badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200/60'; }
                            else if (isInspected) { dotColor = 'bg-teal-500'; badgeStyle = 'bg-teal-50 text-teal-700 border-teal-200/60'; }
                            else if (isReady) { dotColor = 'bg-emerald-500'; badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200/60'; }

                            const occupancy = isGuestInside ? 'Occupied' : isDnd ? 'DND' : (room.subtitleInfo?.startsWith('In house') ? 'In house' : room.subtitleInfo?.includes('Checked out') ? room.subtitleInfo.split('·')[0].trim() : 'Vacant');
                            const priority = room.type.includes('VIP') ? 'High' : (room.type.includes('Departure') ? 'Normal' : 'Low');
                            
                            const timeMatch = room.subtitleInfo?.match(/(\d{2}:\d{2})/);
                            const displayTime = timeMatch ? timeMatch[1] : '—';
                            
                            const arrivalMatch = room.subtitleInfo?.match(/arrival (\d{2}:\d{2})/);
                            const arrivalTime = arrivalMatch ? arrivalMatch[1] : '—';

                            return (
                              <div key={room.id} className={`flex flex-col px-6 py-5 ${index !== result.length - 1 ? 'border-b border-[#E7E4DD]' : ''}`}>
                                
                                {/* Data Row */}
                                <div className="grid grid-cols-[70px_1.2fr_1.5fr_1.5fr_1fr_1fr_1.5fr_80px] gap-4 items-center">
                                  <div className="text-[15px] font-bold text-slate-800 font-sans">{room.id}</div>
                                  <div>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeStyle}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                      {room.status}
                                    </span>
                                  </div>
                                  <div className="text-[13px] font-medium text-slate-600">{room.type}</div>
                                  <div className="text-[13px] font-medium text-slate-500">{occupancy}</div>
                                  <div className="text-[13px] font-mono text-slate-500">{arrivalTime}</div>
                                  <div>
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#F5F2EC] text-[11px] font-semibold text-slate-500 border border-[#E7E4DD]">{priority}</span>
                                  </div>
                                  <div className="text-[13px] font-medium text-slate-600">{room.assignedTo}</div>
                                  <div className="text-[12px] font-mono text-slate-400 text-right">{displayTime}</div>
                                </div>

                                {/* Actions Row */}
                                <div className="grid grid-cols-[70px_1fr] gap-4 mt-3">
                                  <div></div> {/* Empty column to indent actions */}
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => handleStartRoom(room.id)}
                                      disabled={isInProgress}
                                      className="px-3.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer bg-white text-slate-500 border-[#E7E4DD] hover:bg-slate-50 hover:text-slate-700"
                                    >
                                      Cleaning
                                    </button>
                                    <button
                                      onClick={() => handleReleaseRoom(room.id)}
                                      disabled={isReady}
                                      className="px-3.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer bg-white text-slate-500 border-[#E7E4DD] hover:bg-slate-50 hover:text-slate-700"
                                    >
                                      Clean
                                    </button>
                                    <button
                                      onClick={() => handleInspectRoom(room.id)}
                                      disabled={isInspected}
                                      className="px-3.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer bg-white text-slate-500 border-[#E7E4DD] hover:bg-slate-50 hover:text-slate-700"
                                    >
                                      Inspected
                                    </button>
                                    <button
                                      onClick={() => handleToggleDnd(room.id)}
                                      disabled={isDnd}
                                      className="px-3.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer bg-white text-slate-500 border-[#E7E4DD] hover:bg-slate-50 hover:text-slate-700"
                                    >
                                      DND
                                    </button>
                                    <button
                                      onClick={() => setRoomsList(prev => prev.map(r => r.id === room.id ? { ...r, status: 'Guest Inside' } : r))}
                                      disabled={isGuestInside}
                                      className="px-3.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer bg-white text-slate-500 border-[#E7E4DD] hover:bg-slate-50 hover:text-slate-700"
                                    >
                                      Guest Inside
                                    </button>
                                    <button
                                      onClick={() => setRoomsList(prev => prev.map(r => r.id === room.id ? { ...r, status: 'Maintenance' } : r))}
                                      disabled={isMaintenance}
                                      className="px-3.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer bg-white text-slate-500 border-[#E7E4DD] hover:bg-slate-50 hover:text-slate-700"
                                    >
                                      Maintenance
                                    </button>
                                  </div>
                                </div>

                              </div>
                            );
                          })
                          )}
                        </div>
                      </div>
                    );
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 select-none">
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">TASKS</span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">Guest requests, routed to a floor</h2>
                <p className="text-xs text-slate-500 max-w-2xl font-medium leading-relaxed font-sans">
                  Towels, cots, extra pillows and turndowns arrive here the moment a guest asks — in any language, on any channel.
                </p>
              </div>
              {!isStaff && (
                <button
                  onClick={handleNewTask}
                  className="flex items-center gap-2 bg-[#175C41] hover:bg-[#114832] text-white px-5 py-2.5 rounded-[14px] text-sm font-semibold transition-all cursor-pointer self-start"
                >
                  <ClipboardList size={18} />
                  <span>New task</span>
                </button>
              )}
            </div>

            {/* 4 Task KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 select-none font-sans">
              
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#E7E4DD] shadow-sm text-left relative min-h-[90px] md:min-h-[100px] flex flex-col justify-between">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Open</span>
                <div className="mt-2">
                  <span className="text-xl md:text-2xl font-bold text-slate-900 leading-none block font-serif">{taskKpis.openTasks}</span>
                </div>
              </div>

              <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#E7E4DD] shadow-sm text-left relative min-h-[90px] md:min-h-[100px] flex flex-col justify-between">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Unassigned</span>
                <div className="mt-2 space-y-0.5">
                  <span className="text-xl md:text-2xl font-bold text-slate-900 leading-none block font-serif">{taskKpis.unassignedTasks}</span>
                  <span className="text-[9px] md:text-[10px] text-slate-400 font-bold block leading-none">nobody has it yet</span>
                </div>
              </div>

              <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#E7E4DD] shadow-sm text-left relative min-h-[90px] md:min-h-[100px] flex flex-col justify-between">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Completed</span>
                <div className="mt-2">
                  <span className="text-xl md:text-2xl font-bold text-slate-900 leading-none block font-serif">{taskKpis.completedTasks}</span>
                </div>
              </div>

              <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#E7E4DD] shadow-sm text-left relative min-h-[90px] md:min-h-[100px] flex flex-col justify-between">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">From guests</span>
                <div className="mt-2">
                  <span className="text-xl md:text-2xl font-bold text-slate-900 leading-none block font-serif">{taskKpis.fromGuestTasks}</span>
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
