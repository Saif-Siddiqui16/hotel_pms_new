import { initialDashboardData } from '../data/mockData';

let currentDashboardData = { ...initialDashboardData };

export const dashboardService = {
  getDashboardData: async () => {
    // API-Ready Abstraction: Currently returns mock data
    return { ...currentDashboardData };
  },

  togglePriorityAction: async (actionId) => {
    currentDashboardData.priorityActions = currentDashboardData.priorityActions.map(act => 
      act.id === actionId ? { ...act, status: act.status === 'completed' ? 'pending' : 'completed' } : act
    );
    return { ...currentDashboardData };
  }
};
