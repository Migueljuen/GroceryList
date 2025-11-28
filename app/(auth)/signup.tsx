import {
    FirebaseAuthTypes
} from '@react-native-firebase/auth';
import { signUp } from '../../firebase/auth';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

    const handleSignUp = async () => {
        // Clear previous errors
        setError('');

        // Validation
        if (!email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            const userCredential = await signUp(email, password);
            setUser(userCredential.user);
            router.replace('/(tabs)');
            console.log(user);
        } catch (err: any) {
            console.error("Error during sign up:", err);
            // Handle Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already in use');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak');
            } else {
                setError('Failed to create account. Please try again.');
            }
        }
    };


    return (
        <SafeAreaView className='px-8 flex justify-around h-screen  '>

            <View className='gap-12'>

                {/* text */}
                <View className='gap-2'>
                    <Text className='font-dm-semibold tracking-tighter text-3xl text-black/90'>Let&apos;s create your {'\n'}account.</Text>
                    <Text className='font-dm-light text-2xl text-black/50 '>Welcome to ShareEat!</Text>
                </View>

                {/* inputs */}
                <View className='gap-4'>
                    <View className='gap-2'>
                        <Text className='font-dm-medium'>Email</Text>
                        <TextInput
                            placeholder="Enter Email"
                            value={email}
                            onChangeText={setEmail}
                            className='border border-gray-400 rounded-xl p-3 font-dm'
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>


                    <View className='gap-2'>
                        <Text className='font-dm-medium'>Password</Text>
                        <TextInput
                            placeholder="Enter Password"
                            value={password}
                            secureTextEntry
                            onChangeText={setPassword}
                            className='border border-gray-400 rounded-xl p-3 font-dm'
                        />
                    </View>

                    <View className='gap-2'>
                        <Text className='font-dm-medium'>Confirm Password</Text>
                        <TextInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            secureTextEntry
                            onChangeText={setConfirmPassword}
                            className='border border-gray-400 rounded-xl p-3 font-dm'
                        />
                    </View>

                    {/* Error message */}
                    {error ? (
                        <Text className='text-red-500 font-dm text-sm'>{error}</Text>
                    ) : null}
                </View>
            </View>



            {/* <Button title="Sign Up" onPress={handleSignUp} /> */}
            <View className='gap-4' >
                <Pressable className='bg-[#1a1a1a] rounded-xl p-3' onPress={handleSignUp} >
                    <Text className='text-white/90 text-center font-dm'>Create account</Text>
                </Pressable>
                <Text className="text-center text-black/60 font-dm">
                    Already have an account?{" "}
                    <Text
                        onPress={() => router.replace('/login')}
                        className="text-black/90 font-dm-medium"
                    >
                        Login
                    </Text>
                </Text>
            </View>

        </SafeAreaView>
    );
}