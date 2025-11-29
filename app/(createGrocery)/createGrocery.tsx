// app/(createGrocery)/createGrocery.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useGroceryLists } from '../../context/GroceryListContext';
import { addGroceryList, updateGroceryList } from '../../firebase/groceryLists';

interface GroceryItem {
    id: string;
    text: string;
    completed: boolean;
}

export default function CreateGrocery() {
    const router = useRouter();
    const { user } = useAuth();
    const { groceryLists } = useGroceryLists();
    const { id } = useLocalSearchParams<{ id?: string }>();

    // Check if we're editing an existing list
    const existingList = id ? groceryLists.find(list => list.id === id) : null;

    const [title, setTitle] = useState(existingList?.title || '');
    const [items, setItems] = useState<GroceryItem[]>(existingList?.items || []);
    const [newItemText, setNewItemText] = useState('');
    const [isSaved, setIsSaved] = useState(!!existingList); // Already saved if editing
    const [listId, setListId] = useState<string | null>(id || null);

    // Update items when existing list changes (real-time updates)
    useEffect(() => {
        if (id && existingList) {
            setTitle(existingList.title);
            setItems(existingList.items);
            setIsSaved(true);
            setListId(id);
        }
    }, [existingList, id]);

    const handleAddItem = () => {
        if (newItemText.trim() === '') return;

        const newItem: GroceryItem = {
            id: Date.now().toString(),
            text: newItemText.trim(),
            completed: false,
        };

        setItems([...items, newItem]);
        setNewItemText('');
    };

    const handleToggleItem = (itemId: string) => {
        setItems(items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        ));
    };

    const handleItemTextChange = (itemId: string, newText: string) => {
        setItems(items.map(item =>
            item.id === itemId ? { ...item, text: newText } : item
        ));
    };

    const handleDeleteItem = (itemId: string) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    const handleSaveList = async () => {
        if (title.trim() === '') {
            Alert.alert('Error', 'Please enter a title for your grocery list');
            return;
        }

        try {
            if (listId) {
                // UPDATE existing list
                await updateGroceryList(listId, { title, items });
                Alert.alert('Success', 'Grocery list updated!');
            } else {
                // CREATE new list
                const docRef = await addGroceryList(
                    title,
                    user?.displayName || 'Anonymous',
                    items
                );
                setListId(docRef);
            }

            setIsSaved(true);

        } catch (error) {
            console.error('Error saving grocery list:', error);
            Alert.alert('Error', 'Failed to save grocery list. Please try again.');
        }
    };

    const handleShare = () => {
        Alert.alert('Share', 'Share functionality coming soon!');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="black" />
                    </Pressable>

                    {isSaved ? (
                        <Pressable onPress={handleShare}>
                            <Ionicons name="share-outline" size={24} color="black" />
                        </Pressable>
                    ) : (
                        <Pressable onPress={handleSaveList}>
                            <Text className='font-dm-medium text-black/90 text-lg'>Done</Text>
                        </Pressable>
                    )}
                </View>

                {/* Title Input */}
                <View className="px-6 mb-8">
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Title Here"
                        className="text-2xl font-dm-semibold text-black/90"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Items List */}
                <ScrollView className="flex-1 px-6">
                    {items.map((item) => (
                        <View
                            key={item.id}
                            className="flex-row items-center gap-3 mb-4"
                        >
                            <Pressable onPress={() => handleToggleItem(item.id)}>
                                <Ionicons
                                    name={item.completed ? "radio-button-on-outline" : "radio-button-off-outline"}
                                    size={24}
                                    color={item.completed ? "#10B981" : "#D1D5DB"}
                                />
                            </Pressable>

                            <TextInput
                                value={item.text}
                                onChangeText={(newText) => handleItemTextChange(item.id, newText)}
                                placeholder="Item name"
                                placeholderTextColor="#9CA3AF"
                                editable={!item.completed}
                                className={`flex-1 text-base border-b border-gray-200 pb-2 ${item.completed ? 'text-black/60' : 'text-black/90'
                                    }`}
                            />

                            <Pressable onPress={() => handleDeleteItem(item.id)}>
                                <Ionicons
                                    name="close-circle-outline"
                                    size={20}
                                    color="#9CA3AF"
                                />
                            </Pressable>
                        </View>
                    ))}

                    {/* Add New Item Input */}
                    <View className="flex-row items-center gap-3 mb-4">
                        <Ionicons
                            name="radio-button-off-outline"
                            size={24}
                            color="#D1D5DB"
                        />
                        <TextInput
                            value={newItemText}
                            onChangeText={setNewItemText}
                            placeholder="Add item..."
                            className="flex-1 font-dm text-base border-b border-gray-200 pb-2"
                            placeholderTextColor="#9CA3AF"
                            onSubmitEditing={handleAddItem}
                            returnKeyType="done"
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}