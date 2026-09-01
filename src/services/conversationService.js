import { initialConversationData } from '../data/mockData';
import { API_BASE_URL } from '../config';

let convState = { ...initialConversationData };

export const conversationService = {
  getConversationData: async () => {
    return { ...convState };
  },

  getConversations: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/conversations`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  },

  sendMessage: async (text) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    convState.messages = [...convState.messages, newMsg];
    return { ...convState };
  },

  addSuggestedAction: async (actionName, price) => {
    const systemMsg = {
      id: `msg-action-${Date.now()}`,
      sender: 'system',
      text: `✓ Added ${actionName} (${price}) to guest folio.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    convState.messages = [...convState.messages, systemMsg];
    return { ...convState };
  }
};
