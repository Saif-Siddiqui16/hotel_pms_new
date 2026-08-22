import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, Bell, ChevronDown, User, LogOut, ArrowLeft, Hotel, Search,
  BedDouble, Clock, Settings, Users, Sparkles, Building2, Wrench, LayoutDashboard, CreditCard
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export const Navbar = () => {
  const { role, activeWorkspace, hotelSubscription, toggleSidebar, exitWorkspace, setIsAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState('ai'); // 'ai' or 'whatsapp'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
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
      default: return 'Manager';
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = (user?.name && user.name !== 'John Doe') ? user.name : (role === ROLES.SUPER_ADMIN ? 'System Admin' : 'John Manager');
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
      <header className="sticky top-0 z-30 bg-[#0F172A] text-white border-b border-slate-800 shadow-md">
        {/* Tier 1: Brand & User Header */}
        <div className="h-14 px-4 sm:px-8 flex items-center justify-between bg-[#090D16]">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 cursor-pointer"
              title="Toggle Menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#6D4AFF] rounded-lg flex items-center justify-center text-white shadow-sm font-bold">
                <Hotel size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm tracking-wider font-mono text-white">HOTELOGX CONNECT</span>
                <span className="text-[9px] font-semibold text-purple-400 font-mono tracking-widest uppercase">{getPortalSubtitle(role)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 relative">
            {/* Global Search */}
            <div className="relative group hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input 
                ref={searchInputRef}
                type="text"
                placeholder="Search guests, rooms, tickets... (Press '/')"
                className="w-48 sm:w-64 md:w-80 h-9 bg-slate-800/50 border border-slate-700/50 text-white text-xs font-medium rounded-lg pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-800/80 transition-all font-sans"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">/</span>
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1F2E] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result, index) => {
                        const ResultIcon = result.icon;
                        const isSelected = index === selectedIndex;
                        return (
                          <div 
                            key={result.id}
                            className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors ${isSelected ? 'bg-indigo-500/10' : 'hover:bg-slate-800/50'}`}
                            onClick={() => handleSelectResult(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                                <ResultIcon size={14} />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>{result.name}</span>
                                <span className="text-[10px] text-slate-500 font-medium">{result.subtext}</span>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{result.type}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-slate-400">No matching records found.</p>
                      <p className="text-[10px] text-slate-500 mt-1">Try searching by room number or name.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-[1px] h-4 bg-slate-700 mx-1 hidden sm:block"></div>

            {/* Notification Bell with Dropdown Panel */}
            <div className="relative flex" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors relative cursor-pointer"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-[#0F172A]" />
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
                          {[
                            { icon: '📱', text: 'Maria Silva replied “Cleaning” for room 405', time: '15:02', source: 'WhatsApp' },
                            { icon: '📱', text: 'Inès Duarte marked 307 as Inspected', time: '13:48', source: 'WhatsApp' },
                            { icon: '📱', text: 'Kadir Yılmaz started 212 — Stayover linen', time: '14:15', source: 'WhatsApp' },
                            { icon: '📱', text: 'Alina Popescu reported DND on 115', time: '11:30', source: 'WhatsApp' },
                            { icon: '📱', text: 'Guest Clara Bertrand requested room change via WhatsApp', time: '09:52', source: 'Guest' },
                            { icon: '📱', text: 'Sofia Marchetti asked about breakfast hours', time: '09:47', source: 'Guest' },
                            { icon: '📱', text: 'Yuki Tanabe requested human takeover for restaurant reservation', time: '08:26', source: 'Human takeover' },
                            { icon: '📱', text: 'Priya Raghavan asked about the spa schedule', time: '08:11', source: 'Guest' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-default">
                              <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-800 font-medium leading-snug">{item.text}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                                  <span className="text-slate-300 text-[10px]">·</span>
                                  <span className="text-[10px] font-semibold text-slate-500">{item.source}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-md bg-[#6D4AFF] flex items-center justify-center text-white text-xs font-bold font-mono">
                  {userInitials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">{userName}</span>
                  <span className="text-[9px] text-purple-300 font-mono uppercase font-semibold">[{getRoleLabel(role)}]</span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <p className="font-bold text-sm text-slate-900 truncate">{userName}</p>
                    <p className="text-xs text-slate-500 font-mono truncate">{user?.email || 'admin@hotelogx.com'}</p>
                  </div>
                  
                  <div className="p-2 space-y-0.5">
                    <div className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono mt-1">
                      My Account
                    </div>
                    <button onClick={() => navigate('/app/settings')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-left font-bold cursor-pointer transition-colors">
                      <User size={14} className="text-slate-400" /> My Profile
                    </button>
                    
                    {(role === ROLES.HOTEL_ADMIN || role === ROLES.PLATFORM_OPERATOR || role === ROLES.MANAGER) && (
                      <button onClick={() => navigate('/app/subscription-billing')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-left font-bold cursor-pointer transition-colors">
                        <CreditCard size={14} className="text-slate-400" /> Billing & Usage
                      </button>
                    )}

                    <div className="h-[1px] bg-slate-100 my-1" />
                    <button 
                      onClick={() => setIsAuthenticated(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left font-bold cursor-pointer transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
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
    </>
  );
};
