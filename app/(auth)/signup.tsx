import {
    FirebaseAuthTypes
} from '@react-native-firebase/auth';
import { signUp } from '../../firebase/auth';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        // Validation
        if (!email || !password || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'All fields are required'
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'Passwords do not match'
            });
            return;
        }

        if (password.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Password must be at least 6 characters'
            });
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await signUp(email, password);
            setUser(userCredential.user);
            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Account created successfully'
            });

            // Small delay to show success toast
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 500);

            console.log(user);
        } catch (err: any) {
            // Don't log to console.error to avoid Expo error overlay
            console.log("Sign up failed:", err?.code || err?.message);

            let errorMessage = 'Failed to create account. Please try again.';

            // Handle Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already in use';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            } else if (err.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password accounts are not enabled';
            } else if (err?.message) {
                errorMessage = err.message;
            }

            Toast.show({
                type: 'error',
                text1: 'Sign Up Failed',
                text2: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className='px-8 flex justify-around h-screen'>
            <View className='gap-12'>
                {/* text */}
                <View className='gap-2'>
                    <Text className='font-dm-semibold tracking-tighter text-3xl text-black/90'>
                        Let&apos;s create your {'\n'}account.
                    </Text>
                    <Text className='font-dm-light text-2xl text-black/50'>
                        Welcome to ShareEat!
                    </Text>
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
                            editable={!isLoading}
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
                            editable={!isLoading}
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
                            editable={!isLoading}
                        />
                    </View>
                </View>
            </View>

            <View className='gap-4'>
                <Pressable
                    className={`rounded-xl p-3 ${isLoading ? 'bg-gray-400' : 'bg-[#1a1a1a]'}`}
                    onPress={handleSignUp}
                    disabled={isLoading}
                >
                    <Text className='text-white/90 text-center font-dm'>
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </Text>
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