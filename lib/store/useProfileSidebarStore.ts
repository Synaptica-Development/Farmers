import { create } from 'zustand';
import api from '@/lib/axios';

interface SidebarState {
    notificationCount: number;
    orderCount: number;
    fetchSidebarCounts: () => Promise<void>;
    decreaseNotification: () => void;
    setCounts: (n: number, o: number) => void;
}

export const useProfileSidebarStore = create<SidebarState>((set, get) => ({
    notificationCount: 0,
    orderCount: 0,

    fetchSidebarCounts: async () => {
        try {
            const res = await api.get('/api/SideBar/profile-sidebar');
            const data = res.data ?? {};
            const notificationCount = Number(data.notificationCount ?? 0);
            const orderCount = Number(data.orderCount ?? 0);
            set({ notificationCount, orderCount });
        } catch (err) {
            console.error('Failed to fetch sidebar counts:', err);
        }
    },

    decreaseNotification: () => {
        const current = get().notificationCount;
        if (current > 0) set({ notificationCount: current - 1 });
    },

    setCounts: (n: number, o: number) => {
        set({ notificationCount: n, orderCount: o });
    },
}));
