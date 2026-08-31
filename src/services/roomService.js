const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('autopilot_token') || sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('stayflow_user') || '{}');
  const activeWorkspaceStr = sessionStorage.getItem('stayflow_active_workspace');
  const activeWorkspace = activeWorkspaceStr && activeWorkspaceStr !== 'undefined' ? JSON.parse(activeWorkspaceStr) : null;
  const currentHotelId = activeWorkspace?.id || user?.hotelId || sessionStorage.getItem('fallback_hotel_id');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(currentHotelId ? { 'x-hotel-id': currentHotelId.toString() } : {})
  };
};

export const roomService = {
  // Get all rooms
  getRooms: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch rooms');
      return data.data || data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  // Update a room's status, assignment, etc.
  updateRoom: async (id, roomData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(roomData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update room');
      return data.data || data;
    } catch (error) {
      console.error(`Error updating room ${id}:`, error);
      throw error;
    }
  },

  // Seed or create room
  createRoom: async (roomData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(roomData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create room');
      return data.data || data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }
};
