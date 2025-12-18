import { Ionicons } from '@expo/vector-icons';
import {
    FirebaseAuthTypes
} from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroceryListCard } from '../../components/GroceryListCard';
import { useAuth } from '../../context/AuthContext';
import { useGroceryLists } from '../../context/GroceryListContext';
import { logout } from '../../firebase/auth';

export default function ToDo() {

    // grocery list stuff

    const { groceryLists, loading: listsLoading } = useGroceryLists();
    const navigation = useNavigation();

    const { user, loading: authLoading } = useAuth();
    const [user1, setUser1] = useState<FirebaseAuthTypes.User | null>(null);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            setUser1(null);
        } catch (err) {
            console.error("Error during logout:", err);
        }
    };

    const handleNotification = async () => {
        router.push('/(invites)/invites')
    }



    const handleListPress = (id: string) => {
        router.push(`/(createGrocery)/createGrocery?id=${id}`); // ⬅️ Pass ID as query param
    };

    const pinnedLists = groceryLists.filter(list => list.isPinned);
    const unpinnedLists = groceryLists.filter(list => !list.isPinned);

    // Group by year
    const listsByYear = unpinnedLists.reduce((acc, list) => {
        const year = list.createdAt.getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(list);
        return acc;
    }, {} as Record<number, typeof groceryLists>);

    if (authLoading || listsLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-6 py-4 gap-4">
                {/* Header */}
                <View className='flex flex-row justify-between items-center'>
                    <View className="mt-12 flex flex-col items-start ">

                        <Text className="text-black/70 font-dm text-lg ">
                            Ready when you are,
                        </Text>
                        <Text className="font-dm-semibold text-3xl tracking-tighter text-black/90 capitalize w-full">
                            {user?.email?.split('@')[0] || 'User'}
                        </Text>
                    </View>
                    <View className='flex flex-row gap-8'>
                        <Pressable className='mt-6' onPress={handleNotification} >
                            <Ionicons name="notifications-outline" size={20} color="#9CA3AF" />

                        </Pressable>
                        <Pressable className='mt-6' onPress={handleLogout} >
                            <Ionicons name="log-out-outline" size={20} color="#9CA3AF" />

                        </Pressable>
                    </View>
                </View>

                {/* Search Bar */}
                <View className="">
                    <View className="flex-row items-center px-4 py-1 bg-gray-100 rounded-lg">
                        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 font-dm text-red-600"
                            placeholder="Search "
                            placeholderTextColor="#9CA3AF"

                        />
                    </View>
                </View>



                {/* Grocery Lists Section */}
                <ScrollView >
                    {/* Pinned Section */}
                    {pinnedLists.length > 0 && (
                        <View className="mb-6">
                            <Text className="text-xl font-dm-semibold text-black/90 mb-4">
                                Pinned
                            </Text>
                            {pinnedLists.map(list => (
                                <GroceryListCard
                                    key={list.id}
                                    list={list}
                                    onPress={handleListPress}
                                />
                            ))}
                        </View>
                    )}

                    {/* Lists by Year */}
                    {Object.keys(listsByYear)
                        .sort((a, b) => Number(b) - Number(a))
                        .map(year => (
                            <View key={year} className="mb-6">
                                <Text className="text-xl font-dm-semibold text-black/90 mb-4">
                                    {year}
                                </Text>
                                {listsByYear[Number(year)].map(list => (
                                    <GroceryListCard
                                        key={list.id}
                                        list={list}
                                        onPress={handleListPress}
                                    />
                                ))}
                            </View>
                        ))}
                </ScrollView>

                <Pressable onPress={() => router.push("/(createGrocery)/createGrocery")} className='flex flex-row items-center gap-2 absolute bottom-24 right-6'>
                    <Ionicons name="add-circle-outline" size={28} color="black" />
                    <Text className='font-dm-semibold'>New list</Text>
                </Pressable>



            </View>
        </SafeAreaView >
    );
}