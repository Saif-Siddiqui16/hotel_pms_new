import { initialHousekeepingData } from '../data/mockData';

let hkState = { ...initialHousekeepingData };

export const housekeepingService = {
  getHousekeepingData: async () => {
    return { ...hkState };
  },

  updateRoomStatus: async (roomId, newStatus) => {
    hkState.cleaningList = hkState.cleaningList.map(item => 
      item.id === roomId ? { ...item, status: newStatus } : item
    );
    // Recalculate summary metrics dynamically
    const readyCount = hkState.cleaningList.filter(i => i.status === 'Ready').length + 38;
    const toCleanCount = hkState.cleaningList.filter(i => i.status === 'To Clean' || i.status === 'Cleaning').length + 12;
    hkState.roomsReady = readyCount;
    hkState.roomsToClean = toCleanCount;
    return { ...hkState };
  },

  addRoomNote: async (roomId, note) => {
    hkState.cleaningList = hkState.cleaningList.map(item =>
      item.id === roomId ? { ...item, notes: note } : item
    );
    return { ...hkState };
  }
};
