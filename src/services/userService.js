import { API_BASE_URL } from '../config';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('autopilot_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const userService = {
  getUsers: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && data.data) {
        return data.data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phoneNumber: u.phoneNumber,
          role: u.role,
          status: u.status || 'Active',
          hotelName: u.hotelName || 'Unknown Hotel',
          joinedDate: u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          avatarColor: 'bg-indigo-600'
        }));
      }
      return [];
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  },

  createUser: async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phoneNumber: userData.phoneNumber,
          role: userData.role || 'Front Office Manager',
          status: userData.status || 'Active',
          hotelId: userData.hotelId || 1
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const u = data.data;
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phoneNumber: u.phoneNumber,
          role: u.role,
          status: u.status || 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
          avatarColor: 'bg-indigo-600'
        };
      }
      throw new Error(data.message || 'Failed to create user');
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  },

  updateUser: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
      return null;
    } catch (err) {
      console.error('Error updating user:', err);
      return null;
    }
  },
  deleteUser: async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      return false;
    }
  }
};
