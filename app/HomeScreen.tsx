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

export default function HomeScreen() {
  const {theme,colors} = useTheme()//Vai acessar os valores do tema
  const router = useRouter()
  const[expoPushToken,setExpoPushToken]=useState<string|null>(null)

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
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser revertida!",
      [
        {text:"Cancelar",style:"cancel"},
        {text:"Deletar",style:"destructive",
          onPress: async ()=>{
            try{
              const user = auth.currentUser;
              if(user){
                  await deleteUser(user)
                  await AsyncStorage.removeItem('@user')
                  Alert.alert("Conta Excluída","Sua conta foi excluída com sucesso.")
                  router.replace("/")//Redireciona para login
              }else{
                  Alert.alert("Error","Nenhu usuário logado")
              }
            }catch(error){
              console.log("Erro ao excluir a conta");
              Alert.alert("Erro", "Não foi possível excluir a conta")              
            }
          }
        }
      ]
    )
  }

  const buscarProdutos = async () => {
  try {
    const user = auth.currentUser;

    const itemsCollectionRef = collection(db, 'items');
    const q = query(itemsCollectionRef, where("userId", "==", user.uid));

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
    console.log("Erro ao carregar os items: ", e);
    Alert.alert("Erro", "Não foi possível carregar as tarefas.");
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

      <Text style={dynamicStyles.titulo}>Bem-vindo(a)!</Text>

      <View style={dynamicStyles.botaoContainer}>
        <TouchableOpacity style={dynamicStyles.button} onPress={realizarLogoff}>
          <Text style={dynamicStyles.buttonText}>LOGOFF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[dynamicStyles.button, { backgroundColor: "#FF3B30" }]} onPress={excluirConta}>
          <Text style={dynamicStyles.buttonText}>EXCLUIR CONTA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.button} onPress={() => router.replace("/AlterarSenhaScreen")}>
          <Text style={dynamicStyles.buttonText}>TROCAR SENHA</Text>
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.linkContainer}>
        <Link href="CadastrarTarefa" style={dynamicStyles.link}>Cadastrar Tarefa</Link>
        <Link href="Versiculos" style={dynamicStyles.link}>Versículo</Link>
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