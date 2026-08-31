import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Wrench, Phone, MoreVertical, Camera, Paperclip, AlertTriangle, ArrowUpRight, Plus, ArrowRight, Clock, CheckCircle2, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';

export const MaintenanceDashboard = () => {
  const { user } = useApp();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Open');
  
  // Track active technician for sidebar if needed, though we default to 'user.name'
  const [activeTechnicianTab, setActiveTechnicianTab] = useState(user?.name || 'Unassigned');

  useEffect(() => {
    const loadData = async () => {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
      
      const allTasks = await taskService.getTasks();
      const maintenanceTasks = allTasks.filter(t => t.department === 'Maintenance');
      const formattedTasks = maintenanceTasks.map((t, idx) => {
        // Fallback for MT ID if id is missing
        const mtId = t.id ? `MT-${t.id}` : `MT-${110 + idx}`;
        const isUrgent = t.priority === 'Urgent';
        const isHigh = t.priority === 'High';
        const isNormal = t.priority === 'Normal';
        const isLow = t.priority === 'Low';
        const isOutOfService = isUrgent || (t.detail && t.detail.toLowerCase().includes('water damage'));
        
        return {
          ...t,
          mtId,
          isUrgent,
          isHigh,
          isNormal,
          isLow,
          isOutOfService,
        };
      });
      setTasks(formattedTasks);
    };
    loadData();
  }, []);

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const updated = await taskService.updateTask(id, { status: newStatus });
      if (updated) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: updated.status } : t));
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleStartWork = (id) => updateTaskStatus(id, 'In Progress');
  const handleCompleteWork = (id) => updateTaskStatus(id, 'Completed');
  const handlePartsRequired = (id) => updateTaskStatus(id, 'Waiting Parts');

  const openIssuesCount = tasks.filter(t => t.status !== 'Completed' && t.status !== 'Fixed').length;
  const urgentCount = tasks.filter(t => t.isUrgent && t.status !== 'Completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedTodayCount = tasks.filter(t => t.status === 'Completed' || t.status === 'Fixed').length;
  const roomsOutOfServiceCount = tasks.filter(t => t.isOutOfService && t.status !== 'Completed').length;
  
  const sortedTasks = [...tasks].filter(t => t.status !== 'Completed' && t.status !== 'Fixed').sort((a, b) => {
    const pA = a.isUrgent ? 3 : a.isHigh ? 2 : a.isNormal ? 1 : 0;
    const pB = b.isUrgent ? 3 : b.isHigh ? 2 : b.isNormal ? 1 : 0;
    return pB - pA;
  });

  // Dynamic AI Brief Generation
  const generateAIBrief = () => {
    if (tasks.length === 0) return { title: 'No maintenance issues active today.', bullets: [] };
    
    const urgentTasks = sortedTasks.filter(t => t.isUrgent);
    const waitingParts = sortedTasks.filter(t => t.status === 'Waiting Parts');
    
    let title = '';
    if (urgentTasks.length > 0) {
      title = `Attention: ${urgentTasks.length} urgent task(s) require immediate action today.`;
    } else if (openIssuesCount > 0) {
      title = `You have ${openIssuesCount} open issues today. Operations are running smoothly.`;
    } else {
      title = 'All maintenance tasks are completed for today!';
    }
    
    const bullets = [];
    if (urgentTasks.length > 0) {
      bullets.push({
        color: 'bg-red-500',
        text: `${urgentTasks[0].mtId} · Room ${urgentTasks[0].room || 'N/A'} — ${urgentTasks[0].what}. This is flagged as urgent.`
      });
    }
    if (waitingParts.length > 0) {
      bullets.push({
        color: 'bg-amber-500',
        text: `${waitingParts.length} task(s) are currently on hold waiting for parts.`
      });
    }
    bullets.push({
      color: 'bg-emerald-500',
      text: `Completing a ticket updates the status across the PMS automatically.`
    });
    
    return { title, bullets };
  };
  const aiBrief = generateAIBrief();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeView = searchParams.get('tab') || 'dashboard';

  // Dynamic Technicians Grouping
  const techniciansMap = {};
  sortedTasks.forEach(t => {
    const assignee = t.sendTo && t.sendTo !== 'Leave unassigned' ? t.sendTo : 'Unassigned';
    if (!techniciansMap[assignee]) techniciansMap[assignee] = [];
    techniciansMap[assignee].push(t);
  });
  const techniciansList = Object.keys(techniciansMap).sort();

  // Dynamic Related Tasks
  const relatedTasks = sortedTasks.filter(t => t.status === 'In Progress' || t.status === 'Waiting Parts');

  // WhatsApp Sidebar Dynamic Preview Task
  const previewTask = sortedTasks.length > 0 ? sortedTasks[0] : null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (activeView === 'issues') {
    const filteredTasks = tasks.filter(t => {
       if (activeFilter === 'Open') return t.status !== 'Completed' && t.status !== 'Fixed';
       if (activeFilter === 'Mine') return t.sendTo === user?.name;
       if (activeFilter === 'Urgent') return t.isUrgent && t.status !== 'Completed';
       if (activeFilter === 'Waiting Parts') return t.status === 'Waiting Parts';
       if (activeFilter === 'Completed') return t.status === 'Completed' || t.status === 'Fixed';
       if (activeFilter === 'All') return true;
       return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
      <div className="h-screen w-full bg-[#FAF9F6] font-sans overflow-y-auto text-left text-slate-900 pb-20 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] font-sans">ISSUE LOG</span>
              <h2 className="text-3xl font-bold font-serif text-slate-900">Every ticket, and where it came from</h2>
              <p className="text-sm text-slate-500 font-medium">Guests report through WhatsApp or email, housekeeping reports with a button, the AI opens the ticket and picks the department.</p>
            </div>
            <button className="px-4 py-2 bg-[#105F39] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0b4227] transition-colors cursor-pointer shadow-sm">
              <Plus size={16} /> Report issue
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Open', count: openIssuesCount },
              { label: 'Mine', count: tasks.filter(t => t.sendTo === user?.name).length },
              { label: 'Urgent', count: urgentCount },
              { label: 'Waiting Parts', count: tasks.filter(t => t.status === 'Waiting Parts').length },
              { label: 'Completed', count: completedTodayCount },
              { label: 'All', count: tasks.length }
            ].map(filter => (
               <button 
                 key={filter.label}
                 onClick={() => setActiveFilter(filter.label)}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer flex items-center gap-2 ${
                   activeFilter === filter.label 
                     ? 'bg-[#105F39] text-white border-[#105F39]' 
                     : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                 }`}
               >
                 {filter.label} <span className={activeFilter === filter.label ? 'text-white/80' : 'text-slate-400'}>{filter.count}</span>
               </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredTasks.length === 0 && (
               <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-xl border border-slate-200">No tasks match this filter.</div>
            )}
            {filteredTasks.map(t => {
               const isUrgent = t.isUrgent;
               const isHigh = t.isHigh;
               const isNormal = t.isNormal;
               
               let priorityClass = 'bg-slate-100 text-slate-600 border-slate-200';
               if (isUrgent) priorityClass = 'bg-red-50 text-red-700 border-red-200';
               else if (isHigh) priorityClass = 'bg-orange-50 text-orange-700 border-orange-200';

               return (
                  <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 relative">
                    <div className="absolute top-6 right-6">
                       <Wrench size={14} className="text-slate-300" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{t.mtId}</span>
                      <span className="text-[11px] font-bold text-slate-900 border-b border-slate-900 pb-0.5 leading-none">Room {t.room || 'N/A'}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${priorityClass}`}>
                        {t.priority}
                      </span>
                      
                      {t.status === 'In Progress' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200">
                          In Progress
                        </span>
                      )}
                      {t.status === 'Waiting Parts' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200">
                          Waiting Parts
                        </span>
                      )}
                      {t.status === 'New' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-blue-50 text-blue-700 border-blue-200">
                          Open
                        </span>
                      )}
                      
                      {t.isOutOfService && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                          <Wrench size={8} /> Out of service
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">{t.what}</h4>
                      {t.detail && <p className="text-sm text-slate-500">{t.detail}</p>}
                      <p className="text-[10px] text-slate-400 font-medium font-mono pt-1">
                        {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · System · {t.department} · {t.sendTo || 'Unassigned'}
                      </p>
                    </div>

                    {t.logs && t.logs.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        {t.logs.map((log) => (
                          <div key={log.id} className="flex items-start gap-3 text-xs text-slate-600">
                            <span className="font-mono text-[10px] text-slate-400 w-12 pt-0.5">
                              {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {log.icon === 'whatsapp' ? (
                              <div className="w-4 h-4 rounded border border-emerald-500 shrink-0 flex items-center justify-center mt-0.5">
                                <span className="text-emerald-500 text-[10px]">💬</span>
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-emerald-200 shrink-0 mt-0.5" />
                            )}
                            <p className="flex-1 font-medium">{log.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-4 flex-wrap gap-4">
                       <div className="flex items-center gap-2">
                        {t.status === 'New' && (
                          <button onClick={() => handleStartWork(t.id)} className="px-4 py-1.5 bg-[#105F39] text-white hover:bg-[#0b4227] rounded-lg text-xs font-bold transition-colors cursor-pointer">
                            Accept
                          </button>
                        )}
                        <button className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                          Update
                        </button>
                        {t.status !== 'Waiting Parts' && (
                          <button onClick={() => handlePartsRequired(t.id)} className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                            Parts required
                          </button>
                        )}
                        <button onClick={() => handleCompleteWork(t.id)} className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                          Complete
                        </button>
                        <button className="px-4 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer">
                          <ArrowUpRight size={12} /> Escalate
                        </button>
                      </div>
                      
                      {t.status === 'New' && (!t.sendTo || t.sendTo === 'Leave unassigned') && (
                        <div className="flex items-center gap-1.5">
                           <span className="text-amber-500 mr-1"><AlertTriangle size={12} /></span>
                           {techniciansList.map(tech => (
                              <button key={tech} onClick={() => updateTaskStatus(t.id, 'In Progress')} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-[10px] font-bold cursor-pointer">
                                {tech}
                              </button>
                           ))}
                        </div>
                      )}
                    </div>
                  </div>
               );
            })}
          </div>

          <div className="pt-8">
             <div className="space-y-1 mb-6">
                <h3 className="text-xl font-bold font-serif text-slate-900">How a ticket travels</h3>
                <p className="text-xs text-slate-500 font-medium">the same flow whether it starts with a guest or a cleaner</p>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                   <span className="text-[10px] text-[#008069] font-black uppercase tracking-wider font-mono block mb-3">#1</span>
                   <h4 className="font-bold text-sm text-slate-900 mb-2">Reported</h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed">Guest message, or a housekeeper tapping "Maintenance Required" on the room card.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                   <span className="text-[10px] text-[#008069] font-black uppercase tracking-wider font-mono block mb-3">#2</span>
                   <h4 className="font-bold text-sm text-slate-900 mb-2">Ticket opened</h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed">The AI writes the ticket, sets urgency and sends it to the technical WhatsApp group.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                   <span className="text-[10px] text-[#008069] font-black uppercase tracking-wider font-mono block mb-3">#3</span>
                   <h4 className="font-bold text-sm text-slate-900 mb-2">Worked</h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed">Accept · Unable to handle · Parts required · External technician — all buttons, no typing.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                   <span className="text-[10px] text-[#008069] font-black uppercase tracking-wider font-mono block mb-3">#4</span>
                   <h4 className="font-bold text-sm text-slate-900 mb-2">Closed</h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed">The room goes back to housekeeping for a recheck and the guest is told it is fixed.</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    );
  }

  if (activeView === 'tasks') {
    const tasksViewTasks = tasks.filter(t => {
       if (activeFilter === 'Open') return t.status !== 'Completed' && t.status !== 'Fixed';
       if (activeFilter === 'Mine') return t.sendTo === user?.name;
       if (activeFilter === 'Completed') return t.status === 'Completed' || t.status === 'Fixed';
       if (activeFilter === 'All') return true;
       return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const whatsappLogs = [];
    tasks.forEach(t => {
       if (t.logs) {
          t.logs.forEach(log => {
             if (log.icon === 'whatsapp') {
                whatsappLogs.push({ ...log, mtId: t.mtId, room: t.room });
             }
          });
       }
    });
    whatsappLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
      <div className="h-screen w-full bg-[#FAF9F6] font-sans overflow-y-auto text-left text-slate-900 pb-20 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] font-sans">TASKS</span>
              <h2 className="text-3xl font-bold font-serif text-slate-900">Parts, checks and follow-ups</h2>
              <p className="text-sm text-slate-500 font-medium">Anything that is not a room fault but still needs doing — ordering parts, booking an external technician, rechecking a repair.</p>
            </div>
            <button className="px-4 py-2 bg-[#105F39] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0b4227] transition-colors cursor-pointer shadow-sm">
              <Plus size={16} /> New task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Assigned to me</span>
              <span className="text-4xl font-bold font-serif text-slate-900">{tasks.filter(t => t.sendTo === user?.name).length}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Open</span>
              <span className="text-4xl font-bold font-serif text-slate-900">{tasks.filter(t => t.status !== 'Completed' && t.status !== 'Fixed').length}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Waiting</span>
              <span className="text-4xl font-bold font-serif text-slate-900 block leading-none">{tasks.filter(t => t.status === 'Waiting Parts').length}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">parts or third parties</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Completed</span>
              <span className="text-4xl font-bold font-serif text-slate-900">{tasks.filter(t => t.status === 'Completed' || t.status === 'Fixed').length}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['Mine', 'Open', 'Completed', 'All'].map(filter => (
               <button 
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer flex items-center gap-2 ${
                   activeFilter === filter 
                     ? 'bg-[#105F39] text-white border-[#105F39]' 
                     : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                 }`}
               >
                 {filter}
               </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {tasksViewTasks.length === 0 && (
               <div className="p-8 text-center text-slate-500 font-medium">No tasks match this filter.</div>
            )}
            {tasksViewTasks.map(t => {
               const isUrgent = t.isUrgent;
               const isHigh = t.isHigh;
               const isNormal = t.isNormal;
               
               let priorityClass = 'bg-slate-100 text-slate-600 border-slate-200';
               if (isUrgent) priorityClass = 'bg-red-50 text-red-700 border-red-200';
               else if (isHigh) priorityClass = 'bg-orange-50 text-orange-700 border-orange-200';

               return (
                 <div key={t.id} className="p-5 flex gap-4 hover:bg-slate-50 transition-colors">
                   <div className="bg-slate-100 rounded-lg px-3 py-1.5 h-fit border border-slate-200 shrink-0">
                     <span className="font-mono text-slate-600 font-bold text-xs">{t.room || 'N/A'}</span>
                   </div>
                   
                   <div className="flex-1 space-y-1.5 min-w-0">
                     <div className="flex items-center justify-between gap-4">
                       <div className="flex items-center gap-2 truncate">
                         <h4 className="text-[15px] font-bold text-slate-900 truncate">{t.what}</h4>
                         <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0 ${priorityClass}`}>
                           {t.priority}
                         </span>
                       </div>
                       
                       <div className="shrink-0">
                         {t.status === 'In Progress' && (
                           <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5">
                             <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block" /> In Progress
                           </span>
                         )}
                         {t.status === 'Waiting Parts' && (
                           <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5">
                             <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block" /> Waiting Parts
                           </span>
                         )}
                         {t.status === 'New' && (
                           <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5">
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block" /> Open
                           </span>
                         )}
                         {t.status === 'Completed' && (
                           <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" /> Completed
                           </span>
                         )}
                       </div>
                     </div>
                     
                     {t.detail && <p className="text-xs text-slate-500 truncate">{t.detail}</p>}
                     
                     <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium pt-0.5 truncate">
                       <span className="text-slate-300">💬</span> 
                       <span>Guest WhatsApp</span>
                       <span className="px-1">·</span>
                       <span>{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       <span className="px-1">·</span>
                       <span className="text-slate-300">📅</span>
                       <span>due 11:00</span>
                       <span className="px-1">·</span>
                       <span>{t.sendTo || 'Unassigned'}</span>
                     </div>
                   </div>
                 </div>
               );
            })}
          </div>

          <div className="pt-6">
            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-bold font-serif text-slate-900">Reported from WhatsApp</h3>
              <p className="text-xs text-slate-500 font-medium">what you and the team sent in today</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
               {whatsappLogs.length === 0 && (
                 <div className="p-8 text-center text-slate-500 font-medium">No WhatsApp logs today.</div>
               )}
               {whatsappLogs.map((log, idx) => (
                 <div key={idx} className="p-4 px-5 flex gap-3 hover:bg-slate-50 transition-colors">
                   <div className="w-5 h-5 rounded-full border border-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                     <span className="text-emerald-500 text-[10px]">💬</span>
                   </div>
                   <div className="space-y-1">
                     <p className="text-sm font-medium text-slate-700">{log.message}</p>
                     <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                       <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       <span>·</span>
                       <span className="font-mono">{log.mtId}</span>
                       <span>·</span>
                       <span>Room {log.room || 'N/A'}</span>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#FAF9F6] font-sans overflow-y-auto text-left text-slate-900 pb-20">
      <style>{`
        #maint-board h1, #maint-board h2, #maint-board h3, #maint-board h4, #maint-board h5 {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif;
        }
      `}</style>
      
      <div id="maint-board" className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
        {/* Header Section */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] font-sans">TECHNICAL DEPARTMENT</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'User'}</h2>
          <p className="text-sm text-slate-500 font-medium">You have {sortedTasks.length} open tickets. Everything below can also be worked from WhatsApp.</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white border-t-2 border-t-slate-200 border border-slate-100 rounded-lg p-4 shadow-sm flex flex-col justify-between relative">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Open issues</span>
            <span className="text-3xl font-bold font-serif mt-3 text-slate-900">{openIssuesCount}</span>
            <Wrench size={12} className="text-amber-600 absolute top-4 right-4" />
          </div>
          
          <div className="bg-[#FFF5F5] border-t-2 border-t-red-200 border border-red-50 rounded-lg p-4 shadow-sm flex flex-col justify-between relative">
            <span className="text-[10px] text-red-800 uppercase font-bold tracking-wider">Urgent</span>
            <div className="mt-3">
              <span className="text-3xl font-bold font-serif text-red-900 leading-none">{urgentCount}</span>
            </div>
            <AlertTriangle size={12} className="text-red-600 absolute top-4 right-4" />
          </div>

          <div className="bg-white border-t-2 border-t-blue-200 border border-slate-100 rounded-lg p-4 shadow-sm flex flex-col justify-between relative">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">In progress</span>
            <span className="text-3xl font-bold font-serif mt-3 text-slate-900">{inProgressCount}</span>
            <Clock size={12} className="text-blue-500 absolute top-4 right-4" />
          </div>

          <div className="bg-white border-t-2 border-t-emerald-200 border border-slate-100 rounded-lg p-4 shadow-sm flex flex-col justify-between relative">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Completed today</span>
            <span className="text-3xl font-bold font-serif mt-3 text-slate-900">{completedTodayCount}</span>
            <CheckCircle2 size={12} className="text-emerald-500 absolute top-4 right-4" />
          </div>

          <div className="bg-white border-t-2 border-t-red-100 border border-slate-100 rounded-lg p-4 shadow-sm flex flex-col justify-between relative">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight">Rooms out of service</span>
            <div className="mt-2">
              <span className="text-3xl font-bold font-serif text-slate-900 leading-none">{roomsOutOfServiceCount}</span>
            </div>
            <Wrench size={12} className="text-red-400 absolute top-4 right-4" />
          </div>
        </div>

        {/* AI Maintenance Brief */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex">
          <div className="w-1 bg-emerald-500 shrink-0" />
          <div className="p-6 flex-1 space-y-4 relative">
            <button className="absolute top-6 right-6 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              View details
            </button>
            
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <Sparkles size={10} className="text-emerald-500" />
              <span>AI MAINTENANCE BRIEF</span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900">
              {aiBrief.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs text-slate-700 font-medium">
              {aiBrief.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className={`w-1.5 h-1.5 ${bullet.color} rounded-full mt-1.5 shrink-0`} />
                  <p>{bullet.text}</p>
                </div>
              ))}
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium italic mt-2">
              Dynamically generated from current open tasks and priorities.
            </p>
          </div>
        </div>

        {/* Split Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
          
          {/* LEFT SIDE: Content */}
          <div className="flex-1 min-w-0 space-y-8 w-full">
            
            {/* Active issues list */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-0.5">
                <h3 className="text-lg font-bold text-slate-900">Active issues</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{sortedTasks.length} open · sorted by urgency</p>
              </div>

              <div className="space-y-4">
                {sortedTasks.length === 0 && (
                   <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500 text-sm font-medium">
                      No active issues at the moment.
                   </div>
                )}
                {sortedTasks.map((t) => {
                  const isUrgent = t.isUrgent;
                  const isHigh = t.isHigh;
                  const isNormal = t.isNormal;
                  
                  let priorityClass = 'bg-slate-100 text-slate-600 border-slate-200';
                  if (isUrgent) priorityClass = 'bg-red-50 text-red-700 border-red-200';
                  else if (isHigh) priorityClass = 'bg-orange-50 text-orange-700 border-orange-200';

                  return (
                    <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                      {/* Tags */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 font-bold">{t.mtId}</span>
                          <span className="text-[11px] font-bold text-slate-900 border-b border-slate-900 pb-0.5 leading-none">Room {t.room || 'N/A'}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${priorityClass}`}>
                            {isUrgent ? 'Urgent' : isHigh ? 'High' : isNormal ? 'Normal' : 'Low'}
                          </span>
                          
                          {t.status === 'In Progress' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200">
                              In Progress
                            </span>
                          )}
                          {t.status === 'Waiting Parts' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200">
                              Waiting Parts
                            </span>
                          )}
                          {t.status === 'New' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-blue-50 text-blue-700 border-blue-200">
                              Open
                            </span>
                          )}
                          
                          {t.isOutOfService && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                              <Wrench size={8} /> Out of service
                            </span>
                          )}
                        </div>
                        <Wrench size={14} className="text-slate-300" />
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-slate-900 leading-tight">{t.what}</h4>
                        {t.detail && <p className="text-[13px] text-slate-500">{t.detail}</p>}
                      </div>

                      {/* Timeline */}
                      {t.logs && t.logs.length > 0 && (
                        <div className="space-y-2.5 pt-2">
                          {t.logs.map((log) => (
                            <div key={log.id} className="flex items-start gap-3 text-xs text-slate-600">
                              <span className="font-mono text-[10px] text-slate-400 w-12 pt-0.5">
                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {log.icon === 'whatsapp' ? (
                                <div className="w-4 h-4 rounded border border-emerald-500 shrink-0 flex items-center justify-center mt-0.5">
                                  <span className="text-emerald-500 text-[10px]">💬</span>
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0 mt-0.5" />
                              )}
                              <p className="flex-1">{log.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-4 flex-wrap">
                        {t.status === 'New' && (
                          <button 
                            onClick={() => handleStartWork(t.id)}
                            className="px-4 py-1.5 bg-[#105F39] text-white hover:bg-[#0b4227] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                        )}
                        {t.status === 'In Progress' && (
                          <button 
                            className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Update
                          </button>
                        )}
                        {t.status !== 'Waiting Parts' && (
                          <button 
                            onClick={() => handlePartsRequired(t.id)}
                            className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Parts required
                          </button>
                        )}
                        <button 
                          onClick={() => handleCompleteWork(t.id)}
                          className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Complete
                        </button>
                        <button className="px-4 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors flex items-center gap-1 ml-auto cursor-pointer">
                          <ArrowUpRight size={12} /> Escalate
                        </button>
                        
                        {t.sendTo && t.sendTo !== 'Leave unassigned' && (
                          <div className="flex items-center gap-1.5 ml-2">
                            <span className="text-slate-500 mr-1"><AlertTriangle size={12} /></span>
                            <span className="px-3 py-1 border border-slate-200 rounded-lg text-[10px] font-bold bg-slate-50">{t.sendTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technicians Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-slate-900">Technicians</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">who is carrying what</p>
              </div>
              
              {techniciansList.length === 0 ? (
                  <div className="text-sm text-slate-500 italic">No assigned tasks currently.</div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {techniciansList.map(tech => (
                      <div key={tech} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-sm text-slate-900">{tech}</h4>
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold border border-amber-200">{techniciansMap[tech].length} open</span>
                        </div>
                        <div className="space-y-2 text-[11px]">
                          {techniciansMap[tech].map(t => (
                            <div key={t.id} className="flex items-start gap-2">
                              <span className="font-mono text-slate-400 font-bold shrink-0 w-8">{t.room || 'N/A'}</span>
                              <span className="text-slate-700 truncate" title={t.what}>{t.what}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
              )}
            </div>

            {/* Related Tasks */}
            <div className="space-y-4 pt-4 border-t border-slate-200 pb-12">
              <div className="flex justify-between items-baseline">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-bold text-slate-900">Related tasks</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">parts, follow-ups and checks</p>
                </div>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Wrench size={10} /> {relatedTasks.length} open
                </span>
              </div>
              
              {relatedTasks.length === 0 ? (
                  <div className="text-sm text-slate-500 italic">No related tasks currently.</div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                  {relatedTasks.map(t => (
                    <div key={t.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-slate-400 font-bold w-8">{t.room || 'N/A'}</span>
                        <span className="text-slate-700 font-medium">{t.what}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200">{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDE: WhatsApp Operations Layer */}
          <div className="hidden lg:flex w-[350px] xl:w-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0 flex-col overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-100">
              <div className="space-y-1.5 mb-6">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">WHATSAPP OPERATIONS LAYER</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  This is what your team sees on their phones. Tap a button as they would — the dashboards update immediately.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {techniciansList.slice(0, 3).map(tech => (
                   <button 
                     key={tech} 
                     onClick={() => setActiveTechnicianTab(tech)}
                     className={`px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm cursor-pointer transition-colors ${
                       activeTechnicianTab === tech 
                        ? 'bg-[#105F39] text-white hover:bg-[#0b4227]' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                     }`}
                   >
                     {tech}
                   </button>
                ))}
              </div>
            </div>

            {/* Phone Mockup UI */}
            <div className="flex-1 bg-[#F0F2F5] relative flex flex-col min-h-[500px]">
              {/* WhatsApp Header */}
              <div className="bg-[#008069] text-white px-4 py-3 flex items-center gap-3 shrink-0">
                <button className="flex items-center gap-1 text-white/90 hover:text-white cursor-pointer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold font-mono">HC</span>
                  </div>
                </button>
                <div className="flex-1">
                  <h3 className="font-bold text-sm leading-tight">Hotelogx Connect</h3>
                  <p className="text-[10px] text-white/80">business account</p>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <Phone size={16} className="fill-current" />
                  <MoreVertical size={18} />
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 bg-[#EFEAE2] flex flex-col gap-3 relative overflow-y-auto" style={{backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-light-pattern-soft-texture.jpg")', backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(239, 234, 226, 0.95)'}}>
                
                <div className="text-center">
                  <span className="bg-[#E1F3FB] text-[#4F6C7A] text-[10px] font-bold px-3 py-1 rounded-xl shadow-sm inline-block select-none">Today</span>
                </div>

                {previewTask ? (
                  <>
                    {/* Bot Message Dynamic */}
                    <div className="bg-white rounded-xl rounded-tl-sm p-2.5 pb-1 max-w-[85%] shadow-sm relative">
                      <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent border-b-[8px] border-b-transparent"></div>
                      <div className="text-[11px] font-bold text-[#008069] mb-1">Hotelogx Connect</div>
                      <div className="text-[13px] text-slate-800 space-y-2 leading-snug">
                        <p className="font-bold">New Maintenance Request</p>
                        <p>Room {previewTask.room || 'N/A'}<br/>Issue: {previewTask.what}<br/>Priority: {previewTask.priority}<br/>Reported by: System</p>
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-[9px] text-slate-400 select-none">
                          {new Date(previewTask.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Interactive WhatsApp Buttons */}
                    <div className="bg-white rounded-xl shadow-sm p-1 max-w-[85%] divide-y divide-slate-100 font-bold text-[#00A884]">
                      <button 
                        onClick={() => handleStartWork(previewTask.id)}
                        className="w-full py-2.5 text-[13px] text-center hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Accept
                      </button>
                      <button className="w-full py-2.5 text-[13px] text-center hover:bg-slate-50 transition-colors cursor-pointer text-red-500">
                        Unable to Handle
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                     <p className="text-xs text-slate-500 italic bg-white/50 px-3 py-1 rounded-full">No active tasks to preview.</p>
                  </div>
                )}

              </div>

              {/* Input Area */}
              <div className="bg-[#F0F2F5] p-2 flex items-end gap-2 shrink-0">
                <div className="bg-white rounded-full flex-1 flex items-center gap-2 px-4 py-2 shadow-sm min-h-[40px]">
                  <button className="text-slate-400 hover:text-slate-600 cursor-pointer"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
                  <input type="text" placeholder="Message" className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700" />
                  <button className="text-slate-400 hover:text-slate-600 cursor-pointer"><Paperclip size={18} /></button>
                  <button className="text-slate-400 hover:text-slate-600 cursor-pointer"><Camera size={18} /></button>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white shrink-0 shadow-sm cursor-pointer hover:bg-[#008f6f] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MaintenanceDashboard;
