import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';
import { useTheme } from '../src/context/ThemeContext';
import ThemeToggleButton from '../src/components/ThemeToggleButton';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('@user');
        if (usuarioSalvo) router.push('/HomeScreen');
      } catch (error) {
        console.log('Erro ao verificar login', error);
      }
    };
    verificarUsuarioLogado();
  }, []);

  const handleLogin = () => {
    if (!email || !senha) return Alert.alert(t('attention'), t('fillFields'));
    signInWithEmailAndPassword(auth, email, senha)
      .then(async ({ user }) => {
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        router.push('/HomeScreen');
      })
      .catch(() => Alert.alert(t('attention'), t('invalidCredentials')));
  };

  const esqueceuSenha = () => {
    if (!email) return Alert.alert(t('attention'), t('emailForPasswordReset'));
    sendPasswordResetEmail(auth, email)
      .then(() => Alert.alert(t('success'), t('recoveryEmailSent')))
      .catch(() => Alert.alert(t('error'), t('emailSendFail')));
  };

  const mudarIdioma = (lang: string) => i18n.changeLanguage(lang);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    themeButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 10,
    },
    titulo: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
      color: colors.text,
    },
    input: {
      borderWidth: 2,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.inputBackground,
      borderColor: colors.border,
    },
    botao: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: colors.button,
    },
    textoBotao: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.buttonText,
    },
    containerIdiomas: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 15,
      gap: 10,
    },
    botaoIdioma: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    textoIdioma: {
      color: '#fff',
      fontWeight: 'bold',
    },
    link: {
      textAlign: 'center',
      marginTop: 15,
      fontWeight: '600',
      fontSize: 16,
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Botão de tema */}
      <View style={dynamicStyles.themeButtonContainer}>
        <ThemeToggleButton />
      </View>

      <Text style={dynamicStyles.titulo}>{t('login')}</Text>

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

      <TouchableOpacity style={dynamicStyles.botao} onPress={handleLogin}>
        <Text style={dynamicStyles.textoBotao}>Login</Text>
      </TouchableOpacity>

      {/* Idiomas */}
      <View style={dynamicStyles.containerIdiomas}>
        <TouchableOpacity style={[dynamicStyles.botaoIdioma, { backgroundColor: '#FF5D5D' }]} onPress={() => mudarIdioma('en')}>
          <Text style={dynamicStyles.textoIdioma}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[dynamicStyles.botaoIdioma, { backgroundColor: '#03FF5F' }]} onPress={() => mudarIdioma('pt')}>
          <Text style={dynamicStyles.textoIdioma}>PT</Text>
        </TouchableOpacity>
      </View>

      <Link href="CadastrarScreen" style={dynamicStyles.link}>
        {t('signup')}
      </Link>
      <Text style={dynamicStyles.link} onPress={esqueceuSenha}>
        {t('forgotpswd')}
      </Text>
    </SafeAreaView>
  );
}