// types/GroceryList.ts
export interface GroceryList {
    id: string;
    title: string;
    owner: string;
    createdAt: Date;
    isPinned?: boolean;
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';

    // items?: GroceryItem[];
    // sharedWith?: string[];
}