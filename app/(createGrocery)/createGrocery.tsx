// app/(createGrocery)/createGrocery.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { addGroceryList } from '../../firebase/groceryLists';

interface GroceryItem {
    id: string;
    text: string;
    completed: boolean;
}

export default function CreateGrocery() {
    const router = useRouter();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [items, setItems] = useState<GroceryItem[]>([]);
    const [newItemText, setNewItemText] = useState('');

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

    const handleToggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const handleDeleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleSaveList = async () => {
        if (title.trim() === '') {
            Alert.alert('Error', 'Please enter a title for your grocery list');
            return;
        }

        try {
            await addGroceryList(
                title,
                user?.displayName || 'Anonymous',
                items
            );

            Alert.alert('Success', 'Grocery list created!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            console.error('Error creating grocery list:', error);
            Alert.alert('Error', 'Failed to create grocery list. Please try again.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="black" />
                    </Pressable>

                    <Pressable onPress={handleSaveList}>
                        <Text className='font-dm-medium text-black/90 text-lg'>Done</Text>
                    </Pressable>
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
                                    name={item.completed ? "checkmark-circle" : "radio-button-off-outline"}
                                    size={24}
                                    color={item.completed ? "#10B981" : "#D1D5DB"}
                                />
                            </Pressable>

                            <Text
                                className={`flex-1 text-base border-b border-gray-200 pb-2 ${item.completed ? 'line-through text-gray-400' : 'text-black/90'
                                    }`}
                            >
                                {item.text}
                            </Text>

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

                {/* New Item Button */}
                <Pressable
                    onPress={handleAddItem}
                    className="absolute bottom-24 right-6 flex-row items-center gap-2"
                >
                    <Ionicons name="add-circle-outline" size={28} color="black" />
                    <Text className="font-dm-semibold text-base">New Item</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}