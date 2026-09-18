import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from './services/api';
import { showAlert } from '../utils/alert';
import SeletorTempo from '../components/SeletorTempo';

export default function AdicionarProgresso() {
    const router = useRouter();
    const { grupoId } = useLocalSearchParams<{ grupoId: string }>();
    const [minutos, setMinutos] = useState(0);
    const [observacao, setObservacao] = useState('');
    const [salvando, setSalvando] = useState(false);

    const handleAdicionar = async () => {
        if (minutos <= 0) {
            showAlert('Erro', 'Informe quanto tempo você estudou.');
            return;
        }
        setSalvando(true);
        try {
            await api.post(`/grupos/${grupoId}/progresso`, {
                tempoMinutos: minutos,
                observacao,
            });
            router.back();
        } catch {
            showAlert('Erro', 'Não foi possível salvar o progresso.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#4db6ac" />
                </TouchableOpacity>
                <Text style={styles.headerTitulo}>Adicionar Progresso</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.conteudo}>
                <Text style={styles.pergunta}>Quanto tempo você estudou agora?</Text>
                <SeletorTempo minutos={minutos} onChange={setMinutos} />

                <Text style={styles.pergunta}>Alguma observação importante?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Opcional"
                    placeholderTextColor="#aaa"
                    value={observacao}
                    onChangeText={setObservacao}
                    multiline
                />

                <TouchableOpacity style={styles.botao} onPress={handleAdicionar} disabled={salvando}>
                    {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Adicionar</Text>}
                </TouchableOpacity>
            </ScrollView>
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
        padding: 20,
        paddingBottom: 40,
    },
    pergunta: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 14,
        fontSize: 14,
        color: '#333',
        backgroundColor: '#fff',
        minHeight: 90,
        textAlignVertical: 'top',
    },
    botao: {
        backgroundColor: '#4db6ac',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 24,
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
