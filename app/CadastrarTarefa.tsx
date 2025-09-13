import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { auth,db,collection,addDoc,getDocs } from "../src/services/firebaseConfig"
import { Timestamp } from 'firebase/firestore';

export default function CadastroScreen() {
  const{colors} = useTheme()
  // Estados para armazenar os valores digitados
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const router = useRouter();

  const handleCadastro = async() => {
    const user = auth.currentUser;
    if (!title || !description || !dueDate) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    //Implementação do backend
    try{
      const docRef = await addDoc(collection(db,'items'),{
        userId: user.uid, // Salva o ID do usuário que criou a tarefa
        title:title,
        description:description,
        completed:false,
        dueDate:dueDate,
        createdAt:Timestamp.now(),
        updatedAt:Timestamp.now()
      })
      console.log("Tarefa criada com o ID: ",docRef.id);
      setTitle('')//Limpa o Text Input
      setDescription('')//Limpa o Text Input
      setDueDate('')//Limpa o Text Input
      Alert.alert("Sucesso","Tarefa salva com sucesso!")
      router.push('/HomeScreen')
    }catch(e){
      console.log("Erro ao criar o tarefa: ",e);
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <Text style={[styles.titulo,{color:colors.text}]}>Criar Tarefa</Text>

      {/* Campo Nome */}
      <TextInput
        style={styles.input}
        placeholder="Titulo da tarefa"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      {/* Campo Email */}
      <TextInput
        style={styles.input}
        placeholder="Descrição da tarefa"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
      />

      {/* Campo Senha */}
      <TextInput
        style={styles.input}
        placeholder="Data agendamento"
        placeholderTextColor="#aaa"
        value={dueDate}
        onChangeText={setDueDate}
      />

      {/* Botão */}
      <TouchableOpacity style={[styles.botao,{backgroundColor:colors.button}]} onPress={handleCadastro}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  botao: {
    backgroundColor: '#00B37E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});