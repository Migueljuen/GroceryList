import auth from '@react-native-firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { GroceryList, subscribeInvites } from '../firebase/groceryLists';

const InviteContext = createContext<{
    invites: GroceryList[];
    loading: boolean;
}>({
    invites: [],
    loading: true,
});

export const InviteProvider = ({ children }: { children: React.ReactNode }) => {
    const [invites, setInvites] = useState<GroceryList[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth().currentUser;
        if (!user?.email) return;

        const unsub = subscribeInvites(user.email, lists => {
            setInvites(lists);
            setLoading(false);
        });

        return unsub;
    }, []);

    return (
        <InviteContext.Provider value={{ invites, loading }}>
            {children}
        </InviteContext.Provider>
    );
};

export const useInvites = () => useContext(InviteContext);
