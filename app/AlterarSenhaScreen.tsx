import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from "../src/services/firebaseConfig";
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import ThemeToggleButton from '../src/components/ThemeToggleButton';

export default function AlterarSenhaScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleAlterarSenha = async () => {
    if (!novaSenha || !confirmarSenha || !senhaAtual) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert("Atenção", "As senhas não conferem!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        Alert.alert("Erro", "Nenhum usuário logado");
        return;
      }
      const credential = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, novaSenha);
      Alert.alert("Sucesso", "Senha alterada com sucesso");
      router.push("/HomeScreen");
    } catch (error: any) {
      console.log("Erro ao alterar senha:", error);
      Alert.alert("Erro", "Não foi possível alterar a senha");
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

      <Text style={dynamicStyles.titulo}>Alterar Senha</Text>

      <TextInput
        style={dynamicStyles.input}
        placeholder="Digite a senha atual"
        placeholderTextColor={colors.text}
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
      />

      <TextInput
        style={dynamicStyles.input}
        placeholder="Digite a nova senha"
        placeholderTextColor={colors.text}
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />

      <TextInput
        style={dynamicStyles.input}
        placeholder="Confirme a nova senha"
        placeholderTextColor={colors.text}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TouchableOpacity style={dynamicStyles.botao} onPress={handleAlterarSenha}>
        <Text style={dynamicStyles.textoBotao}>Alterar Senha</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}