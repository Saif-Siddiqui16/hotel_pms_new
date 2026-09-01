import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Bell,
  Save,
  ShieldAlert,
  RefreshCw,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  Database,
  Sliders,
  ShieldCheck,
  Users,
  Building2,
  Link,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp, ROLES } from "../context/AppContext";
import { API_BASE_URL } from "../config";
import UsersManagement from "./UsersManagement";
import SubscriptionBilling from "./SubscriptionBilling";

// --- SUB-PANEL: AI TONE & STYLE ---
const AIToneStylePanel = ({ settings, onChange }) => {
  const tone = settings.communicationVoice;
  const language = settings.defaultLanguage;
  const signature = settings.messageSignature;

  // Preview messages mapped to selected tone
  const getPreviewText = () => {
    switch (tone) {
      case "Formal & Traditional":
        return "Dear Ms. Jenkins, we are pleased to inform you that your request for a checkout extension until 2:00 PM has been formally approved. Enjoy your stay.";
      case "Friendly, Casual & Quick":
        return "Hey Sarah! Sure thing, I've extended your checkout to 2 PM. Sleep in and relax, no rush!";
      case "Ultra-Luxury Concierge Style":
        return "Good morning Sarah. It is our utmost pleasure to accommodate your request. Your checkout has been graciously extended to 2:00 PM today.";
      default: // Warm & Professional
        return "Absolutely Sarah, I’ve extended your checkout until 2:00 PM today based on availability. Your room key has been updated automatically.";
    }
  };

  return (
    <div className="space-y-5 text-left">
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            AI Persona & Tone
          </h3>
          <p className="text-slate-500 text-xs font-medium">
            Configure the automated communication voice signature for your
            property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Communication Voice
            </label>
            <select
              value={tone}
              onChange={(e) => onChange("communicationVoice", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-purple-500/20"
            >
              <option>Warm & Professional</option>
              <option>Formal & Traditional</option>
              <option>Friendly, Casual & Quick</option>
              <option>Ultra-Luxury Concierge Style</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Default Language
            </label>
            <select
              value={language}
              onChange={(e) => onChange("defaultLanguage", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-purple-500/20"
            >
              <option>Auto-Detect Multilingual</option>
              <option>Strict English Only</option>
              <option>Bilingual (English / Spanish)</option>
              <option>Bilingual (English / French)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Automated Message Signature
          </label>
          <input
            type="text"
            value={signature}
            onChange={(e) => onChange("messageSignature", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-purple-500/20 placeholder-slate-400"
          />
        </div>
      </div>

      {/* INTERACTIVE CHAT PREVIEW */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-3.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Live Voice Preview Simulation
        </span>

        <div className="space-y-3 max-w-md">
          {/* Guest side bubble */}
          <div className="flex justify-end">
            <div className="bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl rounded-tr-none text-xs font-medium max-w-xs">
              "Can I checkout at 2 PM?"
            </div>
          </div>

          {/* AI side bubble */}
          <div className="flex justify-start items-start gap-2">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
              <Bot size={13} />
            </div>
            <div className="bg-white border border-slate-150 text-slate-900 px-3.5 py-2 rounded-xl rounded-tl-none text-xs font-semibold max-w-xs space-y-1 shadow-sm">
              <p className="leading-relaxed">{getPreviewText()}</p>
              <span className="text-[9.5px] text-slate-400 font-medium block border-t border-slate-100 pt-1 mt-1 text-right">
                {signature}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-PANEL: AI PERMISSIONS ---
const AIPermissionsPanel = ({ settings, onChange }) => {
  const lateCheckOutLimit = settings.lateCheckoutLimit;
  const refundLimit = `$${settings.billingWaiverLimit}`;
  const upgradePermission = settings.roomUpgradeLimit;

  const handleRefundChange = (val) => {
    const numeric = parseInt(val.replace("$", ""), 10) || 0;
    onChange("billingWaiverLimit", numeric);
  };

  return (
    <div className="space-y-5 text-left">
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            AI Decision Permissions
          </h3>
          <p className="text-slate-500 text-xs font-medium">
            Set precise operational authorization levels for independent AI
            decisions.
          </p>
        </div>

        {/* Compact permissions card deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Late Checkout */}
          <div className="border border-slate-200/80 rounded-xl p-4 space-y-2.5 hover:border-purple-200/60 transition-all bg-slate-50/20">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              Late Checkout limits
            </span>
            <p className="text-xs text-slate-500 font-medium leading-normal">
              AI can independently extend guest room keys complimentary up to:
            </p>
            <select
              value={lateCheckOutLimit}
              onChange={(e) => onChange("lateCheckoutLimit", e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none"
            >
              <option>12:00 PM</option>
              <option>1:00 PM</option>
              <option>2:00 PM</option>
              <option>3:00 PM (Supervisor alert)</option>
            </select>
          </div>

          {/* Card 2: Refund Approvals */}
          <div className="border border-slate-200/80 rounded-xl p-4 space-y-2.5 hover:border-purple-200/60 transition-all bg-slate-50/20">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              Refund Approvals
            </span>
            <p className="text-xs text-slate-500 font-medium leading-normal">
              AI can auto-issue billing credits / folio waivers up to:
            </p>
            <select
              value={refundLimit}
              onChange={(e) => handleRefundChange(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none"
            >
              <option>$0 (Requires manual desk review)</option>
              <option>$25</option>
              <option>$50</option>
              <option>$100</option>
            </select>
          </div>

          {/* Card 3: Room Upgrades */}
          <div className="border border-slate-200/80 rounded-xl p-4 space-y-2.5 hover:border-purple-200/60 transition-all bg-slate-50/20">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              Room Upgrades
            </span>
            <p className="text-xs text-slate-500 font-medium leading-normal">
              AI can grant complimentary upgrades during check-in for:
            </p>
            <select
              value={upgradePermission}
              onChange={(e) => onChange("roomUpgradeLimit", e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none"
            >
              <option>No Autonomous Upgrades</option>
              <option>Standard Rooms Only</option>
              <option>Standard & Junior Suites</option>
            </select>
          </div>
        </div>
      </div>

      {/* Safety Guard Notice */}
      <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-xl flex items-start gap-3">
        <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-800 leading-relaxed font-semibold">
          Any guest inquiry exceeding these limits (e.g. asking for $75 discount
          or checkout at 3 PM) is automatically forwarded to human staff
          takeover queue.
        </p>
      </div>
    </div>
  );
};

// --- SUB-PANEL: ESCALATION RULES ---
const EscalationRulesPanel = ({ settings, onChange }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-5 text-left animate-in fade-in duration-300">
      <div className="text-left">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Escalation Routing
        </h3>
        <p className="text-slate-500 text-xs font-medium">
          Define target human teams when guest situations bypass automated
          control limits.
        </p>
      </div>

      <div className="space-y-3.5">
        {[
          {
            label: "VIP Guests Escalations",
            desc: "Loyalty status triggers priority desk routing",
            state: settings.vipEscalationRoute,
            key: "vipEscalationRoute",
            options: ["Supervisor", "Front Desk Manager", "Duty Manager"],
          },
          {
            label: "Refund & Disputes",
            desc: "Surcharges or incidental fee disputes",
            state: settings.refundEscalationRoute,
            key: "refundEscalationRoute",
            options: ["Supervisor", "Front Desk Manager", "Accounting Desk"],
          },
          {
            label: "Complaint Sentiment Trigger",
            desc: "High negativity / anger detected by AI NLP",
            state: settings.sentimentEscalationRoute,
            key: "sentimentEscalationRoute",
            options: [
              "Human Takeover",
              "Front Desk Supervisor",
              "Escalation Channel",
            ],
          },
          {
            label: "Low AI Confidence Trigger",
            desc: "Fails to map matching hotel SOP rules",
            state: settings.confidenceEscalationRoute,
            key: "confidenceEscalationRoute",
            options: [
              "Takeover Queue",
              "Front Desk Assistant",
              "Supervisor Queue",
            ],
          },
        ].map((rule, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl"
          >
            <div className="space-y-0.5 text-left">
              <p className="text-xs font-bold text-slate-900">{rule.label}</p>
              <p className="text-[10px] text-slate-400 font-semibold">
                {rule.desc}
              </p>
            </div>
            <select
              value={rule.state}
              onChange={(e) => onChange(rule.key, e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none w-full sm:w-48 cursor-pointer"
            >
              {rule.options.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SUB-PANEL: STAFF ALERTS ---
const StaffAlertsPanel = ({ settings, onChange }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-5 text-left animate-in fade-in duration-300">
      <div className="text-left">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Staff Routing & Alerts
        </h3>
        <p className="text-slate-500 text-xs font-medium">
          Configure alert triggers and messaging routes when humans are paged.
        </p>
      </div>

      <div className="space-y-3">
        {/* WhatsApp Alert */}
        <div className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-200 rounded-xl">
          <div className="text-left space-y-0.5">
            <p className="text-xs font-bold text-slate-900">
              WhatsApp Shift Paging
            </p>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Send high-priority escalation notifications directly to staff
              WhatsApp devices.
            </p>
          </div>
          <button
            onClick={() => onChange("pushAlertsEnabled", !settings.pushAlertsEnabled)}
            className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all shrink-0 cursor-pointer ${settings.pushAlertsEnabled ? "bg-[#6D28D9]" : "bg-slate-300"}`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${settings.pushAlertsEnabled ? "translate-x-4" : ""}`}
            />
          </button>
        </div>

        {/* Email Alert */}
        <div className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-200 rounded-xl">
          <div className="text-left space-y-0.5">
            <p className="text-xs font-bold text-slate-900">
              Email Takeover Summary
            </p>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Generate instant email alerts with full conversational transcripts
              for manual takeover cases.
            </p>
          </div>
          <button
            onClick={() => onChange("systemAlertsEnabled", !settings.systemAlertsEnabled)}
            className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all shrink-0 cursor-pointer ${settings.systemAlertsEnabled ? "bg-[#6D28D9]" : "bg-slate-300"}`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${settings.systemAlertsEnabled ? "translate-x-4" : ""}`}
            />
          </button>
        </div>

        {/* Shift Routing */}
        <div className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-200 rounded-xl">
          <div className="text-left space-y-0.5">
            <p className="text-xs font-bold text-slate-900">
              Active Shift-Based Paging
            </p>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Route alerts dynamically depending on currently logged shift
              rosters in PMS.
            </p>
          </div>
          <button
            onClick={() => onChange("shiftPagingEnabled", !settings.shiftPagingEnabled)}
            className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all shrink-0 cursor-pointer ${settings.shiftPagingEnabled ? "bg-[#6D28D9]" : "bg-slate-300"}`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${settings.shiftPagingEnabled ? "translate-x-4" : ""}`}
            />
          </button>
        </div>

        {/* Night Mode */}
        <div className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-200 rounded-xl">
          <div className="text-left space-y-0.5">
            <p className="text-xs font-bold text-slate-900">
              Auto Night-Duty Mode
            </p>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Forward escalated calls directly to the night manager mobile
              between 11 PM and 6 AM.
            </p>
          </div>
          <button
            onClick={() => onChange("nightDutyEnabled", !settings.nightDutyEnabled)}
            className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all shrink-0 cursor-pointer ${settings.nightDutyEnabled ? "bg-[#6D28D9]" : "bg-slate-300"}`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${settings.nightDutyEnabled ? "translate-x-4" : ""}`}
            />
          </button>
        </div>

        {/* Emergency Escalation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50/50 border border-slate-200 rounded-xl">
          <div className="text-left space-y-0.5">
            <p className="text-xs font-bold text-slate-900">
              Emergency Priority Channel
            </p>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Assign dispatch level to high safety risk complaints (e.g. room
              damage, incident alerts).
            </p>
          </div>
          <select
            value={settings.emergencyChannel}
            onChange={(e) => onChange("emergencyChannel", e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none w-full sm:w-48 cursor-pointer"
          >
            <option>Standard Takeover Queue</option>
            <option>High Priority Page</option>
            <option>Immediate Manager SMS Page</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// --- SUB-PANEL: CONNECTED SYSTEMS ---
const ConnectedSystemsPanel = () => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-5 text-left animate-in fade-in duration-300">
      <div className="text-left">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Connected Systems
        </h3>
        <p className="text-slate-500 text-xs font-medium">
          Verify sync statuses with critical operational PMS and dispatch
          platforms.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            system: "Opera PMS Integration",
            type: "Core PMS Link",
            status: "Sync Healthy",
            detail: "Dynamic folio fee posts active",
          },
          {
            system: "WhatsApp Enterprise API",
            type: "Guest Channel Link",
            status: "Active",
            detail: "Primary messaging webhook live",
          },
          {
            system: "SMTP Email Dispatch",
            type: "Staff Paging Channel",
            status: "Operational",
            detail: "Digest reports dispatch active",
          },
        ].map((sys, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl flex items-center justify-between gap-4"
          >
            <div className="space-y-0.5 text-left">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                {sys.type}
              </span>
              <p className="text-xs font-bold text-slate-950">{sys.system}</p>
              <p className="text-[10px] text-slate-500 font-semibold">
                {sys.detail}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                {sys.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SUB-PANEL: ACCOUNT SECURITY ---
const AccountSecurityPanel = ({ settings, onChange }) => {
  const { addToast } = useApp();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [logoutAll, setLogoutAll] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast("All password fields are required.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Confirm password does not match new password.", "error");
      return;
    }

    setUpdatingPass(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}` // Fallback if using local storage
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        addToast("Password updated successfully.", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        addToast(data.message || "Failed to update password.", "error");
      }
    } catch (err) {
      addToast("Connection error updating password.", "error");
    } finally {
      setUpdatingPass(false);
    }
  };

  // Simple password strength calculator
  const getPasswordStrength = () => {
    if (!newPassword)
      return { percent: 0, text: "Empty", color: "bg-slate-200" };
    if (newPassword.length < 5)
      return { percent: 25, text: "Weak", color: "bg-rose-500" };
    if (newPassword.length < 8)
      return { percent: 50, text: "Moderate", color: "bg-amber-500" };

    const hasNumbers = /\d/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (hasNumbers && hasSpecial)
      return { percent: 100, text: "Very Secure", color: "bg-emerald-500" };
    return { percent: 75, text: "Secure", color: "bg-purple-500" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left animate-in fade-in duration-300">
      {/* Left side credentials edit form */}
      <form onSubmit={handleUpdatePassword} className="md:col-span-8 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Account Credentials
          </h3>
          <p className="text-slate-500 text-xs font-medium">
            Update password credentials to access hotel operational dashboards
            securely.
          </p>
        </div>

        <div className="space-y-3 text-xs font-semibold">
          {/* Current Pass */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3 pr-9 py-1.75 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-purple-500/30 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-650"
              >
                {showCurrent ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {/* New Pass */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full pl-3 pr-9 py-1.75 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-purple-500/30 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-650"
              >
                {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            {/* Strength Meter */}
            {newPassword && (
              <div className="space-y-1 pt-1 text-left">
                <div className="flex justify-between text-[9px] font-bold">
                  <span className="text-slate-400">Password Strength:</span>
                  <span className="text-slate-700">{strength.text}</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Pass */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-3 pr-9 py-1.75 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-purple-500/30 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-650"
              >
                {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={updatingPass}
            className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider cursor-pointer"
          >
            {updatingPass ? "Updating Password..." : "Update Password"}
          </button>
        </div>

        {/* Secure Access Controls */}
        <div className="pt-3.5 border-t border-slate-100 space-y-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Access Controls
          </span>

          {/* Enforce Complex rules */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <div className="text-left space-y-0.5">
              <p className="text-slate-900 font-bold">Enforce Complex Rules</p>
              <p className="text-[9.5px] text-slate-400 leading-none">
                Require special characters and numeric sequences.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange("enforceComplexRules", !settings.enforceComplexRules)}
              className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all cursor-pointer ${settings.enforceComplexRules ? "bg-[#6D28D9]" : "bg-slate-300"}`}
            >
              <div
                className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${settings.enforceComplexRules ? "translate-x-4" : ""}`}
              />
            </button>
          </div>

          {/* MFA */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <div className="text-left space-y-0.5">
              <p className="text-slate-900 font-bold">
                Two-Factor Authentication (MFA)
              </p>
              <p className="text-[9.5px] text-slate-400 leading-none">
                Require OTP codes on staff login requests (future-ready).
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange("mfaEnabled", !settings.mfaEnabled)}
              className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all cursor-pointer ${settings.mfaEnabled ? "bg-[#6D28D9]" : "bg-slate-300"}`}
            >
              <div
                className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${settings.mfaEnabled ? "translate-x-4" : ""}`}
              />
            </button>
          </div>

          {/* Session Timeout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
            <div className="text-left space-y-0.5">
              <p className="text-slate-900 font-bold">Session Idle Timeout</p>
              <p className="text-[9.5px] text-slate-400 leading-none">
                Automatically lock session after duration of idle status.
              </p>
            </div>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => onChange("sessionTimeout", e.target.value)}
              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none w-full sm:w-28 cursor-pointer"
            >
              <option>4 Hours</option>
              <option>8 Hours</option>
              <option>24 Hours</option>
            </select>
          </div>

          {/* Logout all */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setLogoutAll(true);
                setTimeout(() => setLogoutAll(false), 2000);
              }}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              {logoutAll
                ? "All other sessions closed"
                : "Force logout from all other devices"}
            </button>
          </div>
        </div>
      </form>

      {/* Right side security status card */}
      <div className="md:col-span-4 bg-slate-50 border border-slate-150 p-4.5 rounded-xl text-left space-y-4 h-fit">
        <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span className="text-[10.5px] font-bold text-slate-900 uppercase tracking-wider">
            Access Status
          </span>
        </div>

        <div className="space-y-3.5 font-semibold text-xs text-slate-600">
          <div className="space-y-0.5">
            <span className="text-[9.5px] text-slate-400 font-bold block uppercase leading-none">
              Last password update
            </span>
            <p className="text-slate-900 font-bold">Just now</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9.5px] text-slate-400 font-bold block uppercase leading-none">
              Active Sessions
            </span>
            <p className="text-slate-900 font-bold">1 device active</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9.5px] text-slate-400 font-bold block uppercase leading-none">
              MFA Status
            </span>
            <p
              className={
                settings.mfaEnabled
                  ? "text-emerald-600 font-bold"
                  : "text-slate-500 font-bold"
              }
            >
              {settings.mfaEnabled ? "Active (Email-linked)" : "Inactive"}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9.5px] text-slate-400 font-bold block uppercase leading-none">
              Protection status
            </span>
            <p className="text-slate-900 font-bold">
              Brute-force protection active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-PANEL: USAGE & BILLING ---
const BillingPlanPanel = () => {
  const { hotels } = useApp();
  const myHotel = hotels[0] || { plan: "Enterprise", rooms: 150 };

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-300">
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Usage & Billing Metrics
          </h3>
          <p className="text-slate-500 text-xs font-medium">
            Review current operational workspace limits and direct integration
            statuses.
          </p>
        </div>

        {/* Shrunken billing indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Rooms Sync
            </span>
            <p className="text-sm font-black text-slate-950 font-mono">
              {myHotel.rooms || 150} Rooms
            </p>
            <span className="text-[9px] text-slate-400 block font-semibold leading-none">
              PMS Active Sync
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Conversations
            </span>
            <p className="text-sm font-black text-slate-950 font-mono">
              1,240 / 5,000
            </p>
            <span className="text-[9px] text-slate-400 block font-semibold leading-none">
              24.8% Monthly limit
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Integration Status
            </span>
            <p className="text-sm font-black text-emerald-600 font-mono">
              Connected
            </p>
            <span className="text-[9px] text-slate-400 block font-semibold leading-none">
              PMS bridge normal
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Automation success
            </span>
            <p className="text-sm font-black text-[#6D28D9] font-mono">
              99.2% OK
            </p>
            <span className="text-[9px] text-slate-400 block font-semibold leading-none">
              0 unresolved locks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-PANEL: HOTEL PROFILE ---
const HotelProfilePanel = ({ settings, onChange }) => {
  return (
    <div className="space-y-6 text-left">
      {/* Property identity */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">Property identity</h3>
            <p className="text-slate-500 text-xs font-medium mt-0.5">What the AI calls your hotel, and what appears on invoices</p>
          </div>
          <button className="px-4 py-1.5 bg-[#8DAA9E] text-white rounded font-bold text-xs flex items-center gap-1.5 opacity-80 cursor-default">
            <CheckCircle2 size={14} /> Saved
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Trading name</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900" defaultValue="Hotel Mercier" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Legal entity</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900" defaultValue="Hotel Mercier BV" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Street</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900" defaultValue="Leopoldstraat 42" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Postcode</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono" defaultValue="2000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">City</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900" defaultValue="Antwerp" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Country</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900" defaultValue="Belgium" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">VAT number</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono" defaultValue="BE 0784.512.339" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Timezone</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono" defaultValue="Europe/Brussels" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Rooms</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900" defaultValue="48" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Rating</label>
              <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900">
                <option>4 stars</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & channels */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">Contact & channels</h3>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Where guests reach you, and where the AI sends them to book</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Reception phone</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono" defaultValue="+32 3 227 41 00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Reception mailbox</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono" defaultValue="reception@hotelmercier.be" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Website</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono" defaultValue="hotelmercier.be" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Booking engine</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono" defaultValue="hotelmercier.be/book" />
            </div>
          </div>
          <div className="flex gap-2 items-start text-[10px] text-slate-400 font-medium">
            <ShieldCheck size={14} className="shrink-0 text-slate-400 mt-0.5" />
            <p>Availability questions always end at your booking engine. The WhatsApp number is set in Connections, not here — it belongs to your WhatsApp Business account.</p>
          </div>
        </div>
      </div>

      {/* Stay basics */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">Stay basics</h3>
          <p className="text-slate-500 text-xs font-medium mt-0.5">The AI answers check-in and check-out questions from these times</p>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Check-in from</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono" defaultValue="15:00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide">Check-out by</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-mono" defaultValue="11:00" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 tracking-wide">Languages the AI replies in</label>
            <div className="flex flex-wrap gap-2">
              {['Dutch', 'French', 'English', 'German'].map(lang => (
                <span key={lang} className="px-3 py-1 rounded-full border border-slate-900 text-xs font-semibold text-slate-900 bg-white">
                  {lang}
                </span>
              ))}
              {['Spanish', 'Italian', 'Portuguese', 'Polish'].map(lang => (
                <span key={lang} className="px-3 py-1 rounded-full border border-slate-200 text-xs font-medium text-slate-400 bg-slate-50">
                  {lang}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1.5">The AI answers in the language the guest wrote in. These are the ones your team can proofread.</p>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-bold text-slate-500 tracking-wide">How the AI describes the hotel</label>
            <textarea className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 min-h-[80px]" defaultValue="A 48-room townhouse hotel in the fashion district, five minutes from Antwerp Central. Courtyard-facing Deluxe rooms, a small spa and a breakfast room that opens at 07:00."></textarea>
            <p className="text-[10px] text-slate-400 font-medium">Used for pre-arrival enquiries alongside your knowledge base.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN SETTINGS EXPORT COMPONENT ---
const Settings = () => {
  const { addToast, role } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Settings State matching database columns
  const [settings, setSettings] = useState({
    communicationVoice: "Warm & Professional",
    defaultLanguage: "Auto-Detect Multilingual",
    messageSignature: "Sincerely, the Guest Relations Team",
    lateCheckoutLimit: "2:00 PM",
    billingWaiverLimit: 30,
    roomUpgradeLimit: "Standard Rooms Only",
    vipEscalationRoute: "Front Desk Manager",
    refundEscalationRoute: "Supervisor",
    sentimentEscalationRoute: "Human Takeover",
    confidenceEscalationRoute: "Takeover Queue",
    shiftPagingEnabled: false,
    nightDutyEnabled: true,
    emergencyChannel: "High Priority Page",
    enforceComplexRules: true,
    mfaEnabled: false,
    sessionTimeout: "8 Hours",
    systemAlertsEnabled: true,
    pushAlertsEnabled: true,
    globalAutomation: true,
    confidenceThreshold: 85,
    humanTakeoverEnabled: true,
    escalationThreshold: 65,
    occupancyTrigger: 90
  });

  const [mobileExpanded, setMobileExpanded] = useState("tone");

  // Fetch settings from live database
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings((prev) => ({
            ...prev,
            ...data.data
          }));
        }
      })
      .catch((err) => console.error("Error fetching settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast("Operational behavior controls successfully updated.", "success");
      } else {
        addToast(data.message || "Failed to save settings.", "error");
      }
    } catch (err) {
      addToast("Connection error saving settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

// --- SUB-PANEL: HOTEL POLICIES & KNOWLEDGE UPLOAD ---
const KnowledgePolicyPanel = ({ settings, onChange }) => {
  const [policiesText, setPoliciesText] = useState(
    settings?.hotelPoliciesText || 
    "• Check-in time: 14:00 | Check-out time: 11:00\n• Early Check-in: Available from 12:00 for €20 surcharge.\n• Breakfast Hours: 07:00 - 10:30 AM in Main Dining Room.\n• Free High-Speed WiFi network: MercierGuest (Password: Mercier2026!)\n• Pet Policy: Small pets under 10kg allowed for €15/night."
  );
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: "Mercier_Hotel_Guest_Policy_2026.pdf", size: "1.2 MB", date: "Uploaded Today" },
    { name: "House_Rules_and_Amenities.docx", size: "450 KB", date: "Uploaded 3 days ago" }
  ]);
  const [isSavingPolicy, setIsSavingPolicy] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setUploadedDocs(prev => [
        { name: file.name, size: `${(file.size / 1024).toFixed(0)} KB`, date: "Just now" },
        ...prev
      ]);
    }
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>📄</span> Hotel Policies & Knowledge Upload
          </h3>
          <p className="text-slate-500 text-xs font-medium mt-0.5">
            Upload your hotel's rules, FAQs, and policy documents for AI training.
          </p>
        </div>

        {/* Policy Text Editor */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Hotel Operating Guidelines & Rules (Text Notes)
          </label>
          <textarea
            rows={6}
            value={policiesText}
            onChange={(e) => setPoliciesText(e.target.value)}
            placeholder="Type or paste hotel policies here (e.g. Check-in time, Breakfast hours, WiFi password)..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-[#6D4AFF] focus:ring-2 focus:ring-purple-100 font-mono leading-relaxed"
          />
        </div>

        {/* Document Upload Area */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Upload Policy Documents & PDFs
          </label>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-purple-200 hover:border-[#6D4AFF] bg-purple-50/40 p-6 rounded-2xl text-center cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 bg-purple-100 text-[#6D4AFF] rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              📁
            </div>
            <p className="text-xs font-bold text-slate-800">
              Click to browse or drop policy documents here
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">
              Supports PDF, DOCX, TXT files up to 25MB
            </p>
          </div>

          {/* Uploaded Documents List */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Active Policy Files</span>
            <div className="space-y-2">
              {uploadedDocs.map((doc, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-purple-600 font-bold">📄</span>
                    <span className="font-bold text-slate-800">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({doc.size})</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active Knowledge
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SUB-PANEL: WHATSAPP & EMAIL DETAILS ---
const WhatsAppEmailDetailsPanel = ({ settings, onChange }) => {
  const [waNumber, setWaNumber] = useState(settings?.whatsappNumber || "+44 7700 900077");
  const [waToken, setWaToken] = useState(settings?.whatsappToken || "EAAG...39281x");
  const [emailAddress, setEmailAddress] = useState(settings?.senderEmail || "reservations@mercierhotel.com");
  const [smtpServer, setSmtpServer] = useState(settings?.smtpHost || "smtp.sendgrid.net");
  const [isWaConnected, setIsWaConnected] = useState(true);

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>📱</span> WhatsApp & Email Integration Details
          </h3>
          <p className="text-slate-500 text-xs font-medium mt-0.5">
            Configure channel credentials and authorizations for WhatsApp Business API and Email dispatch.
          </p>
        </div>

        {/* WhatsApp Integration Box */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg">
                💬
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono">WhatsApp Business API</h4>
                <p className="text-[11px] text-slate-500 font-medium">Guest messaging channel status</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected & Authorized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                WhatsApp Registered Phone Number
              </label>
              <input
                type="text"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#6D4AFF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Meta Business API Authorization Token
              </label>
              <input
                type="password"
                value={waToken}
                onChange={(e) => setWaToken(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#6D4AFF]"
              />
            </div>
          </div>
        </div>

        {/* Email Integration Box */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-lg">
                ✉️
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono">Email Dispatch Server</h4>
                <p className="text-[11px] text-slate-500 font-medium">Guest confirmation & alert emails</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Active Dispatcher
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Sender Email Address
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#6D4AFF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                SMTP Dispatch Host
              </label>
              <input
                type="text"
                value={smtpServer}
                onChange={(e) => setSmtpServer(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#6D4AFF]"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SUB-PANEL: INTEGRATIONS (WhatsApp, Email, Mews) ---
const IntegrationsPanel = () => {
  const waWebhookUrl = `${API_BASE_URL}/api/webhooks/whatsapp`;
  const emailWebhookUrl = `${API_BASE_URL}/api/webhooks/email`;
  const mewsWebhookUrl = `${API_BASE_URL}/api/webhooks/mews`;

  const [hotel, setHotel] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [emailForm, setEmailForm] = useState({
    smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '',
    imapHost: '', imapPort: 993, imapUser: '', imapPass: ''
  });
  const [waForm, setWaForm] = useState({
    whatsappPhoneId: '', whatsappApiKey: '', whatsappAppSecret: '', whatsappVerifyToken: ''
  });
  const [mewsForm, setMewsForm] = useState({
    pmsBaseUrl: '', pmsApiKey: '', pmsSecret: ''
  });

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hotels/settings`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('autopilot_token')}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const h = data.data;
          setHotel(h);
          setEmailForm({
            smtpHost: h.smtpHost || '',
            smtpPort: h.smtpPort || 587,
            smtpUser: h.smtpUser || h.hotelEmail || '',
            smtpPass: '',
            imapHost: h.imapHost || '',
            imapPort: h.imapPort || 993,
            imapUser: h.smtpUser || h.hotelEmail || '',
            imapPass: ''
          });
          setWaForm({
            whatsappPhoneId: h.whatsappPhoneId || '',
            whatsappApiKey: '',
            whatsappAppSecret: '',
            whatsappVerifyToken: h.whatsappVerifyToken || ''
          });
          setMewsForm({
            pmsBaseUrl: h.pmsBaseUrl || 'https://api.mews-demo.com/api/connector/v1',
            pmsApiKey: h.pmsApiKey || '',
            pmsSecret: ''
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const hotelId = hotel?.id;
      if (!hotelId) throw new Error('Hotel not loaded');
      const res = await fetch(`${API_BASE_URL}/api/email-integrations/${hotelId}/imap-smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('autopilot_token')}`
        },
        body: JSON.stringify({
          mailboxEmail: emailForm.smtpUser,
          imapHost: emailForm.imapHost,
          imapPort: Number(emailForm.imapPort),
          imapSecure: Number(emailForm.imapPort) === 993,
          smtpHost: emailForm.smtpHost,
          smtpPort: Number(emailForm.smtpPort),
          smtpSecure: Number(emailForm.smtpPort) === 465,
          smtpUser: emailForm.smtpUser,
          smtpPass: emailForm.smtpPass || undefined
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Save failed');
      triggerToast('Email connection settings saved successfully!', 'success');
      setActiveModal(null);
    } catch (err) {
      triggerToast(err.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWhatsApp = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/hotels/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('autopilot_token')}`
        },
        body: JSON.stringify({
          whatsappPhoneId: waForm.whatsappPhoneId,
          whatsappApiKey: waForm.whatsappApiKey || undefined,
          whatsappAppSecret: waForm.whatsappAppSecret || undefined,
          whatsappVerifyToken: waForm.whatsappVerifyToken,
          whatsappConnected: true
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Save failed');
      triggerToast('WhatsApp credentials saved successfully!', 'success');
      setActiveModal(null);
    } catch (err) {
      triggerToast(err.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMews = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/hotels/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('autopilot_token')}`
        },
        body: JSON.stringify({
          pmsBaseUrl: mewsForm.pmsBaseUrl,
          pmsApiKey: mewsForm.pmsApiKey || undefined,
          pmsSecret: mewsForm.pmsSecret || undefined,
          pmsConnected: true
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Save failed');
      triggerToast('Mews PMS credentials saved successfully!', 'success');
      setActiveModal(null);
    } catch (err) {
      triggerToast(err.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const CopyInput = ({ label, value }) => (
    <div className="space-y-1">
      <p className="text-[9px] font-black uppercase tracking-widest text-[#7C3AED] font-mono">{label}</p>
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
        <input readOnly value={value} className="flex-1 bg-transparent text-[11px] text-slate-600 font-mono outline-none truncate" />
        <button type="button" onClick={() => { navigator.clipboard?.writeText(value); triggerToast('Copied!'); }} title="Copy" className="shrink-0 text-slate-400 hover:text-[#7C3AED] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
      </div>
    </div>
  );

  const FieldInput = ({ label, fkey, type = 'text', placeholder }) => (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block">{label}</label>
      <input
        type={type}
        value={emailForm[fkey] ?? ''}
        onChange={e => setEmailForm(prev => ({ ...prev, [fkey]: e.target.value }))}
        placeholder={placeholder || ''}
        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#7C3AED] font-mono transition"
      />
    </div>
  );

  const waActive = hotel?.whatsappConnected ?? true;
  const emailActive = hotel?.emailConnected ?? true;
  const mewsActive = hotel?.pmsConnected ?? true;
  const waAlert = hotel?.whatsappHealthStatus === 'expired' || hotel?.whatsappHealthStatus === 'invalid';

  const Card = ({ icon, tag, title, healthLabel, healthValue, handshakeOk, webhookLabel, webhookUrl, alertMsg, isActive, onConfigure }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className="p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-slate-100">{icon}</div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">{tag}</p>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">{title}</h3>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono shrink-0 border ${isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
      </div>
      <div className="px-5 pb-3 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500 font-medium">{healthLabel}</span>
          <span className="font-bold text-slate-800">{healthValue}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500 font-medium">Connection Handshake:</span>
          <span className={`font-bold ${handshakeOk ? 'text-emerald-600' : 'text-red-500'}`}>{handshakeOk ? '✓ Registered' : '✗ Not Registered'}</span>
        </div>
      </div>
      <div className="px-5 pb-4 space-y-1">
        <p className="text-[9px] font-black uppercase tracking-widest text-[#7C3AED] font-mono">{webhookLabel}</p>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <input readOnly value={webhookUrl} className="flex-1 bg-transparent text-[11px] text-slate-600 font-mono outline-none truncate" />
          <button type="button" onClick={() => { navigator.clipboard?.writeText(webhookUrl); triggerToast('Copied!'); }} className="shrink-0 text-slate-400 hover:text-[#7C3AED] transition-colors" title="Copy">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
        </div>
      </div>
      {alertMsg && (
        <div className="mx-5 mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
          <span className="text-base shrink-0">🔑</span>
          <div>
            <p className="text-[10px] font-black text-red-700 uppercase tracking-wider mb-0.5">ACCESS TOKEN EXPIRED / INVALID</p>
            <p className="text-[10px] text-red-600 leading-relaxed">{alertMsg}</p>
          </div>
        </div>
      )}
      <div className="flex-1" />
      <div className="flex border-t border-slate-100">
        <button type="button" onClick={onConfigure} className="flex-1 py-3 text-[10px] font-black text-white bg-slate-900 hover:bg-slate-800 transition-colors uppercase tracking-wider">CONFIGURE</button>
        <button type="button" onClick={onConfigure} className="flex-1 py-3 text-[10px] font-black text-slate-700 border-l border-slate-100 hover:bg-slate-50 transition-colors uppercase tracking-wider">RECONNECT</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] px-5 py-3 rounded-xl text-xs font-bold shadow-xl text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h2 className="text-base font-bold text-slate-900">Integrations &amp; Channels</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Live connection status. Paste webhook URLs directly into each platform's dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <Card
          icon="💬"
          tag="Official Meta Channel"
          title="WhatsApp Business API"
          healthLabel="Outbound Health Rate:"
          healthValue={hotel?.whatsappConnected ? "99.8% Healthy" : "Offline"}
          handshakeOk={waActive}
          webhookLabel="Webhook Endpoint"
          webhookUrl={waWebhookUrl}
          alertMsg={waAlert ? "Access Token is expired or invalid. Please generate a new token from Meta Developer Console → WhatsApp → API Setup." : null}
          isActive={waActive}
          onConfigure={() => setActiveModal('whatsapp')}
        />
        <Card
          icon="✉️"
          tag="SMTP Server Queue"
          title="SMTP Email Reservation Gateway"
          healthLabel="Outbound Health Rate:"
          healthValue={hotel?.emailConnected ? "100% Inbox Ready" : "Offline"}
          handshakeOk={emailActive}
          webhookLabel="Email Webhook Endpoint (Forward Target)"
          webhookUrl={emailWebhookUrl}
          alertMsg={null}
          isActive={emailActive}
          onConfigure={() => setActiveModal('email')}
        />
        <Card
          icon="🏨"
          tag="PMS Integration"
          title="Mews PMS"
          healthLabel="Sync Health:"
          healthValue={hotel?.pmsConnected ? "100% Synced" : "Not Connected"}
          handshakeOk={mewsActive}
          webhookLabel="Mews Webhook Endpoint"
          webhookUrl={mewsWebhookUrl}
          alertMsg={null}
          isActive={mewsActive}
          onConfigure={() => setActiveModal('mews')}
        />
      </div>

      {/* MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {activeModal === 'whatsapp' && (
              <form onSubmit={handleSaveWhatsApp} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">AUTHORIZATION SETTINGS</p>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">WhatsApp Business API Credentials</h3>
                  </div>
                  <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1 text-lg">✕</button>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-base shrink-0">🔒</span>
                  <div>
                    <p className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">OPERATOR SECURITY NOTICE</p>
                    <p className="text-[10px] text-indigo-600 mt-0.5 leading-relaxed">Credentials are encrypted with AES-256 and stored securely. Access tokens are obfuscated from all dispatch layers.</p>
                  </div>
                </div>

                {waAlert && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                    <span>🔑</span>
                    <div>
                      <p className="text-[10px] font-black text-red-700 uppercase tracking-wider">Access Token Expired / Invalid</p>
                      <p className="text-[10px] text-red-600 mt-0.5">Generate a new token from Meta Developer Console → WhatsApp → API Setup.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block">Meta Phone Number ID</label>
                    <input type="text" value={waForm.whatsappPhoneId} onChange={e => setWaForm(p => ({ ...p, whatsappPhoneId: e.target.value }))} placeholder="e.g. 1049283749283" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#7C3AED] font-mono transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block">Permanent Access Token</label>
                    <input type="password" value={waForm.whatsappApiKey} onChange={e => setWaForm(p => ({ ...p, whatsappApiKey: e.target.value }))} placeholder="••••••••••••••••••••••" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#7C3AED] font-mono transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block">Meta App Secret</label>
                    <input type="password" value={waForm.whatsappAppSecret} onChange={e => setWaForm(p => ({ ...p, whatsappAppSecret: e.target.value }))} placeholder="••••••••••••••••••••••" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#7C3AED] font-mono transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block">Webhook Verify Token</label>
                    <input type="text" value={waForm.whatsappVerifyToken} onChange={e => setWaForm(p => ({ ...p, whatsappVerifyToken: e.target.value }))} placeholder="Custom verify token" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#7C3AED] font-mono transition" />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#7C3AED] font-mono">Webhook Endpoint (paste into Meta Dashboard)</p>
                  <CopyInput label="" value={waWebhookUrl} />
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase hover:bg-slate-50 transition">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-black uppercase tracking-wider transition disabled:opacity-50">
                    {isSaving ? 'SAVING...' : 'SAVE CONNECTION SETTINGS'}
                  </button>
                </div>
              </form>
            )}

            {activeModal === 'mews' && (
              <form onSubmit={handleSaveMews} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">AUTHORIZATION SETTINGS</p>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">Mews PMS Connection Settings</h3>
                  </div>
                  <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1 text-lg">✕</button>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-base shrink-0">🔒</span>
                  <div>
                    <p className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">OPERATOR SECURITY NOTICE</p>
                    <p className="text-[10px] text-indigo-600 mt-0.5 leading-relaxed">Credentials are encrypted with AES-256 and stored securely. API tokens are obfuscated from all dispatch layers.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block">Mews API Base URL</label>
                    <input type="text" value={mewsForm.pmsBaseUrl} onChange={e => setMewsForm(p => ({ ...p, pmsBaseUrl: e.target.value }))} placeholder="https://api.mews.com/api/connector/v1" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#7C3AED] font-mono transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block">Mews Client Token</label>
                    <input type="password" value={mewsForm.pmsApiKey} onChange={e => setMewsForm(p => ({ ...p, pmsApiKey: e.target.value }))} placeholder="••••••••••••••••••••••" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#7C3AED] font-mono transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block">Mews Access Token</label>
                    <input type="password" value={mewsForm.pmsSecret} onChange={e => setMewsForm(p => ({ ...p, pmsSecret: e.target.value }))} placeholder="••••••••••••••••••••••" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#7C3AED] font-mono transition" />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#7C3AED] font-mono">Webhook Endpoint (paste into Mews Commander)</p>
                  <CopyInput label="" value={mewsWebhookUrl} />
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase hover:bg-slate-50 transition">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-black uppercase tracking-wider transition disabled:opacity-50">
                    {isSaving ? 'SAVING...' : 'SAVE CONNECTION SETTINGS'}
                  </button>
                </div>
              </form>
            )}


            {activeModal === 'email' && (
              <form onSubmit={handleSaveEmail} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">AUTHORIZATION SETTINGS</p>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">SMTP Email Reservation Gateway Handshake Settings</h3>
                  </div>
                  <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1 text-lg">✕</button>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-base shrink-0">🔒</span>
                  <div>
                    <p className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">OPERATOR SECURITY NOTICE</p>
                    <p className="text-[10px] text-indigo-600 mt-0.5 leading-relaxed">Security protocols authorize connections using dynamic AES-256 tokens. Private credentials are completely obfuscated from dispatch layers.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <FieldInput label="SMTP Host" fkey="smtpHost" placeholder="smtp.titan.email" />
                  <FieldInput label="SMTP Port" fkey="smtpPort" placeholder="587" />
                  <FieldInput label="SMTP User" fkey="smtpUser" placeholder="info@yourdomain.com" />
                  <FieldInput label="SMTP Password" fkey="smtpPass" type="password" placeholder="••••••••••••••••••••••" />
                  <FieldInput label="IMAP Host" fkey="imapHost" placeholder="imap.titan.email" />
                  <FieldInput label="IMAP Port" fkey="imapPort" placeholder="993" />
                  <FieldInput label="IMAP User" fkey="imapUser" placeholder="info@yourdomain.com" />
                  <FieldInput label="IMAP Password" fkey="imapPass" type="password" placeholder="••••••••••••••••••••••" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase hover:bg-slate-50 transition">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-black uppercase tracking-wider transition disabled:opacity-50">
                    {isSaving ? 'SAVING...' : 'SAVE CONNECTION SETTINGS'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};




  const allTabs = [
    {
      id: "profile",
      label: "Hotel Profile",
      icon: Building2,
    },
    {
      id: "users",
      label: "Users & Roles",
      icon: Users,
    },
    {
      id: "knowledge",
      label: "Knowledge Base",
      icon: Database,
    },
    {
      id: "connections",
      label: "Connections",
      icon: Link,
    },
    {
      id: "ai_behaviour",
      label: "AI Behaviour",
      icon: Bot,
    },
    {
      id: "subscription",
      label: "Subscription & Billing",
      icon: CreditCard,
    },
  ];

  const tabs = allTabs.filter(tab => !tab.superAdminOnly || role === ROLES.SUPER_ADMIN);

  const renderContent = (tabId) => {
    switch (tabId) {
      case "profile":
        return <HotelProfilePanel settings={settings} onChange={handleChange} />;
      case "users":
        return <UsersManagement />;
      case "knowledge":
        return <KnowledgePolicyPanel settings={settings} onChange={handleChange} />;
      case "connections":
        return <IntegrationsPanel />;
      case "ai_behaviour":
        return (
          <div className="space-y-6">
            <AIToneStylePanel settings={settings} onChange={handleChange} />
            <StaffAlertsPanel settings={settings} onChange={handleChange} />
          </div>
        );
      case "subscription":
        return <SubscriptionBilling />;
      default:
        return <HotelProfilePanel settings={settings} onChange={handleChange} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3 text-slate-400">
        <RefreshCw size={28} className="animate-spin text-[#105F39]" />
        <p className="text-xs font-semibold">Loading hotel configurations...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 h-full overflow-y-auto bg-[#F7F6F3] text-left font-sans text-slate-900">
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="space-y-1 text-left">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono block">SETTINGS</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight" style={{fontFamily: 'Georgia, serif'}}>Hotel Mercier</h1>
          <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
            Your property, your team, what the AI knows, what it is connected to, how much freedom it has and what you pay.
          </p>
        </div>

        {/* HORIZONTAL TABS */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 font-sans text-xs pb-2 border-b border-[#E7E4DD]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-bold transition-all cursor-pointer whitespace-nowrap border-b-2 -mb-[9px] pb-3 ${
                activeTab === tab.id
                  ? "text-[#105F39] border-[#105F39]"
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENT PANEL */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Settings;
