import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { useTranslation } from 'react-i18next';


const fetchRandomVerse = async () => {
  const response = await fetch('https://bible-api.com/?random=verse&translation=almeida');
  if (!response.ok) {
    throw new Error('Não foi possível buscar o versículo. Tente novamente.');
  }
  return response.json();
};

export default function VerseScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['randomVerse'],
    queryFn: fetchRandomVerse,
  });

  // --- ESTILIZAÇÃO DINÂMICA COM THEME ---
  const dynamicStyles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    verseContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    verseText: {
      fontSize: 22,
      color: colors.text,
      fontStyle: 'italic',
      textAlign: 'center',
      lineHeight: 32,
    },
    referenceText: {
      fontSize: 18,
      color: colors.text,
      textAlign: 'right',
      marginTop: 20,
      fontWeight: 'bold',
      opacity: 0.7,
    },
    infoText: {
      marginTop: 10,
      fontSize: 16,
      color: colors.text,
    },
    errorText: {
      fontSize: 16,
      color: '#ff6b6b',
      textAlign: 'center',
      marginBottom: 10,
    },
    button: {
      backgroundColor: colors.button,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  if (isLoading) {
    return (
      <View style={dynamicStyles.centered}>
        <ActivityIndicator size="large" color={colors.button} />
        <Text style={dynamicStyles.infoText}>{t('lookingVerse')}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={dynamicStyles.centered}>
        <Text style={dynamicStyles.errorText}>{t('errorOccurred')}</Text>
        <Text style={dynamicStyles.errorText}>{error.message}</Text>
        <TouchableOpacity style={dynamicStyles.button} onPress={() => refetch()}>
          <Text style={dynamicStyles.buttonText}>{t('tryAgain')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.verseContainer}>
        <Text style={dynamicStyles.verseText}>"{data?.text}"</Text>
        <Text style={dynamicStyles.referenceText}>- {data?.reference}</Text>
      </View>

      <TouchableOpacity style={dynamicStyles.button} onPress={() => refetch()}>
        <Text style={dynamicStyles.buttonText}>{t('getNewVerse')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}