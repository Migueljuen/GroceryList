// app/(modal)/manageMembers.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {
    doc,
    FirebaseFirestoreTypes,
    getFirestore,
    onSnapshot,
} from '@react-native-firebase/firestore';

import { inviteUserByEmail } from '../../firebase/groceryLists';

type GroceryListDoc = {
    ownerId: string;
    memberIds: string[];
    memberEmails: string[];
    invitedEmails?: string[];
};

export default function ManageMembers() {
    const router = useRouter();
    const { listId } = useLocalSearchParams<{ listId?: string }>();

    const currentUser = auth().currentUser;

    const [email, setEmail] = useState('');
    const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
    const [memberEmails, setMemberEmails] = useState<string[]>([]);
    const [ownerId, setOwnerId] = useState<string | null>(null);

    /* =========================
       Subscribe to list
    ========================= */

    useEffect(() => {
        if (!listId) return;

        const firestore = getFirestore(getApp());
        const ref = doc(firestore, 'groceryLists', listId);

        const unsubscribe = onSnapshot(
            ref,
            (snap: FirebaseFirestoreTypes.DocumentSnapshot) => {
                if (!snap.exists()) return;

                const data = snap.data() as GroceryListDoc;

                setInvitedEmails(data.invitedEmails ?? []);
                setMemberEmails(data.memberEmails ?? []);
                setOwnerId(data.ownerId);
            }
        );

        return unsubscribe;
    }, [listId]);

    /* =========================
       Invite handler
    ========================= */

    const handleInvite = async () => {
        if (!email.trim() || !listId) return;

        try {
            await inviteUserByEmail(listId, email.trim());

            Toast.show({
                type: 'success',
                text1: 'Invite sent',
                text2: `${email} has been invited`,
            });

            setEmail('');
        } catch (e) {
            console.error('Invite failed', e);

            Toast.show({
                type: 'error',
                text1: 'Invite failed',
                text2: 'Could not invite user',
            });
        }
    };

    /* =========================
       UI
    ========================= */

    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            {/* Header */}
            <View className="flex-row items-center py-4">
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="close" size={28} />
                </Pressable>
                <Text className="ml-4 text-lg font-semibold">
                    Manage Members
                </Text>
            </View>

            {/* Invite */}
            <Text className="mt-6 mb-2 font-medium">Invite by email</Text>
            <View className="flex-row gap-2">
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="email@example.com"
                    autoCapitalize="none"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                />
                <Pressable
                    onPress={handleInvite}
                    className="bg-black px-4 rounded-lg justify-center"
                >
                    <Text className="text-white">Invite</Text>
                </Pressable>
            </View>

            <View className=''>
                {/* Members */}
                <Text className="mt-8 mb-2 font-medium">Members</Text>

                {memberEmails.length === 0 ? (
                    <Text className="text-gray-500">No members</Text>
                ) : (
                    <FlatList
                        data={memberEmails}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            const isYou = item === currentUser?.email;
                            const isOwner = currentUser?.uid === ownerId;

                            return (
                                <View className="flex-row justify-between py-2 ">
                                    <Text>{isYou ? 'You' : item}</Text>
                                    {isOwner && isYou && (
                                        <Text className="text-xs text-gray-500">
                                            Owner
                                        </Text>
                                    )}
                                </View>
                            );
                        }}
                    />
                )}

                {/* Pending Invites */}
                <Text className="mt-8  mb-2 font-medium">
                    Pending Invites
                </Text>

                {invitedEmails.length === 0 ? (
                    <Text className="text-gray-500">
                        No pending invites
                    </Text>
                ) : (
                    <FlatList
                        data={invitedEmails}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <View className="py-2 border-b border-gray-200">
                                <Text>{item}</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
