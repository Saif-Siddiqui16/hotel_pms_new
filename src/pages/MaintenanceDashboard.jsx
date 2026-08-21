import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  UserCheck, 
  X, 
  FileText, 
  CheckSquare,
  AlertTriangle,
  Phone,
  Smartphone,
  Radio,
  HardHat
} from 'lucide-react';
import { maintenanceService } from '../services/maintenanceService';

export const MaintenanceDashboard = () => {
  const [data, setData] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await maintenanceService.getMaintenanceData();
    setData(res);
  };

  const handleStatusChange = async (ticketId, status) => {
    const updated = await maintenanceService.updateTicketStatus(ticketId, status);
    setData(updated);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, status }));
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !noteText.trim()) return;
    const updated = await maintenanceService.addTicketNote(selectedTicket.id, noteText);
    setData(updated);
    setSelectedTicket(prev => ({ ...prev, details: `${prev.details}\n[Note]: ${noteText}` }));
    setNoteText('');
  };

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading Operational Maintenance Dashboard...
      </div>
    );
  }

  const activeStaffList = data.activeStaff || [
    { id: "mnt-st-1", name: "Peter Hansen", role: "Maintenance Lead", phone: "+1 (555) 871-3401", extension: "Ext 301", specialty: "HVAC & Refrigeration", activeTickets: 3, status: "In Room 302", avatarColor: "bg-rose-600" },
    { id: "mnt-st-2", name: "Mike Alvarez", role: "Senior Technician", phone: "+1 (555) 871-3402", extension: "Ext 302", specialty: "Plumbing & Electrical", activeTickets: 2, status: "Available", avatarColor: "bg-teal-600" },
    { id: "mnt-st-3", name: "Carlos Gomez", role: "General Maintenance Tech", phone: "+1 (555) 871-3403", extension: "Ext 303", specialty: "Carpentry & Hardware", activeTickets: 1, status: "On Dispatch", avatarColor: "bg-amber-600" }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#FAF9F6] min-h-screen text-slate-900 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DD] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold uppercase tracking-wider font-mono">
              ENGINEERING & MAINTENANCE
            </span>
            <span className="text-xs text-slate-400 font-medium font-mono">• Direct Dispatch</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Maintenance Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Active work orders queue and on-duty technicians contact directory.
          </p>
        </div>

        {/* Central Hotline Mobile Badge */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">Maintenance Central Phone</span>
            <span className="text-xs font-extrabold text-slate-900 font-mono block">{data.hotlineNumber || "+1 (555) 871-3400"}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Open Tickets</span>
            <span className="text-3xl font-extrabold text-slate-900 font-mono mt-1 block">{data.openTickets}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Wrench size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Urgent (High Priority)</span>
            <span className="text-3xl font-extrabold text-rose-600 font-mono mt-1 block">{data.urgentTickets}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertOctagon size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Completed Today</span>
            <span className="text-3xl font-extrabold text-emerald-600 font-mono mt-1 block">{data.completedToday}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Featured Room 302 Ticket & Main Ticket List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ticket List Table (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Maintenance Tickets</h2>
              <p className="text-xs text-slate-500">Live work order queue</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Room</th>
                  <th className="py-3.5 px-4">Issue</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                {data.tickets.map((ticket) => (
                  <tr 
                    key={ticket.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-500 font-mono">
                      {ticket.ticketNo}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-sm">
                      Room {ticket.roomNumber}
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-900 font-semibold">
                      {ticket.issue}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ticket.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                        ticket.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {ticket.assignedTo}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        ticket.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {ticket.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleStatusChange(ticket.id, 'COMPLETED')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                        >
                          Complete
                        </button>
                      )}
                      {ticket.status === 'COMPLETED' && (
                        <span className="text-[11px] font-bold text-emerald-600">Fixed ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Side - On-Duty Technicians Directory with Telephones & Highlighted Ticket */}
        <div className="space-y-6">
          
          {/* On-Duty Maintenance Technicians Directory with Telephones */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="text-rose-600" size={18} />
                <h2 className="text-base font-bold text-slate-900">On-Duty Technicians</h2>
              </div>
              <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-mono">
                {activeStaffList.length} Technicians
              </span>
            </div>
            
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Active engineering staff reachable by direct phone for immediate maintenance dispatch:
            </p>

            <div className="space-y-3">
              {activeStaffList.map((st) => (
                <div key={st.id} className="p-3 bg-slate-50/80 hover:bg-rose-50/30 rounded-xl border border-slate-200/80 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${st.avatarColor || 'bg-rose-600'} text-white flex items-center justify-center text-xs font-bold font-mono`}>
                        {st.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{st.name}</h4>
                        <span className="text-[10px] text-slate-500 font-medium block">{st.specialty}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {st.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                    <div className="flex items-center gap-1 text-slate-600 font-mono font-semibold text-[11px]">
                      <Phone size={12} className="text-rose-600" />
                      <span>{st.phone}</span>
                    </div>
                    <a
                      href={`tel:${st.phone}`}
                      className="px-2.5 py-1 bg-white hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold font-mono transition-colors shadow-xs"
                    >
                      Call Tech
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Room 302 High Priority Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={14} /> High Priority Ticket
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">Room 302</span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Air conditioning failure</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Unit blowing warm air. Guest reported unit vibrating.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[9px] font-bold uppercase text-slate-400 block">Assigned Tech</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block">Peter Hansen</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[9px] font-bold uppercase text-slate-400 block">Est. Repair Time</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block">30 minutes</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleStatusChange('mnt-102', 'COMPLETED')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Complete Ticket
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase">Ticket {selectedTicket.ticketNo}</span>
                <h3 className="text-lg font-bold text-slate-900">Room {selectedTicket.roomNumber} Issue</h3>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Issue Title</span>
                <p className="text-sm font-bold text-slate-900">{selectedTicket.issue}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Work Description</span>
                <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap mt-1">
                  {selectedTicket.details}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Assigned To</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{selectedTicket.assignedTo}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Estimated Time</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{selectedTicket.estimatedMinutes} mins</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddNote} className="space-y-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add technician note..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-rose-500 outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Add Notes
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleStatusChange(selectedTicket.id, 'IN_PROGRESS')}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleStatusChange(selectedTicket.id, 'COMPLETED')}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Complete Ticket
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenanceDashboard;
