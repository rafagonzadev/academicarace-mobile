import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from './services/api';
import { showAlert } from '../utils/alert';
import { formatarDataDigitada, hojeFormatado, paraIso } from '../utils/data';
import SeletorTempo from '../components/SeletorTempo';

type Tipo = 'ESTUDO' | 'LEITURA';

export default function CriarGrupo() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState<Tipo>('ESTUDO');
    const [metaMinutos, setMetaMinutos] = useState(120);
    const [dataInicio, setDataInicio] = useState(hojeFormatado());
    const [dataFim, setDataFim] = useState('');
    const [salvando, setSalvando] = useState(false);

    const handleCriar = async () => {
        if (!nome.trim()) {
            showAlert('Erro', 'Dê um nome ao grupo.');
            return;
        }
        if (metaMinutos <= 0) {
            showAlert('Erro', 'Defina uma meta diária.');
            return;
        }
        const dataInicioIso = dataInicio ? paraIso(dataInicio) : null;
        if (dataInicio && !dataInicioIso) {
            showAlert('Erro', 'Data de início inválida. Use o formato DD/MM/AAAA.');
            return;
        }
        const dataFimIso = dataFim ? paraIso(dataFim) : null;
        if (dataFim && !dataFimIso) {
            showAlert('Erro', 'Data de fim inválida. Use o formato DD/MM/AAAA.');
            return;
        }
        setSalvando(true);
        try {
            const res = await api.post('/grupos/me', {
                nome,
                descricao,
                tipo,
                metaDiaria: metaMinutos,
                dataInicio: dataInicioIso,
                dataFim: dataFimIso,
            });
            showAlert('Grupo criado', `Código de convite: ${res.data.codigoConvite}`);
            router.back();
        } catch {
            showAlert('Erro', 'Não foi possível criar o grupo.');
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
                <Text style={styles.headerTitulo}>Criar Grupo</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.conteudo}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do grupo de estudos"
                    placeholderTextColor="#aaa"
                    value={nome}
                    onChangeText={setNome}
                />

                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={[styles.input, styles.inputMultilinha]}
                    placeholder="Do que se trata o grupo, regras, etc."
                    placeholderTextColor="#aaa"
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                />

                <Text style={styles.label}>Tipo</Text>
                <View style={styles.tipoLinha}>
                    <TouchableOpacity
                        style={[styles.tipoBotao, tipo === 'ESTUDO' && styles.tipoBotaoAtivo]}
                        onPress={() => setTipo('ESTUDO')}
                    >
                        <Text style={[styles.tipoTexto, tipo === 'ESTUDO' && styles.tipoTextoAtivo]}>Estudo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tipoBotao, tipo === 'LEITURA' && styles.tipoBotaoAtivo]}
                        onPress={() => setTipo('LEITURA')}
                    >
                        <Text style={[styles.tipoTexto, tipo === 'LEITURA' && styles.tipoTextoAtivo]}>Leitura</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Meta diária (quanto cada pessoa deve estudar por dia)</Text>
                <SeletorTempo minutos={metaMinutos} onChange={setMetaMinutos} />

                <View style={styles.datasLinha}>
                    <View style={styles.dataCampo}>
                        <Text style={styles.label}>Início</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor="#aaa"
                            value={dataInicio}
                            onChangeText={(t) => setDataInicio(formatarDataDigitada(t))}
                            keyboardType="number-pad"
                            maxLength={10}
                        />
                    </View>
                    <View style={styles.dataCampo}>
                        <Text style={styles.label}>Fim</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor="#aaa"
                            value={dataFim}
                            onChangeText={(t) => setDataFim(formatarDataDigitada(t))}
                            keyboardType="number-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.botao} onPress={handleCriar} disabled={salvando}>
                    {salvando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.botaoTexto}>Criar Grupo</Text>
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
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
        marginTop: 14,
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
    inputMultilinha: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    tipoLinha: {
        flexDirection: 'row',
        gap: 10,
    },
    tipoBotao: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cfe9e7',
        backgroundColor: '#fff',
    },
    tipoBotaoAtivo: {
        backgroundColor: '#4db6ac',
        borderColor: '#4db6ac',
    },
    tipoTexto: {
        color: '#4db6ac',
        fontWeight: 'bold',
        fontSize: 14,
    },
    tipoTextoAtivo: {
        color: '#fff',
    },
    datasLinha: {
        flexDirection: 'row',
        gap: 12,
    },
    dataCampo: {
        flex: 1,
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
