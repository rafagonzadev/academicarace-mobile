import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from './services/api';
import { showAlert } from '../utils/alert';

export default function EntrarGrupo() {
    const router = useRouter();
    const [codigo, setCodigo] = useState('');
    const [entrando, setEntrando] = useState(false);

    const handleEntrar = async () => {
        if (!codigo.trim()) {
            showAlert('Erro', 'Digite o código de convite.');
            return;
        }
        setEntrando(true);
        try {
            const res = await api.post('/grupos/entrar', { codigo: codigo.trim().toUpperCase() });
            showAlert('Tudo certo!', `Você entrou no grupo "${res.data.nome}".`);
            router.back();
        } catch {
            showAlert('Erro', 'Código de convite inválido.');
        } finally {
            setEntrando(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#4db6ac" />
                </TouchableOpacity>
                <Text style={styles.headerTitulo}>Entrar em grupo</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.conteudo}>
                <Text style={styles.label}>Código de convite</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: ABC123"
                    placeholderTextColor="#aaa"
                    value={codigo}
                    onChangeText={(t) => setCodigo(t.toUpperCase())}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={8}
                />

                <TouchableOpacity style={styles.botao} onPress={handleEntrar} disabled={entrando}>
                    {entrando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Entrar</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fafa',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    conteudo: {
        padding: 24,
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
        fontSize: 18,
        letterSpacing: 2,
        color: '#333',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    botao: {
        backgroundColor: '#4db6ac',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
