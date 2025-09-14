import { StyleSheet,View,Text,Pressable, Alert } from "react-native"
import { FontAwesome,MaterialIcons } from '@expo/vector-icons'
import { useEffect, useState } from "react"
import { doc,updateDoc,db,deleteDoc } from '../services/firebaseConfig'
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from "firebase/firestore"

export default function ItemLoja(props:any){
    const[isCompleted,setIsCompleted]=useState(props.isCompleted)

    const formatedCreatedAt = format(props.createdAt.toDate(), "dd/MM/yyyy HH:mm");
    const formatedUpdatedAt = format(props.updatedAt.toDate(), "dd/MM/yyyy HH:mm");
    const formatedDueDate = format(props.dueDate.toDate(), "dd/MM/yyyy HH:mm");

    const updateIsCompleted = async()=>{
        const produtoRef = doc(db,"items",props.id)

        await updateDoc(produtoRef,{
            isCompleted:isCompleted,
            updatedAt:Timestamp.now()
        })
    }

    useEffect(() => {
        updateIsCompleted()
    },[isCompleted])
    
    const deleteTarefa = async()=>{
        Alert.alert("Deseja Excluir?","Essa ação é irreversivel!",[
            {text:'cancelar'},
            {
                text:'Excluir',
                onPress: async ()=> await deleteDoc(doc(db,"items",props.id))
            }
        ],{cancelable:true})//Clicar fora da caixa para cancelar
    }

  return (
    <View style={styles.container}>
        <Pressable onPress={()=>setIsCompleted(!isCompleted)}>
            {isCompleted?(
                <FontAwesome name='check-circle' size={24} color='black'/>
            ):(
                <FontAwesome name='check-circle-o' size={24} color='black'/>
            )}

            
        </Pressable>
        <Text style={styles.texto}>{props.title}</Text>
        <Text style={styles.texto}>{props.description}</Text>
        <Text style={styles.texto}>{formatedDueDate}</Text>
        <Text style={styles.texto}>Criado em {formatedCreatedAt}</Text>        
        <Text style={styles.texto}>Ultima modificação: {formatedUpdatedAt}</Text>
        <Pressable onPress={()=>deleteTarefa()}>
            <MaterialIcons name='delete' size={24} color='black'/>
        </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        backgroundColor: 'lightgrey',
        justifyContent:'space-between',
        alignItems:'center',
        width:'90%',
        alignSelf:'center',
        marginTop:10,
        padding:10,
        borderRadius:10
    },
    texto:{
        flex:1,
        marginLeft:10,
        fontSize:17,
        fontWeight:500
    }
})