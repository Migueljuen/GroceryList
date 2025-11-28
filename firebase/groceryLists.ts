import { getApp } from '@react-native-firebase/app';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from '@react-native-firebase/firestore';

export interface GroceryItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface GroceryList {
    id: string;
    title: string;
    owner: string;
    createdAt: Date;
    isPinned?: boolean;
    items: GroceryItem[];
}

const firestore = getFirestore(getApp());
const groceryListsCollection = collection(firestore, 'groceryLists');

// CREATE - Add a new grocery list
export const addGroceryList = async (
    title: string,
    owner: string,
    items: GroceryItem[] = []
): Promise<void> => {
    if (!title.trim()) return;

    await addDoc(groceryListsCollection, {
        title: title.trim(),
        owner,
        items,

        isPinned: false,
        createdAt: serverTimestamp(),
    });
};

// READ - Subscribe to all grocery lists
export const subscribeGroceryLists = (
    onUpdate: (lists: GroceryList[]) => void,
    onError?: (error: Error) => void
) => {
    const listsQuery = query(groceryListsCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
        listsQuery,
        (snapshot) => {
            const lists: GroceryList[] = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as GroceryList[];

            onUpdate(lists);
        },
        (error) => {
            console.error('Error fetching grocery lists:', error);
            onError?.(error);
        }
    );
};

// UPDATE - Update a grocery list
export const updateGroceryList = async (
    id: string,
    updates: Partial<Omit<GroceryList, 'id' | 'createdAt'>>
): Promise<void> => {
    const listDoc = doc(firestore, 'groceryLists', id);
    await updateDoc(listDoc, updates);
};

// UPDATE - Toggle pin status
export const togglePin = async (id: string, currentPinStatus: boolean): Promise<void> => {
    const listDoc = doc(firestore, 'groceryLists', id);
    await updateDoc(listDoc, {
        isPinned: !currentPinStatus,
    });
};

// DELETE - Delete a grocery list
export const deleteGroceryList = async (id: string): Promise<void> => {
    const listDoc = doc(firestore, 'groceryLists', id);
    await deleteDoc(listDoc);
};