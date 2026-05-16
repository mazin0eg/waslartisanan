import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      customer: null,
      admin: null,
      setCustomer: (customer) => set({ customer, admin: null }),
      clearCustomer: () => set({ customer: null }),
      setAdmin: (admin) => set({ admin, customer: null }),
      clearAdmin: () => set({ admin: null }),
    }),
    {
      name: 'wasl-auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
