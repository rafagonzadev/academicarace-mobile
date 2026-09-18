import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '../services/api';
import { formatarMinutos } from '../../utils/tempo';

type Participante = { nome: string; diasConsecutivos: number };
type LinhaRanking = { posicao: number; nome: string; tempoMinutos: number; ehVoce: boolean };
type SuaMeta = { metaDiariaMinutos: number; progressoMinutos: number; faltamMinutos: number };
type RankingGrupo = {
    grupoId: number;
    grupoNome: string;
    lider: Participante | null;
    voce: Participante;
    rankingTempo: LinhaRanking[];
    suaMeta: SuaMeta;
};

export default function Ranking() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [rankings, setRankings] = useState<RankingGrupo[]>([]);

    useFocusEffect(
        useCallback(() => {
            let ativo = true;
            setCarregando(true);
            api.get('/grupos/me')
                .then(async (res) => {
                    const grupos = res.data as { id: number }[];
                    const detalhes = await Promise.all(
                        grupos.map((g) => api.get(`/grupos/${g.id}/ranking`).then((r) => r.data as RankingGrupo)),
                    );
                    if (ativo) setRankings(detalhes);
                })
                .catch(() => {
                    if (ativo) setRankings([]);
                })
                .finally(() => {
                    if (ativo) setCarregando(false);
                });
            return () => {
                ativo = false;
            };
        }, []),
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitulo}>Corrida de Estudos</Text>
            </View>

            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.acoes}>
                    <TouchableOpacity style={styles.acaoBotao} onPress={() => router.push('/criar-grupo')}>
                        <Ionicons name="add-circle-outline" size={18} color="#4db6ac" />
                        <Text style={styles.acaoTexto}>Criar grupo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acaoBotao} onPress={() => router.push('/entrar-grupo')}>
                        <Ionicons name="key-outline" size={18} color="#4db6ac" />
                        <Text style={styles.acaoTexto}>Entrar com código</Text>
                    </TouchableOpacity>
                </View>

                {carregando ? (
                    <ActivityIndicator color="#4db6ac" style={{ marginTop: 40 }} />
                ) : rankings.length === 0 ? (
                    <Text style={styles.vazio}>
                        Você ainda não participa de nenhum grupo. Crie um ou entre com um código de convite.
                    </Text>
                ) : (
                    rankings.map((r) => (
                        <BlocoGrupo
                            key={r.grupoId}
                            ranking={r}
                            onAdicionarProgresso={() =>
                                router.push({ pathname: '/adicionar-progresso', params: { grupoId: String(r.grupoId) } })
                            }
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

function BlocoGrupo({ ranking, onAdicionarProgresso }: { ranking: RankingGrupo; onAdicionarProgresso: () => void }) {
    const { grupoNome, lider, voce, rankingTempo, suaMeta } = ranking;
    return (
        <View style={styles.bloco}>
            <Text style={styles.grupoNome}>{grupoNome}</Text>

            <View style={styles.liderCard}>
                <View style={styles.liderLado}>
                    <Text style={styles.liderLabel}>Líder</Text>
                    <Text style={styles.liderNome}>{lider?.nome ?? '—'}</Text>
                    <Text style={styles.liderDias}>{lider?.diasConsecutivos ?? 0} 🫧</Text>
                </View>
                <View style={styles.liderDivisor} />
                <View style={styles.liderLado}>
                    <Text style={styles.liderLabel}>Você</Text>
                    <Text style={styles.liderNome}>{voce.nome}</Text>
                    <Text style={styles.liderDias}>{voce.diasConsecutivos} 🫧</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitulo}>Ranking de Tempo Estudado</Text>
                {rankingTempo.length === 0 ? (
                    <Text style={styles.semDados}>Ninguém registrou progresso hoje ainda.</Text>
                ) : (
                    rankingTempo.map((l) => (
                        <View key={l.posicao} style={styles.linha}>
                            <Text style={styles.posicao}>{l.posicao}º</Text>
                            <Text style={[styles.linhaNome, l.ehVoce && styles.linhaNomeVoce]} numberOfLines={1}>
                                {l.nome}
                                {l.ehVoce ? ' (você)' : ''}
                            </Text>
                            <Text style={styles.linhaTempo}>{formatarMinutos(l.tempoMinutos)} hoje</Text>
                        </View>
                    ))
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitulo}>Sua meta</Text>
                <Text style={styles.metaLinha}>Meta diária: {formatarMinutos(suaMeta.metaDiariaMinutos)}</Text>
                <Text style={styles.metaLinha}>
                    Progresso: {formatarMinutos(suaMeta.progressoMinutos)} / {formatarMinutos(suaMeta.metaDiariaMinutos)}
                </Text>
                <Text style={styles.metaLinha}>Faltam: {formatarMinutos(suaMeta.faltamMinutos)}</Text>
            </View>

            <TouchableOpacity style={styles.botaoProgresso} onPress={onAdicionarProgresso}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.botaoProgressoTexto}>Adicionar Progresso</Text>
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
        padding: 16,
        paddingBottom: 32,
    },
    acoes: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 8,
    },
    acaoBotao: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#cfe9e7',
        borderRadius: 10,
        paddingVertical: 12,
    },
    acaoTexto: {
        color: '#4db6ac',
        fontWeight: 'bold',
        fontSize: 13,
    },
    vazio: {
        textAlign: 'center',
        color: '#888',
        fontSize: 14,
        marginTop: 40,
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    bloco: {
        marginTop: 20,
    },
    grupoNome: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    liderCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    liderLado: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
    },
    liderDivisor: {
        width: 1,
        backgroundColor: '#eee',
        marginHorizontal: 12,
    },
    liderLabel: {
        fontSize: 12,
        color: '#4db6ac',
        fontWeight: 'bold',
    },
    liderNome: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    liderDias: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitulo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    semDados: {
        fontSize: 13,
        color: '#999',
    },
    linha: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    posicao: {
        width: 32,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4db6ac',
    },
    linhaNome: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    linhaNomeVoce: {
        fontWeight: 'bold',
        color: '#4db6ac',
    },
    linhaTempo: {
        fontSize: 13,
        color: '#666',
    },
    metaLinha: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    botaoProgresso: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#4db6ac',
        borderRadius: 20,
        padding: 12,
        marginTop: 12,
    },
    botaoProgressoTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
