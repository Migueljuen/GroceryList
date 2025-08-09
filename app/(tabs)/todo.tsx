
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

import Feather from '@expo/vector-icons/Feather';
interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export default function ToDo() {
    const [userInput, setUserInput] = useState<string>("");
    const [todos, setTodos] = useState<Todo[]>([]);

    // useEffect(() => {

    // }, [userInput])

    const addTodo = (): void => {
        if (userInput.trim() === "") {
            Alert.alert("Please enter a todo item.");
            return;
        }
        const newTodo: Todo = {
            id: Date.now().toString(),
            text: userInput.trim(),
            completed: false
        };

        setTodos([...todos, newTodo]);
        setUserInput("");
    }
    const deleteTodo = (id: string): void => {
        Alert.alert("Delete todo", `Are you sure you want to delete this todo?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setTodos(todos.filter(todo => todo.id !== id));
                    }
                }
            ]
        );
    }


    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <View className='flex-1 px-6 py-4'>
                {/* Header */}
                <View className='my-12'>
                    <Text className='text-3xl font-bold text-gray-800 text-center'>
                        Todo List
                    </Text>
                    <Text className='text-gray-500 text-center mt-1'>
                        {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
                    </Text>
                </View>

                {/* Input Section */}
                <View className='mb-6'>
                    <View className='flex-row gap-4'>
                        <TextInput
                            value={userInput}
                            onChangeText={setUserInput}
                            className='flex-1 px-4 py-3 rounded-lg border border-gray-200 '
                            onSubmitEditing={addTodo}
                            returnKeyType="done"
                        />
                        <TouchableOpacity
                            onPress={addTodo}
                            className='bg-blue-500 px-6 py-3 rounded-lg justify-center items-center'
                        >
                            <Text className='text-white font-semibold '>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Todo List */}
                <ScrollView
                    className='flex-1'
                    showsVerticalScrollIndicator={false}
                >
                    {todos.length === 0 ? (
                        <View className='flex-1 justify-center items-center py-12'>
                            <Text className='text-gray-400 text-lg text-center'>
                                No todos yet!{'\n'}Add one above to get started.
                            </Text>
                        </View>
                    ) : (
                        <View className='space-y-3'>
                            {todos.map((todo) => (
                                <View
                                    key={todo.id}
                                    className='bg-white p-4 mt-2 rounded-lg border border-gray-200 flex-row items-center justify-between'
                                >
                                    <TouchableOpacity
                                        onPress={() => console.log(`Toggle todo ${todo.id}`)}
                                        className='flex-row items-center flex-1 '
                                    >

                                        <Text className={`flex-1 text-gray-800 ${todo.completed
                                            ? 'line-through text-gray-500'
                                            : ''
                                            }`}>
                                            {todo.text}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => deleteTodo(todo.id)}
                                        className=' px-3 py-2 rounded-md ml-3'
                                    >
                                        <Text className='text-white'>
                                            <Feather name="delete" size={24} color="#2f2f2f" />

                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
