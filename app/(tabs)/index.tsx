import { Ionicons } from '@expo/vector-icons';
import {
    FirebaseAuthTypes
} from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroceryListCard } from '../../components/GroceryListCard';
import { useAuth } from '../../context/AuthContext';
import { useGroceryLists } from '../../context/GroceryListContext';
import { logout } from '../../firebase/auth';
import {
    addTodo,
    deleteTodo,
    subscribeTodos,
    Todo
} from '../../firebase/todos';
export default function ToDo() {
    //todo stuff
    const [userInput, setUserInput] = useState<string>('');
    const [todos, setTodos] = useState<Todo[]>([]);

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
    // Handle adding a new todo
    const handleAddTodo = async () => {
        try {
            await addTodo(userInput);
            setUserInput('');
        } catch (error) {
            console.error('Error adding todo:', error);
            Alert.alert('Error', 'Failed to add todo. Please try again.');

        }
    };

    // Handle deleting a todo
    const handleDeleteTodo = async (id: string) => {
        Alert.alert(
            'Delete todo',
            'Are you sure you want to delete this todo?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTodo(id);
                        } catch (error) {
                            console.error('Error deleting todo:', error);
                            Alert.alert('Error', 'Failed to delete todo. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    // Read todo
    useEffect(() => {
        const unsubscribe = subscribeTodos(
            (todosList) => setTodos(todosList),
            (error) => {
                Alert.alert('Error', 'Failed to load todos. Please check your connection.');
            }
        );

        return unsubscribe;
    }, []);



    const handleListPress = (id: string) => {
        (navigation as any).navigate('GroceryListDetails', { listId: id });
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
                        <Text className="font-dm-semibold text-3xl tracking-tighter text-black/90">
                            {user?.displayName || 'User'} {/* ⬅️ Display user name */}
                        </Text>
                    </View>

                    <Pressable className='mt-6' onPress={handleLogout} >
                        <Text className='text-red-500 text-center font-dm'> Logout</Text>
                    </Pressable>
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

                {/* Input Section */}

                <View className="mb-6 hidden">
                    <View className="flex-row gap-4 items-center">
                        <TextInput
                            value={userInput}
                            onChangeText={setUserInput}
                            className="flex-1 px-4 py-3 rounded-lg border-b border-gray-400"
                            placeholder="Enter a new task"
                            onSubmitEditing={handleAddTodo}
                            returnKeyType="done"
                        />

                        {/* <CirclePlus size={32} color="black" onPress={handleAddTodo} /> */}
                        <Ionicons onPress={handleAddTodo} name="add-circle-outline" size={28} color="black" />


                    </View>
                </View>


                {/* Grocery Lists Section */}
                <ScrollView className="flex-1 ">
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

                {/* Todo List */}
                <ScrollView className="flex-1 hidden" showsVerticalScrollIndicator={false}>
                    {todos.length === 0 ? (
                        <View className="flex-1 justify-center items-center py-12">
                            <Text className="text-gray-400 text-lg text-center">
                                No todos yet!{'\n'}Add one above to get started.
                            </Text>
                        </View>
                    ) : (
                        <View className="space-y-3">
                            {todos.map((todo) => (
                                <View
                                    key={todo.id}
                                    className="bg-white p-4 mt-2 rounded-lg flex-row items-center justify-between"
                                >

                                    <Text
                                        className={`flex-1 text-black/90 border-b border-gray-200 py-4 ${todo.completed ? 'line-through text-gray-500' : ''
                                            }`}
                                    >
                                        {todo.text}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => handleDeleteTodo(todo.id)}
                                        className=""
                                    >
                                        <Ionicons
                                            name="radio-button-off-outline"
                                            size={24}
                                            color="#2f2f2f"
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>



            </View>
        </SafeAreaView>
    );
}