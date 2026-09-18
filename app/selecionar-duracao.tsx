import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRegistroDraft } from '../context/RegistroDraftContext';
import SeletorTempo from '../components/SeletorTempo';

export default function SelecionarDuracao() {
    const router = useRouter();
    const { duracaoMinutos, setDuracaoMinutos } = useRegistroDraft();
    const [minutos, setMinutos] = useState(duracaoMinutos ?? 0);

    const handleAdicionar = () => {
        setDuracaoMinutos(minutos);
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#4db6ac" />
                </TouchableOpacity>
                <Text style={styles.headerTitulo}>Selecionar duração</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.conteudo}>
                <SeletorTempo minutos={minutos} onChange={setMinutos} />
            </View>

            <TouchableOpacity style={styles.botaoAdicionar} onPress={handleAdicionar}>
                <Text style={styles.botaoAdicionarTexto}>Adicionar</Text>
            </TouchableOpacity>
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    botaoAdicionar: {
        backgroundColor: '#4db6ac',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        margin: 16,
    },
    botaoAdicionarTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
