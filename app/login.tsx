import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from './services/api'
import { Ionicons } from '@expo/vector-icons';
import { showAlert } from '../utils/alert';
import { setToken } from '../utils/tokenStorage';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        let token;
        try {
            const response = await api.post('/auth/login', { email, senha });
            token = response.data.token;
        } catch (error) {
            showAlert('Erro', 'Email ou senha inválidos!');
            return;
        }
        await setToken(token);
        router.replace('/(tabs)');
    };

    return (

        <View style={styles.container}>

            <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#4db6ac" />
            </TouchableOpacity>

            <Text style={styles.titulo}>Bem-vindo de volta</Text>
            <Text style={styles.subtitulo}>Continue sua jornada de estudos!</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Insira seu e-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="email@dominio.com"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Insira sua senha</Text>
                <View style={styles.senhaContainer}>
                    <TextInput
                        style={styles.inputSenha}
                        placeholder="••••••••"
                        placeholderTextColor="#aaa"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={!mostrarSenha}
                    />
                    <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                        <Ionicons
                            name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color="#aaa"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.botao} onPress={handleLogin}>
                <Text style={styles.botaoTexto}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.linkSenha}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/cadastro')}>
                <Text style={styles.linkCadastro}>
                    Não possui uma conta?{' '}
                    <Text style={styles.linkCadastroBold}>Criar conta</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'center',
    },

    voltar: {
        position: 'absolute',
        top: 80,
        left: 24,
    },

    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4db6ac',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitulo: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 50,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 14,
        fontSize: 14,
        color: '#333',
    },
    senhaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 14,
    },
    inputSenha: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 14,
        color: '#333',
    },
    olho: {
        fontSize: 18,
    },
    botao: {
        backgroundColor: '#4db6ac',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkSenha: {
        color: '#4db6ac',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 14,
    },
    linkCadastro: {
        color: '#888',
        textAlign: 'center',
        fontSize: 14,
    },
    linkCadastroBold: {
        color: '#4db6ac',
        fontWeight: 'bold',
    },
});