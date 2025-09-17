import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from "../src/services/firebaseConfig";
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import ThemeToggleButton from '../src/components/ThemeToggleButton';
import { useTranslation } from 'react-i18next';


export default function AlterarSenhaScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleAlterarSenha = async () => {
    if (!novaSenha || !confirmarSenha || !senhaAtual) {
      Alert.alert(t("attention"), t("fillFields"));
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert(t("attention"), t("passwordsDoNotMatch"));
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        Alert.alert(t("error"), t("noUserLogged"));
        return;
      }
      const credential = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, novaSenha);
      Alert.alert(t("success"), t("passwordChangedSuccess"));
      router.push("/HomeScreen");
    } catch (error: any) {
      console.log("Erro ao alterar senha:", error);
      Alert.alert(t("error"), t("passwordChangeFail"));
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      padding: 20,
    },
    themeButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 10,
    },
    titulo: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
      backgroundColor: colors.inputBackground,
      color: colors.text,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    botao: {
      backgroundColor: colors.button,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    textoBotao: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Botão de tema */}
      <View style={dynamicStyles.themeButtonContainer}>
        <ThemeToggleButton />
      </View>

      <Text style={dynamicStyles.titulo}>{t('changePassword')}</Text>

      <TextInput
        style={dynamicStyles.input}
        placeholder={t('currentpswd')}
        placeholderTextColor={colors.text}
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
      />

      <TextInput
        style={dynamicStyles.input}
        placeholder={t('newpswd')}
        placeholderTextColor={colors.text}
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />

      <TextInput
        style={dynamicStyles.input}
        placeholder={t('confirmpswd')}
        placeholderTextColor={colors.text}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TouchableOpacity style={dynamicStyles.botao} onPress={handleAlterarSenha}>
        <Text style={dynamicStyles.textoBotao}>{t('changePassword')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}