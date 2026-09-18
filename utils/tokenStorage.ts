import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// expo-secure-store has no native module on web (it depends on Keychain/Keystore),
// so on web we fall back to localStorage to keep the login session working there too.
export async function getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
        return window.localStorage.getItem('token');
    }
    return SecureStore.getItemAsync('token');
}

export async function setToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
        window.localStorage.setItem('token', token);
        return;
    }
    await SecureStore.setItemAsync('token', token);
}

export async function deleteToken(): Promise<void> {
    if (Platform.OS === 'web') {
        window.localStorage.removeItem('token');
        return;
    }
    await SecureStore.deleteItemAsync('token');
}
