import { initialMaintenanceData } from '../data/mockData';

let mntState = { ...initialMaintenanceData };

export const maintenanceService = {
  getMaintenanceData: async () => {
    return { ...mntState };
  },

  updateTicketStatus: async (ticketId, newStatus) => {
    mntState.tickets = mntState.tickets.map(t =>
      t.id === ticketId ? { ...t, status: newStatus } : t
    );
    mntState.openTickets = mntState.tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
    mntState.urgentTickets = mntState.tickets.filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED').length;
    if (newStatus === 'COMPLETED') {
      mntState.completedToday += 1;
    }
    return { ...mntState };
  },

  addTicketNote: async (ticketId, noteText) => {
    mntState.tickets = mntState.tickets.map(t =>
      t.id === ticketId ? { ...t, details: `${t.details}\n[Note]: ${noteText}` } : t
    );
    return { ...mntState };
  }
};
