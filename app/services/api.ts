import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getToken } from '../../utils/tokenStorage';

// Porta do backend Spring Boot.
const PORTA_API = 8080;

// Descobre o host onde o app está sendo servido (Metro) para falar com o backend
// na mesma máquina — assim o IP da rede não precisa ficar fixo no código.
function resolverBaseURL(): string {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:${PORTA_API}`;
    }

    const hostUri =
        Constants.expoConfig?.hostUri ??
        // @ts-expect-error campos legados de versões antigas do Expo
        Constants.expoGoConfig?.debuggerHost ??
        // @ts-expect-error idem
        Constants.manifest?.debuggerHost ??
        '';

    const host = hostUri.split(':')[0];
    if (host) {
        return `http://${host}:${PORTA_API}`;
    }

    // Último recurso: emulador Android usa 10.0.2.2 para acessar o host.
    return Platform.OS === 'android' ? `http://10.0.2.2:${PORTA_API}` : `http://localhost:${PORTA_API}`;
}

const api = axios.create({
    baseURL: resolverBaseURL(),
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
