// contexts/GroceryListContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

import { subscribeGroceryLists } from '../firebase/groceryLists';
import { GroceryList } from '../types/GroceryList';

const USE_DUMMY = false; // ⬅️ Set to false to use Firebase

const GroceryListContext = createContext<{
    groceryLists: GroceryList[];
    loading: boolean;
} | undefined>(undefined);

export function GroceryListProvider({ children }: { children: React.ReactNode }) {
    const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Firebase implementation
        const unsubscribe = subscribeGroceryLists(
            (lists) => {
                setGroceryLists(lists);
                setLoading(false);
            },
            (error) => {
                console.error('Error loading grocery lists:', error);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, []);

    return (
        <GroceryListContext.Provider value={{ groceryLists, loading }}>
            {children}
        </GroceryListContext.Provider>
    );
}

export function useGroceryLists() {
    const context = useContext(GroceryListContext);
    if (!context) {
        throw new Error('useGroceryLists must be used within GroceryListProvider');
    }
    return context;
}