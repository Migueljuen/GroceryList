// data/dummyGroceryLists.ts

import { GroceryList } from '../types/GroceryList';

export const DUMMY_GROCERY_LISTS: GroceryList[] = [
    {
        id: '1',
        title: "Grocery for Jerrly's Birthday",
        owner: 'Jerrly',
        createdAt: new Date('2025-10-25'),
        isPinned: true,
        color: 'blue',
    },
    {
        id: '2',
        title: 'Christmas Eve Grocery',
        owner: 'Maedein',
        createdAt: new Date('2025-12-23'),
        isPinned: false,
        color: 'green',
    },
    {
        id: '3',
        title: 'Halloween Candies',
        owner: 'Owner',
        createdAt: new Date('2025-12-23'),
        isPinned: false,
        color: 'red',
    },
];