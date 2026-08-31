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

export const taskService = {
  getTasks: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        return data.data.map(task => ({
          ...task,
          title: task.what,
          desc: task.detail || 'Manual task description.',
          meta: `💬 ${task.department} · ${new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · due ${task.due || 'ASAP'} · ${task.sendTo || 'Leave unassigned'}`
        }));
      }
      return [];
    } catch (err) {
      console.error('Error fetching tasks:', err);
      return [];
    }
  },

  createTask: async (taskData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
      });
      const data = await res.json();
      if (data.success) {
        const task = data.data;
        return {
          ...task,
          title: task.what,
          desc: task.detail || 'Manual task description.',
          meta: `💬 ${task.department} · ${new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · due ${task.due || 'ASAP'} · ${task.sendTo || 'Leave unassigned'}`
        };
      }
      throw new Error(data.message || 'Failed to create task');
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        const task = data.data;
        return {
          ...task,
          title: task.what,
          desc: task.detail || 'Manual task description.',
          meta: `💬 ${task.department} · ${new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · due ${task.due || 'ASAP'} · ${task.sendTo || 'Leave unassigned'}`
        };
      }
      return null;
    } catch (err) {
      console.error('Error updating task:', err);
      return null;
    }
  },

  deleteTask: async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  }
};
