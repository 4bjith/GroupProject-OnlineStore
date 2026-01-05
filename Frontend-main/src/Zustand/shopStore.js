import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useShopStore = create(
    persist(
        (set) => ({
            store: null,
            setStore: (store) => set({ store }),
        }),
        {
            name: 'shop-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // using sessionStorage so it clears when tab closes, or localStorage if persistence across sessions is desired. Given it's set by Layout based on URL, sessionStorage or even just memory (no persist) might be fine, but persist helps with reloads if Layout doesn't re-run immediately or deeply nested. Actually, Layout always renders. Simple create might be enough.
        }
    )
);

// Actually, since Layout is always present in the route hierarchy, simple state is sufficient. 
// However, persist prevents flashing if there's any delay. But wait, `Router` passes the store. 
// If `Router` fetches stores async, `store` might be null initially.
// Let's stick to a simple store first.

const useSimpleShopStore = create((set) => ({
    store: null,
    setStore: (store) => set({ store }),
}));

export default useSimpleShopStore;
