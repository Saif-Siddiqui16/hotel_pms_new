import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  UserCheck, 
  RefreshCw,
  Building2,
  FileText,
  X,
  Filter,
  Phone,
  MessageSquare,
  Users,
  Smartphone,
  Radio
} from 'lucide-react';
import { housekeepingService } from '../services/housekeepingService';

export const HousekeepingDashboard = () => {
  const [data, setData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await housekeepingService.getHousekeepingData();
    setData(res);
  };

  const handleStatusChange = async (roomId, newStatus) => {
    const updated = await housekeepingService.updateRoomStatus(roomId, newStatus);
    setData(updated);
    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !newNote.trim()) return;
    const updated = await housekeepingService.addRoomNote(selectedRoom.id, newNote);
    setData(updated);
    setSelectedRoom(prev => ({ ...prev, notes: newNote }));
    setNewNote('');
  };

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading Operational Housekeeping Dashboard...
      </div>
    );
  }

  const filteredList = data.cleaningList.filter(item => {
    if (filterType === 'ALL') return true;
    if (filterType === 'TO_CLEAN') return item.status === 'To Clean';
    if (filterType === 'CLEANING') return item.status === 'Cleaning';
    if (filterType === 'READY') return item.status === 'Ready';
    if (filterType === 'VIP') return item.type === 'VIP';
    return true;
  });

  const activeStaffList = data.activeStaff || [
    { id: "hk-st-1", name: "Elena Rostova", role: "Housekeeping Supervisor", phone: "+1 (555) 468-7351", extension: "Ext 201", floor: "All Floors", activeRooms: 6, status: "Active (On Floor)", avatarColor: "bg-purple-600" },
    { id: "hk-st-2", name: "Anna Vance", role: "Senior Housekeeper", phone: "+1 (555) 468-7352", extension: "Ext 202", floor: "Floor 3 & 4 (VIP Wing)", activeRooms: 4, status: "Active (Cleaning)", avatarColor: "bg-indigo-600" },
    { id: "hk-st-3", name: "David Miller", role: "Housekeeper", phone: "+1 (555) 468-7353", extension: "Ext 203", floor: "Floor 3", activeRooms: 3, status: "Active (On Floor)", avatarColor: "bg-emerald-600" },
    { id: "hk-st-4", name: "Maria Santos", role: "Housekeeper", phone: "+1 (555) 468-7354", extension: "Ext 204", floor: "Floor 2", activeRooms: 5, status: "On Break", avatarColor: "bg-amber-600" }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#FAF9F6] min-h-screen text-slate-900 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DD] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 text-[#6D4AFF] text-[10px] font-bold uppercase tracking-wider font-mono">
              HOUSEKEEPING OPERATIONS
            </span>
            <span className="text-xs text-slate-400 font-medium font-mono">• Direct Mobile Dispatch</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Housekeeping Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Room turn-over queue and active on-duty housekeepers directory.
          </p>
        </div>

        {/* Central Hotline Mobile Badge */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D4AFF] flex items-center justify-center font-bold">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">HK Central Telephone</span>
            <span className="text-xs font-extrabold text-slate-900 font-mono block">{data.hotlineNumber || "+1 (555) 468-7300"}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rooms Ready</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">{data.roomsReady}</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rooms To Clean</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-amber-600 font-mono">{data.roomsToClean}</span>
            <Clock size={18} className="text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Late Rooms</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-rose-600 font-mono">{data.lateRooms}</span>
            <AlertTriangle size={18} className="text-rose-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">DND Rooms</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-700 font-mono">{data.dndRooms}</span>
            <ShieldAlert size={18} className="text-slate-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">VIP Rooms</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-purple-600 font-mono">{data.vipRooms}</span>
            <Sparkles size={18} className="text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Cleaning List Table (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Cleaning List</h2>
              <p className="text-xs text-slate-500">Live housekeeping operations queue</p>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterType('TO_CLEAN')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'TO_CLEAN' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                To Clean
              </button>
              <button 
                onClick={() => setFilterType('CLEANING')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'CLEANING' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Cleaning
              </button>
              <button 
                onClick={() => setFilterType('READY')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'READY' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Ready
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-3.5 px-4">Room</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                {filteredList.map((room) => (
                  <tr 
                    key={room.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedRoom(room)}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-sm">
                      {room.roomNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        room.type === 'VIP' ? 'bg-purple-100 text-purple-700' :
                        room.type === 'Early Arrival' ? 'bg-indigo-100 text-indigo-700' :
                        room.type === 'Deep Clean' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {room.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${room.priority === 'High' ? 'text-rose-600' : 'text-slate-500'}`}>
                        {room.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {room.assignedTo}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        room.status === 'Ready' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        room.status === 'Cleaning' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          room.status === 'Ready' ? 'bg-emerald-500' :
                          room.status === 'Cleaning' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'
                        }`} />
                        {room.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {room.status === 'To Clean' && (
                        <button
                          onClick={() => handleStatusChange(room.id, 'Cleaning')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                        >
                          Start
                        </button>
                      )}
                      {room.status === 'Cleaning' && (
                        <button
                          onClick={() => handleStatusChange(room.id, 'Ready')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                        >
                          Mark Ready
                        </button>
                      )}
                      {room.status === 'Ready' && (
                        <span className="text-[11px] font-bold text-emerald-600">Done ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel - Active Housekeeping Staff with Telephones & Alerts */}
        <div className="space-y-6">
          
          {/* On-Duty Housekeeper Directory with Telephones */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="text-[#6D4AFF]" size={18} />
                <h2 className="text-base font-bold text-slate-900">On-Duty Housekeepers</h2>
              </div>
              <span className="text-[10px] font-extrabold text-[#6D4AFF] bg-purple-50 px-2 py-0.5 rounded-md font-mono">
                {activeStaffList.length} Active
              </span>
            </div>
            
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Mobile phones on the floor receiving automated room cleaning & guest service alerts:
            </p>

            <div className="space-y-3">
              {activeStaffList.map((st) => (
                <div key={st.id} className="p-3 bg-slate-50/80 hover:bg-purple-50/40 rounded-xl border border-slate-200/80 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${st.avatarColor || 'bg-[#6D4AFF]'} text-white flex items-center justify-center text-xs font-bold font-mono`}>
                        {st.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{st.name}</h4>
                        <span className="text-[10px] text-slate-400 font-medium block">{st.floor}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {st.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                    <div className="flex items-center gap-1 text-slate-600 font-mono font-semibold text-[11px]">
                      <Phone size={12} className="text-[#6D4AFF]" />
                      <span>{st.phone}</span>
                    </div>
                    <a
                      href={`tel:${st.phone}`}
                      className="px-2.5 py-1 bg-white hover:bg-[#6D4AFF] hover:text-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold font-mono transition-colors shadow-xs"
                    >
                      Call / SMS
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Alerts */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-left">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <AlertTriangle className="text-amber-500" size={16} />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Priority Floor Alerts</h2>
            </div>
            
            <ul className="space-y-2.5">
              {data.operationalAlerts.map((alert, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs font-medium text-slate-800 leading-relaxed">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="text-[#6D4AFF]" size={20} />
                <h3 className="text-lg font-bold text-slate-900">Room {selectedRoom.roomNumber} Details</h3>
              </div>
              <button 
                onClick={() => setSelectedRoom(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold block uppercase text-[9px]">Cleaning Type</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedRoom.type}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold block uppercase text-[9px]">Current Status</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedRoom.status}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold block uppercase text-[9px]">Assigned Staff</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedRoom.assignedTo}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold block uppercase text-[9px]">Floor Level</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">Floor {selectedRoom.floor}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Housekeeping Notes</span>
              <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                {selectedRoom.notes || 'No special notes.'}
              </p>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add operational note..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-[#6D4AFF] outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Save Note
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleStatusChange(selectedRoom.id, 'Cleaning')}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Mark Cleaning
              </button>
              <button
                onClick={() => handleStatusChange(selectedRoom.id, 'Ready')}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Mark Ready
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default HousekeepingDashboard;
