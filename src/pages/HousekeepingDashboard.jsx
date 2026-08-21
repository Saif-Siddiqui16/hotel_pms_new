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
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HousekeepingDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useApp();

  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleNewTask = () => {
    const room = prompt('Enter Room Number (e.g., 302):', '302');
    if (!room) return;
    const title = prompt('Enter Task Title (e.g., 2 extra pillows):', '2 extra pillows');
    if (!title) return;
    const priority = prompt('Enter Priority (High or Normal):', 'Normal');
    
    const newTask = {
      id: `task-${Date.now()}`,
      room: room,
      title: title,
      priority: priority === 'High' ? 'High' : 'Normal',
      desc: 'Requested by guest.',
      meta: `💬 Guest WhatsApp · 15:00 · due 16:30 · Guest`,
      status: 'Assigned'
    };
    
    setTasksList(prev => [...prev, newTask]);
  };

  // Navigation view read from query params
  const searchParams = new URLSearchParams(location.search);
  const activeView = searchParams.get('tab') || 'dashboard';

  // Staff WhatsApp mock selection tab
  const [activeStaffTab, setActiveStaffTab] = useState('maria'); // 'maria', 'ines'

  // Master Rooms Data List
  const [roomsList, setRoomsList] = useState([
    { id: '115', title: 'Room 115', status: 'Ready', type: 'Stayover', assignedTo: 'Alina Popescu', note: '' },
    { id: '118', title: 'Room 118', status: 'Dirty', type: 'Departure', assignedTo: 'unassigned', note: 'Checked out 09:05' },
    { id: '121', title: 'Room 121', status: 'Ready', type: 'Departure', assignedTo: 'Alina Popescu', note: '' },
    { id: '201', title: 'Room 201', status: 'Dirty', type: 'Departure', assignedTo: 'Maria Silva', note: 'Arrival 16:00' },
    { id: '205', title: 'Room 205', status: 'Ready', type: 'Stayover', assignedTo: 'Maria Silva', note: '' },
    { id: '207', title: 'Room 207', status: 'Maintenance', type: 'Departure', assignedTo: 'Maria Silva', note: 'Ceiling stain — leak from 307' },
    { id: '208', title: 'Room 208', status: 'Dirty', type: 'Departure', assignedTo: 'Inès Duarte', note: 'Baby cot required' },
    { id: '212', title: 'Room 212', status: 'Ready', type: 'Stayover', assignedTo: 'Kadir Yılmaz', note: '' },
    { id: '216', title: 'Room 216', status: 'Ready', type: 'Stayover', assignedTo: 'Kadir Yılmaz', note: '' },
    { id: '302', title: 'Room 302', status: 'Guest Inside', type: 'Stayover + Linen', assignedTo: 'Inès Duarte', note: 'AC issue open, guest may move to 310' },
    { id: '307', title: 'Room 307', status: 'Maintenance', type: 'VIP Arrival', assignedTo: 'Inès Duarte', note: 'Shower leak — VIP arrival at 14:00', hasIcon: true },
    { id: '310', title: 'Room 310', status: 'Ready', type: 'Departure', assignedTo: 'Inès Duarte', note: '' },
    { id: '312', title: 'Room 312', status: 'Ready', type: 'Stayover', assignedTo: 'Kadir Yılmaz', note: '' },
    { id: '401', title: 'Room 401', status: 'Ready', type: 'Departure', assignedTo: 'Maria Silva', note: 'Early arrival 13:00' },
    { id: '405', title: 'Room 405', status: 'Dirty', type: 'Departure', assignedTo: 'Maria Silva', note: 'Checked out 09:40 · arrival 17:30' },
    { id: '409', title: 'Room 409', status: 'Ready', type: 'Stayover', assignedTo: 'Alina Popescu', note: '' },
    { id: '411', title: 'Room 411', status: 'Ready', type: 'Stayover', assignedTo: 'Alina Popescu', note: '' },
    { id: '101', title: 'Room 101', status: 'DND / Occupied', type: 'Stayover', assignedTo: 'unassigned', note: '' }
  ]);

  // Master Housekeeping Tasks List
  const [tasksList, setTasksList] = useState([
    { id: 'task-1', room: '401', title: 'Priority clean before 13:00 early arrival', priority: 'High', desc: 'Grace Okonkwo arriving 13:00, Deluxe King 401.', meta: '🤖 AI Detection · 07:44 · due 12:45 · Grace Okonkwo · Maria Silva', status: 'Completed' },
    { id: 'task-2', room: '212', title: '2 extra towels', priority: 'Normal', desc: '', meta: '💬 Guest WhatsApp · 08:53 · Daniel Weiss · Kadir Yılmaz', status: 'Completed' },
    { id: 'task-3', room: '208', title: 'Baby cot in 208 before 14:00', priority: 'Normal', desc: '', meta: '💬 Guest WhatsApp · 08:11 · due 13:30 · Priya Raghavan · Inès Duarte', status: 'Assigned' }
  ]);

  // Rooms Filter and Floor Filter States
  const [roomsFilter, setRoomsFilter] = useState('all'); // 'all', 'dirty', 'cleaning', 'ready', 'dnd', 'maintenance', 'vip', 'early', 'departures'
  const [floorFilter, setFloorFilter] = useState('all'); // 'all', '1', '2', '3', '4'

  // Action: Start Cleaning Room
  const handleStartRoom = (id) => {
    setRoomsList(prev => prev.map(room => {
      if (room.id === id) {
        return { ...room, status: 'Cleaning' };
      }
      return room;
    }));
  };

  // Action: Release Room / Mark Ready
  const handleReleaseRoom = (id) => {
    setRoomsList(prev => prev.map(room => {
      if (room.id === id) {
        return { ...room, status: 'Ready' };
      }
      return room;
    }));
  };

  // Action: Mark Dirty
  const handleMarkDirty = (id) => {
    setRoomsList(prev => prev.map(room => {
      if (room.id === id) {
        return { ...room, status: 'Dirty' };
      }
      return room;
    }));
  };

  // Action: Toggle DND
  const handleToggleDnd = (id) => {
    setRoomsList(prev => prev.map(room => {
      if (room.id === id) {
        return { 
          ...room, 
          status: room.status === 'DND / Occupied' ? 'Ready' : 'DND / Occupied' 
        };
      }
      return room;
    }));
  };

  // Action: Complete Task
  const handleCompleteTask = (taskId) => {
    setTasksList(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, status: 'Completed' };
      }
      return task;
    }));
  };

  // Compute dynamic KPI stats for cards row
  const getKpiCounts = () => {
    const toClean = roomsList.filter(r => r.status === 'Dirty').length;
    const cleaning = roomsList.filter(r => r.status === 'Cleaning').length;
    const ready = roomsList.filter(r => r.status === 'Ready').length;
    const dnd = roomsList.filter(r => r.status === 'DND / Occupied' || r.status === 'Guest Inside').length;
    const maintenance = roomsList.filter(r => r.status === 'Maintenance').length;
    const vip = roomsList.filter(r => r.type.includes('VIP')).length;
    const early = roomsList.filter(r => r.note.includes('Early') || r.note.includes('arrival 14:00') || r.note.includes('arrival 15:00')).length;
    const departures = roomsList.filter(r => r.type.includes('Departure')).length;

    return { toClean, cleaning, ready, dnd, maintenance, vip, early, departures };
  };

  const kpis = getKpiCounts();

  // Filtered Rooms list for Rooms View
  const getFilteredRooms = () => {
    let result = roomsList;

    // Filter by type
    if (roomsFilter === 'dirty') result = result.filter(r => r.status === 'Dirty');
    else if (roomsFilter === 'cleaning') result = result.filter(r => r.status === 'Cleaning');
    else if (roomsFilter === 'ready') result = result.filter(r => r.status === 'Ready');
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
    const prioritySubset = ['307', '208', '207', '302', '405', '118'];
    return roomsList.filter(r => prioritySubset.includes(r.id));
  };

  // Compute Task KPIs
  const getTaskKpis = () => {
    const openTasks = tasksList.filter(t => t.status !== 'Completed').length;
    const completedTasks = tasksList.filter(t => t.status === 'Completed').length;
    return { openTasks, completedTasks };
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
              <h2 className="text-2xl font-bold text-slate-955 tracking-tight font-serif">{kpis.ready} of 18 rooms released.</h2>
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
                  <span className="text-2xl font-bold text-red-650 leading-none block font-serif">2</span>
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
                            <span className="text-xs font-bold text-slate-900">{room.title}</span>
                            {room.hasIcon && (
                              <span className="text-slate-400 font-sans text-[10px]">👑</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                            {room.type} · {room.assignedTo}
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
                            {room.status}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 shrink-0 font-sans">
                          {!isReady && (
                            <button 
                              onClick={() => handleStartRoom(room.id)}
                              disabled={isInProgress}
                              className={`px-3 py-1.5 border border-slate-200 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs ${
                                isInProgress ? 'bg-slate-50 text-slate-405' : 'bg-white hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              Start
                            </button>
                          )}
                          {!isReady ? (
                            <button 
                              onClick={() => handleReleaseRoom(room.id)}
                              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                            >
                              Release
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-600 px-4 font-mono select-none">Released ✓</span>
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
                <div className="flex gap-2 select-none shrink-0 font-sans">
                  <button 
                    onClick={() => setActiveStaffTab('maria')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeStaffTab === 'maria' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] hover:bg-slate-50 text-slate-650'
                    }`}
                  >
                    Maria
                  </button>
                  <button 
                    onClick={() => setActiveStaffTab('ines')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeStaffTab === 'ines' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] hover:bg-slate-50 text-slate-655'
                    }`}
                  >
                    Inês
                  </button>
                </div>

                {/* Phone Mockup Frame */}
                <div className="border border-[#E7E4DD] rounded-2xl overflow-hidden flex flex-col flex-1 shadow-sm">
                  
                  {/* Chat header */}
                  <div className="bg-white p-3 border-b border-[#E7E4DD] flex justify-between items-center select-none font-sans">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#EBF6EE] rounded-lg flex items-center justify-center text-[#105F39] shrink-0 font-mono font-bold text-xs">
                        {activeStaffTab === 'maria' ? 'MS' : 'ID'}
                      </div>
                      <div className="text-left space-y-0.5">
                        <p className="text-xs font-bold text-slate-900">
                          {activeStaffTab === 'maria' ? 'Maria Silva' : 'Inês Duarte'}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono leading-none">
                          {activeStaffTab === 'maria' ? '+32 468 22 74 91 · Attendant · Fl. 2 & 4' : '+32 468 11 99 22 · Supervisor · All Fl.'}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-455 hover:text-slate-600 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                  </div>

                  {/* Chat window body preview */}
                  <div className="bg-[#efeae2] p-4 flex-1 overflow-y-auto min-h-[220px] flex flex-col justify-start">
                    
                    <div className="bg-white rounded-2xl shadow-xs overflow-hidden max-w-[85%] text-left space-y-1.5 select-none font-sans">
                      <div className="p-4 pb-2 space-y-1.5">
                        {activeStaffTab === 'maria' ? (
                          <div className="space-y-1.5 text-xs text-slate-800 leading-normal font-semibold font-sans">
                            <p>Next room: 405 — Departure, arrival 17:30.</p>
                            <p className="text-[9px] text-slate-400 font-bold text-right font-mono mt-1">15:02</p>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-xs text-slate-800 leading-normal font-semibold font-sans">
                            <p>Next room: 307 — VIP Arrival, arrival 14:00.</p>
                            <p className="text-[9px] text-slate-400 font-bold text-right font-mono mt-1">13:48</p>
                          </div>
                        )}
                      </div>

                      {/* Interactive mock button list links */}
                      <div className="border-t border-slate-100 divide-y divide-slate-100 flex flex-col font-sans">
                        {activeStaffTab === 'maria' ? (
                          <>
                            <button 
                              onClick={() => { alert('WhatsApp Action: Start Cleaning 405'); handleStartRoom('405'); }}
                              className="w-full text-center py-2.5 text-xs font-bold text-sky-650 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              Start Cleaning
                            </button>
                            <button 
                              onClick={() => { alert('WhatsApp Action: Guest Inside Room 405'); }}
                              className="w-full text-center py-2.5 text-xs font-bold text-sky-650 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              Guest Inside
                            </button>
                            <button 
                              onClick={() => { alert('WhatsApp Action: DND Room 405'); }}
                              className="w-full text-center py-2.5 text-xs font-bold text-sky-655 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              DND
                            </button>
                            <button 
                              onClick={() => { alert('WhatsApp Action: Maintenance Issue Room 405'); }}
                              className="w-full text-center py-2.5 text-xs font-bold text-sky-650 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              Maintenance Issue
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => { alert('WhatsApp Action: Start Cleaning 307'); handleStartRoom('307'); }}
                              className="w-full text-center py-2.5 text-xs font-bold text-sky-650 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              Start Cleaning
                            </button>
                            <button 
                              onClick={() => { alert('WhatsApp Action: Guest Inside Room 307'); }}
                              className="w-full text-center py-2.5 text-xs font-bold text-sky-655 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              Guest Inside
                            </button>
                            <button 
                              onClick={() => { alert('WhatsApp Action: DND Room 307'); }}
                              className="w-full text-center py-2.5 text-xs font-bold text-sky-650 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              DND
                            </button>
                            <button 
                              onClick={() => { alert('WhatsApp Action: Maintenance Issue Room 307'); }}
                              className="w-full text-center py-2.5 text-xs font-bold text-sky-650 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              Maintenance Issue
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  </div>

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
                
                {/* Card 1: Maria Silva */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">Maria Silva</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">2/5 released</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['201', '205', '207', '401', '405'].map((room) => (
                      <span key={room} className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[10px] font-bold text-slate-550 font-mono">
                        {room}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card 2: Inês Duarte */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">Inès Duarte</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">0/4 released</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['208', '302', '307', '310'].map((room) => (
                      <span key={room} className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[10px] font-bold text-slate-550 font-mono">
                        {room}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card 3: Kadir Yılmaz */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">Kadir Yılmaz</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">1/3 released</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['212', '216', '312'].map((room) => (
                      <span key={room} className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[10px] font-bold text-slate-550 font-mono">
                        {room}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card 4: Alina Popescu */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">Alina Popescu</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">3/5 released</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['115', '118', '121', '409', '411'].map((room) => (
                      <span key={room} className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[10px] font-bold text-slate-550 font-mono">
                        {room}
                      </span>
                    ))}
                  </div>
                </div>

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
          /* VIEW 2: CHOOSE WHAT TO DO FIRST (ROOMS PAGE VIEW)                          */
          /* ========================================================================= */
          <div className="flex-1 p-8 space-y-8 min-h-0 text-left">
            
            {/* Main Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">ROOMS</span>
                <h2 className="text-2xl font-bold text-slate-955 tracking-tight font-serif">Choose what to do first</h2>
                <p className="text-xs text-slate-550 max-w-2xl font-medium leading-relaxed font-sans">
                  Check statuses, view housekeeper notes, assign staff or override cleaning priorities.
                </p>
              </div>
              <button 
                onClick={() => {
                  setRoomsList(prev => prev.map(r => r.status !== 'Ready' ? { ...r, status: 'Ready' } : r));
                  alert('All rooms marked Cleaned / Released!');
                }}
                className="px-5 py-2.5 bg-[#0F5132] hover:bg-[#0b4227] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0 font-sans flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Release all</span>
              </button>
            </div>

            {/* Filter pills switcher row */}
            <div className="flex flex-wrap gap-2 select-none shrink-0 font-sans">
              <button 
                onClick={() => setRoomsFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  roomsFilter === 'all' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                All <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${roomsFilter === 'all' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{roomsList.length}</span>
              </button>
              <button 
                onClick={() => setRoomsFilter('dirty')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  roomsFilter === 'dirty' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-655 hover:bg-slate-50'
                }`}
              >
                To Clean <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${roomsFilter === 'dirty' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{kpis.toClean}</span>
              </button>
              <button 
                onClick={() => setRoomsFilter('cleaning')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  roomsFilter === 'cleaning' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-655 hover:bg-slate-50'
                }`}
              >
                Cleaning <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${roomsFilter === 'cleaning' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{kpis.cleaning}</span>
              </button>
              <button 
                onClick={() => setRoomsFilter('ready')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  roomsFilter === 'ready' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                Ready <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${roomsFilter === 'ready' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{kpis.ready}</span>
              </button>
              <button 
                onClick={() => setRoomsFilter('dnd')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  roomsFilter === 'dnd' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                DND / Occupied <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${roomsFilter === 'dnd' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{kpis.dnd}</span>
              </button>
              <button 
                onClick={() => setRoomsFilter('maintenance')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  roomsFilter === 'maintenance' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                Maintenance <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${roomsFilter === 'maintenance' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{kpis.maintenance}</span>
              </button>
              <button 
                onClick={() => setRoomsFilter('vip')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  roomsFilter === 'vip' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-50'
                }`}
              >
                VIP <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${roomsFilter === 'vip' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{kpis.vip}</span>
              </button>
              <button 
                onClick={() => setRoomsFilter('early')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  roomsFilter === 'early' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-655 hover:bg-slate-50'
                }`}
              >
                Early Arrivals <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${roomsFilter === 'early' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{kpis.early}</span>
              </button>
              <button 
                onClick={() => setRoomsFilter('departures')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  roomsFilter === 'departures' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-655 hover:bg-slate-50'
                }`}
              >
                Departures <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${roomsFilter === 'departures' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{kpis.departures}</span>
              </button>
            </div>

            {/* Sub-filters row by floor level */}
            <div className="flex gap-2.5 border-b border-[#E7E4DD] pb-3 text-xs font-bold select-none font-sans shrink-0">
              <span className="text-slate-400">Floors:</span>
              {['all', '1', '2', '3', '4'].map((floor) => (
                <button
                  key={floor}
                  onClick={() => setFloorFilter(floor)}
                  className={`hover:text-slate-900 cursor-pointer ${
                    floorFilter === floor ? 'text-[#105F39] underline decoration-2 underline-offset-4' : 'text-slate-550'
                  }`}
                >
                  {floor === 'all' ? 'All floors' : `Floor ${floor}`}
                </button>
              ))}
            </div>

            {/* Grid display of 18 Rooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
              {getFilteredRooms().map((room) => {
                const isMaintenance = room.status === 'Maintenance';
                const isDirty = room.status === 'Dirty';
                const isGuestInside = room.status === 'Guest Inside';
                const isReady = room.status === 'Ready';
                const isInProgress = room.status === 'Cleaning' || room.status === 'In Progress';

                let statusBadgeClass = 'bg-slate-50 text-slate-605 border-slate-150';
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
                  <div key={room.id} className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs p-5 flex flex-col justify-between gap-4 text-left">
                    
                    {/* Header info */}
                    <div className="flex justify-between items-baseline select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-slate-905 font-mono">{room.id}</span>
                        {room.hasIcon && (
                          <span className="text-[10px]">👑</span>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider font-mono ${statusBadgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
                        {room.status}
                      </span>
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {room.type}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                        Attendant: {room.assignedTo}
                      </p>
                      {room.note && (
                        <p className="text-[10px] text-amber-600 font-medium font-sans">
                          {room.note}
                        </p>
                      )}
                    </div>

                    {/* Action buttons list */}
                    <div className="border-t border-slate-100 pt-3 flex gap-2 font-sans">
                      {isReady ? (
                        <>
                          <button 
                            onClick={() => handleMarkDirty(room.id)}
                            className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold cursor-pointer transition-all shadow-xs"
                          >
                            Dirty
                          </button>
                          <button 
                            onClick={() => alert(`Inspection started for Room ${room.id}`)}
                            className="flex-1 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold cursor-pointer transition-all shadow-xs"
                          >
                            Inspect
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleStartRoom(room.id)}
                            disabled={isInProgress}
                            className={`flex-1 py-1.5 border border-slate-200 rounded-xl text-[10px] font-bold cursor-pointer transition-all shadow-xs ${
                              isInProgress ? 'bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            Start
                          </button>
                          <button 
                            onClick={() => handleReleaseRoom(room.id)}
                            className="flex-1 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold cursor-pointer transition-all shadow-xs"
                          >
                            Cleaned
                          </button>
                        </>
                      )}
                      
                      <button 
                        onClick={() => handleToggleDnd(room.id)}
                        className={`px-3.5 py-1.5 border border-slate-200 rounded-xl text-[10px] font-bold cursor-pointer transition-all shadow-xs ${
                          room.status === 'DND / Occupied' ? 'bg-amber-50 text-amber-700 border-amber-200/60' : 'bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        Set DND
                      </button>
                    </div>

                  </div>
                );
              })}

              {getFilteredRooms().length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 text-xs font-semibold select-none font-sans">
                  No rooms match your active filters.
                </div>
              )}
            </div>

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
              <button 
                onClick={handleNewTask}
                className="px-5 py-2.5 bg-[#0F5132] hover:bg-[#0b4227] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0 font-sans flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>New task</span>
              </button>
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
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">0</span>
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
                  <span className="text-2xl font-bold text-slate-900 leading-none block font-serif">2</span>
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

                    {/* Status Badge clickable action to trigger completion */}
                    <div className="shrink-0 font-sans cursor-pointer" onClick={() => handleCompleteTask(task.id)}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider font-mono ${
                        isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-505'}`} />
                        {task.status}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default HousekeepingDashboard;
