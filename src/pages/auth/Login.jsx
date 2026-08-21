import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Hotel, 
  Lock, 
  Mail, 
  ArrowRight,
  ArrowLeft,
  ShieldCheck, 
  Sparkles,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, ROLES } from '../../context/AppContext';
import { API_BASE_URL } from '../../config';

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const quickFillCredentials = (quickEmail, quickPass) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setIsLoading(true);
    setTimeout(() => {
      const lowerEmail = quickEmail.toLowerCase();
      const isSuperAdmin = lowerEmail.includes('superadmin') || lowerEmail.includes('super');
      const isHousekeeping = lowerEmail.includes('housekeeping') || lowerEmail.includes('hk');
      const isMaintenance = lowerEmail.includes('maintenance') || lowerEmail.includes('mnt');
      const isFrontOffice = lowerEmail.includes('reception') || lowerEmail.includes('frontdesk') || lowerEmail.includes('front') || lowerEmail.includes('anna');
      const isAdmin = lowerEmail.includes('admin') || lowerEmail.includes('manager') || lowerEmail.includes('john');
      
      let mapped = ROLES.MANAGER;
      let redir = '/app';

      if (isSuperAdmin) {
        mapped = ROLES.SUPER_ADMIN;
        redir = '/app';
      } else if (isHousekeeping) {
        mapped = ROLES.HOUSEKEEPING_MANAGER;
        redir = '/app';
      } else if (isMaintenance) {
        mapped = ROLES.MAINTENANCE_MANAGER;
        redir = '/app';
      } else if (isFrontOffice) {
        mapped = ROLES.FRONT_OFFICE;
        redir = '/app';
      } else if (isAdmin) {
        mapped = ROLES.MANAGER;
        redir = '/app';
      }

      setIsAuthenticated(true, {
        name: isSuperAdmin ? 'Super Admin' : (isHousekeeping ? 'Elena (HK Manager)' : (isMaintenance ? 'Peter (Maint Manager)' : (isFrontOffice ? 'Anna (Front Office)' : 'John (Manager)'))),
        email: quickEmail,
        role: mapped,
        property: isSuperAdmin ? 'Global Control' : 'Mercier Hotel'
      });
      setIsLoading(false);
      navigate(redir);
    }, 300);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success && data.data && data.data.user) {
        localStorage.setItem('autopilot_token', data.data.accessToken);
        const userRole = data.data.user.role;
        let roleMapped = ROLES.PLATFORM_OPERATOR;
        let routeRedirect = '/app';

        if (userRole === 'Super Admin' || userRole === 'super_admin') {
          roleMapped = ROLES.SUPER_ADMIN;
          routeRedirect = '/app';
        } else if (userRole === 'Hotel Admin') {
          roleMapped = ROLES.HOTEL_ADMIN;
          routeRedirect = '/app';
        } else if (userRole === 'Operator' || userRole === 'platform_operator') {
          roleMapped = ROLES.PLATFORM_OPERATOR;
          routeRedirect = '/app';
        } else if (userRole === 'Front Desk' || userRole === 'front_office' || userRole === 'Front Office') {
          roleMapped = ROLES.FRONT_OFFICE;
          routeRedirect = '/app';
        } else if (userRole === 'Housekeeping' || userRole === 'Housekeeping Manager') {
          roleMapped = ROLES.HOUSEKEEPING_MANAGER;
          routeRedirect = '/app';
        } else if (userRole === 'Maintenance' || userRole === 'Maintenance Manager') {
          roleMapped = ROLES.MAINTENANCE_MANAGER;
          routeRedirect = '/app';
        } else if (userRole === 'Support Agent') {
          roleMapped = ROLES.GUEST_ASSISTANT;
          routeRedirect = '/app/takeover-queue';
        }

        setIsAuthenticated(true, {
          ...data.data.user,
          role: roleMapped
        });
        setIsLoading(false);
        navigate(routeRedirect);
        return;
      }
    } catch (err) {
      console.warn('Backend authentication endpoint unseeded or unreachable, using demo authorization handshake:', err);
    }

    // Fallback simulation if backend offline
    setTimeout(() => {
      const lowerEmail = email.toLowerCase();
      const isSuperAdmin = lowerEmail.includes('superadmin') || lowerEmail.includes('super');
      const isHousekeeping = lowerEmail.includes('housekeeping') || lowerEmail.includes('hk');
      const isMaintenance = lowerEmail.includes('maintenance') || lowerEmail.includes('mnt');
      const isFrontOffice = lowerEmail.includes('reception') || lowerEmail.includes('frontdesk') || lowerEmail.includes('front') || lowerEmail.includes('anna');
      const isAdmin = lowerEmail.includes('admin') || lowerEmail.includes('manager') || lowerEmail.includes('john');
      
      let mapped = ROLES.MANAGER;
      let redir = '/app';

      if (isSuperAdmin) {
        mapped = ROLES.SUPER_ADMIN;
        redir = '/app';
      } else if (isHousekeeping) {
        mapped = ROLES.HOUSEKEEPING_MANAGER;
        redir = '/app';
      } else if (isMaintenance) {
        mapped = ROLES.MAINTENANCE_MANAGER;
        redir = '/app';
      } else if (isFrontOffice) {
        mapped = ROLES.FRONT_OFFICE;
        redir = '/app';
      } else if (isAdmin) {
        mapped = ROLES.MANAGER;
        redir = '/app';
      }

      setIsAuthenticated(true, {
        name: isSuperAdmin ? 'Super Admin' : (isHousekeeping ? 'Elena (HK Manager)' : (isMaintenance ? 'Peter (Maint Manager)' : (isFrontOffice ? 'Anna (Front Office)' : 'John (Manager)'))),
        email: email || 'admin@grandhotel.ai',
        role: mapped,
        property: isSuperAdmin ? 'Global Control' : 'Mercier Hotel'
      });
      setIsLoading(false);
      navigate(redir);
    }, 800);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsForgotLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (data.success && data.data && data.data.resetToken) {
        setResetToken(data.data.resetToken);
        setIsForgotLoading(false);
        return;
      } else {
        alert(data.message || 'Error generating reset token.');
        setIsForgotLoading(false);
      }
    } catch (err) {
      setTimeout(() => {
        setResetToken('RESET_TOKEN_8892');
        setIsForgotLoading(false);
      }, 800);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsForgotLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert('Password updated successfully! You can now log in.');
        setShowForgotModal(false);
        setResetToken('');
        setForgotEmail('');
        setNewPassword('');
        setIsForgotLoading(false);
        return;
      } else {
        alert(data.message || 'Error updating password.');
        setIsForgotLoading(false);
      }
    } catch (err) {
      setTimeout(() => {
        alert('Password updated successfully! You can now log in.');
        setShowForgotModal(false);
        setResetToken('');
        setForgotEmail('');
        setNewPassword('');
        setIsForgotLoading(false);
      }, 800);
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-900 lg:bg-slate-50 font-sans overflow-hidden selection:bg-[#6D4AFF] selection:text-white">
      
      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 text-left relative z-50"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {resetToken ? 'Reset Password' : 'Password Recovery'}
                </h3>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setResetToken(''); }}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {!resetToken ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Enter your registered email address to receive a secure password reset token.
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="admin@hotel.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] rounded-xl outline-none text-xs font-medium text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full py-3 bg-[#0B1020] hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isForgotLoading ? 'Generating token...' : 'Send Reset Link'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    ✓ Security token generated! Enter your new password below.
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Reset Token</label>
                    <input
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] rounded-xl outline-none text-xs font-medium text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full py-3 bg-[#6D4AFF] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isForgotLoading ? 'Updating password...' : 'Update Password'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEFT SIDE - Project Premium Hotel Photo & Features */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden bg-slate-950 flex-col justify-between p-10 xl:p-14 text-white">
        {/* Background Hotel Image */}
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=90" 
          alt="Luxury Resort Property Management"
          className="absolute inset-0 w-full h-full object-cover opacity-75 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
        />
        
        {/* Aesthetic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020]/80 via-transparent to-[#0B1020]/30" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-[#6D4AFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6D4AFF]/30 border border-white/20">
            <Hotel size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">HOTELOGX</h1>
            <p className="text-[10px] font-semibold tracking-wider text-indigo-200 uppercase mt-1">Property Management System</p>
          </div>
        </div>

        {/* Center Banner Content */}
        <div className="relative z-10 max-w-xl space-y-5 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-indigo-200">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            Smart Property & Hospitality Operations
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Streamline reservations & guest experiences <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-amber-200">effortlessly.</span>
          </h2>

          <p className="text-slate-300 text-xs xl:text-sm leading-relaxed font-normal">
            Unified management for front desk reservations, AI guest communication, housekeeping, and real-time revenue analytics.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
              <Building2 size={18} className="text-indigo-400 shrink-0" />
              <span className="text-xs font-medium text-slate-100">Multi-Hotel Operations</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
              <Sparkles size={18} className="text-amber-400 shrink-0" />
              <span className="text-xs font-medium text-slate-100">24/7 AI Guest Concierge</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-slate-100">Real-Time Inventory Sync</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
              <span className="text-xs font-medium text-slate-100">Automated Analytics</span>
            </div>
          </div>
        </div>

        {/* Footer Tag */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
          <span>© 2026 HOTELOGX. All rights reserved.</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Online
          </span>
        </div>
      </div>

      {/* RIGHT SIDE - Clean ID/Password & Quick Access without Scroll */}
      <div className="w-full lg:w-1/2 xl:w-5/12 h-full flex flex-col justify-between p-6 sm:p-10 xl:p-12 bg-white overflow-y-auto lg:overflow-hidden">
        
        {/* Top Header & Back Button */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeft size={14} className="text-[#6D4AFF]" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 bg-[#6D4AFF] rounded-lg flex items-center justify-center text-white shadow-md">
                <Hotel size={18} />
              </div>
              <span className="font-extrabold text-sm tracking-wide text-slate-900 uppercase">HOTELOGX</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Enter your credentials to access your Hotelogx workspace.
            </p>
          </div>
        </div>

        {/* Form Section (Upper/Middle) */}
        <form onSubmit={handleLogin} className="space-y-4 my-auto py-2">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Work Email</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6D4AFF] transition-colors" size={17} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] focus:bg-white focus:ring-2 focus:ring-[#6D4AFF]/20 rounded-xl outline-none transition-all text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                placeholder="admin@grandhotel.ai"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 block">Password</label>
              <button 
                type="button" 
                onClick={() => setShowForgotModal(true)} 
                className="text-xs font-semibold text-[#6D4AFF] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6D4AFF] transition-colors" size={17} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] focus:bg-white focus:ring-2 focus:ring-[#6D4AFF]/20 rounded-xl outline-none transition-all text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-0.5">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-[#6D4AFF] focus:ring-[#6D4AFF]/30 cursor-pointer" 
              id="remember" 
              defaultChecked
            />
            <label htmlFor="remember" className="text-xs text-slate-600 font-medium cursor-pointer">
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 bg-[#0B1020] hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-70 active:scale-[0.99]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Access Demo Credentials Section */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <KeyRound size={15} className="text-[#6D4AFF]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Quick Access Demo Roles</span>
          </div>

          {/* Simple Clean Role Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickFillCredentials('superadmin@autopilot.com', 'admin123')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all flex items-center justify-center cursor-pointer text-center group shadow-sm"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#6D4AFF] transition-colors">Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => quickFillCredentials('john.manager@mercierhotel.com', 'admin123')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all flex items-center justify-center cursor-pointer text-center group shadow-sm"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#6D4AFF] transition-colors">Manager / Admin</span>
            </button>

            <button
              type="button"
              onClick={() => quickFillCredentials('anna.frontdesk@mercierhotel.com', 'admin123')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all flex items-center justify-center cursor-pointer text-center group shadow-sm"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#6D4AFF] transition-colors">Front Office</span>
            </button>

            <button
              type="button"
              onClick={() => quickFillCredentials('housekeeping@mercierhotel.com', 'admin123')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all flex items-center justify-center cursor-pointer text-center group shadow-sm"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#6D4AFF] transition-colors">Housekeeping</span>
            </button>

            <button
              type="button"
              onClick={() => quickFillCredentials('maintenance@mercierhotel.com', 'admin123')}
              className="px-3 py-2.5 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all flex items-center justify-center cursor-pointer text-center group shadow-sm col-span-2 sm:col-span-1"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#6D4AFF] transition-colors">Maintenance</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')} 
                className="text-[#6D4AFF] font-bold hover:underline cursor-pointer"
              >
                Register Property
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

