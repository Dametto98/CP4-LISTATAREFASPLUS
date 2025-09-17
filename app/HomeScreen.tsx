import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, Alert, FlatList, ActivityIndicator, View, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db, collection, getDocs, query, where } from "../src/services/firebaseConfig";
import { deleteUser } from "firebase/auth";
import Tarefas from "../src/components/Tarefas";
import ThemeToggleButton from "../src/components/ThemeToggleButton";
import { useTheme } from "../src/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const { t } = useTranslation();
  const {colors} = useTheme()//Vai acessar os valores do tema
  const router = useRouter()

  interface Item{
    id:string,
    title:string,
    description:string,
    isCompleted:boolean,
    dueDate:string,
    createdAt:string,
    updatedAt:string,
    userId:string
  }
  const[listaItems,setListaItems]=useState<Item[]>([])

  const realizarLogoff = async ()=>{
    await AsyncStorage.removeItem("@user")
    router.replace('/')
  }

  const excluirConta = () =>{
    Alert.alert(
      t('deleteConfirmation'),
      t('confirmDeleteText'),
      [
        {text:t('cancel'),style:"cancel"},
        {text:t('delete'),style:"destructive",
          onPress: async ()=>{
            try{
              const user = auth.currentUser;
              if(user){
                  await deleteUser(user)
                  await AsyncStorage.removeItem('@user')
                  Alert.alert(t("accountDeleted"),t("deleteSuccess"))
                  router.replace("/")//Redireciona para login
              }else{
                  Alert.alert(t("error"),t("noUserLogged"))
              }
            }catch(error){
              console.log("Erro ao excluir a conta");
              Alert.alert(t("error"), t("deleteFail"))              
            }
          }
        }
      ]
    )
  }

  const buscarProdutos = async () => {
  try {
    const usuarioSalvo = await AsyncStorage.getItem('@user');
    if (!usuarioSalvo) {
      console.log('Usuário não encontrado no AsyncStorage');
      return;
    }

    const usuario = JSON.parse(usuarioSalvo); 
    const userId = usuario.uid; 

    const user = auth.currentUser;
    
    const currentUserId = user ? user.uid : userId;

    if (!currentUserId) {
      console.log('Não foi possível recuperar o userId');
      return;
    }

    const itemsCollectionRef = collection(db, 'items');
    const q = query(itemsCollectionRef, where("userId", "==", currentUserId));

    const querySnapshot = await getDocs(q);
    const items: any = [];

    querySnapshot.forEach((doc) => {
      items.push({
        ...doc.data(),
        id: doc.id
      });
    });

    setListaItems(items);
    
  } catch (e) {
    console.log(t("taskLoadFail"), e);
    Alert.alert(t("error"), t("loadItemsError"));
  }
};


  useEffect(()=>{
    buscarProdutos()
  },[listaItems])

  // Estilos dinâmicos com base no tema
  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: colors.background },
    titulo: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: colors.text },
    botaoContainer: { marginVertical: 15, gap: 10 },
    button: {
      backgroundColor: colors.button,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
      marginVertical: 5,
    },
    buttonText: { color: colors.buttonText, fontSize: 16, fontWeight: "bold" },
    linkContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
    link: { fontWeight: "600", fontSize: 16, color: colors.text },
    flatList: { marginTop: 20 },
    themeButtonContainer: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Botão de alternar tema */}
      <View style={dynamicStyles.themeButtonContainer}>
        <ThemeToggleButton />
      </View>

      <Text style={dynamicStyles.titulo}>{t('welcome')}</Text>

      <View style={dynamicStyles.botaoContainer}>
        <TouchableOpacity style={dynamicStyles.button} onPress={realizarLogoff}>
          <Text style={dynamicStyles.buttonText}>{t('logout')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[dynamicStyles.button, { backgroundColor: "#FF3B30" }]} onPress={excluirConta}>
          <Text style={dynamicStyles.buttonText}>{t('deleteAccount')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.button} onPress={() => router.replace("/AlterarSenhaScreen")}>
          <Text style={dynamicStyles.buttonText}>{t('changepswd')}</Text>
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.linkContainer}>
        <Link href="CadastrarTarefa" style={dynamicStyles.link}>{t('addTask')}</Link>
        <Link href="Versiculos" style={dynamicStyles.link}>{t('verse')}</Link>
      </View>

      {listaItems.length === 0 ? (
        <ActivityIndicator size="large" color={colors.button} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={listaItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Tarefas {...item} />}
          style={dynamicStyles.flatList}
        />
      )}
    </SafeAreaView>
  );
}