import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Users, AlertTriangle, ClipboardList, Wrench, ArrowRight, Bot, Clock, TrendingUp, CheckCircle2, ChevronDown, Download, AlertCircle, ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, ROLES } from '../context/AppContext';
import { SuperAdminControlCenter } from './super-admin/SuperAdminControlCenter';
import FrontOfficeDashboardView from './FrontOffice';
import HousekeepingDashboard from './HousekeepingDashboard';
import MaintenanceDashboard from './MaintenanceDashboard';
import { dashboardService } from '../services/dashboardService';
import { roomService } from '../services/roomService';
import { taskService } from '../services/taskService';
import { conversationService } from '../services/conversationService';
import { API_BASE_URL } from '../config';

const ManagerDashboardView = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    rooms: [],
    tasks: [],
    conversations: [],
    stats: null,
    logs: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rooms, tasks, conversations, statsRes] = await Promise.all([
          roomService.getRooms(),
          taskService.getTasks(),
          conversationService.getConversations(),
          fetch(`${API_BASE_URL}/api/stats/dashboard`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('autopilot_token')}` }
          }).then(r => r.json()).catch(() => ({ data: { metrics: null, activity: [] } }))
        ]);
        
        setData({
          rooms: rooms || [],
          tasks: tasks || [],
          conversations: conversations || [],
          stats: statsRes?.data?.metrics || null,
          logs: statsRes?.data?.activity || []
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const managerName = user?.name || "Jonas";
  const hotelName = user?.property || "Hotel Mercier";

  // KPIs
  const arrivals = 24; // Mock
  const departures = 18; // Mock
  const inHouseCount = data.rooms.filter(r => r.status === 'Occupied' || r.status === 'Guest Inside').length;
  const occupancyRate = Math.round((inHouseCount / (data.rooms.length || 1)) * 100);
  const activeRequests = data.conversations.filter(c => c.status === 'active').length;
  const escalationsCount = data.conversations.filter(c => c.status === 'escalated').length;
  const openTasks = data.tasks.filter(t => t.status !== 'Completed' && t.status !== 'Fixed');
  const maintenanceTasks = openTasks.filter(t => t.department === 'Maintenance' || t.what?.toLowerCase().includes('leak') || t.what?.toLowerCase().includes('ac'));

  const foTasks = openTasks.filter(t => t.department === 'Front Office');
  const hkTasks = openTasks.filter(t => t.department === 'Housekeeping');
  
  if (loading) {
     return (
       <div className="h-screen w-full flex items-center justify-center bg-[#FAF9F6]">
         <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
           <Bot className="animate-bounce text-[#105F39]" size={20} /> Loading your hotel briefing...
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-4 sm:p-8 font-sans text-slate-900 pb-24 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono mb-2">
            GOOD AFTERNOON, {managerName.split(' ')[0].toUpperCase()}
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Here is your hotel this morning.</h1>
          <p className="text-slate-500 mt-2 text-[14px]">The AI has already handled everything routine. What is below is what still involves a person.</p>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">Arrivals</span>
            <ArrowRight size={14} className="text-emerald-500 rotate-45" />
          </div>
          <div className="text-3xl font-serif font-bold mt-3 text-slate-900">{arrivals}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">2 VIP</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">Departures</span>
            <ArrowRight size={14} className="text-amber-500 -rotate-45" />
          </div>
          <div className="text-3xl font-serif font-bold mt-3 text-slate-900">{departures}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">4 late checkouts</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">In-house</span>
            <Users size={14} className="text-slate-400" />
          </div>
          <div className="text-3xl font-serif font-bold mt-3 text-slate-900">{inHouseCount || 37}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">{occupancyRate || 84}% occupancy</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">Guest requests</span>
            <MessageSquare size={14} className="text-blue-500" />
          </div>
          <div className="text-3xl font-serif font-bold mt-3 text-slate-900">{activeRequests || 2}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">open right now</div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-red-600">Escalations</span>
            <AlertTriangle size={14} className="text-red-500" />
          </div>
          <div className="text-3xl font-serif font-bold mt-3 text-red-700">{escalationsCount || 2}</div>
          <div className="text-[10px] text-red-500 font-medium mt-1">need a person</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">Open tasks</span>
            <ClipboardList size={14} className="text-amber-600" />
          </div>
          <div className="text-3xl font-serif font-bold mt-3 text-slate-900">{openTasks.length}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">across 3 departments</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">Maintenance</span>
            <Wrench size={14} className="text-orange-500" />
          </div>
          <div className="text-3xl font-serif font-bold mt-3 text-slate-900">{maintenanceTasks.length}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">{maintenanceTasks.length > 0 ? `${maintenanceTasks.length} rooms affected` : '0 affected'}</div>
        </div>
      </div>

      {/* AI Daily Briefing */}
      <div className="bg-white border-2 border-[#105F39] rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="p-6 md:p-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <Bot size={14} className="text-[#105F39]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#105F39] font-mono">AI DAILY BRIEFING</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight mb-8 max-w-4xl">
            Two things need you: the air conditioning complaint in 302, and a billing dispute from room 411. Everything else is moving.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[13px] text-slate-700 font-medium leading-relaxed">
            <div className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <p>24 arrivals and 18 departures. 2 VIP arrivals, 3 early check-ins already agreed. <span className="text-[10px] text-slate-400 font-mono ml-1 font-bold">84% occupancy</span></p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-[#105F39] mt-1.5 shrink-0" />
              <p>The AI answered 63 guest messages overnight and this morning, 87.3% without a human. <span className="text-[10px] text-slate-400 font-mono ml-1 font-bold">36 sec avg</span></p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <p>2 conversations need you personally — a warm room in 302 and a billing dispute from a checked-out guest.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
              <p>Room 307 is out of service with a shower leak and a VIP arrives at 14:00. Reception has been warned; a decision on moving the guest is yours. <span className="text-[10px] text-slate-400 font-mono ml-1 font-bold">MT-115</span></p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p>5 rooms still to clean, 5 released. Room 401 was released at 12:26 for the 13:00 early arrival.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <p>€284.50 of upsells accepted today from 21 offers — mostly breakfast, parking and one romantic package. <span className="text-[10px] text-slate-400 font-mono ml-1 font-bold">7 accepted</span></p>
            </div>
          </div>
          <div className="mt-8 text-[10px] text-slate-400 font-medium">
            Compiled at 09:55 from WhatsApp, Gmail, your PMS and every department update received on WhatsApp since midnight.
          </div>
          <div className="absolute top-6 right-6 hidden sm:block">
            <button className="px-4 py-2 bg-[#105F39] text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#0b4227] transition-colors cursor-pointer shadow-sm border border-[#105F39]">
              <ArrowRight size={14} /> View details
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Needs you now & Priorities) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Needs you now */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-2xl font-serif font-bold text-slate-900">Needs you now</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Escalation cards — the AI has already prepared a reply for each</p>
              </div>
              <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-bold border border-red-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 2 waiting
              </span>
            </div>

            <div className="space-y-4">
              {/* Escalation Card 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="font-bold text-[15px] text-slate-900">Clara Bertrand</h4>
                    <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Room 302</span>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 block"></span> High urgency
                    </span>
                  </div>
                  <button className="text-[11px] font-bold border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 text-slate-600 transition-colors shrink-0">Open conversation</button>
                </div>
                
                <div className="flex gap-3 text-[11px] text-slate-400 font-mono mb-5 border-b border-slate-100 pb-4">
                  <span>RES-46219</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12}/> WhatsApp</span>
                  <span>raised 09:52</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-4 pr-0 md:pr-4">
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-3">
                      <div className="text-[9px] font-black text-red-800 uppercase tracking-widest mb-1 font-mono">Why it reached you</div>
                      <div className="text-xs font-bold text-red-900 flex gap-2 items-center">
                        <ShieldAlert size={14} className="text-red-600"/> Compensation requested — outside AI authority
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">AI Summary</div>
                      <p className="text-[13px] text-slate-600 leading-relaxed">
                        Third message about the air conditioning in 302. A maintenance ticket was opened at 09:14 and is still in progress. Guest is now asking for a room change or compensation — outside the AI's authority.
                      </p>
                    </div>
                    <button className="text-[11px] font-bold text-slate-500 flex items-center gap-1 hover:text-slate-900 mt-2">
                      <ChevronDown size={14} /> Show conversation history (7)
                    </button>
                  </div>
                  
                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] font-black text-indigo-800 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono">
                        <Bot size={12}/> Suggested Response
                      </div>
                      <p className="text-[14px] text-slate-900 font-medium mb-4 leading-snug">
                        Offer complimentary upgrade to 310 rather than a rate reduction.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                         <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-medium shadow-sm flex items-center gap-1"><Download size={10}/> Room Change Policy.pdf</span>
                         <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-medium shadow-sm flex items-center gap-1"><Download size={10}/> Compensation Guidelines.docx</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200/60">
                      <button className="bg-[#105F39] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm border border-[#105F39] hover:bg-[#0b4227]">Take over</button>
                      <button className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-50 shadow-sm">Approve AI reply</button>
                      <button className="text-slate-500 text-xs font-bold px-3 py-2 hover:bg-slate-100 rounded-lg">Modify reply</button>
                      <button className="text-slate-500 text-xs font-bold px-3 py-2 hover:bg-slate-100 rounded-lg ml-auto">Resolve</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escalation Card 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="font-bold text-[15px] text-slate-900">Nadia Haddad</h4>
                    <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Room 411</span>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 block"></span> High urgency
                    </span>
                  </div>
                  <button className="text-[11px] font-bold border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 text-slate-600 transition-colors shrink-0">Open conversation</button>
                </div>
                
                <div className="flex gap-3 text-[11px] text-slate-400 font-mono mb-5 border-b border-slate-100 pb-4">
                  <span>REC-67890</span>
                  <span className="flex items-center gap-1">✉️ Email</span>
                  <span>raised 00:05</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-4 pr-0 md:pr-4">
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-3">
                      <div className="text-[9px] font-black text-red-800 uppercase tracking-widest mb-1 font-mono">Why it reached you</div>
                      <div className="text-xs font-bold text-red-900 flex gap-2 items-center">
                        <ShieldAlert size={14} className="text-red-600"/> Billing dispute — always escalate
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">AI Summary</div>
                      <p className="text-[13px] text-slate-600 leading-relaxed">
                        Guest was charged twice for the city tax and once for a minibar item she says she did not take. Billing dispute — always escalated by policy. Draft credit note of €47.60 prepared, needs manager approval.
                      </p>
                    </div>
                    <button className="text-[11px] font-bold text-slate-500 flex items-center gap-1 hover:text-slate-900 mt-2">
                      <ChevronDown size={14} /> Show conversation history (3)
                    </button>
                  </div>
                  
                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] font-black text-indigo-800 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono">
                        <Bot size={12}/> Suggested Response
                      </div>
                      <p className="text-[14px] text-slate-900 font-medium mb-4 leading-snug">
                        Approve €47.60 credit note and reply from the manager's mailbox.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                         <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-medium shadow-sm flex items-center gap-1"><Download size={10}/> Billing & Refund Policy.pdf</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200/60">
                      <button className="bg-[#105F39] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm border border-[#105F39] hover:bg-[#0b4227]">Take over</button>
                      <button className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-50 shadow-sm">Approve AI reply</button>
                      <button className="text-slate-500 text-xs font-bold px-3 py-2 hover:bg-slate-100 rounded-lg">Modify reply</button>
                      <button className="text-slate-500 text-xs font-bold px-3 py-2 hover:bg-slate-100 rounded-lg ml-auto">Resolve</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Today's Priorities */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-serif font-bold text-slate-900">Today's priorities</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Ordered by what will cost you a guest if it slips</p>
            </div>
            
            <div className="space-y-2">
              {[
                { id: "01", text: "Decide on 302 — upgrade to 310 or reduce the second night", tag: "You", tagColor: "bg-red-50 text-red-700 border-red-200" },
                { id: "02", text: "Approve the €47.60 credit note for Nadia Haddad", tag: "You", tagColor: "bg-red-50 text-red-700 border-red-200" },
                { id: "03", text: "307 shower leak must be closed before the 14:00 VIP arrival", tag: "Maintenance", tagColor: "bg-orange-50 text-orange-700 border-orange-200" },
                { id: "04", text: "Late checkout answer for 205 before 10:30", tag: "Front Office", tagColor: "bg-amber-50 text-amber-700 border-amber-200" },
                { id: "05", text: "Card authorisation failed for 208 — collect a new card at check-in", tag: "Front Office", tagColor: "bg-amber-50 text-amber-700 border-amber-200" },
              ].map((pri) => (
                <div key={pri.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono text-slate-400 font-bold">{pri.id}.</span>
                    <span className="text-sm font-medium text-slate-800 group-hover:text-slate-950">{pri.text}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${pri.tagColor}`}>{pri.tag}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="space-y-10">
          
          {/* Department status */}
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Department status</h3>
            <div className="space-y-3">
              {/* Front Office */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200"><MessageSquare size={14} className="text-slate-600"/></div>
                    <div>
                      <div className="font-bold text-[13px] text-slate-900">Front Office</div>
                      <div className="text-[10px] text-slate-400 font-medium">Amélie Duprez</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">{foTasks.length} open tasks</span>
                </div>
                <div className="text-[11px] text-slate-500 pl-3 mt-4 pt-3 border-t border-slate-100 font-medium">
                  {activeRequests} live guest requests · 7 threads on autopilot
                </div>
              </div>

              {/* Housekeeping */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200"><Bot size={14} className="text-slate-600"/></div>
                    <div>
                      <div className="font-bold text-[13px] text-slate-900">Housekeeping</div>
                      <div className="text-[10px] text-slate-400 font-medium">Rosa Ferreira</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">5/18 rooms released</span>
                </div>
                <div className="text-[11px] text-slate-500 pl-3 mt-4 pt-3 border-t border-slate-100 font-medium">
                  5 to clean · updates arriving on WhatsApp
                </div>
              </div>

              {/* Maintenance */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200"><Wrench size={14} className="text-slate-600"/></div>
                    <div>
                      <div className="font-bold text-[13px] text-slate-900">Maintenance</div>
                      <div className="text-[10px] text-slate-400 font-medium">Peter Janssens</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">{maintenanceTasks.length} open issues</span>
                </div>
                <div className="text-[11px] text-slate-500 pl-3 mt-4 pt-3 border-t border-slate-100 font-medium">
                  {maintenanceTasks.length > 0 ? `${maintenanceTasks.length} rooms affected` : '0 affected'} · 1 waiting for parts
                </div>
              </div>
            </div>
          </div>

          {/* This week */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-serif font-bold text-slate-900">This week</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Simple numbers, no dashboards to interpret</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              
              <div className="flex justify-between items-end border-b border-slate-100 pb-5">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-1">Conversations</div>
                  <div className="text-3xl font-serif font-bold text-slate-900 leading-none">63</div>
                  <div className="text-[10px] text-slate-400 mt-1">today</div>
                </div>
                <div className="w-28 h-10 flex items-end justify-between px-1">
                  {[10, 15, 8, 20, 25, 18, 22].map((v, i) => (
                    <div key={i} className="w-2 bg-emerald-100 rounded-t-sm" style={{height: `${v}px`}}></div>
                  ))}
                  <div className="absolute w-28 text-[8px] font-mono text-slate-300 flex justify-between mt-10 pt-1">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-end border-b border-slate-100 pb-5 pt-2">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-1">AI resolution rate</div>
                  <div className="text-3xl font-serif font-bold text-slate-900 leading-none">87.3%</div>
                  <div className="text-[10px] text-slate-400 mt-1">of all threads</div>
                </div>
                <div className="w-28 h-10 flex items-end justify-between px-1">
                  {[15, 18, 22, 20, 24, 25, 25].map((v, i) => (
                    <div key={i} className="w-2 bg-emerald-100 rounded-t-sm" style={{height: `${v}px`}}></div>
                  ))}
                  <div className="absolute w-28 text-[8px] font-mono text-slate-300 flex justify-between mt-10 pt-1">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end pb-5 pt-2">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-1">Upsell revenue</div>
                  <div className="text-3xl font-serif font-bold text-slate-900 leading-none">€284.50</div>
                  <div className="text-[10px] text-slate-400 mt-1">accepted today</div>
                </div>
                <div className="w-28 h-10 flex items-end justify-between px-1">
                  {[12, 8, 15, 10, 18, 22, 14].map((v, i) => (
                    <div key={i} className="w-2 bg-blue-100 rounded-t-sm" style={{height: `${v}px`}}></div>
                  ))}
                  <div className="absolute w-28 text-[8px] font-mono text-slate-300 flex justify-between mt-10 pt-1">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-2.5 rounded-lg flex justify-between items-center mt-2">
                <span>Accepted upsells, all time in view</span>
                <span className="flex items-center gap-1"><TrendingUp size={12}/> €242.00</span>
              </div>
            </div>
          </div>

          {/* What the AI has been doing */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-serif font-bold text-slate-900">What the AI has been doing</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Live, across every channel</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5 max-h-[600px] overflow-y-auto">
              {[
                { id: 1, text: "Escalated 302 — compensation requested by Clara Bertrand", time: "09:52", source: "WhatsApp", icon: "alert" },
                { id: 2, text: "Offered breakfast and airport transfer to Sofia Marchetti", time: "09:47", source: "€120.00 proposed", icon: "upsell" },
                { id: 3, text: "Maria Silva started cleaning 201", time: "09:44", source: "WhatsApp", icon: "housekeeping" },
                { id: 4, text: "Checked live availability for 22-24 Aug and recommended the Deluxe King", time: "09:29", source: "Mews", icon: "info" },
                { id: 5, text: "Late checkout decision for 205 sent to Front Office", time: "09:25", source: "Task 4-1", icon: "info" },
                { id: 6, text: "Taxi booked for 212 at 15:45", time: "09:12", source: "WhatsApp", icon: "info" },
                { id: 7, text: "Milan Novak accepted the 307 shower leak", time: "09:11", source: "MT-115", icon: "maintenance" },
                { id: 8, text: "Confirmed towel delivery to 212 in German", time: "09:03", source: "WhatsApp", icon: "check" },
                { id: 9, text: "Answered a parking question for tomorrow's arrival", time: "08:44", source: "Gmail", icon: "info" },
                { id: 10, text: "Sold two days of bicycle rental to 409", time: "08:36", source: "€34.00", icon: "upsell" },
              ].map((log) => (
                <div key={log.id} className="flex gap-4 text-sm pb-5 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="mt-1 w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {log.icon === 'alert' && <AlertCircle size={12} className="text-red-500" />}
                    {log.icon === 'upsell' && <TrendingUp size={12} className="text-emerald-500" />}
                    {log.icon === 'housekeeping' && <Bot size={12} className="text-amber-500" />}
                    {log.icon === 'info' && <MessageSquare size={12} className="text-blue-500" />}
                    {log.icon === 'maintenance' && <Wrench size={12} className="text-orange-500" />}
                    {log.icon === 'check' && <CheckCircle2 size={12} className="text-emerald-500" />}
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-700 font-medium leading-snug">{log.text}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">{log.time} · {log.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Rooms at a glance */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="mb-6">
          <h3 className="text-2xl font-serif font-bold text-slate-900">Rooms at a glance</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">Housekeeping and maintenance keep this current from WhatsApp</p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 scrollbar-hide">
          {data.rooms.slice(0, 15).map((room, i) => {
            let statusColor = "bg-slate-50 text-slate-600 border-slate-200";
            if (room.status === 'Clean' || room.status === 'Inspected') statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (room.status === 'Dirty') statusColor = "bg-red-50 text-red-700 border-red-200";
            if (room.status === 'Cleaning') statusColor = "bg-amber-50 text-amber-700 border-amber-200";
            if (room.status === 'Guest Inside' || room.status === 'Occupied') statusColor = "bg-orange-50 text-orange-700 border-orange-200";
            if (room.status === 'Maintenance') statusColor = "bg-rose-50 text-rose-700 border-rose-200";
            if (room.status === 'DND') statusColor = "bg-purple-50 text-purple-700 border-purple-200";
            
            return (
              <div key={room.id || i} className="bg-white border border-[#E7E4DD] rounded-xl p-4 min-w-[120px] h-[100px] flex flex-col justify-between shrink-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="font-serif font-bold text-slate-900 text-lg">{room.number}</div>
                <div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusColor} mb-1.5 w-fit`}>
                    {room.status}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">09:48</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

const Dashboard = () => {
  const { role } = useApp();

  // Smart Role Routing at /app
  if (role === ROLES.SUPER_ADMIN) {
    return <SuperAdminControlCenter />;
  }
  if (role === ROLES.FRONT_OFFICE) {
    return <FrontOfficeDashboardView />;
  }
  if (role === ROLES.HOUSEKEEPING_MANAGER || role === ROLES.HOUSEKEEPING_STAFF) {
    return <HousekeepingDashboard />;
  }
  if (role === ROLES.MAINTENANCE_MANAGER || role === ROLES.MAINTENANCE_STAFF) {
    return <MaintenanceDashboard />;
  }

  // Manager default view
  return <ManagerDashboardView />;
};

export default Dashboard;
