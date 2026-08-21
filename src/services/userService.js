import { initialUsersData } from '../data/mockData';

let usersState = [...initialUsersData];

export const userService = {
  getUsers: async () => {
    return [...usersState];
  },

  createUser: async (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'Front Office',
      status: userData.status || 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatarColor: 'bg-indigo-600'
    };
    usersState = [newUser, ...usersState];
    return newUser;
  },

  updateUser: async (id, updates) => {
    usersState = usersState.map(u => u.id === id ? { ...u, ...updates } : u);
    return usersState.find(u => u.id === id);
  },

  deleteUser: async (id) => {
    usersState = usersState.filter(u => u.id !== id);
    return true;
  }
};
