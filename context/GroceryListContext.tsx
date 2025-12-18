import auth from '@react-native-firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

import { subscribeGroceryLists } from '../firebase/groceryLists';
import { GroceryList } from '../types/GroceryList';

const GroceryListContext = createContext<{
    groceryLists: GroceryList[];
    loading: boolean;
} | undefined>(undefined);

export function GroceryListProvider({ children }: { children: React.ReactNode }) {
    const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeLists: (() => void) | undefined;

        // Listen to auth state
        const unsubscribeAuth = auth().onAuthStateChanged(user => {
            // Cleanup old Firestore listener
            if (unsubscribeLists) {
                unsubscribeLists();
                unsubscribeLists = undefined;
            }

            if (!user) {
                // Logged out
                setGroceryLists([]);
                setLoading(false);
                return;
            }

            // Logged in → subscribe
            setLoading(true);
            unsubscribeLists = subscribeGroceryLists(
                lists => {
                    setGroceryLists(lists);
                    setLoading(false);
                },
                error => {
                    console.error('Error loading grocery lists:', error);
                    setLoading(false);
                }
            );
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeLists) unsubscribeLists();
        };
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
