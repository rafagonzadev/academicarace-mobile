import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from './services/api';
import { showAlert } from '../utils/alert';
import { deleteToken } from '../utils/tokenStorage';

export default function Perfil() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [fotoUri, setFotoUri] = useState<string | null>(null);

    useEffect(() => {
        api.get('/usuarios/me')
            .then((res) => {
                setNome(res.data.nome);
                setEmail(res.data.email);
                if (res.data.foto) {
                    setFotoUri(res.data.foto);
                }
            })
            .catch(() => showAlert('Erro', 'Não foi possível carregar seu perfil.'))
            .finally(() => setCarregando(false));
    }, []);

    const handleEscolherFoto = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissao.granted) {
            showAlert('Permissão necessária', 'Precisamos de acesso às suas fotos.');
            return;
        }
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.5,
            base64: true,
        });
        if (!resultado.canceled && resultado.assets[0].base64) {
            setFotoUri(`data:image/jpeg;base64,${resultado.assets[0].base64}`);
        }
    };

    const handleLogout = async () => {
        await deleteToken();
        // Limpa toda a pilha de navegação (não só a tela atual) antes de ir pra
        // splash — senão dava pra arrastar/voltar e reaparecer na Home logada.
        router.dismissAll();
        router.replace('/');
    };

    const handleSalvar = async () => {
        if (!nome.trim()) {
            showAlert('Erro', 'O nome não pode ficar vazio.');
            return;
        }
        setSalvando(true);
        try {
            await api.put('/usuarios/me', { nome, senha: novaSenha || undefined, foto: fotoUri });
            setNovaSenha('');
            showAlert('Sucesso', 'Alterações salvas!');
        } catch {
            showAlert('Erro', 'Não foi possível salvar as alterações.');
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <View style={[styles.container, styles.centro]}>
                <ActivityIndicator color="#4db6ac" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#4db6ac" />
                </TouchableOpacity>
                <Text style={styles.headerTitulo}>Perfil</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.conteudo}>
                <TouchableOpacity style={styles.avatarContainer} onPress={handleEscolherFoto}>
                    {fotoUri ? (
                        <Image source={{ uri: fotoUri }} style={styles.avatarImagem} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={96} color="#4db6ac" />
                    )}
                    <Text style={styles.trocarFotoTexto}>Trocar foto</Text>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome de usuário</Text>
                    <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput style={[styles.input, styles.inputDesabilitado]} value={email} editable={false} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nova senha</Text>
                    <TextInput
                        style={styles.input}
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        placeholder="Deixe em branco para não alterar"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar} disabled={salvando}>
                    {salvando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.botaoSalvarTexto}>Salvar alterações</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity style={styles.botaoSair} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.botaoSairTexto}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fafa',
    },
    centro: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    conteudo: {
        padding: 24,
        paddingBottom: 100,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarImagem: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    trocarFotoTexto: {
        color: '#4db6ac',
        fontWeight: 'bold',
        fontSize: 13,
        marginTop: 8,
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
        backgroundColor: '#fff',
    },
    inputDesabilitado: {
        color: '#999',
        backgroundColor: '#f5f5f5',
    },
    botaoSalvar: {
        backgroundColor: '#4db6ac',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    botaoSalvarTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    botaoSair: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e57373',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 18,
        gap: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    botaoSairTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
