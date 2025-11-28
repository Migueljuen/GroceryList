// contexts/GroceryListContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { DUMMY_GROCERY_LISTS } from '../data/dummyGroceryLists';
import { GroceryList } from '../types/GroceryList';

const USE_DUMMY = true;

const GroceryListContext = createContext<{
    groceryLists: GroceryList[];
    loading: boolean;
} | undefined>(undefined);

export function GroceryListProvider({ children }: { children: React.ReactNode }) {
    const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (USE_DUMMY) {
            setGroceryLists(DUMMY_GROCERY_LISTS);
            setLoading(false);
            return;
        }

        // Firebase implementation:
        // import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
        // import { db } from '../firebase';
        //
        // const q = query(
        //   collection(db, 'groceryLists'),
        //   orderBy('createdAt', 'desc')
        // );
        //
        // const unsubscribe = onSnapshot(q, (snapshot) => {
        //   const lists = snapshot.docs.map(doc => ({
        //     id: doc.id,
        //     ...doc.data(),
        //     createdAt: doc.data().createdAt.toDate(),
        //   })) as GroceryList[];
        //   setGroceryLists(lists);
        //   setLoading(false);
        // });
        //
        // return unsubscribe;
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