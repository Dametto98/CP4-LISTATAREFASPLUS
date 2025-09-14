import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { Button, Text, TextInput, StyleSheet,Alert, FlatList, ActivityIndicator } from "react-native"
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { auth,db,collection,getDocs,query, where } from "../src/services/firebaseConfig"
import { deleteUser } from "firebase/auth";
import ItemLoja from "../src/components/ItemLoja";
import ThemeToggleButton from "../src/components/ThemeToggleButton";
import { useTheme } from "../src/context/ThemeContext";
import * as Notifications from "expo-notifications"

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
  return (
    <SafeAreaView style={[
      styles.container,
      {backgroundColor:colors.background}
    ]}>
        <Text style={[{color:colors.text}]}>Seja bem-vindo(a), você está logado(a)!</Text>
        <ThemeToggleButton/>
        <Button title="REALIZAR LOGOFF" onPress={realizarLogoff}/>
        <Button title="EXCLUIR CONTA" color="red" onPress={excluirConta}/>
        <Button title="TROCAR A SENHA" onPress={()=>(router.replace("/AlterarSenhaScreen"))}/>
        <Link href="CadastrarTarefa" style={{marginTop:20,color:colors.text,marginLeft:150,fontWeight:600}}>Cadastrar Tarefa</Link>
        <Link href="Versiculos" style={{marginTop:20,color:colors.text,marginLeft:150,fontWeight:600}}>Versiculo</Link>

        {listaItems.length<=0?<ActivityIndicator/>:(
          <FlatList
            data={listaItems}
            renderItem={({item})=>{
              return(
                <ItemLoja 
                  title={item.title}
                  description={item.description}
                  isCompleted={item.isCompleted}
                  dueDate={item.dueDate}
                  createdAt={item.createdAt}
                  updatedAt={item.updatedAt}
                  id={item.id}
                />
              )
            }}
          />
        )}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  input:{
    backgroundColor:'lightgray',
    width:'90%',
    alignSelf:'center',
    marginTop:'auto',
    borderRadius:10,
    paddingLeft:20
  }
})