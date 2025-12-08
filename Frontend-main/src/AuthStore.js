import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const authStore = create (
    persist(
        (set)=>({
            token:null,
            addUser:(userdata)=>
                set((state)=>({
                    user:userdata,
                })),
            addToken:(item)=>
                set((state)=>({
                    token:item
                })),
            removeToken:()=>
                set((state)=>({
                    token:null,
                })),
            logout:()=>
                set((state)=>({
                    token:null,
                    user:null,
                })),
        }),
        {
            name:"authStore",
            storage:createJSONStorage(()=>localStorage),
        }
    )
)

export default authStore