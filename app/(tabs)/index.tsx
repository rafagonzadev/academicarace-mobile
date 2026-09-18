import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '../services/api';

const dias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const atividades = [
  { id: 1, usuario: 'Usuário Teste', mensagem: 'Alcançou a liderança! 🤩👑' },
  { id: 2, usuario: 'Usuário Teste', mensagem: 'Usuário Teste agora está na disputa pelo topo!' },
  { id: 3, usuario: 'Usuário Teste', mensagem: 'Avaliou o livro "Nome do livro" ⭐⭐⭐⭐' },
];

const atividadesExtras = [
  { id: 4, usuario: 'Usuário Teste', mensagem: 'Bateu a meta semanal de estudos! 🎯' },
  { id: 5, usuario: 'Usuário Teste', mensagem: 'Chegou a 7 dias consecutivos de estudo!' },
];

type Registro = { data: string };
type Streak = { diasConsecutivos: number; ultimaData: string | null };

function inicioDaSemana(referencia: Date) {
  const inicio = new Date(referencia);
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() - inicio.getDay());
  return inicio;
}

function mesmoDia(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function Home() {
  const router = useRouter();
  const [diasAtivos, setDiasAtivos] = useState<boolean[]>(new Array(7).fill(false));
  const [streak, setStreak] = useState<Streak>({ diasConsecutivos: 0, ultimaData: null });
  const [mostrarExtras, setMostrarExtras] = useState(false);

  useFocusEffect(
      useCallback(() => {
        api.get('/streaks/me').then((res) => setStreak(res.data)).catch(() => {});

        api.get('/registros-estudo/me').then((res) => {
          const registros: Registro[] = res.data;
          const inicio = inicioDaSemana(new Date());
          const ativos = dias.map((_, index) => {
            const diaDaSemana = new Date(inicio);
            diaDaSemana.setDate(inicio.getDate() + index);
            return registros.some((registro) => mesmoDia(new Date(registro.data), diaDaSemana));
          });
          setDiasAtivos(ativos);
        }).catch(() => {});
      }, [])
  );

  return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Início</Text>
          <TouchableOpacity onPress={() => router.push('/perfil')}>
            <Ionicons name="person-circle-outline" size={32} color="#4db6ac" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Ritmo da semana */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Ritmo da semana 🫧</Text>
            <Text style={styles.cardSubtitulo}>
              {streak.diasConsecutivos} {streak.diasConsecutivos === 1 ? 'dia consecutivo' : 'dias consecutivos'}
            </Text>
            <View style={styles.diasContainer}>
              {dias.map((dia, index) => (
                  <View
                      key={index}
                      style={[
                        styles.diaBolinha,
                        diasAtivos[index] && styles.diaBolinhaAtivo,
                      ]}
                  >
                    <Text
                        style={[
                          styles.diaTexto,
                          diasAtivos[index] && styles.diaTextoAtivo,
                        ]}
                    >
                      {dia}
                    </Text>
                  </View>
              ))}
            </View>
          </View>

          {/* Registro diário */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Seu registro diário</Text>
            <TouchableOpacity
                style={styles.adicionarRegistro}
                onPress={() => router.push('/adicionar-registro')}
            >
              <Ionicons name="add-circle-outline" size={18} color="#4db6ac" />
              <Text style={styles.adicionarRegistroTexto}>Adicionar Registro</Text>
            </TouchableOpacity>
          </View>

          {/* Feed de atividades */}
          {atividades.map((atividade) => (
              <View key={atividade.id} style={styles.atividadeCard}>
                <Ionicons name="person-circle-outline" size={36} color="#4db6ac" />
                <View style={styles.atividadeTexto}>
                  <Text style={styles.atividadeUsuario}>{atividade.usuario}</Text>
                  <Text style={styles.atividadeMensagem}>{atividade.mensagem}</Text>
                </View>
              </View>
          ))}

          {mostrarExtras && atividadesExtras.map((atividade) => (
              <View key={atividade.id} style={styles.atividadeCard}>
                <Ionicons name="person-circle-outline" size={36} color="#4db6ac" />
                <View style={styles.atividadeTexto}>
                  <Text style={styles.atividadeUsuario}>{atividade.usuario}</Text>
                  <Text style={styles.atividadeMensagem}>{atividade.mensagem}</Text>
                </View>
              </View>
          ))}

          {/* Botão outras atualizações: só aparece quando há novidades ainda não exibidas */}
          {!mostrarExtras && (
              <TouchableOpacity style={styles.outrasAtualizacoes} onPress={() => setMostrarExtras(true)}>
                <Text style={styles.outrasAtualizacoesTexto}>Outras Atualizações</Text>
                <Ionicons name="chevron-down" size={18} color="#fff" />
              </TouchableOpacity>
          )}

          <View style={{ height: 24 }} />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitulo: {
    fontSize: 13,
    color: '#4db6ac',
    marginBottom: 12,
  },
  diasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  diaBolinha: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaBolinhaAtivo: {
    backgroundColor: '#4db6ac',
  },
  diaTexto: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4db6ac',
  },
  diaTextoAtivo: {
    color: '#fff',
  },
  adicionarRegistro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  adicionarRegistroTexto: {
    color: '#4db6ac',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  atividadeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  atividadeTexto: {
    marginLeft: 12,
    flex: 1,
  },
  atividadeUsuario: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4db6ac',
  },
  atividadeMensagem: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  outrasAtualizacoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4db6ac',
    borderRadius: 20,
    padding: 12,
    margin: 16,
    marginTop: 16,
  },
  outrasAtualizacoesTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 6,
  },
});
