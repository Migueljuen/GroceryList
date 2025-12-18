
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    FirebaseFirestoreTypes,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from '@react-native-firebase/firestore';

/* =======================
   Types
======================= */

export interface GroceryItem {
    id: string;
    text: string;
    completed: boolean;
}

type GroceryListDoc = {
    ownerId: string;
    memberIds: string[];
    memberEmails: string[];
    invitedEmails: string[];
    title: string;
    email: string;
    items: GroceryItem[];
    isPinned: boolean;
    createdAt: FirebaseFirestoreTypes.Timestamp;
};



export interface GroceryList {
    id: string;
    ownerId: string;
    memberIds: string[];
    invitedEmails: string[];
    title: string;
    email: string;
    items: GroceryItem[];
    isPinned: boolean;
    createdAt: Date;
}




/* =======================
   Firestore setup
======================= */

const firestore = getFirestore(getApp());
const groceryListsCollection = collection(firestore, 'groceryLists');

/* =======================
   CREATE
======================= */

export const addGroceryList = async (
    title: string,
    email: string,
    items: GroceryItem[] = []
): Promise<string> => {
    const uid = auth().currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');
    if (!title.trim()) throw new Error('Title is required');

    const docRef = await addDoc(groceryListsCollection, {
        ownerId: uid,
        memberIds: [uid],
        memberEmails: [auth().currentUser?.email],
        invitedEmails: [],
        title: title.trim(),
        email,
        items,
        isPinned: false,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
};

/* =======================
   READ (SUBSCRIBE)
======================= */

export const subscribeGroceryLists = (
    onUpdate: (lists: GroceryList[]) => void,
    onError?: (error: Error) => void
) => {
    const uid = auth().currentUser?.uid;

    if (!uid) {
        onUpdate([]);
        return () => { };
    }

    const listsQuery = query(
        groceryListsCollection,
        where('memberIds', 'array-contains', uid),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(
        listsQuery,
        (snapshot) => {
            if (!snapshot) {
                onUpdate([]);
                return;
            }

            const lists: GroceryList[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                    const data = doc.data() as GroceryListDoc;

                    return {
                        id: doc.id,
                        ownerId: data.ownerId,
                        memberIds: data.memberIds,
                        title: data.title,
                        email: data.email,
                        items: data.items,
                        isPinned: data.isPinned,
                        createdAt: data.createdAt?.toDate() ?? new Date(),
                    };
                }
            );

            onUpdate(lists);
        },
        error => {
            console.log('Error fetching grocery lists:', error);
            onError?.(error);
        }
    );

};



/* =======================
   UPDATE
======================= */

export const updateGroceryList = async (
    id: string,
    updates: Partial<Omit<GroceryList, 'id' | 'createdAt'>>
): Promise<void> => {
    const listDoc = doc(firestore, 'groceryLists', id);
    await updateDoc(listDoc, updates);
};

/* =======================
   TOGGLE PIN
======================= */

export const togglePin = async (
    id: string,
    currentPinStatus: boolean
): Promise<void> => {
    const listDoc = doc(firestore, 'groceryLists', id);
    await updateDoc(listDoc, {
        isPinned: !currentPinStatus,
    });
};

/* =======================
   DELETE
======================= */

export const deleteGroceryList = async (id: string): Promise<void> => {
    const listDoc = doc(firestore, 'groceryLists', id);
    await deleteDoc(listDoc);
};



/* =======================
   INVITE MEMBER
======================= */

export const inviteUserByEmail = async (
    listId: string,
    email: string
) => {
    const listRef = doc(firestore, 'groceryLists', listId);

    await updateDoc(listRef, {
        invitedEmails: arrayUnion(email.toLowerCase()),
    });
};


/* =======================
   PENDING INVITES
======================= */


export const subscribeInvites = (
    email: string,
    onUpdate: (lists: GroceryList[]) => void
) => {
    const q = query(
        groceryListsCollection,
        where('invitedEmails', 'array-contains', email)
    );

    return onSnapshot(
        q,
        (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
            const lists: GroceryList[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                    const data = doc.data() as GroceryListDoc;

                    return {
                        id: doc.id,
                        ownerId: data.ownerId,
                        memberIds: data.memberIds,
                        title: data.title,
                        invitedEmails: data.invitedEmails ?? [],
                        email: data.email,
                        items: data.items,
                        isPinned: data.isPinned,
                        createdAt: data.createdAt?.toDate() ?? new Date(),
                    };

                }
            );

            onUpdate(lists);
        }
    );
};


/* =======================
   ACCEPT INVITES
======================= */

export const acceptInvite = async (
    listId: string,
    email: string,
    uid: string
) => {
    const ref = doc(firestore, 'groceryLists', listId);

    await updateDoc(ref, {
        invitedEmails: arrayRemove(email.toLowerCase()),
        memberIds: arrayUnion(uid),
        memberEmails: arrayUnion(email.toLowerCase()),
    });
};


/* =======================
 DECLINE
======================= */


export const declineInvite = async (
    listId: string,
    email: string
) => {
    const ref = doc(firestore, 'groceryLists', listId);

    await updateDoc(ref, {
        invitedEmails: arrayRemove(email.toLowerCase()),
    });
};


/* =======================
 REMOVE
======================= */
export const removeMember = async (
    listId: string,
    memberUid: string
) => {
    const ref = doc(firestore, 'groceryLists', listId);

    await updateDoc(ref, {
        memberIds: arrayRemove(memberUid),
    });
};
