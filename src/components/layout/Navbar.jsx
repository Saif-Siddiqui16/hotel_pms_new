import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Bell, ChevronDown, LogOut, Settings as SettingsIcon, User, Hotel, 
  LayoutDashboard, MessageSquare, CheckSquare, TrendingUp, Cpu, Library, 
  Activity, Users, Sparkles, Wrench, Server, Menu, ArrowLeft, MoreHorizontal,
  Building2, CreditCard, UserCheck, Clock
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../utils/cn';

export const Navbar = () => {
  const { role, user, notifications, markNotificationRead, setIsAuthenticated, toggleSidebar, activeWorkspace, exitWorkspace, hotelSubscription, rolePermissions } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const deptDropdownRef = useRef(null);

  useClickOutside(notificationRef, () => setShowNotifications(false));
  useClickOutside(profileRef, () => setShowProfile(false));
  useClickOutside(deptDropdownRef, () => setShowDeptDropdown(false));

  const rawQuery = searchQuery.toLowerCase().trim();

  const searchResults = rawQuery.length > 1 ? [
    { id: 'C1', name: 'Sarah Jenkins', subtext: 'WhatsApp • Active', type: 'Conversation', icon: MessageSquare, path: '/app/conversations' },
    { id: 'FO1', name: 'Front Desk Check-in', subtext: 'Front Office Operations', type: 'Front Office', icon: Building2, path: '/app/front-office' },
    { id: 'HK1', name: 'Housekeeping Status', subtext: 'Floor Cleaning Queue', type: 'Housekeeping', icon: Sparkles, path: '/app/housekeeping' },
    { id: 'MT1', name: 'Maintenance Tickets', subtext: 'Engineering Repairs', type: 'Maintenance', icon: Wrench, path: '/app/maintenance' },
  ].filter(r => r.name.toLowerCase().includes(rawQuery)).slice(0, 6) : [];

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectResult(searchResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  const handleSelectResult = (result) => {
    navigate(result.path);
    setSearchQuery('');
    setSelectedIndex(-1);
    searchInputRef.current?.blur();
  };

  const getRoleLabel = (currentRole) => {
    if (currentRole === ROLES.SUPER_ADMIN) return 'Super Admin';
    if (currentRole === ROLES.PLATFORM_OPERATOR) return 'Operator';
    if (currentRole === ROLES.MANAGER) return 'Manager';
    if (currentRole === ROLES.HOTEL_ADMIN) return 'Hotel Admin';
    if (currentRole === ROLES.FRONT_OFFICE) return 'Front Office';
    if (currentRole === ROLES.HOUSEKEEPING_MANAGER || currentRole === ROLES.HOUSEKEEPING_STAFF) return 'Housekeeping';
    if (currentRole === ROLES.MAINTENANCE_MANAGER || currentRole === ROLES.MAINTENANCE_STAFF) return 'Maintenance';
    return currentRole ? currentRole.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'User';
  };

  const getPortalSubtitle = (currentRole) => {
    if (currentRole === ROLES.SUPER_ADMIN) return 'Platform Administration';
    if (currentRole === ROLES.FRONT_OFFICE) return 'Front Office Portal';
    if (currentRole === ROLES.HOUSEKEEPING_MANAGER || currentRole === ROLES.HOUSEKEEPING_STAFF) return 'Housekeeping Operations';
    if (currentRole === ROLES.MAINTENANCE_MANAGER || currentRole === ROLES.MAINTENANCE_STAFF) return 'Maintenance Operations';
    return 'Manager Portal';
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = (user?.name && user.name !== 'John Doe') ? user.name : (role === ROLES.SUPER_ADMIN ? 'System Admin' : 'John Manager');
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const hotelName = activeWorkspace?.name || hotelSubscription?.hotelName || 'Mercier Hotel';

  // Role detection flags
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isFrontOffice = role === ROLES.FRONT_OFFICE;
  const isHousekeeping = role === ROLES.HOUSEKEEPING_MANAGER || role === ROLES.HOUSEKEEPING_STAFF;
  const isMaintenance = role === ROLES.MAINTENANCE_MANAGER || role === ROLES.MAINTENANCE_STAFF;
  const isManagerOrAdmin = !isSuperAdmin && !isFrontOffice && !isHousekeeping && !isMaintenance;

  // Department dropdown options per role
  const managerDeptOptions = [
    { name: 'Front Office', path: '/app/front-office', icon: Building2, desc: 'Arrivals, departures & folios' },
    { name: 'Housekeeping', path: '/app/housekeeping', icon: Sparkles, desc: 'Room cleaning & inspection' },
    { name: 'Maintenance', path: '/app/maintenance', icon: Wrench, desc: 'Repairs & work orders' }
  ];

  const frontOfficeDeptOptions = [
    { name: 'Housekeeping', path: '/app/housekeeping', icon: Sparkles, desc: 'Room cleaning & inspection' },
    { name: 'Maintenance', path: '/app/maintenance', icon: Wrench, desc: 'Repairs & work orders' }
  ];

  const activeDeptOptions = isManagerOrAdmin ? managerDeptOptions : (isFrontOffice ? frontOfficeDeptOptions : []);

  // Top Nav Items configuration per Department
  const managerNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app', exact: true },
    { name: 'Conversations', icon: MessageSquare, path: '/app/conversations' },
    { name: 'Tasks', icon: UserCheck, path: '/app/takeover-queue' },
    { name: 'Upsells', icon: TrendingUp, path: '/app/transactions' },
    { isDropdown: true, name: 'Departments', options: managerDeptOptions },
    { name: 'Users', icon: Users, path: '/app/users' },
    { name: 'Settings', icon: SettingsIcon, path: '/app/settings' },
  ];

  const frontOfficeNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app', exact: true },
    { name: 'Conversations', icon: MessageSquare, path: '/app/conversations' },
    { name: 'Tasks', icon: UserCheck, path: '/app/takeover-queue' },
  ];

  const housekeepingNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app/housekeeping', exact: true },
    { name: 'Rooms', icon: Building2, path: '/app/housekeeping?tab=rooms' },
    { name: 'Tasks', icon: Clock, path: '/app/housekeeping?tab=tasks' },
  ];

  const maintenanceNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app/maintenance', exact: true },
    { name: 'Issues', icon: Wrench, path: '/app/maintenance?tab=issues' },
    { name: 'Tasks', icon: Clock, path: '/app/maintenance?tab=tasks' },
  ];

  const superAdminNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app', exact: true },
    { name: 'Setup Requests', icon: Users, path: '/app/onboarding' },
    { name: 'Hotel Accounts', icon: Building2, path: '/app/workspaces' },
    { name: 'Billing Management', icon: CreditCard, path: '/app/billing-management' },
    { name: 'System Settings', icon: SettingsIcon, path: '/app/platform-settings' },
  ];

  let currentNavItems = managerNavItems;
  if (location.pathname.startsWith('/app/maintenance')) {
    currentNavItems = maintenanceNavItems;
  } else if (location.pathname.startsWith('/app/housekeeping')) {
    currentNavItems = housekeepingNavItems;
  } else if (isSuperAdmin) {
    currentNavItems = superAdminNavItems;
  } else if (isFrontOffice) {
    currentNavItems = frontOfficeNavItems;
  } else if (isHousekeeping) {
    currentNavItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/app', exact: true },
      { name: 'Rooms', icon: Building2, path: '/app?tab=rooms' },
      { name: 'Tasks', icon: Clock, path: '/app?tab=tasks' },
    ];
  } else if (isMaintenance) {
    currentNavItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/app', exact: true },
      { name: 'Issues', icon: Wrench, path: '/app?tab=issues' },
      { name: 'Tasks', icon: Clock, path: '/app?tab=tasks' },
    ];
  }

  const isDeptActive = activeDeptOptions.some(opt => location.pathname.startsWith(opt.path));

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-[#0F172A] text-white border-b border-slate-800 shadow-md">
        {/* Tier 1: Brand & User Header */}
        <div className="h-14 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800/80 bg-[#090D16]">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60"
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

          {/* Hotel Name Center Display */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200 font-mono">{hotelName}</span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative hidden sm:block w-40 lg:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1 bg-slate-800/80 border border-slate-700 focus:border-[#6D4AFF] rounded-lg text-xs font-medium text-slate-200 outline-none transition-all placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 w-72 mt-2 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-2">
                    {searchResults.map((res, i) => {
                      const Icon = res.icon;
                      return (
                        <div 
                          key={res.id} 
                          className={cn(
                            "p-2.5 rounded-lg cursor-pointer flex items-center justify-between text-left transition-colors",
                            selectedIndex === i ? "bg-purple-50 text-[#6D4AFF]" : "hover:bg-slate-50"
                          )}
                          onClick={() => handleSelectResult(res)}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon size={16} className="text-slate-500" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">{res.name}</div>
                              <div className="text-[10px] text-slate-400">{res.subtext}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <span className="font-bold text-xs">Notifications</span>
                    <button className="text-[10px] text-[#6D4AFF] font-bold hover:underline cursor-pointer">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => markNotificationRead(n.id)} className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer text-left">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
                  <div className="p-3 bg-slate-50 border-b border-slate-100 text-left">
                    <p className="text-xs font-bold text-slate-800">{userName}</p>
                    <p className="text-[10px] text-purple-600 font-mono font-bold uppercase mt-0.5">{getRoleLabel(role)}</p>
                  </div>
                  <div className="p-1">
                    {/* Settings Option only for Manager & Super Admin */}
                    {(isManagerOrAdmin || isSuperAdmin) && (
                      <button 
                        onClick={() => { 
                          const settingsPath = isSuperAdmin ? '/app/platform-settings' : '/app/settings';
                          navigate(settingsPath); 
                          setShowProfile(false); 
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg text-left font-medium cursor-pointer"
                      >
                        <SettingsIcon size={14} /> Settings
                      </button>
                    )}
                    
                    {/* Role-Specific Department Views */}
                    {isManagerOrAdmin && (
                      <>
                        <div className="h-[1px] bg-slate-100 my-1" />
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1 block">Department Views</span>
                        <button 
                          onClick={() => { navigate('/app/front-office'); setShowProfile(false); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-lg text-left font-medium cursor-pointer"
                        >
                          🏨 Front Office
                        </button>
                        <button 
                          onClick={() => { navigate('/app/housekeeping'); setShowProfile(false); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-lg text-left font-medium cursor-pointer"
                        >
                          🧹 Housekeeping
                        </button>
                        <button 
                          onClick={() => { navigate('/app/maintenance'); setShowProfile(false); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-lg text-left font-medium cursor-pointer"
                        >
                          🔧 Maintenance
                        </button>
                        <button 
                          onClick={() => { navigate('/app/users'); setShowProfile(false); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-lg text-left font-medium cursor-pointer"
                        >
                          👥 Staff & Users
                        </button>
                      </>
                    )}



                    <div className="h-[1px] bg-slate-100 my-1" />
                    <button 
                      onClick={() => setIsAuthenticated(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left font-bold cursor-pointer"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: Complete Navigation Bar with Department Dropdown */}
        <div className="h-11 px-4 sm:px-8 bg-[#0F172A] flex items-center border-b border-slate-800 overflow-x-visible space-x-1 sm:space-x-2">
          {currentNavItems.map((item, idx) => {
            if (item.isDropdown) {
              return (
                <div key={item.name} className="relative shrink-0" ref={deptDropdownRef}>
                  <button
                    onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all font-mono whitespace-nowrap cursor-pointer",
                      isDeptActive || showDeptDropdown
                        ? "bg-[#6D4AFF] text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                    )}
                  >
                    <Building2 size={14} />
                    <span>{item.name}</span>
                    <ChevronDown size={13} className={cn("transition-transform duration-200", showDeptDropdown && "rotate-180")} />
                  </button>

                  {/* Dropdown Menu */}
                  {showDeptDropdown && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-2 space-y-1 text-left">
                        <div className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">
                          Select Department
                        </div>
                        {item.options.map(opt => {
                          const Icon = opt.icon;
                          const isOptionActive = location.pathname.startsWith(opt.path);
                          return (
                            <button
                              key={opt.name}
                              onClick={() => {
                                navigate(opt.path);
                                setShowDeptDropdown(false);
                              }}
                              className={cn(
                                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all cursor-pointer",
                                isOptionActive
                                  ? "bg-purple-50 text-[#6D4AFF] font-bold"
                                  : "hover:bg-slate-50 text-slate-700 font-medium"
                              )}
                            >
                              <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0", isOptionActive ? "bg-[#6D4AFF] text-white" : "bg-slate-100 text-slate-600")}>
                                <Icon size={13} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs leading-tight">{opt.name}</span>
                                <span className="text-[9px] text-slate-400 font-normal leading-tight">{opt.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = (item.path && item.path.includes('?tab='))
              ? (location.pathname + location.search) === item.path
              : (item.exact 
                  ? (location.pathname === item.path && !location.search.includes('tab=')) 
                  : (item.path && location.pathname.startsWith(item.path)));
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all font-mono whitespace-nowrap shrink-0",
                  isActive 
                    ? "bg-[#6D4AFF] text-white shadow-sm" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                )}
              >
                <Icon size={14} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Workspace Impersonation Banner */}
      {activeWorkspace && (
        <div className="fixed top-[100px] right-0 left-0 h-10 bg-gradient-to-r from-[#6D4AFF] to-purple-800 text-white px-6 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">Viewing Workspace: {activeWorkspace.name}</span>
          </div>
          <button 
            onClick={() => { exitWorkspace(); navigate('/app/workspaces'); }}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono cursor-pointer"
          >
            <ArrowLeft size={12} /> Back to Admin
          </button>
        </div>
      )}
    </>
  );
};
