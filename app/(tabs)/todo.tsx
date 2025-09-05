import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    addTodo,
    deleteTodo,
    subscribeTodos,
    Todo
} from '../../firebase/todos';

export default function ToDo() {
    const [userInput, setUserInput] = useState<string>('');
    const [todos, setTodos] = useState<Todo[]>([]);

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



    // Read
    useEffect(() => {
        const unsubscribe = subscribeTodos(
            (todosList) => setTodos(todosList),
            (error) => {
                Alert.alert('Error', 'Failed to load todos. Please check your connection.');
            }
        );

        return unsubscribe;
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 px-6 py-4">
                {/* Header */}
                <View className="my-12">
                    <Text className="text-3xl font-bold text-gray-800 text-center">
                        Todo List
                    </Text>
                    <Text className="text-gray-500 text-center mt-1">
                        {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
                    </Text>
                </View>

                {/* Input Section */}
                <View className="mb-6">
                    <View className="flex-row gap-4">
                        <TextInput
                            value={userInput}
                            onChangeText={setUserInput}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-200"
                            placeholder="Enter a new todo..."
                            onSubmitEditing={handleAddTodo}
                            returnKeyType="done"
                        />
                        <TouchableOpacity
                            onPress={handleAddTodo}
                            className="bg-blue-500 px-6 py-3 rounded-lg justify-center items-center"
                        >
                            <Text className="text-white font-semibold">Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Todo List */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
                                    className="bg-white p-4 mt-2 rounded-lg border border-gray-200 flex-row items-center justify-between"
                                >

                                    <Text
                                        className={`flex-1 text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''
                                            }`}
                                    >
                                        {todo.text}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => handleDeleteTodo(todo.id)}
                                        className="px-3 py-2 rounded-md ml-3"
                                    >
                                        <Feather name="delete" size={24} color="#2f2f2f" />
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