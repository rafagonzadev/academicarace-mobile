import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from './services/api';
import { showAlert } from '../utils/alert';
import { useRegistroDraft } from '../context/RegistroDraftContext';

type Metodo = {
    id: number;
    nome: string;
    descricao: string;
};

export default function AdicionarMetodo() {
    const router = useRouter();
    const { metodoId, setMetodo } = useRegistroDraft();
    const [carregando, setCarregando] = useState(true);
    const [metodos, setMetodos] = useState<Metodo[]>([]);
    const [selecionadoId, setSelecionadoId] = useState<number | null>(metodoId);
    const [infoAbertoId, setInfoAbertoId] = useState<number | null>(null);

    useEffect(() => {
        api.get('/metodos-estudo')
            .then((res) => setMetodos(res.data))
            .catch(() => showAlert('Erro', 'Não foi possível carregar os métodos.'))
            .finally(() => setCarregando(false));
    }, []);

    const handleAdicionar = () => {
        const escolhido = metodos.find((m) => m.id === selecionadoId);
        setMetodo(escolhido ? escolhido.id : null, escolhido ? escolhido.nome : null);
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#4db6ac" />
                </TouchableOpacity>
                <Text style={styles.headerTitulo}>Adicionar método</Text>
                <View style={{ width: 24 }} />
            </View>

            {carregando ? (
                <View style={styles.centro}>
                    <ActivityIndicator color="#4db6ac" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.lista}>
                    {metodos.map((metodo) => {
                        const selecionado = selecionadoId === metodo.id;
                        const infoAberto = infoAbertoId === metodo.id;
                        return (
                            <View key={metodo.id} style={[styles.item, selecionado && styles.itemSelecionado]}>
                                <TouchableOpacity
                                    style={styles.itemLinha}
                                    onPress={() => setSelecionadoId(metodo.id)}
                                >
                                    <Ionicons
                                        name={selecionado ? 'radio-button-on' : 'radio-button-off'}
                                        size={20}
                                        color="#4db6ac"
                                    />
                                    <Text style={styles.itemNome}>{metodo.nome}</Text>
                                    <TouchableOpacity
                                        onPress={() => setInfoAbertoId(infoAberto ? null : metodo.id)}
                                        hitSlop={8}
                                    >
                                        <Ionicons name="information-circle-outline" size={22} color="#888" />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                                {infoAberto && (
                                    <Text style={styles.itemDescricao}>{metodo.descricao}</Text>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            )}

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
    centro: {
        flex: 1,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    lista: {
        padding: 16,
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    itemSelecionado: {
        borderColor: '#4db6ac',
    },
    itemLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    itemNome: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
    },
    itemDescricao: {
        marginTop: 10,
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
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
