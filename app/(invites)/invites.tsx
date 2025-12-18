import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';
import {
    acceptInvite,
    declineInvite,
    GroceryList,
    subscribeInvites,
} from '../../firebase/groceryLists';

export default function PendingInvites() {
    const router = useRouter();
    const user = auth().currentUser;

    const [invites, setInvites] = useState<GroceryList[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const unsubscribe = subscribeInvites(
            user.email.toLowerCase(),
            lists => {
                setInvites(lists);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [user?.email]);

    /* =======================
       Actions
    ======================= */

    const handleAccept = async (listId: string) => {
        if (!user?.uid || !user?.email) return;

        try {
            await acceptInvite(
                listId,
                user.email.toLowerCase(),
                user.uid
            );
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to accept invite');
        }
    };

    const handleDecline = async (listId: string) => {
        if (!user?.email) return;

        try {
            await declineInvite(
                listId,
                user.email.toLowerCase()
            );
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to decline invite');
        }
    };

    /* =======================
       UI
    ======================= */

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-200">
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="close" size={26} />
                </Pressable>
                <Text className="ml-4 text-lg font-dm-semibold">
                    Pending Invites
                </Text>
            </View>

            <ScrollView className="flex-1 px-6">
                {loading && (
                    <Text className="mt-6 text-gray-500">
                        Loading invites...
                    </Text>
                )}

                {!loading && invites.length === 0 && (
                    <Text className="mt-6 text-gray-500">
                        No pending invites
                    </Text>
                )}

                {invites.map(list => (
                    <View
                        key={list.id}
                        className="mt-6 p-4 border border-gray-200 rounded-xl"
                    >
                        <Text className="text-lg font-dm-semibold">
                            {list.title}
                        </Text>

                        <Text className="text-sm text-gray-500 mt-1">
                            Invited by: {list.email}
                        </Text>

                        <View className="flex-row justify-end mt-4 gap-3">
                            <Pressable
                                onPress={() => handleDecline(list.id)}
                                className="px-4 py-2 rounded-lg border border-gray-300"
                            >
                                <Text className="text-gray-600">Decline</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => handleAccept(list.id)}
                                className="px-4 py-2 rounded-lg bg-black"
                            >
                                <Text className="text-white">Accept</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
