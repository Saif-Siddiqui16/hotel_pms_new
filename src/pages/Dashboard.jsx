import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  Clock,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Wrench,
  Sparkles,
  ChevronRight,
  UserCheck,
  CheckSquare,
  Building2,
  ArrowRight,
  Send,
  Edit3,
  AlertCircle,
  Check,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp, ROLES } from '../context/AppContext';
import { SuperAdminControlCenter } from './super-admin/SuperAdminControlCenter';
import FrontOffice from './FrontOffice';
import HousekeepingDashboard from './HousekeepingDashboard';
import MaintenanceDashboard from './MaintenanceDashboard';
import { dashboardService } from '../services/dashboardService';
import { API_BASE_URL } from '../config';

const ManagerDashboardView = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [briefingData, setBriefingData] = useState(null);
  const [stats, setStats] = useState(null);

  // Guest Conversation AI Approval State
  const [guestMessage, setGuestMessage] = useState("Can I check in early?");
  const [aiResponse, setAiResponse] = useState("Early check-in is available from 12:00 for €20.");
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [editedResponse, setEditedResponse] = useState("Early check-in is available from 12:00 for €20.");
  const [conversationApproved, setConversationApproved] = useState(false);

  // Open Tasks Checklist State
  const [openTasks, setOpenTasks] = useState([
    { id: 1, text: "Room 214 Baby Cot", completed: false },
    { id: 2, text: "VIP Welcome Gift", completed: false },
    { id: 3, text: "Airport Pickup", completed: false },
    { id: 4, text: "Late Checkout Approval", completed: false },
  ]);

  // Recent AI Activity Logs
  const [recentAiActivities, setRecentAiActivities] = useState([
    { id: 1, title: "Reservation modified", time: "2 mins ago" },
    { id: 2, title: "Restaurant booking confirmed", time: "14 mins ago" },
    { id: 3, title: "Taxi booked", time: "32 mins ago" },
    { id: 4, title: "Guest question answered", time: "1 hour ago" },
  ]);

  const loadData = async () => {
    try {
      const bData = await dashboardService.getDashboardData();
      setBriefingData(bData);
    } catch (err) {
      console.warn('Dashboard briefing load fallback:', err);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/stats/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('autopilot_token')}`
        }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch backend stats:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData().then(() => {
      setIsRefreshing(false);
      triggerToast("Overview Data Refreshed");
    });
  };

  const handleApproveConversation = () => {
    setConversationApproved(true);
    triggerToast("✓ AI response approved & sent to guest!");
  };

  const handleSaveModify = () => {
    setAiResponse(editedResponse);
    setIsEditingResponse(false);
    triggerToast("✓ AI response updated!");
  };

  const handleEscalateConversation = () => {
    triggerToast("⚠️ Conversation escalated to Human Assistance Queue!");
    setTimeout(() => navigate('/app/takeover-queue'), 1000);
  };

  const toggleTask = (taskId) => {
    setOpenTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const managerName = user?.name || briefingData?.managerName || "John";
  const hotelName = user?.property || briefingData?.hotelName || "Mercier Hotel";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 relative pb-16 text-left selection:bg-purple-950 selection:text-amber-100 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-white font-mono">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E4DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-purple-50 border border-purple-200 text-[#6D4AFF] text-[10px] font-bold uppercase tracking-wider font-mono">
              HOTELOGX CONNECT
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">• {hotelName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-2">
            Good Morning, {managerName} 👋
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">
            Manager Briefing & Operational Control Center
          </p>
        </div>

        <div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF9F6] border border-[#E7E4DD] hover:border-slate-300 text-[#111827] rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#6D4AFF]' : 'text-[#6D4AFF]'} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Briefing'}
          </button>
        </div>
      </div>

      {/* Today's Shift KPI Grid */}
      <div>
        <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest font-mono mb-3">Today's Shift Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Arrivals */}
          <div 
            onClick={() => navigate('/app/front-office')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-[#6D4AFF]">Arrivals</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{briefingData?.arrivals || 24}</div>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-[#6D4AFF] rounded-2xl flex items-center justify-center text-xl shadow-sm">
              🏨
            </div>
          </div>

          {/* Departures */}
          <div 
            onClick={() => navigate('/app/front-office')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-[#6D4AFF]">Departures</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{briefingData?.departures || 18}</div>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
              🚪
            </div>
          </div>

          {/* In-house Guests / Guest Requests */}
          <div 
            onClick={() => navigate('/app/conversations')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600">In-house Guests</span>
              <div className="text-3xl font-extrabold text-emerald-600 font-mono mt-1">87</div>
              <span className="text-[10px] text-slate-400 font-semibold">(9 Guest Requests)</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
              👥
            </div>
          </div>

          {/* Escalations */}
          <div 
            onClick={() => navigate('/app/takeover-queue')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-rose-300 transition-all cursor-pointer group"
          >
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-rose-600">Escalations</span>
              <div className="text-3xl font-extrabold text-rose-600 font-mono mt-1">2</div>
              <span className="text-[10px] text-rose-500 font-bold">Needs Staff Attention</span>
            </div>
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
              ⚠️
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Guest Conversation AI Approval vs Open Tasks & AI Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide): Guest Conversation (AI Approval Panel) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6D4AFF] flex items-center justify-center font-bold">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Guest Conversation</h2>
                  <p className="text-[11px] text-slate-400 font-medium">Pending AI Response Approval</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase font-mono">
                Action Required
              </span>
            </div>

            {/* Conversation Flow Display */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              
              {/* Guest Message Bubble */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <User size={14} className="text-slate-500" />
                  <span>Guest:</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 shadow-xs">
                  "{guestMessage}"
                </div>
              </div>

              {/* AI Proposed Response Bubble */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#6D4AFF]">
                  <Bot size={14} />
                  <span>AI Suggested Response:</span>
                </div>
                
                {isEditingResponse ? (
                  <div className="space-y-2">
                    <textarea 
                      className="w-full p-3 bg-white border-2 border-[#6D4AFF] rounded-xl text-sm font-medium text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-purple-200"
                      rows={3}
                      value={editedResponse}
                      onChange={(e) => setEditedResponse(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsEditingResponse(false)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveModify}
                        className="px-3 py-1.5 bg-[#6D4AFF] hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={14} /> Save Response
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200 text-sm font-medium text-purple-950">
                    "{aiResponse}"
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: [ Approve ] [ Modify ] [ Escalate ] */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button 
                onClick={handleApproveConversation}
                disabled={conversationApproved}
                className="flex-1 min-w-[120px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                {conversationApproved ? 'Approved & Sent' : 'Approve'}
              </button>

              <button 
                onClick={() => setIsEditingResponse(true)}
                className="flex-1 min-w-[120px] py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 size={16} />
                Modify
              </button>

              <button 
                onClick={handleEscalateConversation}
                className="flex-1 min-w-[120px] py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertCircle size={16} />
                Escalate
              </button>
            </div>
          </div>

          {/* AI Summary Section */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0B1020] text-white p-6 rounded-3xl shadow-md border border-indigo-900/40 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <div className="w-8 h-8 rounded-xl bg-[#6D4AFF] flex items-center justify-center text-white shadow-md">
                <Bot size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">🤖 AI Operational Summary</h2>
                <p className="text-[10px] text-indigo-200 font-medium">Automated daily highlights across all departments</p>
              </div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {briefingData?.aiSummary ? briefingData.aiSummary.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-xs font-medium text-slate-200">
                  <span className="text-amber-400 font-bold text-sm">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              )) : (
                <>
                  <li className="flex items-start gap-2.5 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-xs font-medium text-slate-200">
                    <span className="text-amber-400 font-bold text-sm">•</span>
                    <span>18 early check-in requests auto-handled with policy charges.</span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-xs font-medium text-slate-200">
                    <span className="text-amber-400 font-bold text-sm">•</span>
                    <span>94% guest messages resolved by AI Assistant without staff intervention.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column (1 Col wide): Open Tasks & Recent AI Activity */}
        <div className="space-y-6">
          
          {/* Open Tasks Checklist Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} className="text-[#6D4AFF]" />
                <h2 className="text-base font-bold text-slate-900">Open Tasks</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">Checklist</span>
            </div>

            <div className="space-y-2.5">
              {openTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center gap-3 transition-all cursor-pointer group"
                >
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[#6D4AFF] focus:ring-[#6D4AFF] cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 group-hover:text-[#6D4AFF]'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent AI Activity Feed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Recent AI Activity</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">Live Logs</span>
            </div>

            <div className="space-y-3">
              {recentAiActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between text-xs font-medium py-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="font-semibold text-slate-800">{activity.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Quick Access Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building2 size={16} className="text-[#6D4AFF]" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Department Portals</h2>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs font-bold">
              <button 
                onClick={() => navigate('/app/front-office')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-xl border border-slate-200 text-slate-700 transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>🏨 Front Office</span>
                <span className="text-[10px] text-slate-400 font-normal">Check-in & Guests →</span>
              </button>
              <button 
                onClick={() => navigate('/app/housekeeping')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-xl border border-slate-200 text-slate-700 transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>🧹 Housekeeping</span>
                <span className="text-[10px] text-slate-400 font-normal">Cleaning Queue →</span>
              </button>
              <button 
                onClick={() => navigate('/app/maintenance')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-xl border border-slate-200 text-slate-700 transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>🔧 Maintenance</span>
                <span className="text-[10px] text-slate-400 font-normal">Work Orders →</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

const FrontOfficeDashboardView = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);
  const [briefingData, setBriefingData] = useState(null);

  // Guest Conversation AI Approval State
  const [guestMessage, setGuestMessage] = useState("Can I check in early?");
  const [aiResponse, setAiResponse] = useState("Early check-in is available from 12:00 for €20.");
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [editedResponse, setEditedResponse] = useState("Early check-in is available from 12:00 for €20.");
  const [conversationApproved, setConversationApproved] = useState(false);

  // Open Tasks Checklist State
  const [openTasks, setOpenTasks] = useState([
    { id: 1, text: "Room 214 Baby Cot", completed: false },
    { id: 2, text: "VIP Welcome Gift", completed: false },
    { id: 3, text: "Airport Pickup", completed: false },
    { id: 4, text: "Late Checkout Approval", completed: false },
  ]);

  // Recent AI Activity Logs
  const [recentAiActivities, setRecentAiActivities] = useState([
    { id: 1, title: "Reservation modified", time: "2 mins ago" },
    { id: 2, title: "Restaurant booking confirmed", time: "14 mins ago" },
    { id: 3, title: "Taxi booked", time: "32 mins ago" },
    { id: 4, title: "Guest question answered", time: "1 hour ago" },
  ]);

  const loadData = async () => {
    try {
      const bData = await dashboardService.getDashboardData();
      setBriefingData(bData);
    } catch (err) {
      console.warn('Dashboard briefing load fallback:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApproveConversation = () => {
    setConversationApproved(true);
    triggerToast("✓ AI response approved & sent to guest!");
  };

  const handleSaveModify = () => {
    setAiResponse(editedResponse);
    setIsEditingResponse(false);
    triggerToast("✓ AI response updated!");
  };

  const handleEscalateConversation = () => {
    triggerToast("⚠️ Conversation escalated to Human Assistance Queue!");
    setTimeout(() => navigate('/app/takeover-queue'), 1000);
  };

  const toggleTask = (taskId) => {
    setOpenTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const hotelName = user?.property || briefingData?.hotelName || "Mercier Hotel";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 relative pb-16 text-left selection:bg-purple-950 selection:text-amber-100 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-white font-mono">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E4DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-purple-50 border border-purple-200 text-[#6D4AFF] text-[10px] font-bold uppercase tracking-wider font-mono">
              HOTELOGX CONNECT
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">• {hotelName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-2">
            Front Office
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">
            Operational Dashboard & Guest Connect Hub
          </p>
        </div>
      </div>

      {/* Today's Shift KPI Grid */}
      <div>
        <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest font-mono mb-3">Today's Shift</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Arrivals */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arrivals</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{briefingData?.arrivals || 24}</div>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-[#6D4AFF] rounded-2xl flex items-center justify-center text-xl shadow-sm">
              🏨
            </div>
          </div>

          {/* Departures */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Departures</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{briefingData?.departures || 18}</div>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
              🚪
            </div>
          </div>

          {/* In-house Guests */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In-house Guests</span>
              <div className="text-3xl font-extrabold text-emerald-600 font-mono mt-1">87</div>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
              👥
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Guest Conversation AI Approval vs Open Tasks & AI Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide): Guest Conversation (AI Approval Panel) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6D4AFF] flex items-center justify-center font-bold">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Guest Conversation</h2>
                  <p className="text-[11px] text-slate-400 font-medium">Pending AI Response Approval</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase font-mono">
                Action Required
              </span>
            </div>

            {/* Conversation Flow Display */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              
              {/* Guest Message Bubble */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <User size={14} className="text-slate-500" />
                  <span>Guest:</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 shadow-xs">
                  "{guestMessage}"
                </div>
              </div>

              {/* AI Proposed Response Bubble */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#6D4AFF]">
                  <Bot size={14} />
                  <span>AI Suggested Response:</span>
                </div>
                
                {isEditingResponse ? (
                  <div className="space-y-2">
                    <textarea 
                      className="w-full p-3 bg-white border-2 border-[#6D4AFF] rounded-xl text-sm font-medium text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-purple-200"
                      rows={3}
                      value={editedResponse}
                      onChange={(e) => setEditedResponse(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsEditingResponse(false)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveModify}
                        className="px-3 py-1.5 bg-[#6D4AFF] hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={14} /> Save Response
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200 text-sm font-medium text-purple-950">
                    "{aiResponse}"
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: [ Approve ] [ Modify ] [ Escalate ] */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button 
                onClick={handleApproveConversation}
                disabled={conversationApproved}
                className="flex-1 min-w-[120px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                {conversationApproved ? 'Approved & Sent' : 'Approve'}
              </button>

              <button 
                onClick={() => setIsEditingResponse(true)}
                className="flex-1 min-w-[120px] py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 size={16} />
                Modify
              </button>

              <button 
                onClick={handleEscalateConversation}
                className="flex-1 min-w-[120px] py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertCircle size={16} />
                Escalate
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide): Open Tasks & Recent AI Activity */}
        <div className="space-y-6">
          
          {/* Open Tasks Checklist Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} className="text-[#6D4AFF]" />
                <h2 className="text-base font-bold text-slate-900">Open Tasks</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">Checklist</span>
            </div>

            <div className="space-y-2.5">
              {openTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center gap-3 transition-all cursor-pointer group"
                >
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[#6D4AFF] focus:ring-[#6D4AFF] cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 group-hover:text-[#6D4AFF]'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent AI Activity Feed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Recent AI Activity</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">Live Logs</span>
            </div>

            <div className="space-y-3">
              {recentAiActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between text-xs font-medium py-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="font-semibold text-slate-800">{activity.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

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

  // Manager / Admin default view
  return <FrontOffice />;
};

export default Dashboard;

