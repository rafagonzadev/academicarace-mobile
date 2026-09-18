import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from './services/api';
import { showAlert } from '../utils/alert';
import { useRegistroDraft } from '../context/RegistroDraftContext';

function formatarDuracao(minutos: number | null) {
    if (minutos === null) return 'Selecionar (obrigatório)';
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
}

export default function AdicionarRegistro() {
    const router = useRouter();
    const draft = useRegistroDraft();
    const { titulo, descricao, fotoUri, metodoNome, duracaoMinutos } = draft;
    const [postando, setPostando] = useState(false);

    const handleEscolherDaGaleria = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissao.granted) {
            showAlert('Permissão necessária', 'Precisamos de acesso às suas fotos.');
            return;
        }
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        });
        if (!resultado.canceled) {
            draft.setFotoUri(resultado.assets[0].uri);
        }
    };

    const handleTirarFoto = async () => {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
            showAlert('Permissão necessária', 'Precisamos de acesso à sua câmera.');
            return;
        }
        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        });
        if (!resultado.canceled) {
            draft.setFotoUri(resultado.assets[0].uri);
        }
    };

    const handlePostar = async () => {
        if (!titulo.trim()) {
            showAlert('Erro', 'Adicione um título para o registro.');
            return;
        }
        if (duracaoMinutos === null) {
            showAlert('Erro', 'A duração é obrigatória.');
            return;
        }
        setPostando(true);
        try {
            await api.post('/registros-estudo/me', {
                titulo,
                descricao,
                metodoId: draft.metodoId,
                duracaoMinutos,
            });
            draft.reset();
            router.replace('/(tabs)');
        } catch {
            showAlert('Erro', 'Não foi possível salvar o registro.');
        } finally {
            setPostando(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#4db6ac" />
                </TouchableOpacity>
                <Text style={styles.headerTitulo}>Adicionar Registro</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.fotoContainer}>
                    {fotoUri ? (
                        <Image source={{ uri: fotoUri }} style={styles.foto} />
                    ) : (
                        <View style={styles.fotoPlaceholder}>
                            <Ionicons name="image-outline" size={28} color="#4db6ac" />
                            <Text style={styles.fotoTexto}>Foto (opcional)</Text>
                        </View>
                    )}
                    <View style={styles.fotoBotoes}>
                        <TouchableOpacity style={styles.fotoBotao} onPress={handleTirarFoto}>
                            <Ionicons name="camera-outline" size={16} color="#4db6ac" />
                            <Text style={styles.fotoBotaoTexto}>Câmera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fotoBotao} onPress={handleEscolherDaGaleria}>
                            <Ionicons name="images-outline" size={16} color="#4db6ac" />
                            <Text style={styles.fotoBotaoTexto}>Galeria</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Título</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Revisão de Cálculo I"
                        placeholderTextColor="#aaa"
                        value={titulo}
                        onChangeText={draft.setTitulo}
                    />

                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultilinha]}
                        placeholder="Conte um pouco sobre o que você estudou"
                        placeholderTextColor="#aaa"
                        value={descricao}
                        onChangeText={draft.setDescricao}
                        multiline
                        numberOfLines={4}
                    />

                    <TouchableOpacity style={styles.linha} onPress={() => router.push('/adicionar-metodo')}>
                        <View>
                            <Text style={styles.linhaTitulo}>Método</Text>
                            <Text style={styles.linhaValor}>{metodoNome ?? 'Selecionar (opcional)'}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linha} onPress={() => router.push('/selecionar-duracao')}>
                        <View>
                            <Text style={styles.linhaTitulo}>Duração</Text>
                            <Text style={[styles.linhaValor, duracaoMinutos === null && styles.linhaValorObrigatorio]}>
                                {formatarDuracao(duracaoMinutos)}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.botaoPostar} onPress={handlePostar} disabled={postando}>
                    {postando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.botaoPostarTexto}>Postar</Text>
                    )}
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
        padding: 16,
        paddingBottom: 32,
    },
    fotoContainer: {
        marginBottom: 16,
    },
    foto: {
        width: '100%',
        height: 160,
        borderRadius: 16,
    },
    fotoPlaceholder: {
        height: 120,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#cfe9e7',
        borderStyle: 'dashed',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    fotoTexto: {
        color: '#4db6ac',
        fontSize: 13,
        fontWeight: 'bold',
    },
    fotoBotoes: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    fotoBotao: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#cfe9e7',
        borderRadius: 10,
        paddingVertical: 10,
    },
    fotoBotaoTexto: {
        color: '#4db6ac',
        fontSize: 13,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 14,
        fontSize: 14,
        color: '#333',
    },
    inputMultilinha: {
        minHeight: 90,
        textAlignVertical: 'top',
    },
    linha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 12,
    },
    linhaTitulo: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    linhaValor: {
        fontSize: 13,
        color: '#4db6ac',
        marginTop: 2,
    },
    linhaValorObrigatorio: {
        color: '#e57373',
    },
    botaoPostar: {
        backgroundColor: '#4db6ac',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    botaoPostarTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
