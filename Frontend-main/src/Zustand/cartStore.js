import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import logger from '../utils/logger.js';

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                const items = get().items;
                const productId = product._id || product.id;
                const existingItem = items.find((item) => (item._id || item.id) === productId);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            (item._id || item.id) === productId
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                    logger.state('cartStore', 'addItem (increment)', { productId, title: product.title, newQuantity: existingItem.quantity + 1 });
                } else {
                    set({ items: [...items, { ...product, quantity: 1 }] });
                    logger.state('cartStore', 'addItem (new)', { productId, title: product.title });
                }
            },

            removeItem: (productId) => {
                const item = get().items.find((item) => (item._id || item.id) === productId);
                set({
                    items: get().items.filter((item) => (item._id || item.id) !== productId),
                });
                logger.state('cartStore', 'removeItem', { productId, title: item?.title });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        (item._id || item.id) === productId ? { ...item, quantity } : item
                    ),
                });
                logger.state('cartStore', 'updateQuantity', { productId, quantity });
            },

            clearCart: () => {
                const itemCount = get().items.length;
                set({ items: [] });
                logger.state('cartStore', 'clearCart', { itemsRemoved: itemCount });
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0);
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);

export default useCartStore;
