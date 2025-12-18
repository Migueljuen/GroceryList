// types/GroceryList.ts

export interface GroceryItem {
    id: string;
    text: string;
    completed: boolean;
}
// export interface GroceryList {
//     id: string;
//     title: string;
//     owner: string;
//     createdAt: Date;
//     isPinned?: boolean;
//     email: string;
//     items: GroceryItem[];
//     sharedWith?: string[];
// }


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
