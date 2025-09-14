import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithCredential} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../src/services/firebaseConfig';
import { useTheme } from '../src/context/ThemeContext';
import ThemeToggleButton from '../src/components/ThemeToggleButton';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';
import { changeLanguage } from 'i18next';

const WEB_CLIENT_ID = '1024555257607-egqipkahpr73onb7j2hara1mjcviijio.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

export default function LoginScreen() {
  //Hook que fornece a funcção 't' para a tradução do idioma
  const{t,i18n}=useTranslation()

  //Função para mudar o idioma
  const mudarIdioma = (lang:string)=>{
    i18n.changeLanguage(lang)
  }

  //Colors do ThemeContext
  const {theme,colors} = useTheme()
  // Estados para armazenar os valores digitados
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter()//Hook de navegação

  useEffect(()=>{
    const verificarusuarioLogado = async()=>{
      try{
        const usuarioSalvo = await AsyncStorage.getItem("@user")
        if(usuarioSalvo){
          router.push('/HomeScreen')//Redireciona para a tela HomeScreen(Usuario logado)
        }

      }catch(error){
        console.log("Erro ao verificar login", error)        
      }
    }
    verificarusuarioLogado()//chama a função
  },[])

  // Função para simular o envio do formulário
  const handleLogin= () => {
    if ( !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    //Backend do login
    signInWithEmailAndPassword(auth, email, senha)
      .then(async(userCredential) => {
 
        const user = userCredential.user;
        await AsyncStorage.setItem('@user',JSON.stringify(user))
        router.push('/HomeScreen')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error: ", errorMessage);
        if(error.code==="auth/invalid-credential"){
          Alert.alert("Atenção","E-Mail ou Senha incorreto!")
        }
      });
  };

  const handleGoogleLogin = async () => {
    if (Platform.OS === 'web') {
      await handleGoogleLoginWeb();
    } else {
      await handleGoogleLoginNative();
    }
  };

  const handleGoogleLoginWeb = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      router.push('/HomeScreen');
    } catch (error) {
      console.error("Erro no login com Google (Web):", error);
      Alert.alert("Erro", "Não foi possível fazer o login com o Google.");
    }
  };

  // --- FUNÇÃO CORRIGIDA ---
  const handleGoogleLoginNative = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      if (!idToken) {
        throw new Error('O idToken não foi retornado pelo Google Sign-In.');
      }
      
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      
      const user = userCredential.user;
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      router.push('/HomeScreen');

    } catch (error) {
      console.log("Erro no login com Google (Nativo):", error);
      if (error.code === '12501') { 
        return; // O usuário cancelou o login, não é um erro.
      }
      Alert.alert("Erro", "Não foi possível fazer o login com o Google.");
    }
  };

  const esqueceuSenha = () =>{
    if(!email){
      alert("Digite o e-mail para recuperar a senha")
      return
    }
    sendPasswordResetEmail(auth,email)
      .then(()=>{
        alert("Email de recuperação enviado")
      })
      .catch((error)=>{
        console.log("Error",error.message)
        alert("Erro ao enviar e-mail de reset de senha")
      })

  }
  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <Text style={[styles.titulo,{color:colors.text}]}>{t("login")}</Text>


      {/* Campo Email */}
      <TextInput
        style={[styles.input,{color:colors.text}]}
        placeholder="E-mail"
        placeholderTextColor={colors.text}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo Senha */}
      <TextInput
        style={[styles.input,{color:colors.text}]}
        placeholder={t("password")}
        placeholderTextColor={colors.text}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão */}
      <TouchableOpacity style={[styles.botao,{backgroundColor:colors.button}]} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.botao, styles.googleButton]} 
        onPress={handleGoogleLogin} // Apenas chama a nova função
      ></TouchableOpacity>

      <View style={
        {flexDirection:'row',
         justifyContent:'center',
         marginTop:15,
         gap:5}}>
        <TouchableOpacity 
          onPress={()=>mudarIdioma("en")} 
          style={[styles.botao,{backgroundColor:"#FF5D5D"}]}
        >
          <Text>EN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={()=>mudarIdioma("pt")}
          style={[styles.botao,{backgroundColor:"#03FF5F"}]}
        >
          <Text>PT</Text>
        </TouchableOpacity>
      </View>
      <ThemeToggleButton/>

      <Link href="CadastrarScreen" style={{marginTop:20,color:colors.text,marginLeft:150,fontWeight:600}}>{t("signup")}</Link>
      
      <Text style={{marginTop:20,color:colors.text,marginLeft:130,fontWeight:600}} onPress={esqueceuSenha}>{t("forgotpswd")}</Text>
    </View>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#333',
  },
  botao: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#4285F4', // Cor oficial do Google para Web
    marginTop: 10,
  }
});