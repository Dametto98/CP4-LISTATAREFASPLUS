import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- 1. FUNÇÃO PARA BUSCAR OS DADOS DA API ---
// É uma boa prática manter a lógica de fetch separada do componente.
const fetchRandomVerse = async () => {
  // Usamos a tradução "almeida" para ter o versículo em português
  const response = await fetch('https://bible-api.com/?random=verse&translation=almeida');
  if (!response.ok) {
    throw new Error('Não foi possível buscar o versículo. Tente novamente.');
  }
  return response.json();
};

export default function VerseScreen() {
  // --- 2. USANDO O HOOK useQuery ---
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['randomVerse'], // Uma chave única para esta busca
    queryFn: fetchRandomVerse, // A função que busca os dados
  });

  // --- 3. RENDERIZAÇÃO CONDICIONAL ---
  // Mostra um indicador de carregamento enquanto os dados não chegam.
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00B37E" />
        <Text style={styles.infoText}>Buscando um versículo...</Text>
      </View>
    );
  }

  // Mostra uma mensagem de erro se a busca falhar.
  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Ocorreu um erro:</Text>
        <Text style={styles.errorText}>{error.message}</Text>
        <TouchableOpacity style={styles.button} onPress={() => refetch()}>
          <Text style={styles.buttonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- 4. EXIBIÇÃO DOS DADOS ---
  // Quando os dados chegam com sucesso.
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.verseContainer}>
        <Text style={styles.verseText}>"{data?.text}"</Text>
        <Text style={styles.referenceText}>- {data?.reference}</Text>
      </View>

      {/* O botão de refetch permite buscar um novo versículo */}
      <TouchableOpacity style={styles.button} onPress={() => refetch()}>
        <Text style={styles.buttonText}>Buscar Novo Versículo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Estilização da tela
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  verseContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  verseText: {
    fontSize: 22,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 32,
  },
  referenceText: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'right',
    marginTop: 20,
    fontWeight: 'bold',
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00B37E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});