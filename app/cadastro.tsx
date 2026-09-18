import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from './services/api';
import { showAlert } from '../utils/alert';

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    const router = useRouter();

    const handleCadastro = async () => {
        if (!nome || !email || !senha || !confirmarSenha) {
            showAlert('Erro', 'Preencha todos os campos!');
            return;
        }
        if (senha !== confirmarSenha) {
            showAlert('Erro', 'As senhas não coincidem!');
            return;
        }
        try {
            await api.post('/auth/cadastro', { nome, email, senha });
            showAlert('Sucesso', 'Conta criada! Faça login.');
            router.replace('/login');
        } catch (error) {
            showAlert('Erro', 'Não foi possível criar a conta.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#4db6ac" />
            </TouchableOpacity>

            <Text style={styles.titulo}>Criar uma conta</Text>
            <Text style={styles.subtitulo}>Crie sua conta desde já aqui!</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Insira seu nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Seu nome completo"
                    placeholderTextColor="#aaa"
                    value={nome}
                    onChangeText={setNome}
                />
            </View>

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

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirme a senha</Text>
                <View style={styles.senhaContainer}>
                    <TextInput
                        style={styles.inputSenha}
                        placeholder="••••••••"
                        placeholderTextColor="#aaa"
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry={!mostrarConfirmar}
                    />
                    <TouchableOpacity onPress={() => setMostrarConfirmar(!mostrarConfirmar)}>
                        <Ionicons
                            name={mostrarConfirmar ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color="#aaa"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
                <Text style={styles.botaoTexto}>Continuar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.linkLogin}>
                    Já possui uma conta?{' '}
                    <Text style={styles.linkLoginBold}>Fazer login</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        marginBottom: 32,
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
    linkLogin: {
        color: '#888',
        textAlign: 'center',
        fontSize: 14,
    },
    linkLoginBold: {
        color: '#4db6ac',
        fontWeight: 'bold',
    },
});