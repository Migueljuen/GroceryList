// types/GroceryList.ts

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
    email: string;
    items: GroceryItem[];
    sharedWith?: string[];
}