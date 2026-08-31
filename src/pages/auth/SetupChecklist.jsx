import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const SetupChecklist = () => {
  const navigate = useNavigate();

  const STEPS = [
    { id: 1, title: 'Hotel Profile', desc: 'The facts the AI treats as certain' },
    { id: 2, title: 'Connect PMS', desc: 'Read availability, rates and arrivals' },
    { id: 3, title: 'Connect Email', desc: 'Where guest email arrives' },
    { id: 4, title: 'Connect Guest WhatsApp', desc: 'The number guests already write to' },
    { id: 5, title: 'Connect Internal WhatsApp', desc: 'How departments work from a phone' },
    { id: 6, title: 'Upload Knowledge Base', desc: 'What the AI answers from', optional: true },
    { id: 7, title: 'Invite Users', desc: 'Your team and what they see', optional: true },
    { id: 8, title: 'Configure AI Behaviour', desc: 'How much freedom the AI has' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans selection:bg-[#204033] selection:text-white pb-16">
      
      {/* Header */}
      <header className="px-8 py-5 border-b border-[#eee] bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#204033] rounded-md">
            <span className="font-serif font-semibold text-white text-sm">H|</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#1a1a1a] font-semibold text-[15px] leading-tight tracking-tight">Setting up Hotel Mercier</span>
            <span className="text-[#888] text-[12px] font-medium mt-0.5">0 of 8 steps done</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress Bar */}
          <div className="w-32 h-1.5 bg-[#eee] rounded-full overflow-hidden hidden sm:block">
            <div className="w-[10%] h-full bg-[#ccc] rounded-full" />
          </div>
          
          {/* Finish Button */}
          <button 
            onClick={() => navigate('/app')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#ddd] hover:border-[#aaa] text-[#1a1a1a] rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            Finish
            <ArrowRight size={14} className="opacity-70" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto px-6 pt-12">
        <h1 className="text-[32px] font-serif font-semibold text-[#1a1a1a] mb-3">
          Your setup checklist
        </h1>
        <p className="text-[#666] text-[15px] mb-10 max-w-2xl leading-relaxed">
          Open a step to set it up. Connections sign you in with the provider and we configure the technical side — you only ever see whether it is healthy.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {STEPS.map((step) => (
            <button 
              key={step.id}
              className="flex items-center p-5 bg-white border border-[#eee] hover:border-[#ddd] hover:shadow-sm rounded-xl transition-all text-left group"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#eee] bg-[#fafafa] flex items-center justify-center text-[#888] text-[13px] font-medium mr-4">
                {step.id}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[#1a1a1a] font-semibold text-[15px]">{step.title}</h3>
                  {step.optional && (
                    <span className="px-2 py-0.5 bg-[#f5f5f5] text-[#666] text-[10px] font-semibold rounded-full border border-[#eee]">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-[#888] text-[13px] group-hover:text-[#666] transition-colors">{step.desc}</p>
              </div>

              <div className="flex-shrink-0 ml-4 text-[#ccc] group-hover:text-[#888] transition-colors">
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="flex gap-3 max-w-2xl">
          <Sparkles size={18} className="text-[#8ea499] flex-shrink-0 mt-0.5" />
          <p className="text-[#888] text-[13px] leading-relaxed">
            Hotelogx Connect reads reservations, availability and rates from your PMS. It never creates, changes or cancels a booking and never takes payment — availability questions always finish on your own booking engine.
          </p>
        </div>
      </main>

    </div>
  );
};

export default SetupChecklist;
