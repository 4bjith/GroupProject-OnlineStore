import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const authStore = create(
    persist(
        (set) => ({
            token: null,
            role: null,
            addUser: (userdata) =>
                set((state) => ({
                    user: userdata,
                })),
            addToken: (item) =>
                set((state) => ({
                    token: item,
                    role: item.role,
                })),
            removeToken: () =>
                set((state) => ({
                    token: null,
                    role: null,
                })),
            logout: () =>
                set((state) => ({
                    token: null,
                    user: null,
                    role: null,
                })),
        }),
        {
            name: "authStore",
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default authStore