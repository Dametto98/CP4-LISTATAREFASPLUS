import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { Button, Text, TextInput, StyleSheet,Alert, FlatList, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { auth,db,collection,addDoc,getDocs } from "../src/services/firebaseConfig"
import { deleteUser } from "firebase/auth";
import ItemLoja from "../src/components/ItemLoja";
import ThemeToggleButton from "../src/components/ThemeToggleButton";
import { useTheme } from "../src/context/ThemeContext";
import * as Notifications from "expo-notifications"

Notifications.setNotificationHandler({
    handleNotification:async()=>({
        shouldShowAlert:true,
        shouldPlaySound:true,//Toca o som
        shouldSetBadge:false//Não altera o badge
    })
})

export default function HomeScreen() {
  const {theme,colors} = useTheme()//Vai acessar os valores do tema
  const router = useRouter()
  const[nomeProduto,setNomeProduto]=useState('')
  const[expoPushToken,setExpoPushToken]=useState<string|null>(null)

  interface Item{
    id:string,
    nomeProduto:string,
    isChecked:boolean
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

  const salvarItem = async ()=>{
    try{
      const docRef = await addDoc(collection(db,'items'),{
        nomeProduto:nomeProduto,
        isChecked:false
      })
      console.log("Produto criado com o ID: ",docRef.id);
      setNomeProduto('')//Limpa o Text Input
      Alert.alert("Sucesso","Produto salvo com sucesso!")
    }catch(e){
      console.log("Erro ao criar o produto: ",e);
      
    }
  }

  const buscarProdutos = async ()=>{
    try{
      const querySnapshot = await getDocs(collection(db, 'items'))
      const items:any = []

      querySnapshot.forEach((item)=>{
        items.push({
          ...item.data(),
          id: item.id
        })
      })
      setListaItems(items)
      // console.log("Itens carregados: ", items);
      
    }catch(e){
      console.log("Erro ao carregar os items: ",e);
      
    }
  }

  //Funçaõ para disparar a notificação local
  const dispararNotificacao = async()=>{
    await Notifications.scheduleNotificationAsync({
      content:{
          title:"Promoções do dia!",
          body:"Aproveite as melhores ofertas"
      },
      trigger:{
          type:"timeInterval",//tipo de trigger: intervalo de tempo
          seconds:2,//aguarda 02 segundos para disparar
          repeats:false
      } as Notifications.TimeIntervalTriggerInput
    })
  }

  const registerForPushNotificationsAsync = async ():Promise<string|null> =>{
      try{
          const tokenData = await Notifications.getExpoPushTokenAsync()
          const token  = tokenData.data
          console.log("Token gerado com sucesso: ",token)
          return token
      }catch(error){
          console.log("Error ao gerar token",error)
          return null
      }
  }
  useEffect(()=>{
        //Ficar escutando se houve recebimento de notificação
        const subscription = Notifications.addNotificationReceivedListener(notification =>{
            console.log("Notificação recebida: ", notification)
        })
        //Função de limpeza que irá ser chamada quando for desfeito
        //Remove o listener para evitar multiplas chamadas.
        return ()=>subscription.remove()
    },[])

  useEffect(()=>{
    //Solicitar a permissão das notificações do aparelho
    (async()=>{
      //Verifica o stests da permissão das notificações do dispositivo
      const{status:existingStatus} = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      //Solicita a permissão das notificações do dispositivo
      if(existingStatus!=="granted"){
        const{status} = await Notifications.requestPermissionsAsync()
        finalStatus=status
      }
    })()
  },[])

  useEffect(()=>{
    buscarProdutos()
  },[listaItems])
  return (
    <SafeAreaView style={[styles.container,
      // {backgroundColor:theme ==='dark'?'#121212':'#fff'}
      {backgroundColor:colors.background}
    ]}>
        <Text style={[{color:colors.text}]}>Seja bem-vindo(a), você está logado(a)!</Text>
        <ThemeToggleButton/>
        <Button title="REALIZAR LOGOFF" onPress={realizarLogoff}/>
        <Button title="EXCLUIR CONTA" color="red" onPress={excluirConta}/>
        <Button title="TROCAR A SENHA" onPress={()=>(router.replace("/AlterarSenhaScreen"))}/>
        <Button title="DISPARAR NOTIFICAÇÃO" color="purple" onPress={dispararNotificacao}/>

        {listaItems.length<=0?<ActivityIndicator/>:(
          <FlatList
            data={listaItems}
            renderItem={({item})=>{
              return(
                <ItemLoja 
                  nomeProduto={item.nomeProduto}
                  isChecked={item.isChecked}
                  id={item.id}
                />
              )
            }}
          />
        )}

        <TextInput
          placeholder="Digite o nome do produto"
          style={styles.input}
          value={nomeProduto}
          onChangeText={(value)=>setNomeProduto(value)}
          onSubmitEditing={salvarItem}
        />

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