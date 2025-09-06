'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/lib/axios';

interface CartContextType {
    count: number;
    setCountFromApi: (newCount: number) => void;
    refresh: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [count, setCount] = useState(0);

    const loadCartCount = async () => {
        try {
            const response = await api.get('/api/Cart/my-cart');
            setCount(response.data.cartItemsCount || 0);
        } catch (err) {
            console.error('Failed to load cart count', err);
            setCount(0);
        }
    };

    useEffect(() => {
        loadCartCount();
    }, []);

    const setCountFromApi = (newCount: number) => setCount(newCount);

    const refresh = () => loadCartCount();

    return (
        <CartContext.Provider value={{ count, setCountFromApi, refresh }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
