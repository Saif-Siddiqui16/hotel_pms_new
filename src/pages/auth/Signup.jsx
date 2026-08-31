import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const navigate = useNavigate();
  const [whatsappUsage, setWhatsappUsage] = useState('separate');

  const STEPS = [
    { id: 1, title: 'Hotel Profile', desc: 'The facts the AI treats as certain' },
    { id: 2, title: 'Connect PMS', desc: 'Read availability, rates and arrivals' },
    { id: 3, title: 'Connect Email', desc: 'Where guest email arrives' },
    { id: 4, title: 'Connect Guest WhatsApp', desc: 'The number guests already write to' },
    { id: 5, title: 'Connect Internal WhatsApp', desc: 'How departments work from a phone' },
    { id: 6, title: 'Upload Knowledge Base', desc: 'What the AI answers from' },
    { id: 7, title: 'Invite Users', desc: 'Your team and what they see' },
    { id: 8, title: 'Configure AI Behaviour', desc: 'How much freedom the AI has' },
  ];

  const WHATSAPP_OPTIONS = [
    { id: 'separate', title: 'Separate guest and staff numbers', desc: 'Guests write to one number, departments work from another' },
    { id: 'shared', title: 'One number for both', desc: 'Guests and staff share a single business number' },
    { id: 'guest_only', title: 'Guest WhatsApp only', desc: 'Departments will work from the dashboard instead' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center py-16 px-6 font-sans selection:bg-[#204033] selection:text-white overflow-y-auto">
      
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 flex items-center justify-center bg-[#204033] rounded-md">
          <span className="font-serif font-semibold text-white text-sm">H|</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-medium leading-none tracking-wide text-[#1a1a1a]">Hotelogx</span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#8ea499] uppercase mt-0.5">Connect</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h1 className="text-4xl font-serif font-semibold text-[#1a1a1a] mb-4">
            Welcome to Hotelogx Connect
          </h1>
          <p className="text-[#666] text-[15px] leading-relaxed">
            Eight steps and Hotel Mercier is live. Most of them take a minute — you pick the provider, sign in once, and we configure the rest on our side. You can skip anything and come back to it under Settings.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-16">
          {STEPS.map((step) => (
            <div key={step.id} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-[#ddd] flex items-center justify-center text-[#888] text-xs font-medium mt-0.5">
                {step.id}
              </div>
              <div>
                <h3 className="text-[#1a1a1a] font-semibold text-[15px] mb-0.5">{step.title}</h3>
                <p className="text-[#888] text-[13px]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Question Card */}
        <div className="bg-white border border-[#eee] rounded-2xl p-8 mb-8 shadow-sm">
          <p className="text-[#888] text-[10px] font-bold tracking-widest uppercase mb-2">ONE QUESTION BEFORE WE START</p>
          <h3 className="text-[#1a1a1a] font-semibold text-[15px] mb-1">How does your hotel use WhatsApp?</h3>
          <p className="text-[#666] text-[14px] mb-6">
            Guests and staff can share a number, but most hotels keep them apart so operations chatter never reaches a guest.
          </p>

          <div className="space-y-3">
            {WHATSAPP_OPTIONS.map((option) => (
              <label 
                key={option.id}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  whatsappUsage === option.id 
                    ? 'border-[#204033] bg-[#f4f7f5]' 
                    : 'border-[#eee] hover:border-[#ddd] bg-white'
                }`}
              >
                <div className="mt-1 relative flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="whatsappUsage"
                    value={option.id}
                    checked={whatsappUsage === option.id}
                    onChange={() => setWhatsappUsage(option.id)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    whatsappUsage === option.id ? 'border-[#204033]' : 'border-[#ccc]'
                  }`}>
                    {whatsappUsage === option.id && (
                      <div className="w-2 h-2 rounded-full bg-[#204033]" />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className={`font-medium text-[14px] ${whatsappUsage === option.id ? 'text-[#1a1a1a]' : 'text-[#444]'}`}>
                    {option.title}
                  </h4>
                  <p className={`text-[13px] ${whatsappUsage === option.id ? 'text-[#555]' : 'text-[#888]'}`}>
                    {option.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Area */}
        <div>
          <button 
            onClick={() => navigate('/setup')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#204033] hover:bg-[#162e24] text-white rounded-lg text-sm font-medium transition-all shadow-sm mb-4"
          >
            Start setup
            <ArrowRight size={16} className="opacity-80" />
          </button>
          
          <p className="text-[#999] text-[12px]">
            Nothing is charged during setup, and no reservation is ever touched.
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default Signup;
