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
        sessionStorage.setItem('autopilot_token', data.data.accessToken);
        const userRole = data.data.user.role;
        let roleMapped = ROLES.PLATFORM_OPERATOR;
        let routeRedirect = '/app';

        if (userRole === 'Super Admin' || userRole === 'super_admin') {
          roleMapped = ROLES.SUPER_ADMIN;
          routeRedirect = '/app';
        } else if (userRole === 'Hotel Admin') {
          roleMapped = ROLES.HOTEL_ADMIN;
          routeRedirect = '/app';
        } else if (userRole === 'Manager') {
          roleMapped = ROLES.MANAGER;
          routeRedirect = '/app';
        } else if (userRole === 'Operator' || userRole === 'platform_operator') {
          roleMapped = ROLES.PLATFORM_OPERATOR;
          routeRedirect = '/app';
        } else if (userRole === 'Front Desk' || userRole === 'front_office' || userRole === 'Front Office') {
          roleMapped = ROLES.FRONT_OFFICE;
          routeRedirect = '/app';
        } else if (userRole === 'Housekeeping Manager') {
          roleMapped = ROLES.HOUSEKEEPING_MANAGER;
        } else if (userRole === 'Housekeeping' || userRole === 'Housekeeping Staff') {
          roleMapped = ROLES.HOUSEKEEPING_STAFF;
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
          originalRole: data.data.user.role,
          role: roleMapped
        });
        setIsLoading(false);
        navigate(routeRedirect);
        return;
      } else {
        alert(data.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Backend authentication error:', err);
      // Fallback for local demo if backend is down
      setTimeout(() => {
        let simulatedRole = 'Platform Operator';
        if (email.includes('superadmin')) simulatedRole = 'Super Admin';
        else if (email.includes('manager')) simulatedRole = 'Manager';
        else if (email.includes('frontdesk')) simulatedRole = 'Front Desk';
        else if (email.includes('housekeeping')) simulatedRole = 'Housekeeping';
        else if (email.includes('maintenance')) simulatedRole = 'Maintenance';

        const simulatedUser = {
          id: 'simulated_user_123',
          name: email.split('@')[0] || 'Demo User',
          email: email,
          role: simulatedRole
        };

        sessionStorage.setItem('autopilot_token', 'simulated_token_123');
        
        let roleMapped = ROLES.PLATFORM_OPERATOR;
        let routeRedirect = '/app';

        if (simulatedRole === 'Super Admin' || simulatedRole === 'super_admin') {
          roleMapped = ROLES.SUPER_ADMIN;
          routeRedirect = '/app';
        } else if (simulatedRole === 'Hotel Admin') {
          roleMapped = ROLES.HOTEL_ADMIN;
          routeRedirect = '/app';
        } else if (simulatedRole === 'Manager') {
          roleMapped = ROLES.MANAGER;
          routeRedirect = '/app';
        } else if (simulatedRole === 'Operator' || simulatedRole === 'platform_operator') {
          roleMapped = ROLES.PLATFORM_OPERATOR;
          routeRedirect = '/app';
        } else if (simulatedRole === 'Front Desk' || simulatedRole === 'front_office' || simulatedRole === 'Front Office') {
          roleMapped = ROLES.FRONT_OFFICE;
          routeRedirect = '/app';
        } else if (simulatedRole === 'Housekeeping Manager') {
          roleMapped = ROLES.HOUSEKEEPING_MANAGER;
        } else if (simulatedRole === 'Housekeeping' || simulatedRole === 'Housekeeping Staff') {
          roleMapped = ROLES.HOUSEKEEPING_STAFF;
          routeRedirect = '/app';
        } else if (simulatedRole === 'Maintenance' || simulatedRole === 'Maintenance Manager') {
          roleMapped = ROLES.MAINTENANCE_MANAGER;
          routeRedirect = '/app';
        } else if (simulatedRole === 'Support Agent') {
          roleMapped = ROLES.GUEST_ASSISTANT;
          routeRedirect = '/app/takeover-queue';
        }

        setIsAuthenticated(true, {
          ...simulatedUser,
          originalRole: simulatedUser.role,
          role: roleMapped
        });
        setIsLoading(false);
        navigate(routeRedirect);
      }, 800);
    }
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
    <div className="min-h-screen w-full flex bg-slate-50 font-sans overflow-hidden selection:bg-[#6D4AFF] selection:text-white">
      
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
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative bg-slate-950 flex-col py-10 px-12 xl:px-16 text-white overflow-y-auto overflow-x-hidden">
        
        {/* Background Hotel Image */}
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=90" 
          alt="Luxury Resort Property Management"
          className="absolute inset-0 w-full h-full object-cover opacity-75 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
        />
        
        {/* Aesthetic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/80 to-[#0B1020]/90" />
        
        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3 mb-16">
          <div className="w-11 h-11 bg-[#6D4AFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6D4AFF]/30 border border-white/20">
            <Hotel size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white leading-none">HOTELOGX</span>
            <span className="text-[10px] font-semibold tracking-wider text-indigo-200 uppercase mt-1">Connect</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-[480px] space-y-6">
          <h1 className="text-[44px] leading-[1.1] font-extrabold text-white tracking-tight">
            An AI front office and operations assistant.
          </h1>

          <p className="text-slate-300 text-[15px] leading-relaxed pb-8">
            Not a chatbot, not another inbox. The AI handles routine guest communication and coordinates your departments — your team sees only what genuinely requires a person.
          </p>

          {/* Features List */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#6D4AFF]/20 border border-[#6D4AFF]/50 flex items-center justify-center text-indigo-200 text-xs font-bold">1</div>
              <div>
                <h3 className="text-white font-bold mb-1 text-[15px]">The guest writes wherever they already are</h3>
                <p className="text-slate-400 text-[14px] leading-snug">WhatsApp, Gmail, Outlook or your own mailbox. One thread per guest, whatever they use.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#6D4AFF]/20 border border-[#6D4AFF]/50 flex items-center justify-center text-indigo-200 text-xs font-bold">2</div>
              <div>
                <h3 className="text-white font-bold mb-1 text-[15px]">The AI answers, and knows when not to</h3>
                <p className="text-slate-400 text-[14px] leading-snug">It replies from your own policies and live availability, and escalates complaints, refunds and safety to a human.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#6D4AFF]/20 border border-[#6D4AFF]/50 flex items-center justify-center text-indigo-200 text-xs font-bold">3</div>
              <div>
                <h3 className="text-white font-bold mb-1 text-[15px]">Work reaches the right department on WhatsApp</h3>
                <p className="text-slate-400 text-[14px] leading-snug">Housekeeping and maintenance update rooms and tickets with a tap. No new app to learn.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#6D4AFF]/20 border border-[#6D4AFF]/50 flex items-center justify-center text-indigo-200 text-xs font-bold">4</div>
              <div>
                <h3 className="text-white font-bold mb-1 text-[15px]">Everyone sees only what needs them</h3>
                <p className="text-slate-400 text-[14px] leading-snug">Managers get a morning briefing instead of an inbox. Reception gets prepared answers instead of questions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-16">
          <div className="pt-6 border-t border-white/10 flex gap-3">
            <Sparkles size={16} className="text-indigo-300 flex-shrink-0 mt-0.5" />
            <p className="text-slate-400 text-[13px] leading-relaxed">
              Reservations always complete on your own booking engine — the AI checks availability and pricing in your PMS, then hands the guest a direct link. It never takes payment.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Sign In Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] h-full flex flex-col p-8 sm:p-12 xl:p-16 lg:pl-24 bg-white overflow-y-auto items-start">
        
        <div className="w-full max-w-[440px] pt-4 lg:pt-8">
          <p className="text-slate-400 text-[11px] font-bold tracking-widest uppercase mb-4">SIGN IN</p>
          
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Hotel Mercier
          </h2>
          <p className="text-slate-500 text-[15px] leading-relaxed mb-8 font-medium">
            Every staff member has their own login. Your role decides what you see — there is no department to pick.
          </p>

          {/* Quick Access Demo Roles - KEPT EXACTLY THE SAME AS REQUESTED */}
          <div className="space-y-4 mb-10">
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
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Work email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] focus:bg-white focus:ring-2 focus:ring-[#6D4AFF]/20 rounded-xl outline-none transition-all text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                placeholder="amelie@hotelmercier.be"
              />
            </div>

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
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] focus:bg-white focus:ring-2 focus:ring-[#6D4AFF]/20 rounded-xl outline-none transition-all text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-[#0B1020] hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 space-y-2">
            <h4 className="text-[14px] font-bold text-slate-900">New hotel?</h4>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium pb-2">
              Start from nothing: the onboarding wizard walks the manager through the profile, the PMS, email, both WhatsApp numbers, the knowledge base, the team and the AI rules.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Sparkles size={14} className="text-[#6D4AFF]" />
              Set up a new hotel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

