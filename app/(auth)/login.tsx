import {
    FirebaseAuthTypes
} from '@react-native-firebase/auth';
import { signIn } from '../../firebase/auth';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        // Validate inputs
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill in all fields'
            });
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await signIn(email, password);
            setUser(userCredential.user);
            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Signed in successfully'
            });

            // Small delay to show success toast
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 500);

            console.log(user);
        } catch (err: any) {
            // Don't log to console.error to avoid Expo error overlay
            console.log("Sign in failed:", err?.code || err?.message);

            // Show user-friendly error messages
            let errorMessage = 'Failed to sign in. Please try again.';

            if (err?.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password';
            } else if (err?.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (err?.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (err?.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (err?.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (err?.message) {
                errorMessage = err.message;
            }

            Toast.show({
                type: 'error',
                text1: 'Sign In Failed',
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
                        Let&apos;s Sign you in.
                    </Text>
                    <Text className='font-dm-light text-2xl text-black/50'>
                        Welcome back to
                        {'\n'}
                        ShareEat!
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
                </View>
            </View>

            <View className='gap-4'>
                <Pressable
                    className={`rounded-xl p-3 ${isLoading ? 'bg-gray-400' : 'bg-[#1a1a1a]'}`}
                    onPress={handleSignIn}
                    disabled={isLoading}
                >
                    <Text className='text-white/90 text-center font-dm'>
                        {isLoading ? 'Signing in...' : 'Login'}
                    </Text>
                </Pressable>
                <Text className="text-center text-black/60 font-dm">
                    Don&apos;t have an account yet?{" "}
                    <Text
                        onPress={() => router.replace('/signup')}
                        className="text-black/90 font-dm-semibold"
                    >
                        Sign Up
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}