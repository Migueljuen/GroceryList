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

    items: GroceryItem[];
    sharedWith?: string[];
}