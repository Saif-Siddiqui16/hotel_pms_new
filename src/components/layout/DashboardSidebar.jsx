import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquare, Sparkles, LayoutDashboard, UserCheck, TrendingUp, Users, Settings as SettingsIcon, Building2, Clock, Wrench, CreditCard
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export const DashboardSidebar = () => {
  const { role, isSidebarOpen, setIsSidebarOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Role detection flags
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isFrontOffice = role === ROLES.FRONT_OFFICE;
  const isHousekeeping = role === ROLES.HOUSEKEEPING_MANAGER || role === ROLES.HOUSEKEEPING_STAFF;
  const isMaintenance = role === ROLES.MAINTENANCE_MANAGER || role === ROLES.MAINTENANCE_STAFF;
  const isManagerOrAdmin = !isSuperAdmin && !isFrontOffice && !isHousekeeping && !isMaintenance;

  // Top Nav Items configuration per Department
  const managerNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app', exact: true },
    { name: 'Conversations', icon: MessageSquare, path: '/app/conversations' },
    { name: 'Tasks', icon: UserCheck, path: '/app/takeover-queue' },
    { name: 'Upsells', icon: TrendingUp, path: '/app/transactions' },
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
    currentNavItems = housekeepingNavItems;
  } else if (isMaintenance) {
    currentNavItems = maintenanceNavItems;
  }

  const handleOpenWhatsAppOps = () => {
    window.dispatchEvent(new CustomEvent('open-whatsapp-ops'));
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // Close sidebar on mobile after clicking
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={cn(
        "w-64 border-r border-[#E7E4DD] bg-white flex flex-col justify-between shrink-0 p-5 h-screen top-0 font-sans z-50 transition-transform duration-300",
        "fixed lg:sticky left-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6D4AFF] rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm cursor-pointer" onClick={() => navigate('/app')}>
              <Building2 size={20} />
            </div>
            <div className="text-left cursor-pointer" onClick={() => navigate('/app')}>
              <h1 className="font-extrabold text-sm tracking-tight text-[#6D4AFF]">Hotelogx</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider -mt-0.5">CONNECT</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
          {currentNavItems.map((item) => {
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
                  "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs transition-all cursor-pointer",
                  isActive
                    ? "bg-[#EBF6EE] text-[#0F5132] font-black"
                    : "text-slate-600 hover:text-slate-900 font-bold"
                )}
              >
                <Icon size={17} className={isActive ? "text-[#0F5132]" : "text-slate-400"} />
                <span>{item.name}</span>
                {item.name === 'Conversations' && (
                  <span className={cn("ml-auto text-[10px] font-black rounded-full px-2 py-0.5 font-mono", isActive ? "bg-[#0F5132] text-white" : "bg-slate-200 text-slate-600")}>
                    2
                  </span>
                )}
                {item.name === 'Tasks' && (
                  <span className={cn("ml-auto text-[10px] font-black rounded-full px-2 py-0.5 font-mono", isActive ? "bg-[#0F5132] text-white" : "bg-slate-200 text-slate-600")}>
                    10
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Whatsapp ops layer widget in sidebar bottom */}
      <div className="space-y-2.5 select-none text-left">
          <button 
            onClick={handleOpenWhatsAppOps}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-white border border-[#E7E4DD] hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs font-sans"
          >
            <MessageSquare size={15} className="text-[#105F39]" />
            <span>WhatsApp ops layer</span>
          </button>
          
          <div className="flex items-start gap-2 px-2">
            <Sparkles size={13} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium font-sans">
              The AI is watching every channel. You only see what needs you.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
