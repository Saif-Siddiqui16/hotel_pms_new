import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, Bell, ChevronDown, User, LogOut, ArrowLeft, Hotel, Search,
  BedDouble, Clock, Settings, Users, Sparkles, Building2, Wrench, LayoutDashboard, CreditCard
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export const Navbar = () => {
  const { user, role, activeWorkspace, hotelSubscription, toggleSidebar, exitWorkspace, setIsAuthenticated, whatsappLogs = [], hotels = [] } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState('ai'); // 'ai' or 'whatsapp'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentHotelId = activeWorkspace?.id || user?.hotelId || (hotels?.length > 0 ? hotels[0].id : null) || sessionStorage.getItem('fallback_hotel_id');
  const currentHotel = hotels?.find(h => h.id == currentHotelId) || (hotels?.length > 0 ? hotels[0] : null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const getPortalSubtitle = (r) => {
    switch (r) {
      case ROLES.SUPER_ADMIN: return 'Platform Operator';
      case ROLES.HOTEL_ADMIN: return 'Hotel Admin Hub';
      case ROLES.FRONT_OFFICE: return 'Front Office Portal';
      case ROLES.HOUSEKEEPING_MANAGER:
      case ROLES.HOUSEKEEPING_STAFF: return 'Housekeeping Portal';
      case ROLES.MAINTENANCE_MANAGER:
      case ROLES.MAINTENANCE_STAFF: return 'Maintenance Portal';
      default: return 'Management Hub';
    }
  };

  const getRoleLabel = (r) => {
    switch (r) {
      case ROLES.SUPER_ADMIN: return 'Platform Operator';
      case ROLES.HOTEL_ADMIN: return 'Hotel Admin';
      case ROLES.FRONT_OFFICE: return 'Front Office';
      case ROLES.HOUSEKEEPING_MANAGER: return 'HK Manager';
      case ROLES.HOUSEKEEPING_STAFF: return 'HK Staff';
      case ROLES.MAINTENANCE_MANAGER: return 'Maint. Manager';
      case ROLES.MAINTENANCE_STAFF: return 'Maint. Staff';
      default: return 'Hotel Manager';
    }
  };

  const notifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = user?.name ? user.name : (role === ROLES.SUPER_ADMIN ? 'System Admin' : 'John Manager');
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Search dummy data
  const searchResults = searchQuery.length > 1 ? [
    { id: 1, type: 'guest', name: 'Sofia Marchetti', subtext: 'In-House · Room 302', icon: User, path: '/app/conversations' },
    { id: 2, type: 'room', name: 'Room 302', subtext: 'Occupied · Dirty', icon: BedDouble, path: '/app/housekeeping' },
    { id: 3, type: 'task', name: 'Late Checkout Request', subtext: 'Room 302 · Pending Approval', icon: Clock, path: '/app/takeover-queue' },
  ] : [];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      handleSelectResult(searchResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  const handleSelectResult = (result) => {
    setSearchQuery('');
    navigate(result.path);
  };

  useEffect(() => {
    const handleOpenWhatsApp = () => {
      setNotifTab('whatsapp');
      setShowNotifications(true);
    };
    window.addEventListener('open-whatsapp-ops', handleOpenWhatsApp);
    return () => window.removeEventListener('open-whatsapp-ops', handleOpenWhatsApp);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white text-slate-900 border-b border-slate-200 shadow-sm">
        {/* Tier 1: Brand & User Header */}
        <div className="h-14 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Toggle Menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-4 pr-6 border-r border-slate-200 hidden sm:flex h-8">
              <div className="flex flex-col text-left justify-center">
                <span className="font-serif text-[20px] font-medium leading-none text-slate-900 tracking-tight">Hotelogx</span>
                <span className="text-[7.5px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Connect</span>
              </div>
            </div>
          </div>

          <div className="flex-1 px-6 hidden md:flex flex-col">
            <div className="flex items-baseline gap-2">
              <h2 className="font-bold text-slate-900 text-[13px]">{currentHotel?.name || 'Hotel Mercier'}</h2>
              <span className="text-slate-400 text-[11px]">{currentHotel?.location || 'Antwerp'} • {currentHotel?.rooms || 48} rooms</span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              {location.pathname.includes('maintenance') || role === ROLES.MAINTENANCE_MANAGER || role === ROLES.MAINTENANCE_STAFF 
                ? 'Maintenance tasks' 
                : location.pathname.includes('housekeeping') || role === ROLES.HOUSEKEEPING_MANAGER || role === ROLES.HOUSEKEEPING_STAFF 
                ? 'Housekeeping floor plans' 
                : 'Front office — your shift, prepared'}
            </p>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="hidden sm:flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="text-[11px] font-semibold text-emerald-700">
                {getRoleLabel(role)}
              </span>
            </div>

            {/* Notification Bell with Dropdown Panel */}
            <div className="relative flex" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer border border-slate-200"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white text-[8px] font-bold text-white flex items-center justify-center">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm sm:hidden" onClick={() => setShowNotifications(false)} />
                  <div className="fixed inset-x-4 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-[380px] sm:-mr-2 h-[80vh] max-h-[600px] bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col font-sans animate-in fade-in slide-in-from-top-2">
                    
                    {/* Header Tabs */}
                    <div className="flex items-center p-1.5 bg-slate-100 border-b border-slate-200">
                      <button 
                        onClick={() => setNotifTab('ai')}
                        className={`flex-1 px-3 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${notifTab === 'ai' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        AI Actions
                      </button>
                      <button 
                        onClick={() => setNotifTab('whatsapp')}
                        className={`flex-1 px-3 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${notifTab === 'whatsapp' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        WhatsApp Log
                      </button>
                    </div>

                    {/* LIVE badge row */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">LIVE</span>
                        <h3 className="text-sm font-bold text-slate-900">
                          {notifTab === 'ai' ? 'What the AI has been doing' : 'WhatsApp operations log'}
                        </h3>
                      </div>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        streaming
                      </span>
                    </div>

                    {/* Activity Feed */}
                    <div className="flex-1 overflow-y-auto">
                      {notifTab === 'ai' ? (
                        <div className="divide-y divide-slate-50">
                          {[
                            { icon: '🛌', text: 'Room 115 is now DND', time: '16:26', source: 'Dashboard', color: 'text-amber-600' },
                            { icon: '✅', text: 'Room 115 is now Inspected', time: '16:28', source: 'Dashboard', color: 'text-teal-600' },
                            { icon: '⚠️', text: 'Escalated 302 — compensation requested by Clara Bertrand', time: '09:52', source: 'WhatsApp', color: 'text-red-500' },
                            { icon: '🎁', text: 'Offered breakfast and airport transfer to Sofia Marchetti', time: '09:47', source: '€120.00 proposed', color: 'text-purple-600' },
                            { icon: '🧹', text: 'Maria Silva started cleaning 201', time: '09:44', source: 'WhatsApp', color: 'text-blue-600' },
                            { icon: '🔍', text: 'Checked live availability for 22–24 Aug and recommended the Deluxe King', time: '09:39', source: 'Mews', color: 'text-slate-600' },
                            { icon: '📋', text: 'Late checkout decision for 205 sent to Front Office', time: '09:21', source: 'Task 1', color: 'text-slate-600' },
                            { icon: '🚕', text: 'Taxi booked for 212 at 15:45', time: '09:12', source: 'WhatsApp', color: 'text-slate-600' },
                            { icon: '🔧', text: 'Milan Novák accepted the 307 shower leak', time: '09:11', source: 'MT-115', color: 'text-orange-600' },
                            { icon: '💬', text: 'Confirmed towel delivery to 212 in German', time: '09:03', source: 'WhatsApp', color: 'text-slate-600' },
                            { icon: '🔍', text: 'Answered a parking question for tomorrow’s arrival', time: '08:44', source: 'Gmail', color: 'text-slate-600' },
                            { icon: '🚲', text: 'Sold two days of bicycle rental to 409', time: '08:36', source: '€24.00', color: 'text-emerald-600' },
                            { icon: '☕', text: 'Added breakfast for 212, two mornings', time: '08:14', source: '€26.00', color: 'text-emerald-600' },
                            { icon: '⚠️', text: 'Billing dispute from Nadia Haddad escalated to the manager', time: '08:05', source: 'Gmail', color: 'text-red-500' },
                            { icon: '💊', text: 'Sold the romantic package to 310', time: '07:50', source: '€65.00', color: 'text-emerald-600' },
                            { icon: '🔕', text: 'Sent parking and early arrival information to Grace Okonkwo', time: '07:41', source: 'Outlook', color: 'text-slate-600' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-default">
                              <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-800 font-medium leading-snug">{item.text}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                                  <span className="text-slate-300 text-[10px]">·</span>
                                  <span className={`text-[10px] font-semibold ${item.color}`}>{item.source}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {whatsappLogs.length > 0 ? (
                            whatsappLogs.map((item, i) => (
                              <div key={item.id || i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-default">
                                <span className="text-base shrink-0 mt-0.5">{item.icon || '📱'}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-slate-800 font-medium leading-snug">{item.text}</p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                                    <span className="text-slate-300 text-[10px]">·</span>
                                    <span className="text-[10px] font-semibold text-slate-500">{item.source || 'WhatsApp'}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-slate-400 text-xs italic">
                              No WhatsApp operations logged yet.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>

            {/* Logout Button */}
            <div className="relative">
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer bg-white"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 text-[10px] font-bold font-mono">
                  {userInitials}
                </div>
                <span className="hidden sm:block text-[13px] font-medium text-slate-700">{userName}</span>
                <LogOut size={13} className="text-slate-400 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Workspace Impersonation Banner */}
      {activeWorkspace && (
        <div className="sticky top-14 right-0 left-0 h-10 bg-gradient-to-r from-[#6D4AFF] to-purple-800 text-white px-6 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">Viewing Workspace: {activeWorkspace.name}</span>
          </div>
          <button 
            onClick={() => { exitWorkspace(); navigate('/app/workspaces'); }}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono cursor-pointer transition-colors"
          >
            <ArrowLeft size={12} /> Back to Admin
          </button>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-600">
                <LogOut size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sign Out</h3>
              <p className="text-sm text-slate-500">Are you sure you want to sign out of Hotelogx Connect?</p>
            </div>
            <div className="flex border-t border-slate-100 bg-slate-50">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors border-r border-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="flex-1 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
