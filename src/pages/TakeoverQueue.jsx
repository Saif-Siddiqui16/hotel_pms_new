import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useApp, ROLES } from '../context/AppContext';

// =========================================================================
// VIEW A: FRONT OFFICE TASKS VIEW (matching reference image)
// =========================================================================
const FrontOfficeTasksView = () => {
  const [activeFilter, setActiveFilter] = useState('mine');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    what: '',
    detail: '',
    room: '',
    due: '',
    department: 'Front Office',
    priority: 'Normal',
    sendTo: 'Leave unassigned'
  });

  const [deskTasks, setDeskTasks] = useState([
    {
      id: 'FO-205',
      room: '205',
      title: 'Late checkout 15:00 — decision needed',
      tags: ['Normal', 'Front Office'],
      desc: 'Guest asked for 15:00. 24 arrivals today; 205 is needed for a 15:00 check-in.',
      meta: '💬 Guest WhatsApp · 09:19 · 📅 due 10:30 · Hendrik Vos · Amélie Duprez',
      status: 'New',
      filter: 'mine'
    },
    {
      id: 'FO-397',
      room: '397',
      title: 'VIP preparation — 307',
      tags: ['High', 'VIP'],
      desc: 'Still water, fruit plate, high floor away from lift. Confirm 20:00 table at De Kleine Zavel.',
      meta: '📋 PMS event · 07:15 · 📅 due 13:30 · Yuki Tanabe · Amélie Duprez',
      status: 'In Progress',
      filter: 'mine'
    },
    {
      id: 'FO-411',
      room: '411',
      title: 'Approve €47.60 credit note',
      tags: ['High', 'Billing'],
      desc: 'Duplicate city tax €10.60 and minibar €26.40 posted to wrong room. Folio MRC-47988.',
      meta: '✉️ Guest Email · 08:05 · 📅 due 17:00 · Nadia Haddad · Jonas Verhaeghe',
      status: 'Escalated',
      filter: 'mine'
    },
    {
      id: 'FO-115',
      room: '115',
      title: 'Post laptop charger to guest',
      tags: ['Low', 'Follow-up'],
      desc: 'Black 65W charger from 115, logged 12 Aug. Waiting for the address.',
      meta: '✉️ Guest Email · yesterday 18:33 · Lars Bakke · Thibault Mertens',
      status: 'Waiting',
      filter: 'mine'
    },
    {
      id: 'FO-212',
      room: '212',
      title: 'Taxi to Antwerpen-Centraal, 15:45',
      tags: ['Normal', 'Front Office'],
      desc: 'Guest asked for 15:45.',
      meta: '💬 Guest WhatsApp · 09:12 · 📅 due 15:30 · Daniel Weiss · Unassigned',
      status: 'New',
      filter: 'guests'
    },
    {
      id: 'FO-298',
      room: '298',
      title: 'Missing payment — card declined on 208',
      tags: ['High', 'Front Office'],
      desc: 'Pre-authorisation failed twice. Request new card at check-in.',
      meta: '📋 PMS event · 06:40 · 📅 due 14:00 · Priya Raghavan · Amélie Duprez',
      status: 'Assigned',
      filter: 'open'
    },
    {
      id: 'FO-392',
      room: '392',
      title: 'Room move request — 302 to 310',
      tags: ['High', 'Front Office'],
      desc: 'Pending manager decision on compensation vs upgrade.',
      meta: '🤖 AI Detection · 09:53 · Clara Bertrand · Jonas Verhaeghe',
      status: 'Escalated',
      filter: 'open'
    },
  ]);

  const statusUpdates = [
    { room: '401', title: 'Priority clean before 13:00 early arrival', guest: 'Grace Okonkwo', updates: ['12:26 — Maria Silva: Cleaned — room released'], status: 'Completed' },
    { room: '392', title: 'Air conditioning not cooling', guest: 'Clara Bertrand', updates: ['09:35 — Peter Janssens: checking condenser on the roof'], status: 'In Progress' },
    { room: '212', title: '2 extra towels', guest: 'Daniel Weiss', updates: ['09:03 — Guest informed automatically'], status: 'Completed' },
    { room: '298', title: 'Baby cot in 208 before 14:00', guest: 'Priya Raghavan', updates: ['08:12 — Sent to Inès Duarte on WhatsApp'], status: 'Assigned' },
    { room: '397', title: 'Shower drain leaking into 207 ceiling', updates: ['09:11 — Milan Novák: Accept'], status: 'In Progress' },
  ];

  const getFilteredTasks = () => {
    if (activeFilter === 'mine') return deskTasks.filter(t => t.filter === 'mine');
    if (activeFilter === 'open') return deskTasks.filter(t => t.status !== 'Completed');
    if (activeFilter === 'guests') return deskTasks.filter(t => t.meta.includes('Guest'));
    if (activeFilter === 'completed') return deskTasks.filter(t => t.status === 'Completed');
    return deskTasks;
  };

  const openCount = deskTasks.filter(t => ['New', 'In Progress', 'Assigned'].includes(t.status)).length;
  const vipCount = deskTasks.filter(t => t.tags.includes('VIP')).length;
  const waitingCount = deskTasks.filter(t => t.status === 'Waiting').length;
  const completedCount = statusUpdates.filter(u => u.status === 'Completed').length;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Escalated': return 'bg-red-50 text-red-700 border-red-200';
      case 'Waiting': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Assigned': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500';
      case 'In Progress': return 'bg-amber-500';
      case 'Escalated': return 'bg-red-500';
      case 'Waiting': return 'bg-purple-500';
      case 'Assigned': return 'bg-indigo-500';
      case 'Completed': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  const getPriorityStyle = (tag) => {
    if (tag === 'High' || tag === 'Urgent') return 'bg-red-50 text-red-700 border border-red-200';
    if (tag === 'Low') return 'bg-slate-50 text-slate-600 border border-slate-200';
    if (tag === 'VIP') return 'bg-purple-50 text-purple-700 border border-purple-200';
    return 'bg-slate-50 text-slate-600 border border-slate-200';
  };

  const submitNewTask = (e) => {
    e.preventDefault();
    if (!taskForm.what.trim()) return;
    const newTask = {
      id: `FO-${Date.now()}`,
      room: taskForm.room || '—',
      title: taskForm.what,
      tags: [taskForm.priority, taskForm.department],
      desc: taskForm.detail || 'Manual task.',
      meta: `💬 Manual · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · due ${taskForm.due || '—'} · ${taskForm.sendTo}`,
      status: 'New',
      filter: 'mine'
    };
    setDeskTasks(prev => [newTask, ...prev]);
    setIsTaskModalOpen(false);
    setTaskForm({ what: '', detail: '', room: '', due: '', department: 'Front Office', priority: 'Normal', sendTo: 'Leave unassigned' });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="h-full overflow-y-auto bg-[#F7F6F3] w-full text-left font-sans">
      <div className="p-8 space-y-8">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">TASKS</span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight" style={{fontFamily: 'Georgia, serif'}}>What the desk owes guests today</h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Created mostly by the AI from guest messages. When housekeeping or maintenance finish something on WhatsApp, it lands here and the guest is told automatically.
            </p>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F5132] hover:bg-[#0b4227] text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm shrink-0"
          >
            <Plus size={14} />
            <span>New task</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Open for the desk', value: openCount },
            { label: 'VIP preparation', value: vipCount },
            { label: 'Waiting on someone else', value: waitingCount },
            { label: 'Completed today', value: completedCount, check: true },
          ].map(({ label, value, check }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#E7E4DD] p-5 shadow-xs">
              <div className="flex justify-between items-start">
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">{label}</p>
                {check && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-2 font-mono">{value}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {[
            { key: 'mine', label: 'Mine' },
            { key: 'open', label: 'All open' },
            { key: 'guests', label: 'From guests' },
            { key: 'completed', label: 'Completed today' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === key
                  ? 'bg-[#0F5132] text-white shadow-sm'
                  : 'bg-white border border-[#E7E4DD] text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tasks list */}
        <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No tasks in this view.</div>
          ) : filteredTasks.map((task) => (
            <div key={task.id} className="p-5 flex items-center gap-4 hover:bg-slate-50/30 transition-colors">
              {/* Room badge */}
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-sm text-slate-800 shrink-0 font-mono select-none">
                {task.room}
              </div>
              {/* Task info */}
              <div className="flex-1 min-w-0 space-y-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">{task.title}</span>
                  {task.tags.map((tag) => (
                    <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getPriorityStyle(tag)}`}>{tag}</span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{task.desc}</p>
                <p className="text-[10px] text-slate-400 font-mono">{task.meta}</p>
              </div>
              {/* Status badge */}
              <div className="shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider font-mono ${getStatusStyle(task.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(task.status)}`} />
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Status updates section */}
        <div className="space-y-4">
          <div className="space-y-1 text-left">
            <h2 className="text-xl font-bold text-slate-900" style={{fontFamily: 'Georgia, serif'}}>Status updates coming back to you</h2>
            <p className="text-xs text-slate-500 font-medium">Straight from housekeeping and maintenance phones</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden divide-y divide-slate-100">
            {statusUpdates.map((u) => (
              <div key={u.room + u.title} className="p-4 flex items-center gap-4 hover:bg-slate-50/30 transition-colors">
                <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-xs text-slate-800 shrink-0 font-mono">
                  {u.room}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{u.title}</span>
                    {u.guest && <span className="text-[10px] text-slate-400 font-medium">{u.guest}</span>}
                  </div>
                  {u.updates.map((upd, i) => (
                    <p key={i} className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <MessageSquare size={9} className="shrink-0 text-slate-400" />
                      {upd}
                    </p>
                  ))}
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider font-mono ${getStatusStyle(u.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(u.status)}`} />
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[10px] text-slate-400 font-medium pb-4">
          Example: "Room 401 early arrival 13:00" was closed by Maria at 12:26 from her phone. The guest was told the room was ready without anyone at the desk typing a word.
        </p>
      </div>

      {/* New Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setIsTaskModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">New task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-all">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={submitNewTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">What needs doing?</label>
                <input
                  type="text"
                  value={taskForm.what}
                  onChange={e => setTaskForm(p => ({ ...p, what: e.target.value }))}
                  placeholder="e.g. Extra pillows for 208"
                  className="w-full px-4 py-2.5 border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 bg-[#F7F6F3]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Detail (optional)</label>
                <textarea
                  value={taskForm.detail}
                  onChange={e => setTaskForm(p => ({ ...p, detail: e.target.value }))}
                  placeholder="Add context..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 bg-[#F7F6F3] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Room</label>
                  <input
                    type="text"
                    value={taskForm.room}
                    onChange={e => setTaskForm(p => ({ ...p, room: e.target.value }))}
                    placeholder="e.g. 302"
                    className="w-full px-4 py-2.5 border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 bg-[#F7F6F3]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due by</label>
                  <input
                    type="time"
                    value={taskForm.due}
                    onChange={e => setTaskForm(p => ({ ...p, due: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 bg-[#F7F6F3]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
                  <select
                    value={taskForm.department}
                    onChange={e => setTaskForm(p => ({ ...p, department: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 bg-[#F7F6F3] cursor-pointer"
                  >
                    {['Front Office', 'Housekeeping', 'Maintenance', 'Billing', 'Follow-up'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={e => setTaskForm(p => ({ ...p, priority: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E7E4DD] rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 bg-[#F7F6F3] cursor-pointer"
                  >
                    {['Normal', 'High', 'Low', 'Urgent'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 px-4 py-2.5 border border-[#E7E4DD] rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#0F5132] hover:bg-[#0b4227] text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
                  Create task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


// =========================================================================
// MAIN MANAGER TASKS VIEW (TICKETS LOG VIEW MATCHING 1st SCREENSHOT)
// =========================================================================
const TakeoverQueue = () => {
  const navigate = useNavigate();
  const { role } = useApp();

  // If role is Front Office, redirect to the sidebar-wrapped FO subview
  if (role === ROLES.FRONT_OFFICE) {
    return <FrontOfficeTasksView />;
  }

  // Master State representing Tasks matching the 1st Image List (12 items total)
  const [tasks, setTasks] = useState([
    {
      id: 'MT-120',
      room: '205',
      title: 'Late checkout 15:00 — decision needed',
      priority: 'Normal',
      department: 'Front Office',
      desc: 'Guest asked for 15:00. 24 arrivals today; 205 is needed for a 15:00 check-in.',
      meta: '💬 Guest WhatsApp · 09:19 · 📅 due 10:30 · Hendrik Vos · Amélie Duprez',
      status: 'New'
    },
    {
      id: 'MT-114',
      room: '302',
      title: 'Air conditioning not cooling',
      priority: 'High',
      department: 'Maintenance',
      desc: 'Split unit runs but blows warm. Guest in house until 19 Aug.',
      meta: '💬 Guest WhatsApp · 08:32 · 📅 due 11:00 · Clara Bertrand · Peter Janssens',
      status: 'In Progress'
    },
    {
      id: 'MT-121',
      room: '307',
      title: 'VIP preparation — 307',
      priority: 'High',
      department: 'VIP',
      desc: 'Still water, fruit plate, high floor away from lift. Confirm 20:00 table at De Kleine Zavel.',
      meta: '📋 PMS event · 07:15 · 📅 due 13:30 · Yuki Tanabe · Amélie Duprez',
      status: 'In Progress'
    },
    {
      id: 'MT-122',
      room: '411',
      title: 'Approve €47.60 credit note',
      priority: 'High',
      department: 'Billing',
      desc: 'Duplicate city tax €10.60 and minibar €26.40 posted to wrong room. Folio MRC-47988.',
      meta: '✉️ Guest Email · 08:05 · 📅 due 17:00 · Nadia Haddad · Jonas Verhaeghe',
      status: 'Escalated'
    },
    {
      id: 'MT-123',
      room: '208',
      title: 'Baby cot in 208 before 14:00',
      priority: 'Normal',
      department: 'Housekeeping',
      desc: 'Guest asked for 14:00. 24 arrivals today.',
      meta: '💬 Guest WhatsApp · 08:11 · 📅 due 13:30 · Priya Raghavan · Inès Duarte',
      status: 'Assigned'
    },
    {
      id: 'MT-124',
      room: '115',
      title: 'Post laptop charger to guest',
      priority: 'Low',
      department: 'Follow-up',
      desc: 'Black 65W charger from 115, logged 12 Aug. Waiting for the address.',
      meta: '✉️ Guest Email · yesterday 18:33 · Lars Bakke · Thibault Mertens',
      status: 'Waiting'
    },
    {
      id: 'MT-115',
      room: '307',
      title: 'Shower drain leaking into 207 ceiling',
      priority: 'Urgent',
      department: 'Maintenance',
      desc: 'Reported by housekeeping during stayover clean.',
      meta: '📋 Housekeeping · 09:06 · Milan Novák',
      status: 'In Progress'
    },
    {
      id: 'MT-125',
      room: '212',
      title: 'Taxi to Antwerpen-Centraal, 15:45',
      priority: 'Normal',
      department: 'Front Office',
      desc: 'Guest asked for 15:45.',
      meta: '💬 Guest WhatsApp · 09:12 · 📅 due 15:30 · Daniel Weiss · Unassigned',
      status: 'New'
    },
    {
      id: 'MT-126',
      room: '208',
      title: 'Missing payment — card declined on 208',
      priority: 'High',
      department: 'Front Office',
      desc: 'Pre-authorisation failed twice. Request new card at check-in.',
      meta: '📋 PMS event · 06:40 · 📅 due 14:00 · Priya Raghavan · Amélie Duprez',
      status: 'Assigned'
    },
    {
      id: 'MT-127',
      room: '302',
      title: 'Room move request — 302 to 310',
      priority: 'High',
      department: 'Front Office',
      desc: 'Pending manager decision on compensation vs upgrade.',
      meta: '🤖 AI Detection · 09:53 · Clara Bertrand · Jonas Verhaeghe',
      status: 'Escalated'
    },
    {
      id: 'MT-128',
      room: '215',
      title: 'Replenish minibar',
      priority: 'Normal',
      department: 'Housekeeping',
      desc: 'Replenish sodas and chips.',
      meta: '💬 Guest WhatsApp · 10:15 · Hendrik Vos · Inès Duarte',
      status: 'Completed'
    },
    {
      id: 'MT-129',
      room: '309',
      title: 'Change bedsheets',
      priority: 'Normal',
      department: 'Housekeeping',
      desc: 'Slight stain reported on sheets.',
      meta: '💬 Guest WhatsApp · 11:20 · Hendrik Vos · Inès Duarte',
      status: 'Completed'
    }
  ]);

  // Operational Filters state
  const [deptFilter, setDeptFilter] = useState('all'); 
  const [statusFilter, setStatusFilter] = useState('open'); // Loaded as 'open' by default to hide 2 completed tasks

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    what: 'Extra pillows for 208',
    detail: '',
    room: '302',
    due: '13:00',
    department: 'Maintenance',
    priority: 'Normal',
    sendTo: 'Leave unassigned'
  });

  // Calculate live KPI counts based on tasks list state
  const openTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const escalatedTasksCount = tasks.filter(t => t.status === 'Escalated').length;
  const fromGuestsCount = tasks.filter(t => t.meta.includes('Guest WhatsApp') || t.meta.includes('Guest Email')).length;
  const createdByAiCount = tasks.filter(t => t.meta.includes('AI') || t.meta.includes('PMS') || t.meta.includes('🤖')).length;

  // Toggle tasks status to completed when clicked
  const handleToggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'New' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Submit Handler for New Task Modal
  const submitNewTask = (e) => {
    e.preventDefault();
    if (!taskForm.what.trim()) return;

    const newTask = {
      id: `MT-${128 + tasks.length}`,
      room: taskForm.room,
      title: taskForm.what,
      priority: taskForm.priority,
      department: taskForm.department,
      desc: taskForm.detail || 'Manual department task.',
      meta: `💬 Guest WhatsApp · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · due ${taskForm.due} · ${taskForm.sendTo}`,
      status: 'New'
    };

    setTasks(prev => [newTask, ...prev]);
    setIsTaskModalOpen(false);
  };

  // Filter Tasks list based on current selection
  const getFilteredTasks = () => {
    let result = tasks;

    // Department filter mapping
    if (deptFilter !== 'all') {
      result = result.filter(t => t.department.toLowerCase() === deptFilter.toLowerCase());
    }

    // Status filter mapping
    if (statusFilter !== 'all') {
      if (statusFilter === 'open') {
        result = result.filter(t => t.status !== 'Completed');
      } else {
        result = result.filter(t => t.status.toLowerCase() === statusFilter.toLowerCase());
      }
    }

    return result;
  };

  return (
    <div id="tasks-log-content" className="w-full flex-1 h-full overflow-y-auto bg-[#F7F6F3] p-8 space-y-8 select-none text-left">
      <style>{`
        #tasks-log-content,
        #tasks-log-content h1,
        #tasks-log-content h2,
        #tasks-log-content h3,
        #tasks-log-content h4,
        #tasks-log-content .serif-font {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
      `}</style>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono font-sans block">TASKS</span>
          <h2 className="text-2xl font-bold text-slate-955 tracking-tight font-serif">One list across every department</h2>
          <p className="text-xs text-slate-500 max-w-2xl font-medium leading-relaxed font-sans">
            Most of these were created by the AI from a guest message. Department updates arrive back from WhatsApp.
          </p>
        </div>
        <button 
          onClick={() => {
            setTaskForm({
              what: 'Extra pillows for 208',
              detail: '',
              room: '302',
              due: '13:00',
              department: 'Maintenance',
              priority: 'Normal',
              sendTo: 'Leave unassigned'
            });
            setIsTaskModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#0F5132] hover:bg-[#0b4227] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0 font-sans flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>New task</span>
        </button>
      </div>

      {/* KPI Stats Cards (4 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[105px] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none animate-all">Open</span>
          <div className="mt-2">
            <span className="text-2.5xl font-bold text-slate-900 leading-none block font-serif serif-font">{openTasksCount}</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block leading-none mt-1">not yet completed</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[105px] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#b91c1c] uppercase tracking-wider leading-none">Escalated</span>
          <div className="mt-2">
            <span className="text-2.5xl font-bold text-[#b91c1c] leading-none block font-serif serif-font">{escalatedTasksCount}</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block leading-none mt-1">waiting on a decision</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[105px] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">From guests</span>
          <div className="mt-2">
            <span className="text-2.5xl font-bold text-slate-900 leading-none block font-serif serif-font">{fromGuestsCount}</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block leading-none mt-1">WhatsApp and email</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[105px] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Created by AI</span>
          <div className="mt-2">
            <span className="text-2.5xl font-bold text-slate-900 leading-none block font-serif serif-font">{createdByAiCount}</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block leading-none mt-1">intent detection and PMS events</span>
          </div>
        </div>

      </div>

      {/* Filter Row 1: Departments */}
      <div className="flex flex-wrap gap-2 font-sans text-xs">
        <button 
          onClick={() => setDeptFilter('all')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            deptFilter === 'all' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-600 hover:bg-slate-55'
          }`}
        >
          All <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${deptFilter === 'all' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{tasks.length}</span>
        </button>
        <button 
          onClick={() => setDeptFilter('front office')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            deptFilter === 'front office' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-600 hover:bg-slate-55'
          }`}
        >
          Front Office <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${deptFilter === 'front office' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{tasks.filter(t => t.department === 'Front Office').length}</span>
        </button>
        <button 
          onClick={() => setDeptFilter('housekeeping')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            deptFilter === 'housekeeping' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-600 hover:bg-slate-55'
          }`}
        >
          Housekeeping <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${deptFilter === 'housekeeping' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{tasks.filter(t => t.department === 'Housekeeping').length}</span>
        </button>
        <button 
          onClick={() => setDeptFilter('maintenance')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            deptFilter === 'maintenance' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-600 hover:bg-slate-55'
          }`}
        >
          Maintenance <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${deptFilter === 'maintenance' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{tasks.filter(t => t.department === 'Maintenance').length}</span>
        </button>
        <button 
          onClick={() => setDeptFilter('guest request')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            deptFilter === 'guest request' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-600 hover:bg-slate-55'
          }`}
        >
          Guest Request <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${deptFilter === 'guest request' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{tasks.filter(t => t.department === 'Guest Request').length}</span>
        </button>
        <button 
          onClick={() => setDeptFilter('vip')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            deptFilter === 'vip' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-600 hover:bg-slate-55'
          }`}
        >
          VIP <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${deptFilter === 'vip' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{tasks.filter(t => t.department === 'VIP').length}</span>
        </button>
        <button 
          onClick={() => setDeptFilter('billing')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            deptFilter === 'billing' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-600 hover:bg-slate-55'
          }`}
        >
          Billing <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${deptFilter === 'billing' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{tasks.filter(t => t.department === 'Billing').length}</span>
        </button>
        <button 
          onClick={() => setDeptFilter('follow-up')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            deptFilter === 'follow-up' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-600 hover:bg-slate-55'
          }`}
        >
          Follow-up <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${deptFilter === 'follow-up' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{tasks.filter(t => t.department === 'Follow-up').length}</span>
        </button>
      </div>

      {/* Filter Row 2: Status */}
      <div className="flex flex-wrap gap-4 font-sans text-xs border-b border-slate-200/60 pb-3 text-slate-500">
        <button 
          onClick={() => setStatusFilter('all')}
          className={`font-bold transition-all cursor-pointer ${statusFilter === 'all' ? 'text-slate-900 border-b-2 border-slate-900 pb-1 -mb-3.5' : 'hover:text-slate-700'}`}
        >
          All
        </button>
        <button 
          onClick={() => setStatusFilter('open')}
          className={`font-bold transition-all cursor-pointer ${statusFilter === 'open' ? 'text-slate-900 border-b-2 border-slate-900 pb-1 -mb-3.5' : 'hover:text-slate-700'}`}
        >
          Open
        </button>
        <button 
          onClick={() => setStatusFilter('new')}
          className={`font-bold transition-all cursor-pointer ${statusFilter === 'new' ? 'text-slate-900 border-b-2 border-slate-900 pb-1 -mb-3.5' : 'hover:text-slate-700'}`}
        >
          New
        </button>
        <button 
          onClick={() => setStatusFilter('assigned')}
          className={`font-bold transition-all cursor-pointer ${statusFilter === 'assigned' ? 'text-slate-900 border-b-2 border-slate-900 pb-1 -mb-3.5' : 'hover:text-slate-700'}`}
        >
          Assigned
        </button>
        <button 
          onClick={() => setStatusFilter('in progress')}
          className={`font-bold transition-all cursor-pointer ${statusFilter === 'in progress' ? 'text-slate-900 border-b-2 border-slate-900 pb-1 -mb-3.5' : 'hover:text-slate-700'}`}
        >
          In Progress
        </button>
        <button 
          onClick={() => setStatusFilter('waiting')}
          className={`font-bold transition-all cursor-pointer ${statusFilter === 'waiting' ? 'text-slate-900 border-b-2 border-slate-900 pb-1 -mb-3.5' : 'hover:text-slate-700'}`}
        >
          Waiting
        </button>
        <button 
          onClick={() => setStatusFilter('escalated')}
          className={`font-bold transition-all cursor-pointer ${statusFilter === 'escalated' ? 'text-slate-900 border-b-2 border-slate-900 pb-1 -mb-3.5' : 'hover:text-slate-700'}`}
        >
          Escalated
        </button>
        <button 
          onClick={() => setStatusFilter('completed')}
          className={`font-bold transition-all cursor-pointer ${statusFilter === 'completed' ? 'text-slate-900 border-b-2 border-slate-900 pb-1 -mb-3.5' : 'hover:text-slate-700'}`}
        >
          Completed
        </button>
      </div>

      {/* Task Cards List Panel */}
      <div className="space-y-4 pt-1">
        {getFilteredTasks().map((task) => {
          const isCompleted = task.status === 'Completed';

          let statusStyle = 'bg-blue-50 text-blue-700 border-blue-200/50';
          if (isCompleted) {
            statusStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
          } else if (task.status === 'In Progress' || task.status === 'Assigned' || task.status === 'Waiting') {
            statusStyle = 'bg-amber-50 text-amber-700 border-amber-200/50';
          } else if (task.status === 'Escalated') {
            statusStyle = 'bg-rose-50 text-rose-700 border-rose-200/50';
          }

          let priorityStyle = 'bg-slate-100 text-slate-600 border-slate-200/60';
          if (task.priority === 'Urgent') {
            priorityStyle = 'bg-red-50 text-red-700 border-red-200/50';
          } else if (task.priority === 'High') {
            priorityStyle = 'bg-orange-50 text-orange-700 border-orange-200/50';
          }

          return (
            <div key={task.id} className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs p-5 flex items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors">
              <div className="flex items-center gap-4">
                {/* Room Badge */}
                <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-sm text-slate-800 shrink-0 font-mono">
                  {task.room}
                </div>

                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2 flex-wrap font-sans">
                    <h4 className={`text-sm font-bold leading-tight font-serif ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider border font-mono ${priorityStyle}`}>
                      {task.priority}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-500 text-[8px] font-black uppercase tracking-wider font-mono">
                      {task.department}
                    </span>
                  </div>
                  {task.desc && (
                    <p className={`text-xs font-semibold leading-relaxed ${isCompleted ? 'text-slate-350' : 'text-slate-650 font-sans'}`}>
                      {task.desc}
                    </p>
                  )}
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono font-sans leading-none pt-0.5">
                    {task.meta}
                  </p>
                </div>
              </div>

              {/* Status Badge clickable action to toggle status */}
              <div className="shrink-0 font-sans cursor-pointer" onClick={() => handleToggleTaskStatus(task.id)}>
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-bold border uppercase tracking-wider font-mono ${statusStyle}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isCompleted ? 'bg-emerald-500' : task.status === 'Escalated' ? 'bg-rose-500' : task.status === 'New' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  {task.status}
                </span>
              </div>
            </div>
          );
        })}

        {getFilteredTasks().length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs font-bold font-sans">
            No tasks match the active filters.
          </div>
        )}
      </div>

      {/* Bottom Section: Where work comes from */}
      <div className="space-y-4 pt-4">
        <div className="text-left select-none space-y-0.5">
          <h3 className="text-lg font-bold text-slate-950 font-serif">Where work comes from</h3>
          <p className="text-[11px] text-slate-500 font-medium font-sans">Sources the AI turns into tasks automatically</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans pb-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
            <div className="space-y-0.5">
              <span className="px-2 py-0.5 rounded bg-blue-55 text-blue-700 text-[8.5px] font-black uppercase tracking-wider font-mono">Guest WhatsApp</span>
              <h4 className="text-xl font-bold text-slate-900 leading-none pt-2 font-serif serif-font">5</h4>
            </div>
            <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
              Requests detected in the guest's own words
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
            <div className="space-y-0.5">
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[8.5px] font-black uppercase tracking-wider font-mono">Guest Email</span>
              <h4 className="text-xl font-bold text-slate-900 leading-none pt-2 font-serif serif-font">2</h4>
            </div>
            <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
              Gmail, Outlook and your own mailbox
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3.5">
            <div className="space-y-0.5">
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[8.5px] font-black uppercase tracking-wider font-mono">AI Detection</span>
              <h4 className="text-xl font-bold text-slate-900 leading-none pt-2 font-serif serif-font">2</h4>
            </div>
            <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
              Follow-ups the AI decides are needed
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E7E4DD] p-5 shadow-xs text-left space-y-3.5">
            <div className="space-y-0.5">
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[8.5px] font-black uppercase tracking-wider font-mono">PMS event</span>
              <h4 className="text-xl font-bold text-slate-900 leading-none pt-2 font-serif serif-font">2</h4>
            </div>
            <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
              Arrivals, VIP flags, failed authorisations
            </p>
          </div>
        </div>
      </div>

      {/* NEW TASK MODAL OVERLAY */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 space-y-6 relative shadow-2xl border border-slate-100 font-sans text-left">
            <button 
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="space-y-1 font-sans">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono block">NEW TASK</span>
              <h3 className="text-xl font-bold text-slate-900 font-serif leading-none">Send work to a department</h3>
            </div>

            <form onSubmit={submitNewTask} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block font-semibold">What needs doing</label>
                <input 
                  type="text" 
                  value={taskForm.what}
                  onChange={(e) => setTaskForm({ ...taskForm, what: e.target.value })}
                  placeholder="Extra pillows for 208"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block font-semibold">Detail (optional)</label>
                <textarea 
                  value={taskForm.detail}
                  onChange={(e) => setTaskForm({ ...taskForm, detail: e.target.value })}
                  placeholder="Additional details..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm h-24 focus:outline-none focus:border-[#105F39] text-slate-700 font-sans resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block font-semibold">Room</label>
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
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block font-semibold">Due</label>
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

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block font-semibold">Department</label>
                  <select 
                    value={taskForm.department}
                    onChange={(e) => setTaskForm({ ...taskForm, department: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans cursor-pointer"
                  >
                    <option value="Front Office">Front Office</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="VIP">VIP</option>
                    <option value="Billing">Billing</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block font-semibold">Priority</label>
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

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-505 uppercase tracking-wider font-sans block font-semibold">Send to</label>
                <select 
                  value={taskForm.sendTo}
                  onChange={(e) => setTaskForm({ ...taskForm, sendTo: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-[#105F39] text-slate-700 font-sans cursor-pointer"
                >
                  <option value="Leave unassigned">Leave unassigned</option>
                  <option value="Hendrik Vos">Hendrik Vos</option>
                  <option value="Peter Janssens">Peter Janssens</option>
                  <option value="Yuki Tanabe">Yuki Tanabe</option>
                  <option value="Milan Novak">Milan Novak</option>
                  <option value="Jonas Verhaeghe">Jonas Verhaeghe</option>
                </select>
              </div>

              <p className="text-[10px] text-slate-400 font-medium font-sans leading-relaxed text-left pt-1">
                Assigned tasks are delivered as an interactive WhatsApp card. The status the person taps comes straight back into these dashboards.
              </p>

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

    </div>
  );
};

export default TakeoverQueue;
