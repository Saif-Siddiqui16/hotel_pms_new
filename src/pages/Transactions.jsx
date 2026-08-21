import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MessageSquare, 
  Clock, 
  LayoutDashboard, 
  Bell, 
  Sparkles,
  Smartphone,
  Wrench,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
  TrendingUp,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Transactions = () => {
  const navigate = useNavigate();

  // Master State representing Upsell Offers matching the 1st Screenshot (14 items total)
  const [offers, setOffers] = useState([
    {
      id: '1',
      guestName: 'Elena Novak',
      room: '310',
      offerName: 'Romantic package (champagne, chocolates, 12:00 checkout)',
      value: 65.00,
      channel: 'WhatsApp',
      status: 'Accepted',
      date: 'Today 07:58'
    },
    {
      id: '2',
      guestName: 'Daniel Weiss',
      room: '212',
      offerName: 'Breakfast, 2 mornings',
      value: 26.00,
      channel: 'WhatsApp',
      status: 'Accepted',
      date: 'Today 08:14'
    },
    {
      id: '3',
      guestName: 'Grace Okonkwo',
      room: '401',
      offerName: 'Garage parking, 2 nights',
      value: 36.00,
      channel: 'Outlook',
      status: 'Accepted',
      date: 'Today 07:41'
    },
    {
      id: '4',
      guestName: 'Sofia Marchetti',
      room: '',
      offerName: 'Breakfast for 2, both mornings',
      value: 52.00,
      channel: 'WhatsApp',
      status: 'Sent',
      date: 'Today 09:47'
    },
    {
      id: '5',
      guestName: 'Sofia Marchetti',
      room: '',
      offerName: 'Private airport transfer',
      value: 68.00,
      channel: 'WhatsApp',
      status: 'Sent',
      date: 'Today 09:47'
    },
    {
      id: '6',
      guestName: 'Hendrik Vos',
      room: '205',
      offerName: 'Late checkout until 14:00',
      value: 35.00,
      channel: 'WhatsApp',
      status: 'Sent',
      date: 'Today 09:19'
    },
    {
      id: '7',
      guestName: 'Priya Raghavan',
      room: '208',
      offerName: 'Early check-in from 13:00',
      value: 30.00,
      channel: 'WhatsApp',
      status: 'Sent',
      date: 'Today 08:10'
    },
    {
      id: '8',
      guestName: 'Yuki Tanabe',
      room: '307',
      offerName: 'Airport transfer on departure',
      value: 68.00,
      channel: 'Gmail',
      status: 'Sent',
      date: 'Today 07:13'
    },
    {
      id: '9',
      guestName: 'Marta Cieślak',
      room: '121',
      offerName: 'Room upgrade to Junior Suite',
      value: 79.00,
      channel: 'WhatsApp',
      status: 'Accepted',
      date: 'Today 06:52'
    },
    {
      id: '10',
      guestName: 'Tomás Ferreira',
      room: '409',
      offerName: 'Bicycle rental, 2 days',
      value: 24.00,
      channel: 'WhatsApp',
      status: 'Accepted',
      date: 'Today 08:36'
    },
    {
      id: '11',
      guestName: 'Anke Willems',
      room: '118',
      offerName: 'Late checkout until 14:00',
      value: 35.00,
      channel: 'Email',
      status: 'Declined',
      date: 'Today 07:20'
    },
    {
      id: '12',
      guestName: 'Ruben Claes',
      room: '',
      offerName: 'Restaurant reservation — De Kleine Zavel',
      value: 0, // represented as "—"
      channel: 'WhatsApp',
      status: 'Accepted',
      date: 'Today 09:02'
    },
    {
      id: '13',
      guestName: 'Ingrid Sørensen',
      room: '405',
      offerName: 'Extra bed',
      value: 45.00,
      channel: 'Gmail',
      status: 'Expired',
      date: 'Yesterday 19:04'
    },
    {
      id: '14',
      guestName: 'Marta Cieślak',
      room: '121',
      offerName: 'Breakfast, 1 morning',
      value: 13.00,
      channel: 'WhatsApp',
      status: 'Accepted',
      date: 'Today 06:53'
    }
  ]);

  // Operational Filter state
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'accepted', 'sent', 'declined', 'expired'

  // Calculate live metric totals
  const totalRevenue = offers
    .filter(o => o.status === 'Accepted')
    .reduce((sum, o) => sum + o.value, 0);

  const offersSentCount = offers.length;
  const offersAcceptedCount = offers.filter(o => o.status === 'Accepted').length;
  const conversionRate = Math.round((offersAcceptedCount / offersSentCount) * 100);

  // Toggle state to accepted when clicked to show interactivity
  const handleToggleOfferStatus = (id) => {
    setOffers(prev => prev.map(o => {
      if (o.id === id) {
        const nextStatus = o.status === 'Sent' ? 'Accepted' : 'Sent';
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  // Filter offers list based on active filter
  const getFilteredOffers = () => {
    if (activeFilter === 'all') return offers;
    return offers.filter(o => o.status.toLowerCase() === activeFilter.toLowerCase());
  };

  return (
    <div id="upsells-log-content" className="w-full flex-1 min-h-screen bg-[#F7F6F3] p-8 space-y-8 select-none text-left font-sans">
      <style>{`
        #upsells-log-content,
        #upsells-log-content h1,
        #upsells-log-content h2,
        #upsells-log-content h3,
        #upsells-log-content h4,
        #upsells-log-content .serif-font {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
      `}</style>

      {/* Top Header Section */}
      <div className="text-left space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap font-sans text-slate-500 text-xs">
          <span>Hotel Mercier</span>
          <span>•</span>
          <span>Antwerp · 48 rooms</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono block">UPSELLS</span>
            <h2 className="text-2.5xl font-bold text-slate-950 tracking-tight font-serif">Offers the AI made in conversation</h2>
            <p className="text-xs text-slate-500 max-w-2xl font-medium leading-relaxed font-sans">
              Only offers from your own priced catalogue, made when the guest gave the AI a reason to make them.
            </p>
          </div>
        </div>
      </div>

      {/* 4 KPI Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[110px] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">Total upsell revenue</span>
          <div className="mt-2 space-y-1">
            <span className="text-2.5xl font-bold text-slate-900 leading-none block font-serif serif-font">€{totalRevenue.toFixed(2)}</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block leading-none">accepted, today</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[110px] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-505 uppercase tracking-wider leading-none">Offers sent</span>
          <div className="mt-2 space-y-1">
            <span className="text-2.5xl font-bold text-slate-900 leading-none block font-serif serif-font">{offersSentCount}</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block leading-none">across WhatsApp and email</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[110px] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-505 uppercase tracking-wider leading-none">Offers accepted</span>
          <div className="mt-2 space-y-1">
            <span className="text-2.5xl font-bold text-slate-900 leading-none block font-serif serif-font">{offersAcceptedCount}</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block leading-none">guest said yes</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left relative min-h-[110px] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-505 uppercase tracking-wider leading-none">Conversion rate</span>
          <div className="mt-2 space-y-1">
            <span className="text-2.5xl font-bold text-slate-900 leading-none block font-serif serif-font">{conversionRate}%</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block leading-none">of everything offered</span>
          </div>
        </div>

      </div>

      {/* Filter pills row */}
      <div className="flex flex-wrap gap-2 select-none font-sans text-xs">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            activeFilter === 'all' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-55'
          }`}
        >
          All <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${activeFilter === 'all' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{offers.length}</span>
        </button>
        <button 
          onClick={() => setActiveFilter('accepted')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            activeFilter === 'accepted' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-55'
          }`}
        >
          Accepted <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${activeFilter === 'accepted' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{offers.filter(o => o.status === 'Accepted').length}</span>
        </button>
        <button 
          onClick={() => setActiveFilter('sent')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            activeFilter === 'sent' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-55'
          }`}
        >
          Sent <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${activeFilter === 'sent' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{offers.filter(o => o.status === 'Sent').length}</span>
        </button>
        <button 
          onClick={() => setActiveFilter('declined')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            activeFilter === 'declined' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-55'
          }`}
        >
          Declined <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${activeFilter === 'declined' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{offers.filter(o => o.status === 'Declined').length}</span>
        </button>
        <button 
          onClick={() => setActiveFilter('expired')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            activeFilter === 'expired' ? 'bg-[#105F39] text-white shadow-xs' : 'bg-white border border-[#E7E4DD] text-slate-650 hover:bg-slate-55'
          }`}
        >
          Expired <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 font-mono ml-0.5 ${activeFilter === 'expired' ? 'bg-[#0b4227] text-white' : 'bg-slate-150 text-slate-600'}`}>{offers.filter(o => o.status === 'Expired').length}</span>
        </button>
      </div>

      {/* Main split layout container grid */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Table List */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-[#E7E4DD] rounded-[24px] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-650 font-sans">
              <thead>
                <tr className="bg-slate-50/60 border-b border-[#E7E4DD] text-slate-450 uppercase text-[9px] font-extrabold tracking-wider">
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Offer</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getFilteredOffers().map((offer) => {
                  const isAccepted = offer.status === 'Accepted';
                  const isSent = offer.status === 'Sent';
                  const isDeclined = offer.status === 'Declined';
                  const isExpired = offer.status === 'Expired';

                  let statusClass = 'bg-slate-50 text-slate-600 border-slate-200/50';
                  if (isAccepted) statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
                  else if (isSent) statusClass = 'bg-amber-50 text-amber-700 border-amber-200/50';
                  else if (isDeclined || isExpired) statusClass = 'bg-slate-100 text-slate-500 border-slate-200/60';

                  const channelIcon = offer.channel === 'WhatsApp' ? '💬' : offer.channel === 'Outlook' ? '✉️' : '✉️';

                  return (
                    <tr key={offer.id} className="hover:bg-slate-50/20 transition-colors">
                      {/* Guest name */}
                      <td className="px-6 py-4.5 align-middle">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">{offer.guestName}</p>
                          {offer.room && (
                            <p className="text-[10px] text-slate-400 font-bold font-mono">Room {offer.room}</p>
                          )}
                        </div>
                      </td>

                      {/* Offer Description */}
                      <td className="px-6 py-4.5 align-middle max-w-[240px]">
                        <p className="font-medium text-slate-700 leading-normal">{offer.offerName}</p>
                      </td>

                      {/* Value */}
                      <td className="px-6 py-4.5 align-middle">
                        <p className="font-bold text-slate-900 font-mono">
                          {offer.value > 0 ? `€${offer.value.toFixed(2)}` : '—'}
                        </p>
                      </td>

                      {/* Channel */}
                      <td className="px-6 py-4.5 align-middle text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <span>{channelIcon}</span>
                          <span>{offer.channel}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4.5 align-middle cursor-pointer" onClick={() => handleToggleOfferStatus(offer.id)}>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-wider font-mono ${statusClass}`}>
                          <span className={`w-1 h-1 rounded-full ${isAccepted ? 'bg-emerald-500' : isSent ? 'bg-amber-500' : 'bg-slate-400'}`} />
                          {offer.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4.5 align-middle text-slate-400 font-bold font-mono text-[10px]">
                        {offer.date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Insight panels */}
        <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col justify-start">
          
          {/* Chart Card */}
          <div className="bg-white border border-[#E7E4DD] rounded-[24px] p-6 shadow-xs text-left space-y-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">This week</h3>
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Accepted upsell revenue</p>
            </div>
            
            {/* CSS trendline graph */}
            <div className="pt-2">
              <svg viewBox="0 0 300 80" className="w-full h-16 text-[#105F39]">
                <path
                  d="M 10 60 L 50 55 L 90 35 L 130 50 L 170 20 L 210 30 L 250 15 L 290 35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="170" cy="20" r="3.5" className="fill-[#105F39]" />
              </svg>
            </div>

            <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase font-mono border-t border-slate-100 pt-2.5">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <p className="text-xs font-semibold text-slate-700 leading-normal pt-1">
              €2,148.75 accepted over the last seven days.
            </p>
          </div>

          {/* Best performing offers List */}
          <div className="bg-white border border-[#E7E4DD] rounded-[24px] p-6 shadow-xs text-left space-y-4 font-sans">
            <h3 className="text-sm font-bold text-slate-900">Best performing offers</h3>
            
            <div className="space-y-3.5 divide-y divide-slate-100 text-xs font-semibold text-slate-650">
              <div className="flex justify-between items-center pt-3.5 first:pt-0">
                <span className="text-slate-800">Room upgrade to Junior Suite</span>
                <span className="font-bold text-slate-900 font-mono">€79.00</span>
              </div>
              <div className="flex justify-between items-center pt-3.5">
                <span className="text-slate-800">Romantic package</span>
                <span className="font-bold text-slate-900 font-mono">€65.00</span>
              </div>
              <div className="flex justify-between items-center pt-3.5">
                <span className="text-slate-800">Garage parking, 2 nights</span>
                <span className="font-bold text-slate-900 font-mono">€36.00</span>
              </div>
              <div className="flex justify-between items-center pt-3.5">
                <span className="text-slate-800">Breakfast, 2 mornings</span>
                <span className="font-bold text-slate-900 font-mono">€26.00</span>
              </div>
              <div className="flex justify-between items-center pt-3.5">
                <span className="text-slate-800">Bicycle rental, 2 days</span>
                <span className="font-bold text-slate-900 font-mono">€24.00</span>
              </div>
            </div>
          </div>

          {/* How it works info box */}
          <div className="bg-[#FAF9F6] border border-[#E7E4DD] rounded-[24px] p-6 text-left space-y-3 font-sans">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">How it works</h4>
            <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
              The AI only offers what is in your upsell catalogue, at your prices, and only when the guest has given it a reason — a late train, a long flight, an anniversary. Nothing is charged until a colleague confirms it in the PMS.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Transactions;
