import {
    FirebaseAuthTypes
} from '@react-native-firebase/auth';
import { logout, signIn, signUp } from '../../firebase/auth';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
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
        } catch (err) {
            console.error("Error during sign in:", err);
        }
    };

    const handleSignUp = async () => {
        try {
            const userCredential = await signUp(email, password);
            setUser(userCredential.user);
        } catch (err) {
            console.error("Error during sign up:", err);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Error during logout:", err);
        }
    };


    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                {user ? (
                    <View>
                        <Text>Welcome {user.email}</Text>
                        <Button title="Logout" onPress={handleLogout} />
                    </View>
                ) : (
                    <>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            secureTextEntry
                            onChangeText={setPassword}
                            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
                        />
                        <Button title="Sign Up" onPress={handleSignUp} />
                        <Button title="Login" onPress={handleSignIn} />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}
