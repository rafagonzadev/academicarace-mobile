import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { getToken } from '../utils/tokenStorage';

export default function Index() {
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Duração mínima fixa pra garantir que a animação do polvo seja visível
    // mesmo quando a checagem do token é praticamente instantânea.
    const tempoMinimo = new Promise((resolve) => setTimeout(resolve, 2000));

    Promise.all([
      getToken().then((token) => setHasToken(!!token)).catch(() => setHasToken(false)),
      tempoMinimo,
    ]).finally(() => setCheckingToken(false));
  }, []);

  if (checkingToken) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ExpoImage
          source={require('../assets/octopus-loading.webp')}
          style={styles.loadingAnimacao}
          contentFit="contain"
          autoplay
        />
      </View>
    );
  }

  if (hasToken) {
    return <Redirect href="/(tabs)" />;
  }

  return (
      <View style={styles.container}>
        <View style={styles.topo}>
          <Image
              source={require('../assets/polvo.png')}
              style={styles.logo}
          />
          <Text style={styles.titulo}>Bem-Vindo ao{'\n'}Academic Race!</Text>
          <Text style={styles.subtitulo}>
            Transforme seus estudos em progresso diário
          </Text>
        </View>

        <View style={styles.botoes}>
          <TouchableOpacity
              style={styles.botaoEntrar}
              onPress={() => router.push('/login')}
          >
            <Text style={styles.botaoEntrarTexto}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text style={styles.linkCadastro}>
              Não possui uma conta?{' '}
              <Text style={styles.linkCadastroBold}>Criar conta</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.rodape}>
            Comece a sua jornada de estudos hoje!
          </Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4db6ac',
    justifyContent: 'space-between',
    padding: 32,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimacao: {
    width: 220,
    height: 220,
  },
  topo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: -50,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 16,
    color: '#e0f2f1',
    textAlign: 'center',
  },
  botoes: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  botaoEntrar: {
    backgroundColor: '#fff',
    width: '70%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  botaoEntrarTexto: {
    color: '#4db6ac',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkCadastro: {
    color: '#e0f2f1',
    fontSize: 14,
    marginBottom: 8,
  },
  linkCadastroBold: {
    fontWeight: 'bold',
    color: '#fff',
  },
  rodape: {
    color: '#e0f2f1',
    fontSize: 12,
    textAlign: 'center',
  },
});