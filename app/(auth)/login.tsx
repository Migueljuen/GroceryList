import {
    FirebaseAuthTypes
} from '@react-native-firebase/auth';
import { signIn } from '../../firebase/auth';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);


    const handleSignIn = async () => {
        try {
            const userCredential = await signIn(email, password);
            setUser(userCredential.user);
            router.replace('/(tabs)');
            console.log(user);
        } catch (err) {
            console.error("Error during sign in:", err);
        }
    };



    return (
        <SafeAreaView className='px-8 flex justify-around h-screen  '>

            <View className='gap-12'>

                {/* text */}
                <View className='gap-2'>
                    <Text className='font-dm-semibold tracking-tighter text-3xl text-black/90'>Let&apos;s Sign you in.</Text>
                    <Text className='font-dm-light text-2xl text-black/50 '>Welcome back

                        to
                        {'\n'}
                        Todo!</Text>
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
                </View>
            </View>



            {/* <Button title="Sign Up" onPress={handleSignUp} /> */}
            <View className='gap-4' >
                <Pressable className='bg-[#1a1a1a] rounded-xl p-3' onPress={handleSignIn} >

                    <Text className='text-white/90 text-center font-dm'>Login</Text>
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
