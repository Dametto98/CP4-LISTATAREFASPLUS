import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../src/services/firebaseConfig";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import ThemeToggleButton from '../src/components/ThemeToggleButton';
import { useTranslation } from 'react-i18next';

export default function CadastroScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter();

  const handleCadastro = () => {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        router.push('/HomeScreen');
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Erro", "Usuário não cadastrado!");
      });
  };

  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 20 },
    themeButtonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
    titulo: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 30, textAlign: 'center' },
    input: {
      backgroundColor: colors.inputBackground,
      color: colors.text,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border
    },
    botao: { backgroundColor: colors.button, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    textoBotao: { color: colors.buttonText, fontSize: 18, fontWeight: 'bold' },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.themeButtonContainer}>
        <ThemeToggleButton />
      </View>

      <Text style={dynamicStyles.titulo}>{t('createAccount')}</Text>

      <TextInput
        style={dynamicStyles.input}
        placeholder={t('fullName')}
        placeholderTextColor={colors.text}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={dynamicStyles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.text}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={dynamicStyles.input}
        placeholder={t('password')}
        placeholderTextColor={colors.text}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={dynamicStyles.botao} onPress={handleCadastro}>
        <Text style={dynamicStyles.textoBotao}>{t('register')}</Text>
      </TouchableOpacity>
    </View>
  );
}