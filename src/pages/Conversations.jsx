import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bot,
  User,
  Send,
  Calendar,
  Smartphone,
  Mail,
  Zap,
  CheckCircle2,
  X,
  Plus,
  Clock,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Info,
  RefreshCw,
  AlertCircle,
  Phone,
  PhoneCall,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  UserPlus,
  LayoutDashboard,
  Bell,
  LogOut,
  Globe,
  Building2,
  Sparkles,
  CheckCircle,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useApp, ROLES } from '../context/AppContext';

const initialConversations = [
  {
    id: 'conv-sarah-45874',
    guest: 'Sarah Johnson',
    lastMsg: 'Can I check in earlier?',
    time: '10:14 AM',
    mode: 'AI',
    channel: 'whatsapp',
    room: 'Deluxe King',
    status: 'VIP Guest',
    stay: '29 July - 31 July',
    confidence: '98%',
    bookingNo: '#45874',
    arrival: '29 July',
    departure: '31 July',
    guestsCount: 2,
    isVip: true,
    messages: [
      { id: 'm-1', sender: 'guest', text: 'Can I check in earlier?', time: '10:14 AM' },
      { id: 'm-2', sender: 'ai', text: 'Yes.\nYour room is expected to be ready around 12:30.\n\nAn early check-in can be arranged for €20.\n\nWould you like me to add this?', time: '10:15 AM' }
    ]
  }
];

const frontOfficeConversationsList = [
  {
    id: 'clara-bertrand',
    name: 'Clara Bertrand',
    lastMsg: 'Either we change room or I would expect the second night to be reduced. Can I speak wit...',
    time: '09:52',
    tag: 'Escalated 302',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-100',
    unreadCount: 2,
    room: '302',
    status: 'In House',
    stay: '16 Aug → 19 Aug',
    nights: '3 • 2A 0C',
    category: 'Deluxe King',
    rate: '€189 / night',
    bookingNo: 'MRC-48219',
    lang: 'France • speaks French • 2 previous stays',
    tags: ['Quiet room', 'Late riser'],
    messages: [
      { sender: 'guest', text: 'Either we change room or I would expect the second night to be reduced. Can I speak with a manager?', time: '08:31', channel: 'WhatsApp' }
    ],
    aiDraft: 'Madame Bertrand, I am very sorry the room is still warm. Our technician is working on the unit now. I can move you to room 310, a Junior Suite on the fourth floor, which is ready now. We will also apply a 20% discount to your second night to make up for the discomfort. Would you like to proceed with the room move?',
    aiSummary: "Third message about the air conditioning in 302 not cooling. Guest is highly frustrated, mentions she slept poorly. Housekeeping confirmed it's blowing room-temp air. Maintenance technician Milan Novák is assigned but waiting on parts."
  },
  {
    id: 'sofia-marchetti',
    name: 'Sofia Marchetti',
    lastMsg: 'AI: Breakfast is served 07:00–10:30 on weekdays and until 11:00 at weekends, in the...',
    time: '09:47',
    tag: 'AI handling',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-100',
    unreadCount: 0,
    room: 'Deluxe Suite',
    status: 'Confirmed',
    stay: '24 Aug → 28 Aug',
    nights: '4 • 2A 0C',
    category: 'Deluxe Suite',
    rate: '€245 / night',
    bookingNo: 'MRC-48332',
    lang: 'Italy • speaks English & Italian',
    tags: ['High floor', 'Anniversary'],
    messages: [
      { sender: 'guest', text: 'What time is breakfast served?', time: '09:46', channel: 'WhatsApp' },
      { sender: 'ai', text: 'AI: Breakfast is served 07:00–10:30 on weekdays and until 11:05 at weekends, in the main restaurant.', time: '09:47', channel: 'WhatsApp' }
    ],
    aiDraft: 'Breakfast is served in the Restaurant Mercier located on the ground floor. Let me know if you would like me to book a table for dinner.',
    aiSummary: "Guest asked about breakfast hours. AI answered correctly. No further action needed."
  },
  {
    id: 'hendrik-vos',
    name: 'Hendrik Vos',
    lastMsg: 'Let\'s see if 15:00 works first, thank you.',
    time: '09:21',
    tag: 'AI handling 205',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-105',
    unreadCount: 1,
    room: '205',
    status: 'In House',
    stay: '19 Aug → 21 Aug',
    nights: '2 • 1A 0C',
    category: 'Standard Queen',
    rate: '€135 / night',
    bookingNo: 'MRC-48110',
    lang: 'Netherlands • speaks Dutch & English',
    tags: ['Late checkout requested'],
    messages: [
      { sender: 'guest', text: 'Let\'s see if 15:00 works first, thank you.', time: '09:21', channel: 'WhatsApp' }
    ],
    aiDraft: 'I have checked our availability and we can confirm a late checkout at 15:00 for a fee of €30. Would you like me to process this?',
    aiSummary: "Guest wants to confirm 15:00 checkout. Housekeeping says okay. Wait for guest response."
  },
  {
    id: 'nadia-haddad',
    name: 'Nadia Haddad',
    lastMsg: 'AI: Dear Madame Haddad, thank you for your message. Billing questions are reviewed by...',
    time: '08:05',
    tag: 'Escalated 411',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-100',
    unreadCount: 1,
    room: '411',
    status: 'Departed',
    stay: '17 Aug → 21 Aug',
    nights: '4 • 2A 0C',
    category: 'Superior King',
    rate: '€165 / night',
    bookingNo: 'MRC-48092',
    lang: 'Belgium • speaks French & English',
    tags: ['Escalated billing issue'],
    messages: [
      { sender: 'guest', text: 'Why was I charged €47.60 extra on my bill? I think this is duplicate city tax and minibar charges.', time: '08:04', channel: 'Email' },
      { sender: 'ai', text: 'AI: Dear Madame Haddad, thank you for your message. Billing questions are reviewed by our finance team, and we will get back to you shortly.', time: '08:05', channel: 'Email' }
    ],
    aiDraft: 'Dear Madame Haddad, I have reviewed your invoice and found a duplicate minibar charge of €36.80 and city tax mismatch of €10.85. I have processed a refund of €47.65 to your card. We apologize for the error.',
    aiSummary: "Guest disputed extra charge of €47.60. AI sent acknowledgment. Shift leader needs to approve refund."
  },
  {
    id: 'grace-okonkwo',
    name: 'Grace Okonkwo',
    lastMsg: 'AI: Good morning Grace, Check-in is from 15:00, but I have marked your arrival as 13:00...',
    time: '07:44',
    tag: 'AI handling 401',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-100',
    unreadCount: 0,
    room: '401',
    status: 'Expected Today',
    stay: '21 Aug → 25 Aug',
    nights: '4 • 1A 0C',
    category: 'Superior King',
    rate: '€175 / night',
    bookingNo: 'MRC-48350',
    lang: 'United Kingdom • speaks English',
    tags: ['Early arrival requested'],
    messages: [
      { sender: 'guest', text: 'Can I check in early at 13:00 today?', time: '07:43', channel: 'WhatsApp' },
      { sender: 'ai', text: 'AI: Good morning Grace, Check-in is from 15:00, but I have marked your arrival as 13:00 and we will try our best to have it ready.', time: '07:44', channel: 'WhatsApp' }
    ],
    aiDraft: 'Great news! Your room 401 has been inspected and is ready for early check-in now. You can check in at the reception.',
    aiSummary: "Guest requested 13:00 early check-in. Room 401 has been inspected by housekeeping and is ready."
  },
  {
    id: 'daniel-weiss',
    name: 'Daniel Weiss',
    lastMsg: 'AI: Ihre Handtücher wurden gebracht. Melden Sie sich gern, wenn Sie noch etwas...',
    time: '09:03',
    tag: 'Resolved 212',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    unreadCount: 0,
    room: '212',
    status: 'In House',
    stay: '20 Aug → 22 Aug',
    nights: '2 • 2A 0C',
    category: 'Standard Queen',
    rate: '€140 / night',
    bookingNo: 'MRC-48299',
    lang: 'Germany • speaks German & English',
    tags: ['Towel request resolved'],
    messages: [
      { sender: 'guest', text: 'Can we get extra towels in room 212?', time: '09:01', channel: 'WhatsApp' },
      { sender: 'ai', text: 'AI: Ihre Handtücher wurden gebracht. Melden Sie sich gern, wenn Sie noch etwas benötigen.', time: '09:03', channel: 'WhatsApp' }
    ],
    aiDraft: 'The towels have been delivered. Let us know if you need anything else.',
    aiSummary: "Guest requested extra towels. Housekeeping delivered them. Marked as resolved."
  },
  {
    id: 'yuki-tanabe',
    name: 'Yuki Tanabe',
    lastMsg: 'Amélie Duprez: Taking this one — I\'ll call De Kleine Zavel when they open at 11:00 and...',
    time: '08:26',
    tag: 'Human takeover 307',
    tagColor: 'bg-teal-50 text-teal-700 border-teal-100',
    unreadCount: 0,
    room: '307',
    status: 'Expected Today',
    stay: '21 Aug → 24 Aug',
    nights: '3 • 2A 0C',
    category: 'Deluxe King',
    rate: '€195 / night',
    bookingNo: 'MRC-48354',
    lang: 'Japan • speaks Japanese & English',
    tags: ['VIP Guest', 'Anniversary package'],
    messages: [
      { sender: 'guest', text: 'Could you recommend a good local restaurant for dinner tonight? Maybe De Kleine Zavel?', time: '08:22', channel: 'WhatsApp' },
      { sender: 'ai', text: 'Amélie Duprez: Taking this one — I\'ll call De Kleine Zavel when they open at 11:00 and book a table for you.', time: '08:26', channel: 'WhatsApp' }
    ],
    aiDraft: 'Dear Yuki, I have booked a table for you at De Kleine Zavel for tonight at 20:00. The reservation is under Tanabe. Have a wonderful dinner!',
    aiSummary: "Guest asked for restaurant recommendation. Amélie took over to book De Kleine Zavel."
  },
  {
    id: 'priya-raghavan',
    name: 'Priya Raghavan',
    lastMsg: 'AI: Hello Priya. Yes — a cot is free of charge for children under two and I have asked...',
    time: '08:11',
    tag: 'AI handling 208',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-100',
    unreadCount: 0,
    room: '208',
    status: 'Expected Today',
    stay: '21 Aug → 28 Aug',
    nights: '7 • 2A 1C',
    category: 'Standard Queen',
    rate: '€140 / night',
    bookingNo: 'MRC-48348',
    lang: 'India • speaks English & Tamil',
    tags: ['Baby cot request'],
    messages: [
      { sender: 'guest', text: 'Do you charge extra for a baby cot?', time: '08:10', channel: 'WhatsApp' },
      { sender: 'ai', text: 'AI: Hello Priya. Yes — a cot is free of charge for children under two and I have asked housekeeping to place it in room 208.', time: '08:11', channel: 'WhatsApp' }
    ],
    aiDraft: 'A baby cot is free of charge. I have confirmed it is placed in your room 208 for your arrival.',
    aiSummary: "Guest asked about baby cot charges. AI confirmed free cot and notified housekeeping."
  },
  {
    id: 'lars-bakke',
    name: 'Lars Bakke',
    lastMsg: 'AI: Hello Lars, Good news — our housekeeping log has a black 65W charger...',
    time: 'yesterday 18:32',
    tag: 'AI handling 115',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-100',
    unreadCount: 0,
    room: '115',
    status: 'Departed',
    stay: '18 Aug → 20 Aug',
    nights: '2 • 1A 0C',
    category: 'Standard Single',
    rate: '€95 / night',
    bookingNo: 'MRC-48190',
    lang: 'Norway • speaks Norwegian & English',
    tags: ['Lost item found'],
    messages: [
      { sender: 'guest', text: 'I think I left my laptop charger in room 115 yesterday. Did anyone find it?', time: 'yesterday 18:30', channel: 'Email' },
      { sender: 'ai', text: 'AI: Hello Lars, Good news — our housekeeping log has a black 65W charger found in room 115. We can ship it to your home address if you like.', time: 'yesterday 18:32', channel: 'Email' }
    ],
    aiDraft: 'We have your charger safely stored. Please send us your address so we can calculate shipping costs.',
    aiSummary: "Guest lost laptop charger. Housekeeping confirmed it was found. Wait for guest shipping address."
  },
  {
    id: 'elena-novak',
    name: 'Elena Novak',
    lastMsg: 'AI: Lovely — it will be in the room by 18:00 and €65 is added to your folio. Enjoy your evening.',
    time: '07:58',
    tag: 'Resolved 318',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    unreadCount: 0,
    room: '318',
    status: 'In House',
    stay: '20 Aug → 23 Aug',
    nights: '3 • 2A 0C',
    category: 'Superior King',
    rate: '€170 / night',
    bookingNo: 'MRC-48301',
    lang: 'Croatia • speaks Croatian & English',
    tags: ['Minibar purchase resolved'],
    messages: [
      { sender: 'guest', text: 'Can you send up a bottle of champagne to room 318 tonight?', time: '07:56', channel: 'WhatsApp' },
      { sender: 'ai', text: 'AI: Lovely — it will be in the room by 18:00 and €65 is added to your folio. Enjoy your evening.', time: '07:58', channel: 'WhatsApp' }
    ],
    aiDraft: 'Champagne has been charged and delivered. Let us know if you need anything else.',
    aiSummary: "Guest requested champagne. AI processed charge to folio and notified room service. Delivered."
  }
];

const FrontOfficeConversationsView = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useApp();
  const logoutUser = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'ai', 'human'
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState('reply'); // 'reply', 'note'
  const [mobileView, setMobileView] = useState('list'); // 'list', 'chat', 'info'

  // Get active selected conversation
  const selectedConv = conversations.find(c => c.id === selectedId) || conversations[0];

  const chatSubject = 'Guest Conversation';

  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/conversations`);
        const data = await res.json();
        if (data.success) {
          const mapped = data.data.map(c => ({
            id: c.id.toString(),
            name: c.guestName || 'Unknown Guest',
            lastMsg: c.lastMessage || 'No messages yet',
            time: c.waitingDuration || 'Just now',
            tag: c.status === 'escalated' ? `Escalated ${c.roomNumber || ''}` : (c.status === 'active' ? 'AI handling' : 'Resolved'),
            tagColor: c.status === 'escalated' ? 'bg-rose-50 text-rose-700 border-rose-100' : (c.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'),
            unreadCount: c.status === 'escalated' ? 1 : 0,
            room: c.roomNumber || 'N/A',
            status: c.status === 'resolved' ? 'Departed' : 'In House',
            stay: c.checkoutDate ? `Until ${new Date(c.checkoutDate).toLocaleDateString()}` : 'N/A',
            nights: 'N/A',
            category: 'N/A',
            rate: 'N/A',
            bookingNo: 'N/A',
            lang: c.loyaltyTier || 'Standard Member',
            tags: [],
            messages: [],
            aiDraft: '',
            aiSummary: ''
          }));
          setConversations(prev => {
            const merged = mapped.map(newC => {
              const existing = prev.find(p => p.id === newC.id);
              return {
                ...newC,
                messages: existing && existing.messages.length > 0 ? existing.messages : newC.messages
              };
            });
            return merged;
          });
        }
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      }
    };
    fetchConvs();
    const interval = setInterval(fetchConvs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/conversations/${selectedId}/messages`);
        const data = await res.json();
        if (data.success && data.messages) {
          const formatted = data.messages
            .filter(m => m.senderType !== 'tool' && !(m.senderType === 'ai' && !m.content?.trim()))
            .map(m => ({
              sender: (m.senderType === 'guest') ? 'guest' : (m.senderType === 'human' ? 'user' : 'ai'),
              text: m.content,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              channel: m.channel || 'WhatsApp'
            }));
          setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, messages: formatted } : c));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 5000);
    return () => clearInterval(interval);
  }, [selectedId]);

  useEffect(() => {
    if (selectedConv) {
      setReplyText(selectedConv.aiDraft || '');
    }
  }, [selectedId]);

  // Tab definitions
  const tabsConfig = [
    { id: 'all', label: 'All', match: c => true },
    { id: 'ai_handling', label: 'AI handling', match: c => c.tag.toLowerCase().includes('ai handling') },
    { id: 'human_takeover', label: 'Human takeover', match: c => c.tag.toLowerCase().includes('human takeover') },
    { id: 'escalated', label: 'Escalated', match: c => c.tag.toLowerCase().includes('escalated') },
    { id: 'unresolved', label: 'Unresolved', match: c => !c.tag.toLowerCase().includes('resolved') },
    { id: 'whatsapp', label: 'WhatsApp', match: c => c.messages.some(m => m.channel?.toLowerCase() === 'whatsapp') },
    { id: 'email', label: 'Email', match: c => c.messages.some(m => m.channel?.toLowerCase() === 'email') },
    { id: 'pre_arrival', label: 'Pre-arrival', match: c => c.status === 'Expected Today' || c.status === 'Confirmed' },
    { id: 'in_house', label: 'In-house', match: c => c.status === 'In House' },
    { id: 'post_stay', label: 'Post-stay', match: c => c.status === 'Departed' },
  ];

  // Filter conversations list based on search and tabs
  const filteredConversations = conversations.filter(c => {
    // Search filter
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.lastMsg.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab filter
    const activeTabConfig = tabsConfig.find(t => t.id === activeTab) || tabsConfig[0];
    return matchesSearch && activeTabConfig.match(c);
  });

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedId) return;
    
    try {
      await fetch(`${API_BASE_URL}/api/conversations/${selectedId}/human-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText })
      });
      // Add reply message to selected conversation's messages locally to feel responsive
      const updated = conversations.map(c => {
        if (c.id === selectedId) {
          return {
            ...c,
            unreadCount: 0,
            lastMsg: `You: ${replyText}`,
            messages: [
              ...c.messages,
              { sender: 'user', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), channel: 'WhatsApp' }
            ],
            aiDraft: '' // Clear draft since we replied
          };
        }
        return c;
      });
      
      setConversations(updated);
      setReplyText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDraft = () => {
    if (selectedConv) {
      setReplyText(selectedConv.aiDraft || '');
    }
  };

  return (
    <div className="h-full bg-[#F7F6F3] flex min-w-0 font-sans text-left relative overflow-hidden">
      <style>{`
        #front-office-conversations-content,
        #front-office-conversations-content button,
        #front-office-conversations-content input,
        #front-office-conversations-content select,
        #front-office-conversations-content textarea,
        #front-office-conversations-content span,
        #front-office-conversations-content p,
        #front-office-conversations-content h1,
        #front-office-conversations-content h2,
        #front-office-conversations-content h3,
        #front-office-conversations-content h4,
        #front-office-conversations-content label,
        #front-office-conversations-content td,
        #front-office-conversations-content th {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
      `}</style>
      
      {/* Left Sidebar removed as requested */}

      {/* 2. Main content page frame */}
      <div id="front-office-conversations-content" className="flex-1 flex flex-col h-full min-w-0 bg-[#F7F6F3]">
        
        {/* Top Header */}
        <header className={`justify-between items-center px-6 lg:px-8 py-4 lg:py-5 border-b border-[#E7E4DD] bg-white shrink-0 ${mobileView === 'list' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="text-left space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800 font-sans">Hotel Mercier</span>
              <span className="text-slate-350 text-xs">•</span>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Antwerp - 48 rooms</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 font-sans">Guest conversations — the AI drafts, you decide</h1>
          </div>

        </header>

        {/* 3 columns body */}
        <div className="flex-1 flex lg:grid lg:grid-cols-4 gap-0 min-h-0 bg-white relative">
          
          {/* Column 1: Conversations List (1/4 width) */}
          <div className={`border-r border-[#E7E4DD] flex-col h-full min-h-0 w-full lg:w-auto ${mobileView === 'list' ? 'flex' : 'hidden lg:flex'}`}>
            {/* Search */}
            <div className="relative px-4 py-3 border-b border-[#E7E4DD]">
              <Search className="absolute left-7.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search guests..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#105F39] focus:bg-white focus:ring-2 focus:ring-[#105F39]/10 rounded-xl outline-none transition-all text-xs font-medium text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Horizontal Tabs with Arrows */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#E7E4DD] bg-slate-50/40 select-none shrink-0 relative font-sans">
              <button className="text-slate-400 hover:text-slate-650 px-1 text-sm font-bold cursor-pointer">‹</button>
              <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-none px-1">
                {tabsConfig.map(tab => {
                  const count = conversations.filter(tab.match).length;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-full flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                        activeTab === tab.id ? 'bg-white border border-[#E7E4DD] text-slate-800 shadow-xs' : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-550'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.2 font-mono ${activeTab === tab.id ? 'bg-[#105F39] text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button className="text-slate-400 hover:text-slate-650 px-1 text-sm font-bold cursor-pointer">›</button>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E7E4DD]">
              {filteredConversations.map(c => {
                const isSelected = c.id === selectedId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedId(c.id);
                      setMobileView('chat');
                    }}
                    className={`p-4 text-left transition-all cursor-pointer hover:bg-slate-50/50 flex flex-col gap-2 relative ${
                      isSelected ? 'bg-[#EBF6EE]/40 border-l-4 border-[#105F39]' : ''
                    }`}
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-900">{c.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">{c.time}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {c.lastMsg}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${c.tagColor}`}>
                        {c.tag}
                      </span>
                      {c.unreadCount > 0 && (
                        <span className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-[9px] font-black text-white font-mono shadow-sm">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs font-medium">
                  No conversations match your filter.
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Chat Pane (2/4 width) */}
          <div className={`lg:col-span-2 flex-col h-full min-h-0 border-r border-[#E7E4DD] w-full lg:w-auto ${mobileView === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* Active chat header */}
            {selectedConv && (
            <div className="px-6 py-4 border-b border-[#E7E4DD] bg-white flex justify-between items-center shrink-0">
              <div className="text-left space-y-0.5 flex items-center gap-3">
                <button
                  onClick={() => setMobileView('list')}
                  className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors shrink-0"
                >
                  <RefreshCw className="rotate-90" size={16} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{chatSubject}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${selectedConv.tagColor}`}>
                      {selectedConv.tag.split(' ')[0]}
                    </span>
                  </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  <span>💬 WhatsApp</span>
                  <span>•</span>
                  <span>{selectedConv.name}</span>
                </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                <div className="hidden sm:block">
                  <span>room {selectedConv.room}</span>
                  <span className="mx-1.5">•</span>
                  <span>{selectedConv.bookingNo}</span>
                </div>
                <button
                  onClick={() => setMobileView('info')}
                  className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-900 border border-slate-200"
                >
                  <Info size={14} />
                </button>
              </div>
            </div>
            )}

            {/* Scrollable messages container */}
            {selectedConv && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30 space-y-4 min-h-[150px]">
              {selectedConv.messages.map((m, idx) => {
                const isGuest = m.sender === 'guest';
                const isAI = m.sender === 'ai';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col gap-1 max-w-[85%] text-left ${
                      !isGuest ? 'ml-auto items-end' : 'items-start'
                    }`}
                  >
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                      {isGuest ? `${selectedConv.name} • ${m.channel} • ${m.time}` : (isAI ? `AI Autopilot • ${m.time}` : `Amélie Dupret • ${m.time}`)}
                    </span>
                    <div 
                      className={`p-4 rounded-2xl text-xs leading-relaxed font-medium shadow-xs ${
                        isGuest 
                          ? 'bg-white border border-[#E7E4DD] text-slate-800' 
                          : 'bg-[#105F39] text-white'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {/* AI Draft Suggestion Box */}
            {selectedConv && (
            <div className="p-4 sm:p-6 border-t border-[#E7E4DD] bg-white space-y-3 sm:space-y-4 shrink-0">
              
              {/* Draft info header */}
              {selectedConv.aiDraft ? (
                <div className="flex items-start gap-2 text-[11px] text-slate-500 font-medium leading-relaxed">
                  <div className="w-5 h-5 bg-[#EBF6EE] rounded flex items-center justify-center text-[#105F39] shrink-0 mt-0.5">
                    <Bot size={13} />
                  </div>
                  <p>
                    Suggested by the AI from <span className="font-bold underline text-slate-700 cursor-pointer">Room Change Policy.pdf</span> — send it, edit it, or write your own.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-[11px] text-slate-500 font-medium leading-relaxed">
                  <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                    <User size={13} />
                  </div>
                  <p>Write your reply to {selectedConv.name} below.</p>
                </div>
              )}

              {/* Mode switch tabs */}
              <div className="flex gap-4 border-b border-slate-100 pb-1">
                <button
                  onClick={() => setActiveChatTab('reply')}
                  className={`text-xs font-bold pb-2 relative transition-all cursor-pointer ${
                    activeChatTab === 'reply' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  <span>Reply on WhatsApp</span>
                  {activeChatTab === 'reply' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#105F39]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveChatTab('note')}
                  className={`text-xs font-bold pb-2 relative transition-all cursor-pointer ${
                    activeChatTab === 'note' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  <span>Internal note</span>
                  {activeChatTab === 'note' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#105F39]" />
                  )}
                </button>
              </div>

              {/* Input Draft Textarea */}
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write your message..."
                className="w-full h-24 sm:h-28 p-3 sm:p-4 border border-[#E7E4DD] rounded-xl outline-none focus:ring-2 focus:ring-[#105F39]/20 focus:border-[#105F39] text-xs text-slate-800 font-medium font-sans leading-relaxed resize-none bg-slate-50/10"
              />

              {/* Action Buttons Toolbar */}
              <div className="flex items-center gap-2 justify-between flex-wrap pt-1.5 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendReply}
                    className="px-4 py-2.5 bg-[#105F39] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send size={13} />
                    <span>Send AI reply</span>
                  </button>

                  {selectedConv.aiDraft && (
                    <button
                      onClick={handleResetDraft}
                      className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-98"
                    >
                      Reset to AI draft
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-px bg-slate-200 mx-1" />
                  
                  <button className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs" title="Take Over">
                    <User size={13} />
                    <span className="text-[10px] uppercase font-black tracking-wider">Take over</span>
                  </button>

                  <button className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs" title="Create Task">
                    <CheckCircle size={13} />
                    <span className="text-[10px] uppercase font-black tracking-wider">Create task</span>
                  </button>

                  <button className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs" title="Escalate">
                    <AlertCircle size={13} className="text-rose-600" />
                    <span className="text-[10px] uppercase font-black tracking-wider text-rose-600">Escalate</span>
                  </button>

                  <button className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs" title="Resolve">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600">Resolve</span>
                  </button>
                </div>
              </div>

            </div>
            )}
          </div>

          {/* Column 3: Guest Profile Details (1/4 width) */}
          <div className={`p-6 space-y-6 overflow-y-auto bg-slate-50/20 text-left h-full min-h-0 flex-col w-full lg:w-auto ${mobileView === 'info' ? 'flex' : 'hidden lg:flex'}`}>
            
            {selectedConv && (
              <>
            {/* Header info */}
            <div className="space-y-3 shrink-0">
              <div className="flex items-center justify-between lg:hidden mb-4 border-b border-[#E7E4DD] pb-4">
                <h3 className="text-sm font-bold text-slate-900">Guest Information</h3>
                <button
                  onClick={() => setMobileView('chat')}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span>{selectedConv.name}</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  {selectedConv.lang}
                </p>
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap gap-1.5">
                {selectedConv.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 bg-slate-100 text-slate-650 border border-slate-200 text-[9px] font-extrabold rounded-md uppercase tracking-wider font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* PMS reservation detail box */}
            <div className="bg-white border border-[#E7E4DD] rounded-2xl p-5 shadow-xs space-y-4 shrink-0">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 font-mono flex items-center gap-1.5">
                <Building2 size={12} className="text-slate-400" />
                <span>Reservation • from your PMS</span>
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline py-1 border-b border-dashed border-slate-100 text-xs font-semibold">
                  <span className="text-slate-400">Number</span>
                  <span className="text-slate-800 font-bold font-mono">{selectedConv.bookingNo}</span>
                </div>
                <div className="flex justify-between items-baseline py-1 border-b border-dashed border-slate-100 text-xs font-semibold">
                  <span className="text-slate-400">Room</span>
                  <span className="text-slate-800 font-bold font-mono">{selectedConv.room}</span>
                </div>
                <div className="flex justify-between items-baseline py-1 border-b border-dashed border-slate-100 text-xs font-semibold">
                  <span className="text-slate-400">Stay</span>
                  <span className="text-slate-800 font-bold font-mono">{selectedConv.stay}</span>
                </div>
                <div className="flex justify-between items-baseline py-1 border-b border-dashed border-slate-100 text-xs font-semibold">
                  <span className="text-slate-400">Nights</span>
                  <span className="text-slate-800 font-bold font-mono">{selectedConv.nights}</span>
                </div>
                <div className="flex justify-between items-baseline py-1 border-b border-dashed border-slate-100 text-xs font-semibold">
                  <span className="text-slate-400">Category</span>
                  <span className="text-slate-800 font-bold">{selectedConv.category}</span>
                </div>
                <div className="flex justify-between items-baseline py-1 border-b border-dashed border-slate-100 text-xs font-semibold">
                  <span className="text-slate-400">Rate</span>
                  <span className="text-slate-800 font-bold font-mono">{selectedConv.rate}</span>
                </div>
                <div className="flex justify-between items-baseline py-1 text-xs font-semibold">
                  <span className="text-slate-400">Status</span>
                  <span className="text-[#105F39] font-extrabold uppercase tracking-wide text-[10px]">{selectedConv.status}</span>
                </div>
              </div>
            </div>

            {/* AI Summary Box */}
            {selectedConv && (
            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 font-mono flex items-center gap-1.5 shrink-0">
                <Sparkles size={12} className="text-[#105F39]" />
                <span>AI Summary</span>
              </h4>
              <div className="flex-1 overflow-y-auto bg-[#fffdf9] p-4 rounded-2xl border border-amber-100 shadow-xs text-xs text-slate-650 leading-relaxed font-medium">
                {selectedConv.aiSummary || 'No AI summary available.'}
              </div>
            </div>
            )}

              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

const Conversations = () => {
  const navigate = useNavigate();
  const { role } = useApp();

  if (role === ROLES.FRONT_OFFICE) {
    return <FrontOfficeConversationsView />;
  }

  const [convs, setConvs] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(null);
  const [activeChannel, setActiveChannel] = useState('ALL');
  const [inputMsg, setInputMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileView, setMobileView] = useState('list'); // 'list', 'chat', 'info'

  // Create conversation Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null); // 'whatsapp', 'email'
  const [formGuestName, setFormGuestName] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formInitialMsg, setFormInitialMsg] = useState('');
  const [formMode, setFormMode] = useState('AI'); // 'AI' or 'HUMAN'

  // Fetch all conversations from live backend database endpoints
  useEffect(() => {
    const fetchAllConversations = async () => {
      try {
        const statuses = ['escalated', 'In Progress', 'active', 'resolved'];
        const promises = statuses.map(status =>
          fetch(`${API_BASE_URL}/api/conversations?status=${encodeURIComponent(status)}`)
            .then(res => res.json())
        );
        const results = await Promise.all(promises);
        
        let backendConvs = [];
        results.forEach((data, idx) => {
          if (data.success && Array.isArray(data.data)) {
            const transformed = data.data.map(c => ({
              id: c.id,
              guest: c.guestName || 'Unknown Guest',
              lastMsg: c.lastMessage || 'No messages yet',
              time: c.waitingDuration || 'Just now',
              mode: (c.status === 'active' || c.status === 'resolved') ? 'AI' : 'HUMAN',
              channel: (c.channel || 'whatsapp').toLowerCase(),
              room: c.roomNumber || 'N/A',
              status: c.loyaltyTier || 'Standard Member',
              stay: c.checkoutDate ? `Until ${c.checkoutDate}` : 'Active Stay',
              confidence: (c.status === 'active' || c.status === 'resolved') ? '98%' : 'N/A',
              messages: []
            }));
            backendConvs = [...backendConvs, ...transformed];
          }
        });

        // Always merge backend conversations with the hardcoded demo list to avoid screen jumping
        setConvs(prevConvs => {
          // Keep all hardcoded ones and any newly fetched ones
          const merged = [...initialConversations];
          
          backendConvs.forEach(newC => {
            if (!merged.find(m => m.id === newC.id)) {
              merged.push(newC);
            }
          });

          // Preserve loaded messages for all conversations
          return merged.map(newC => {
            const existing = prevConvs.find(p => p.id === newC.id);
            return {
              ...newC,
              messages: existing && existing.messages && existing.messages.length > 0 
                ? existing.messages 
                : (newC.messages || [])
            };
          });
        });
        
      } catch (err) {
        console.warn('Backend offline or database unseeded, keeping simulated demo conversations:', err.message);
      }
    };

    fetchAllConversations();
    const interval = setInterval(fetchAllConversations, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages dynamically when selectedId changes
  useEffect(() => {
    if (!selectedId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/conversations/${selectedId}/messages`);
        const data = await response.json();
        if (data.success && Array.isArray(data.messages)) {
          const formattedMessages = data.messages
            .filter(m => m.senderType !== 'tool' && !(m.senderType === 'ai' && (!m.content || !m.content.trim())))
            .map(m => ({
              id: m.id,
              sender: m.senderType === 'human' ? 'human' : m.senderType === 'ai' ? 'ai' : m.senderType === 'system' ? 'system_event' : 'guest',
              text: m.content,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

          setConvs(prev => prev.map(c =>
            c.id === selectedId ? { ...c, messages: formattedMessages } : c
          ));
        }
      } catch (err) {
        console.warn('Failed to fetch live messages:', err.message);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [selectedId]);

  const activeConv = convs.find(c => c.id === selectedId) || convs[0] || {
    id: 1,
    guest: 'No Conversations',
    lastMsg: '',
    time: '',
    mode: 'AI',
    channel: 'whatsapp',
    room: 'N/A',
    status: '',
    stay: '',
    confidence: '0%',
    messages: []
  };
  const messagesEndRef = useRef(null);
  const chatFeedRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const previousSelectedIdRef = useRef(selectedId);
  const previousMessageCountRef = useRef(activeConv.messages.length);

  // Voice Calling states
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callState, setCallState] = useState('Calling...'); // 'Calling...', 'Incoming Call', 'Active Call', 'Ended'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [guestSpeaking, setGuestSpeaking] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [callTranscript, setCallTranscript] = useState([]);

  const handleStartCall = async () => {
    setIsCallModalOpen(true);
    setCallState('Calling...');
    setCallDuration(0);
    setIsMuted(false);
    setAiSpeaking(false);
    setGuestSpeaking(false);
    setCallTranscript([{ sender: 'sys', text: 'Initiating secure WebRTC voice stream...' }]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/voice/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: activeConv.id,
          guestName: activeConv.guest,
          roomNumber: activeConv.room
        })
      });
      const data = await res.json();
      if (data.success && data.call) {
        setCurrentCallId(data.call.callId);
      }
    } catch (err) {
      console.warn('Voice start API fallback:', err);
      setCurrentCallId('CALL-SIM-' + Date.now());
    }

    setTimeout(() => {
      setCallState('Incoming Call');
      setTimeout(() => {
        setCallState('Active Call');
        setAiSpeaking(true);
        setCallTranscript(prev => [...prev, { sender: 'ai', text: `Hello ${activeConv.guest}, this is AutoPilot AI. How can I assist you today?` }]);
        setTimeout(() => setAiSpeaking(false), 3000);
      }, 2000);
    }, 1500);
  };

  useEffect(() => {
    let timer;
    if (callState === 'Active Call') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleSimulateSpeech = async (scenario) => {
    setGuestSpeaking(true);
    let speechText = '';
    let confidence = 0.95;
    let sentiment = 'neutral';
    let billing = 0;
    let humanReq = false;

    if (scenario === 'normal') {
      speechText = 'Can I request a late checkout tomorrow around 2 PM?';
    } else if (scenario === 'angry') {
      speechText = 'This is ridiculous! My room is not cleaned properly and I am very frustrated!';
      sentiment = 'angry';
    } else if (scenario === 'billing') {
      speechText = 'I want a $300 refund for the resort fee that I was wrongly charged.';
      billing = 300;
    } else if (scenario === 'human') {
      speechText = 'I want to speak to a real human manager right now.';
      humanReq = true;
    }

    setCallTranscript(prev => [...prev, { sender: 'guest', text: speechText }]);
    setTimeout(() => setGuestSpeaking(false), 2000);

    try {
      const res = await fetch(`${API_BASE_URL}/api/voice/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId: currentCallId,
          transcriptText: speechText,
          confidence,
          sentiment,
          billingAmount: billing,
          humanRequest: humanReq
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.escalated || data.data?.escalated) {
          const respText = data.aiResponse || data.data?.aiResponse || "I am transferring you to a human operator right away.";
          const reasonText = data.reason || data.data?.reason || "Escalation criteria met";
          setAiSpeaking(true);
          setCallTranscript(prev => [...prev, { sender: 'ai', text: respText }]);
          setTimeout(() => {
            setAiSpeaking(false);
            handleTransferToHuman(respText, reasonText);
          }, 3000);
        } else {
          const respText = data.aiResponse || data.data?.aiResponse || "I've processed your request.";
          setAiSpeaking(true);
          setCallTranscript(prev => [...prev, { sender: 'ai', text: respText }]);
          setTimeout(() => setAiSpeaking(false), 4000);
        }
      }
    } catch (err) {
      console.warn('Voice process API fallback:', err);
      if (scenario !== 'normal') {
        handleTransferToHuman('Transferring to human operator due to policy limit.', `Guest scenario: ${scenario}`);
      } else {
        setAiSpeaking(true);
        setCallTranscript(prev => [...prev, { sender: 'ai', text: "I've processed your request successfully in Opera PMS." }]);
        setTimeout(() => setAiSpeaking(false), 3000);
      }
    }
  };

  const handleTransferToHuman = (aiResp = 'Transferring to human operator.', reason = 'Requested human operator') => {
    const takeoverList = JSON.parse(sessionStorage.getItem('autopilot_voice_takeover') || '[]');
    takeoverList.push({
      id: Date.now(),
      guestName: activeConv.guest,
      roomNumber: activeConv.room,
      loyaltyTier: activeConv.status,
      duration: `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
      status: 'Live Call',
      escalationReason: reason,
      transcript: callTranscript.map(t => `${t.sender.toUpperCase()}: ${t.text}`).join('\n'),
      aiSuggestion: aiResp,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    sessionStorage.setItem('autopilot_voice_takeover', JSON.stringify(takeoverList));
    setCallState('Ended');
    setTimeout(() => {
      setIsCallModalOpen(false);
      navigate('/app/takeover-queue');
    }, 1500);
  };

  const handleEndCall = async () => {
    setCallState('Ended');
    try {
      await fetch(`${API_BASE_URL}/api/voice/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId: currentCallId })
      });
    } catch (e) {}
    setTimeout(() => setIsCallModalOpen(false), 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isNearBottom = () => {
    const feed = chatFeedRef.current;
    if (!feed) return true;
    return feed.scrollHeight - feed.scrollTop - feed.clientHeight < 80;
  };

  const handleChatScroll = () => {
    shouldAutoScrollRef.current = isNearBottom();
  };

  useEffect(() => {
    const messageCount = activeConv.messages.length;
    const selectedChanged = previousSelectedIdRef.current !== selectedId;
    const messageAdded = messageCount > previousMessageCountRef.current;

    if (selectedChanged || shouldAutoScrollRef.current || messageAdded && isNearBottom()) {
      scrollToBottom();
    }

    previousSelectedIdRef.current = selectedId;
    previousMessageCountRef.current = messageCount;
  }, [activeConv.messages, selectedId]);

  const handleSelectChat = (id) => {
    shouldAutoScrollRef.current = true;
    setSelectedId(id);
    setMobileView('chat');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || activeConv.mode === 'AI') return;

    const currentMsg = inputMsg;
    setInputMsg('');
    shouldAutoScrollRef.current = true;

    try {
      const response = await fetch(`${API_BASE_URL}/api/conversations/${selectedId}/human-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentMsg,
          operatorName: 'David'
        })
      });
      const data = await response.json();
      if (data.success && data.message) {
        const newMsg = {
          id: data.message.id,
          sender: 'human',
          text: data.message.content,
          time: new Date(data.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setConvs(prev => prev.map(c =>
          c.id === selectedId ? {
            ...c,
            messages: [...c.messages, newMsg],
            lastMsg: currentMsg,
            time: 'Just now',
            mode: 'HUMAN'
          } : c
        ));
      }
    } catch (err) {
      console.warn('Failed to send live operator reply, using local fallback:', err.message);
      const fallbackMsg = {
        id: Date.now(),
        sender: 'human',
        text: currentMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConvs(prev => prev.map(c =>
        c.id === selectedId ? { ...c, messages: [...c.messages, fallbackMsg], lastMsg: currentMsg, time: 'Just now' } : c
      ));
    }
  };

  // Switch between AI and Human manually (or trigger simulated escalation)
  const handleToggleMode = async (id, newMode) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    shouldAutoScrollRef.current = true;

    if (newMode === 'AI') {
      try {
        const response = await fetch(`${API_BASE_URL}/api/conversations/${id}/return-to-ai`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.success) {
          setConvs(prev => prev.map(c =>
            c.id === id ? {
              ...c,
              mode: 'AI',
              messages: [...c.messages, { id: `sys-esc-${Date.now()}`, sender: 'system_event', text: 'AI automation resumed', time: timeNow }]
            } : c
          ));
        }
      } catch (err) {
        console.warn('Failed to return conversation to AI, applying local transition:', err.message);
        setConvs(prev => prev.map(c =>
          c.id === id ? {
            ...c,
            mode: 'AI',
            messages: [...c.messages, { id: `sys-esc-${Date.now()}`, sender: 'system_event', text: 'AI automation resumed', time: timeNow }]
          } : c
        ));
      }
    } else {
      setConvs(prev => prev.map(c =>
        c.id === id ? {
          ...c,
          mode: 'HUMAN',
          messages: [
            ...c.messages,
            { id: `sys-esc-${Date.now()}-1`, sender: 'system_event', text: 'Conversation escalated due to policy safeguard', time: timeNow },
            { id: `sys-esc-${Date.now()}-2`, sender: 'system_event', text: 'Assigned to Front Desk Manager', time: timeNow },
            { id: `sys-esc-${Date.now()}-3`, sender: 'system_event', text: 'Human operator joined', time: timeNow }
          ]
        } : c
      ));
    }
  };

  const handleStartConversation = (e) => {
    e.preventDefault();
    if (!formGuestName.trim()) return;

    const newId = Date.now();
    const newConv = {
      id: newId,
      guest: formGuestName,
      lastMsg: formInitialMsg.trim() || 'Conversation initialized',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: formMode,
      channel: selectedChannel,
      room: formRoom || 'N/A',
      status: 'Standard Guest',
      stay: 'Active Stay',
      confidence: formMode === 'AI' ? '95%' : '0%',
      messages: [
        ...(formInitialMsg.trim() ? [{
          id: Date.now(),
          sender: 'guest',
          text: formInitialMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }] : [])
      ]
    };

    setConvs(prev => [newConv, ...prev]);
    setSelectedId(newId);

    // Auto activate tab
    setActiveChannel(selectedChannel.toUpperCase());

    // Close modal & reset
    setIsCreateModalOpen(false);
    setSelectedChannel(null);
    setFormGuestName('');
    setFormRoom('');
    setFormContact('');
    setFormInitialMsg('');
    setFormMode('AI');
  };

  return (
    <div className="h-full min-h-0 flex bg-white rounded-2xl shadow-lg overflow-hidden animate-in fade-in duration-700 relative text-left">


      {/* 1. LEFT PANEL: Guest Channels List */}
      <div className={`
        ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}
        w-full md:w-[17rem] lg:w-72 flex-col border-r border-slate-100 bg-slate-50/10 h-full min-h-0 shrink-0
      `}>
        <div className="px-4 py-3 border-b border-slate-100/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-slate-950 tracking-tight">Guest Conversations</h1>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">View and manage all guest communications.</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg hover:scale-105 transition-transform shadow-md shrink-0"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Channel Filters */}
          <div className="flex p-1 bg-slate-100 rounded-xl gap-1 overflow-x-auto shrink-0">
            {['ALL', 'WHATSAPP', 'EMAIL'].map((ch) => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={`flex-1 px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeChannel === ch ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {ch}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-350" size={14} />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold focus:ring-4 focus:ring-purple-500/5 transition-all outline-none"
            />
          </div>
        </div>

        {/* Guest Conversation Scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-2.5 space-y-2">
          {convs
            .filter(c => {
              const matchesSearch = c.guest.toLowerCase().includes(searchTerm.toLowerCase());
              if (activeChannel === 'ALL') return matchesSearch;
              return matchesSearch && c.channel.toLowerCase() === activeChannel.toLowerCase();
            })
            .map((chat) => {
              const isSelected = selectedId === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full p-3 rounded-xl flex gap-3 transition-all border text-left relative overflow-hidden group ${isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/5'
                      : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-800 shadow-sm'
                    }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {chat.guest[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center shadow-sm ${isSelected ? 'border-slate-900 bg-white text-slate-900' : 'border-white bg-slate-900 text-white'
                      }`}>
                      {chat.channel === 'whatsapp' ? (
                        <Smartphone size={9} />
                      ) : (
                        <Mail size={9} />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-bold truncate text-xs">{chat.guest}</span>
                      <span className="text-[9px] font-semibold opacity-60 shrink-0">{chat.time}</span>
                    </div>
                    <p className={`text-[11px] truncate font-medium mb-1.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {chat.lastMsg}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${chat.mode === 'AI' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span className={`text-[8px] font-black uppercase tracking-widest ${isSelected ? 'text-slate-350' : 'text-slate-500'}`}>
                        {chat.mode === 'AI' ? 'AI Auto-Pilot' : 'Human Active'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* 2. CENTER PANEL: Live Chat Area */}
      <div className={`
        ${mobileView === 'chat' ? 'flex' : 'hidden md:flex'}
        flex-1 flex-col bg-white h-full min-h-0
      `}>
        {/* Workspace Chat Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-10 text-left">
          <div className="flex items-center gap-3 min-w-0 text-left">
            <button
              onClick={() => setMobileView('list')}
              className="md:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors shrink-0"
            >
              <RefreshCw className="rotate-90" size={16} />
            </button>
            <div className="hidden sm:flex w-9 h-9 bg-slate-50 rounded-xl items-center justify-center text-slate-900 border border-slate-150 shadow-inner shrink-0">
              <User size={16} />
            </div>

            <div className="min-w-0 text-left animate-in fade-in duration-500">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-slate-900 leading-none truncate">{activeConv.guest}</h3>
                <div className={`px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0 ${activeConv.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                  {activeConv.channel === 'whatsapp' ? <Smartphone size={8} /> : <Mail size={8} />}
                  <span className="text-[7px] font-black uppercase tracking-widest">{activeConv.channel}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeConv.mode === 'AI' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className={`text-[9px] font-black uppercase tracking-[0.1em] truncate ${activeConv.mode === 'AI' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {activeConv.mode === 'AI' ? 'AI AUTO-PILOT ACTIVE' : 'HUMAN OPERATOR ACTIVE'}
                  </span>
                </div>

                {activeConv.mode === 'HUMAN' && (
                  <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-650 px-2 py-0.5 rounded font-black uppercase tracking-wider shrink-0">
                    Front Desk Manager Joined
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeConv.mode === 'HUMAN' && (
              <button
                onClick={() => handleToggleMode(activeConv.id, 'AI')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-600 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md"
              >
                <Bot size={12} />
                <span>Return Conversation to AI</span>
              </button>
            )}
            <button
              onClick={() => setMobileView('info')}
              className="md:hidden p-2 text-slate-450 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all shrink-0"
            >
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* Live Chat Thread Feed */}
        <div ref={chatFeedRef} onScroll={handleChatScroll} className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-5 sm:px-5 space-y-4 bg-slate-50/20">
          {activeConv.messages.map((msg) => {
            if (!msg.text || !msg.text.trim()) return null;

            // Inline Status Badges
            if (msg.sender === 'system_event') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-100/90 border border-slate-200/55 rounded-full shadow-sm text-slate-500">
                    <span className="w-1 h-1 bg-slate-400 rounded-full" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{msg.text}</span>
                    <span className="text-[8px] font-mono text-slate-400 ml-1">({msg.time})</span>
                  </div>
                </div>
              );
            }

            const isGuest = msg.sender === 'guest';
            const isAI = msg.sender === 'ai';

            return (
              <div key={msg.id} className={`flex flex-col ${isGuest ? 'items-start' : 'items-end'}`}>
                <div className={`flex gap-2.5 max-w-[88%] sm:max-w-[78%] ${isGuest ? '' : 'flex-row-reverse'}`}>
                  <div className={`hidden sm:flex w-8 h-8 rounded-xl items-center justify-center shrink-0 shadow-sm ${isGuest ? 'bg-slate-200 text-slate-600' : isAI ? 'bg-emerald-500 text-white' : 'bg-[#6D28D9] text-white'}`}>
                    {isGuest ? <span className="font-black text-[10px]">{activeConv.guest[0]}</span> : isAI ? <Bot size={15} /> : <User size={15} />}
                  </div>
                  <div className="space-y-1">
                    <div className={`px-3.5 py-3 rounded-xl text-[13px] leading-relaxed ${isGuest
                        ? 'bg-slate-100 text-slate-800 rounded-tl-none shadow-sm font-semibold text-left'
                        : isAI
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tr-none text-left shadow-sm font-semibold'
                          : 'bg-[#6D28D9] text-white rounded-tr-none text-left shadow-sm font-semibold'
                      }`}>
                      <p>{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-450 ${isGuest ? 'justify-start' : 'justify-end'}`}>
                      <span>{isGuest ? activeConv.guest : isAI ? 'AI Response' : 'Operator (David)'}</span>
                      <span className="opacity-50">•</span>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="p-3 pb-[calc(env(safe-area-inset-bottom)+16px)] sm:pb-3 border-t border-slate-100 bg-white shrink-0">
          <form onSubmit={handleSendMessage}>
            {/* Interactive Simulation Handoff Helper */}
            {activeConv.mode === 'AI' && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-purple-50/70 border border-purple-100 rounded-xl px-3 py-2 text-left mb-1 gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-[10px] text-purple-800 font-bold">
                  <Bot size={12} className="text-[#6D28D9] animate-pulse" />
                  <span>AI Autopilot is actively managing this guest.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleMode(activeConv.id, 'HUMAN')}
                  className="px-2.5 py-1 bg-[#6D28D9] hover:bg-purple-700 text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all shadow-sm shrink-0"
                >
                  Trigger Simulated Handoff (Test)
                </button>
              </div>
            )}

            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={activeConv.mode === 'AI' ? "AI is handling this conversation" : "Type a direct response..."}
                disabled={activeConv.mode === 'AI'}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-[13px] font-bold focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-[#6D28D9]/40 outline-none transition-all shadow-sm placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleStartCall}
                className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
                title="Start Voice Call"
              >
                <Phone size={16} />
              </button>
              <button
                type="submit"
                disabled={activeConv.mode === 'AI' || !inputMsg.trim()}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. RIGHT PANEL: Simple Guest Context Panel */}
      <div className={`
        ${mobileView === 'info' ? 'flex' : 'hidden lg:flex'}
        ${mobileView === 'info' ? 'fixed inset-0 z-[60] bg-white' : 'w-[17rem] lg:w-72 xl:w-[19rem]'}
        flex-col border-l border-slate-100 bg-slate-50/10 overflow-y-auto scrollbar-hide h-full min-h-0 shrink-0 text-left
      `}>
        {/* Mobile Info Header */}
        <div className="lg:hidden p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">Guest Information</h3>
          <button onClick={() => setMobileView('chat')} className="p-1.5 bg-slate-50 rounded-lg text-slate-900">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-5 text-left">

          {/* Guest Profile Details */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Guest Context
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-left">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-[#6D28D9] border border-purple-100 shadow-sm shrink-0">
                  <User size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 leading-tight truncate">{activeConv.guest}</p>
                  <span className="text-[8.5px] font-black text-[#6D28D9] uppercase tracking-widest mt-1 inline-block">{activeConv.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-left">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Room No.</p>
                  <p className="text-xs font-black text-slate-900">{activeConv.room}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-left">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Stay Dates</p>
                  <p className="text-[10px] font-black text-slate-900 truncate">{activeConv.stay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Reservation Summary
            </h3>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Booking</span>
                <span className="font-bold text-slate-900 font-mono">{activeConv.bookingNo || '#45874'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Arrival</span>
                <span className="font-bold text-slate-900">{activeConv.arrival || '29 July'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Departure</span>
                <span className="font-bold text-slate-900">{activeConv.departure || '31 July'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Room</span>
                <span className="font-bold text-slate-900">{activeConv.room || 'Deluxe King'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Guests</span>
                <span className="font-bold text-slate-900">{activeConv.guestsCount || 2}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">VIP Status</span>
                <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                  {activeConv.isVip ? 'Yes (VIP)' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Suggested Upsell Actions */}
          <div className="space-y-2">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Suggested Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: '+ Add Breakfast', price: '€25' },
                { name: '+ Late Checkout', price: '€30' },
                { name: '+ Airport Taxi', price: '€45' },
                { name: '+ Parking', price: '€15' }
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    setConvs(prev => prev.map(c =>
                      c.id === activeConv.id ? {
                        ...c,
                        messages: [...c.messages, { id: Date.now(), sender: 'ai', text: `✓ Added ${sug.name} (${sug.price}) to reservation folio.`, time: timeNow }]
                      } : c
                    ));
                  }}
                  className="px-2.5 py-2 bg-purple-50/70 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-[10px] font-bold transition-all text-center cursor-pointer shadow-sm"
                >
                  {sug.name}
                </button>
              ))}
            </div>
          </div>

          {/* AI Confidence Score */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Automation Confidence
            </h3>
            <div className="bg-slate-900 rounded-xl p-4 text-white shadow-md relative overflow-hidden text-left">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Confidence Rating</p>
                  <p className="text-xl font-black text-emerald-400 tracking-tight">{activeConv.confidence}</p>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                  <ShieldCheck size={16} />
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: activeConv.confidence }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/guest-profile')}
            className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Open PMS Profile</span>
            <ExternalLink size={10} />
          </button>
        </div>
      </div>

      {/* 4. MODAL LAYER: Create Conversation Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">

            {/* Choose Channel Modal */}
            {selectedChannel === null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Create New Conversation</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Select guest channel to initialize automation workspace.</p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-455 hover:text-slate-900 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  {[
                    {
                      id: 'whatsapp',
                      title: 'WhatsApp Conversation',
                      desc: 'Direct mobile messaging with PMS profile tracking.',
                      icon: Smartphone,
                      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    },
                    {
                      id: 'email',
                      title: 'Email Conversation',
                      desc: 'Formal correspondence and automated folio attachments.',
                      icon: Mail,
                      color: 'bg-blue-50 text-blue-600 border-blue-100'
                    }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedChannel(opt.id)}
                      className="w-full p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 flex gap-4 text-left transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${opt.color} group-hover:scale-105 transition-transform`}>
                        <opt.icon size={16} />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-xs font-black text-slate-900">{opt.title}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (

              /* Initialization Form Modal */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl overflow-hidden text-left"
              >
                <form onSubmit={handleStartConversation}>
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        {selectedChannel === 'whatsapp' ? <Smartphone size={16} className="text-emerald-500" /> : <Mail size={16} className="text-blue-500" />}
                        New {selectedChannel} Chat
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Initialize live communication channel and parameters.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedChannel(null)}
                      className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-455 hover:text-slate-900 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Guest Name</label>
                        <input
                          type="text"
                          required
                          value={formGuestName}
                          onChange={(e) => setFormGuestName(e.target.value)}
                          placeholder="e.g. Robert Downey"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-[#6D28D9] transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Room Number</label>
                        <input
                          type="text"
                          value={formRoom}
                          onChange={(e) => setFormRoom(e.target.value)}
                          placeholder="e.g. 305"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-[#6D28D9] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                        {selectedChannel === 'email' ? 'Email Address' : 'Phone / Contact'}
                      </label>
                      <input
                        type="text"
                        value={formContact}
                        onChange={(e) => setFormContact(e.target.value)}
                        placeholder={selectedChannel === 'email' ? 'guest@example.com' : '+1 (555) 019-2834'}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-[#6D28D9] transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Initial Message</label>
                      <textarea
                        rows="2"
                        value={formInitialMsg}
                        onChange={(e) => setFormInitialMsg(e.target.value)}
                        placeholder="Type first query or greeting..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-[#6D28D9] transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Operational Mode Assignment</label>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setFormMode('AI')}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${formMode === 'AI'
                              ? 'border-emerald-500 bg-emerald-50/25 text-emerald-800 font-bold'
                              : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 text-slate-500'
                            }`}
                        >
                          <Bot size={18} className={formMode === 'AI' ? 'text-emerald-600' : 'text-slate-400'} />
                          <span className="text-[10px] uppercase tracking-wider">AI Auto-Pilot</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormMode('HUMAN')}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${formMode === 'HUMAN'
                              ? 'border-[#6D28D9] bg-purple-50/25 text-purple-800 font-bold'
                              : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 text-slate-500'
                            }`}
                        >
                          <User size={18} className={formMode === 'HUMAN' ? 'text-[#6D28D9]' : 'text-slate-400'} />
                          <span className="text-[10px] uppercase tracking-wider">Human Control</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedChannel(null)}
                      className="px-4 py-2 bg-white border border-slate-250 text-slate-500 hover:text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-slate-900/10"
                    >
                      Start Conversation
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        )}

        {/* VOICE CALL MODAL PANEL */}
        {isCallModalOpen && (
          <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col text-left"
            >
              {/* Call Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-inner">
                    <PhoneCall size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight leading-tight">{activeConv.guest}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Room {activeConv.room} • {activeConv.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                    callState === 'Active Call' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse' : 'bg-white/10 text-slate-300 border-white/10'
                  }`}>
                    {callState}
                  </span>
                  {callState === 'Active Call' && (
                    <p className="text-xs font-mono font-bold text-slate-300 mt-1">
                      {Math.floor(callDuration / 60)}:{callDuration % 60 < 10 ? '0' : ''}{callDuration % 60}
                    </p>
                  )}
                </div>
              </div>

              {/* Indicators & Interactive Speech Simulator */}
              <div className="p-6 space-y-6 bg-slate-50/50 flex-1 overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    aiSpeaking ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm' : 'bg-white border-slate-200 text-slate-500'
                  }`}>
                    <Bot size={20} className={aiSpeaking ? 'text-emerald-600 animate-bounce' : 'text-slate-400'} />
                    <div className="min-w-0">
                      <p className="text-xs font-black">AI Voice Engine</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{aiSpeaking ? 'Speaking...' : 'Listening'}</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    guestSpeaking ? 'bg-purple-50 border-purple-200 text-purple-900 shadow-sm' : 'bg-white border-slate-200 text-slate-500'
                  }`}>
                    <User size={20} className={guestSpeaking ? 'text-[#6D28D9] animate-bounce' : 'text-slate-400'} />
                    <div className="min-w-0">
                      <p className="text-xs font-black">Guest Audio</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{guestSpeaking ? 'Speaking...' : 'Listening'}</p>
                    </div>
                  </div>
                </div>

                {/* Live Transcript Stream */}
                <div className="space-y-2 text-left bg-white p-4 rounded-xl border border-slate-150 min-h-[120px] max-h-[200px] overflow-y-auto shadow-inner">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Live Call Transcript</p>
                  {callTranscript.map((t, idx) => (
                    <div key={idx} className="text-xs leading-relaxed font-medium">
                      <span className={`font-bold ${t.sender === 'ai' ? 'text-emerald-600' : t.sender === 'guest' ? 'text-purple-700' : 'text-slate-400'}`}>
                        {t.sender.toUpperCase()}: 
                      </span> <span className="text-slate-700">{t.text}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Simulator Triggers */}
                {callState === 'Active Call' && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Simulate Guest Speech Input (STT to AI):</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSimulateSpeech('normal')}
                        disabled={guestSpeaking || aiSpeaking}
                        className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 text-left transition-all shadow-sm flex items-center justify-between disabled:opacity-50 cursor-pointer"
                      >
                        <span>Late Checkout Req</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">Normal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateSpeech('angry')}
                        disabled={guestSpeaking || aiSpeaking}
                        className="p-2.5 bg-white hover:bg-red-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 text-left transition-all shadow-sm flex items-center justify-between disabled:opacity-50 cursor-pointer"
                      >
                        <span>Angry Frustration</span>
                        <span className="text-[9px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-black">Escalate</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateSpeech('billing')}
                        disabled={guestSpeaking || aiSpeaking}
                        className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 text-left transition-all shadow-sm flex items-center justify-between disabled:opacity-50 cursor-pointer"
                      >
                        <span>$300 Refund Req</span>
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-black">Escalate</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateSpeech('human')}
                        disabled={guestSpeaking || aiSpeaking}
                        className="p-2.5 bg-white hover:bg-purple-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 text-left transition-all shadow-sm flex items-center justify-between disabled:opacity-50 cursor-pointer"
                      >
                        <span>Req Real Manager</span>
                        <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-black">Escalate</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Controls Footer */}
              <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    isMuted ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTransferToHuman('Transferring to live support queue.', 'Manual Operator Transfer')}
                    className="px-4 py-3 bg-[#6D28D9] hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus size={16} />
                    <span>Transfer to Human</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEndCall}
                    className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    title="End Call"
                  >
                    <PhoneOff size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Conversations;
