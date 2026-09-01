import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  BedDouble, 
  MessageSquare, 
  Sparkles, 
  AlertTriangle,
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const FrontOffice = () => {
  const { user } = useApp();
  const roleStr = user?.role?.toLowerCase() || '';
  const isStaff = !roleStr.includes('manager') && !roleStr.includes('admin');
  
  // Dummy data mirroring the mockups for perfect UI alignment
  const kpis = [
    { label: 'Arrivals', value: '24', sub: '3 early', icon: <ArrowRight size={16} strokeWidth={1.5} />, color: 'text-slate-800' },
    { label: 'Departures', value: '18', sub: '4 late checkouts', icon: <ArrowLeft size={16} strokeWidth={1.5} />, color: 'text-slate-800' },
    { label: 'Rooms ready', value: '5/18', sub: '5 arrivals waiting', icon: <BedDouble size={16} strokeWidth={1.5} />, color: 'text-amber-600' },
    { label: 'Open requests', value: '2', sub: 'in-house guests', icon: <MessageSquare size={16} strokeWidth={1.5} />, color: 'text-blue-600' },
    { label: 'VIP arrivals', value: '2', sub: '1 at 14:00', icon: <Sparkles size={16} strokeWidth={1.5} />, color: 'text-emerald-600' },
    { label: 'Escalated', value: '2', sub: 'need a person', icon: <AlertTriangle size={16} strokeWidth={1.5} />, color: 'text-rose-600' }
  ];

  const briefPoints = [
    { text: "24 arrivals today. 5 rooms are released and 5 arrivals are still waiting on housekeeping.", iconColor: "bg-emerald-500", meta: "" },
    { text: "Yuki Tanabe (VIP, 5th stay) arrives at 14:00. Amélie is confirming a 20:00 table at De Kleine Zavel.", iconColor: "bg-emerald-500", meta: "" },
    { text: "Hendrik Vos in 205 is waiting for an answer on a 15:00 checkout — occupancy says 14:00 is safer.", iconColor: "bg-amber-500", meta: "before 10:30" },
    { text: "Priya Raghavan's card authorisation failed twice — ask for a new card at check-in.", iconColor: "bg-rose-500", meta: "208" },
    { text: "Room 401 was released at 12:26 — Grace Okonkwo's 13:00 early arrival can check in immediately.", iconColor: "bg-emerald-500", meta: "12:26" },
    { text: "307 is out of service with a shower leak and it is the VIP room. Milan expects to finish within 30 minutes.", iconColor: "bg-amber-500", meta: "MT-115" },
    { text: "The AI answered 63 messages so far and is holding 5 conversations without you.", iconColor: "bg-slate-400", meta: "" },
    { text: "Baby cot for 208 and the anniversary package for 310 are both in housekeeping's list.", iconColor: "bg-slate-400", meta: "" }
  ];

  const priorityTasks = [
    { id: '205', title: 'Late checkout 15:00 — decision needed', priority: 'Normal', desc: 'Guest asked for 15:00. 24 arrivals today; 205 is...', meta: 'Guest WhatsApp • 09:19 • due 10:30 • Hendrik Vos • Amélie Duprez', status: 'New', statusColor: 'bg-blue-50 text-blue-600 border-blue-200/60', isNew: true },
    { id: '307', title: 'VIP preparation — 307', priority: 'High', desc: 'Still water, fruit plate, high floor away from lift. Confirm...', meta: 'PMS event • 07:15 • due 13:30 • Yuki Tanabe • Amélie Duprez', status: 'In Progress', statusColor: 'bg-amber-50 text-amber-700 border-amber-200/60', isNew: false },
    { id: '411', title: 'Approve €47.60 credit note', priority: 'High', desc: 'Duplicate city tax €10.60 and minibar €35.40 posted to wrong...', meta: 'Guest Email • 08:05 • due 17:00 • Nadia Haddad • Jonas Verhaeghe', status: 'Escalated', statusColor: 'bg-rose-50 text-rose-700 border-rose-200/60', isNew: false },
    { id: '212', title: 'Taxi to Antwerpen-Centraal, 15:45', priority: 'Normal', desc: '', meta: 'Guest WhatsApp • 09:12 • due 15:30 • Daniel Weiss • Unassigned', status: 'New', statusColor: 'bg-blue-50 text-blue-600 border-blue-200/60', isNew: true },
    { id: '208', title: 'Missing payment — card declined on 208', priority: 'High', desc: 'Pre-authorisation failed twice. Request new card at check-in.', meta: 'PMS event • 08:40 • due 14:00 • Priya Raghavan • Amélie Duprez', status: 'Assigned', statusColor: 'bg-amber-50 text-amber-700 border-amber-200/60', isNew: false },
    { id: '302', title: 'Room move request — 302 to 310', priority: 'High', desc: 'Pending manager decision on compensation v...', meta: 'AI Detection • 09:53 • Clara Bertrand • Jonas Verhaeghe', status: 'Escalated', statusColor: 'bg-rose-50 text-rose-700 border-rose-200/60', isNew: false }
  ];

  const arrivalsWaiting = [
    { room: '401', time: 'Arrival 13:00', desc: 'Departure • Maria Silva • updated 12:26', status: 'Inspected', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500' },
    { room: '208', time: 'Arrival 14:00', desc: 'Departure • Inês Duarte • updated 08:50', status: 'Dirty', statusColor: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500' },
    { room: '307', time: 'Arrival 14:00', isVip: true, desc: 'VIP Arrival • Inês Duarte • updated 09:11', status: 'Maintenance', statusColor: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500' },
    { room: '207', time: 'Arrival 15:00', desc: 'Departure • Maria Silva • updated 09:07', status: 'Maintenance', statusColor: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500' },
    { room: '201', time: 'Arrival 16:00', desc: 'Departure • Maria Silva • updated 09:44', status: 'Cleaning', statusColor: 'bg-amber-50 text-amber-700 border-amber-200/60', dot: 'bg-amber-500' },
    { room: '405', time: 'Arrival 17:30', desc: 'Departure • Maria Silva • updated 09:40', status: 'Dirty', statusColor: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500' },
  ];

  const recentActivity = [
    { icon: <AlertTriangle size={14} className="text-rose-500" />, title: 'Escalated 302 — compensation requested by Clara Bertrand', meta: '09:53 • WhatsApp' },
    { icon: <ArrowRight size={14} className="text-emerald-500" />, title: 'Offered breakfast and airport transfer to Sofia Marchetti', meta: '09:47 • €120.00 proposed' },
    { icon: <BedDouble size={14} className="text-amber-500" />, title: 'Maria Silva started cleaning 201', meta: '09:44 • WhatsApp' },
    { icon: <MessageSquare size={14} className="text-blue-500" />, title: 'Checked live availability for 22-24 Aug and recommended the Deluxe King', meta: '09:39 • Mews' },
    { icon: <ClipboardList size={14} className="text-slate-500" />, title: 'Late checkout decision for 205 sent to Front Office', meta: '09:21 • Task t-1' },
    { icon: <ClipboardList size={14} className="text-slate-500" />, title: 'Taxi booked for 212 at 15:45', meta: '09:12 • WhatsApp' },
    { icon: <Sparkles size={14} className="text-amber-500" />, title: 'Milan Novák accepted the 307 shower leak', meta: '09:11 • MT-115' },
    { icon: <MessageSquare size={14} className="text-emerald-500" />, title: 'Confirmed towel delivery to 212 in German', meta: '09:00 • WhatsApp' },
    { icon: <ArrowUpRight size={14} className="text-blue-500" />, title: 'Answered a parking question for tomorrow\'s arrival', meta: '08:44 • Gmail' },
    { icon: <ArrowUpRight size={14} className="text-emerald-500" />, title: 'Sold two days of bicycle rental to 409', meta: '08:36 • €24.00' },
    { icon: <ArrowRight size={14} className="text-emerald-500" />, title: 'Added breakfast for 212, two mornings', meta: '08:14 • €26.00' },
    { icon: <AlertTriangle size={14} className="text-rose-500" />, title: 'Billing dispute from Nadia Haddad escalated to the manager', meta: '08:06 • Gmail' },
    { icon: <ArrowRight size={14} className="text-emerald-500" />, title: 'Sold the romantic package to 310', meta: '07:58 • €65.00' },
    { icon: <MessageSquare size={14} className="text-blue-500" />, title: 'Sent parking and early arrival information to Grace Okonkwo', meta: '07:41 • Outlook' }
  ];

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8 min-h-0 text-left bg-[#FAF9F6]">
      
      {/* Header Area */}
      <div className="space-y-1.5 pt-2">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono block">GOOD AFTERNOON, AMÉLIE</span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-serif">You are ahead of the desk today.</h2>
        <p className="text-xs md:text-sm text-slate-500 max-w-2xl font-medium leading-relaxed font-sans">
          The AI has answered everything routine and prepared the rest. Read down, then work the list.
        </p>
      </div>

      {/* 6 KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 select-none font-sans">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-4 md:p-5 rounded-2xl border border-[#E7E4DD] shadow-sm text-left flex flex-col justify-between min-h-[90px] md:min-h-[100px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">{kpi.label}</span>
              <span className={kpi.color}>{kpi.icon}</span>
            </div>
            <div className="mt-2 space-y-0.5">
              <span className={`text-xl md:text-2xl font-bold leading-none block font-serif ${kpi.color.replace('text-', 'text-').replace('600', '900')}`}>{kpi.value}</span>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-bold block leading-none">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Front Office Brief Box */}
      <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden font-sans">
        <div className="p-5 md:p-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-500" />
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">AI FRONT OFFICE BRIEF</span>
            </div>
            <button className="flex items-center justify-center gap-2 bg-[#175C41] hover:bg-[#114832] text-white px-4 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer">
              <ArrowRight size={14} />
              <span>Open conversations</span>
            </button>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-serif mt-4 leading-snug">
            Two rooms decide your morning: 401 is ready for the early arrival, 307 is not ready for the VIP.
          </h3>
        </div>
        
        <div className="px-5 md:px-6 pb-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {briefPoints.map((bp, idx) => (
              <div key={idx} className="flex gap-3 text-[11.5px] leading-relaxed">
                <div className="mt-1.5 shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${bp.iconColor}`}></div>
                </div>
                <div className="text-slate-600 font-medium">
                  {bp.text}
                  {bp.meta && <span className="text-[9px] text-slate-400 font-bold uppercase font-mono ml-2">{bp.meta}</span>}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-slate-400 font-medium mt-6 pt-4 border-t border-slate-50 italic">
            Updated continuously from guest messages, housekeeping and maintenance replies on WhatsApp, and your PMS.
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8 items-start pb-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Priority Tasks */}
          <div className="space-y-4 font-sans">
            <div className="flex justify-between items-end border-b border-[#E7E4DD] pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif">Priority tasks</h3>
                <p className="text-[10px] text-slate-500 font-medium">Yours first — housekeeping and maintenance have their own lists</p>
              </div>
              <button className="px-3 py-1 rounded-lg border border-[#E7E4DD] text-[10px] font-bold text-slate-600 hover:bg-slate-50">All tasks</button>
            </div>
            
            <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden divide-y divide-slate-100">
              {priorityTasks.map((task, idx) => (
                <div key={idx} className="p-4 md:p-5 flex gap-4 hover:bg-slate-50/20 transition-colors">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-xs md:text-sm text-slate-800 shrink-0 font-mono select-none">
                    {task.id}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{task.title}</h4>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border font-mono ${
                        task.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200/50' : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.desc && <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{task.desc}</p>}
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono pt-1">
                      {task.meta}
                    </p>
                    {/* Action buttons (mobile shown here as part of flow, desktop same) */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold border uppercase tracking-wider font-mono ${task.statusColor}`}>
                        <span className={`w-1 h-1 rounded-full ${task.statusColor.split(' ')[0].replace('50', '500')}`} />
                        {task.status}
                      </span>
                      {task.isNew && (
                        <>
                          <button className="px-3 py-1 rounded-lg border border-[#E7E4DD] text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">Start</button>
                          <button className="px-3 py-1 rounded-lg border border-[#E7E4DD] text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">Complete</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrivals waiting on a room */}
          <div className="space-y-4 font-sans">
            <div className="border-b border-[#E7E4DD] pb-2">
              <h3 className="text-sm font-bold text-slate-900 font-serif">Arrivals waiting on a room</h3>
              <p className="text-[10px] text-slate-500 font-medium">Live from housekeeping's WhatsApp updates</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs overflow-hidden divide-y divide-slate-100">
              {arrivalsWaiting.map((arr, idx) => (
                <div key={idx} className="p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-xs md:text-sm text-slate-800 shrink-0 font-mono select-none">
                      {arr.room}
                    </div>
                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{arr.time}</h4>
                        {arr.isVip && (
                          <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest font-mono">VIP</span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">{arr.desc}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-bold border uppercase tracking-wider font-mono ${arr.statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${arr.dot}`} />
                    {arr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="space-y-8 font-sans">
          
          {/* Recent AI Activity */}
          <div className="space-y-4">
            <div className="border-b border-[#E7E4DD] pb-2">
              <h3 className="text-sm font-bold text-slate-900 font-serif">Recent AI activity</h3>
              <p className="text-[10px] text-slate-500 font-medium">What was handled without you</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-[#E7E4DD] shadow-xs p-5 md:p-6 space-y-5">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <div className="space-y-0.5 leading-tight">
                    <p className="text-[11px] font-bold text-slate-700">{activity.title}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">{activity.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Handover Note */}
          <div className="bg-white border border-[#E7E4DD] rounded-3xl p-5 md:p-6 shadow-xs relative overflow-hidden">
            {/* Subtle blue tint background logic */}
            <div className="absolute inset-0 bg-blue-50/30 pointer-events-none"></div>
            
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-500" />
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest font-mono">HANDOVER NOTE</span>
              </div>
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                Night shift left nothing open. Clara Bertrand in 302 has now written three times about the air conditioning — the manager is deciding between an upgrade to 310 and a rate reduction. Do not promise either.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FrontOffice;
