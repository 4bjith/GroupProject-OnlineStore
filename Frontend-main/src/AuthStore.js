import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import logger from './utils/logger.js'

const authStore = create(
    persist(
        (set) => ({
            token: null,
            role: null,
            addUser: (userdata) => {
                logger.state('authStore', 'addUser', userdata)
                set((state) => ({
                    user: userdata,
                }))
            },
            addToken: (token, role) => {
                logger.state('authStore', 'addToken', { role })
                set(() => ({
                    token: token,
                    role: role,
                }))
            },
            removeToken: () => {
                logger.state('authStore', 'removeToken')
                set((state) => ({
                    token: null,
                    role: null,
                }))
            },
            logout: () => {
                logger.state('authStore', 'logout')
                set((state) => ({
                    token: null,
                    user: null,
                    role: null,
                }))
            },
        }),
        {
            name: "authStore",
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default authStore