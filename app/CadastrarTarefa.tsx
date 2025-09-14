import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { auth, db, collection, addDoc } from "../src/services/firebaseConfig";
import { Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification:async()=>({
      shouldShowBanner:true,//Exibe o banner
      shouldShowList:true,//Mostra histórico
      shouldPlaySound:true,//Toca o som
      shouldSetBadge:false//Não altera o badge
  }),
});

export default function CadastroScreen() {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const router = useRouter();

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Você precisa permitir as notificações para ser lembrado de suas tarefas!');
      }
    }
    requestPermissions();
  }, []);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onChange = (event, selectedDate) => {
    setShow(false);
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      if (mode === 'date') {
        showMode('time');
      }
    }
  };

  const scheduleTaskNotification = async (taskTitle, taskDescription, taskDate) => {
    if (taskDate.getTime() <= Date.now()) {
      console.log("Não é possível agendar notificação para uma data no passado.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Lembrete de Tarefa: ${taskTitle}`, // Título dinâmico
        body: taskDescription, // Corpo dinâmico
        sound: 'default', // Som padrão de notificação
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: taskDate,
      },
    });

    console.log(`Notificação para a tarefa "${taskTitle}" agendada para ${taskDate.toLocaleString()}`);
  };


  const handleCadastro = async () => {
    const user = auth.currentUser;
    if (!title || !description) {
      Alert.alert('Atenção', 'Preencha o título e a descrição!');
      return;
    }

    try {
      await addDoc(collection(db, 'items'), {
        userId: user.uid,
        title: title,
        description: description,
        isCompleted: false,
        dueDate: Timestamp.fromDate(date),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      await scheduleTaskNotification(title, description, date);

      Alert.alert("Sucesso", "Tarefa salva e notificação agendada!");
      
      // Limpa os campos e volta para a HomeScreen
      setTitle('');
      setDescription('');
      setDate(new Date());
      router.push('/HomeScreen');

    } catch (e) {
      console.log("Erro ao criar a tarefa ou agendar notificação: ", e);
      Alert.alert("Erro", "Não foi possível salvar a tarefa.");
    }
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>Criar Tarefa</Text>

      <TextInput style={styles.input} placeholder="Titulo da tarefa" placeholderTextColor="#aaa" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Descrição da tarefa" placeholderTextColor="#aaa" value={description} onChangeText={setDescription} />

      <TouchableOpacity style={styles.datePickerButton} onPress={showDatepicker}>
        <Text style={styles.datePickerText}>Data/Hora: {formatDateTime(date)}</Text>
      </TouchableOpacity>

      {show && ( <DateTimePicker testID="dateTimePicker" value={date} mode={mode} is24Hour={true} display="default" onChange={onChange}/> )}

      <TouchableOpacity style={[styles.botao, { backgroundColor: colors.button }]} onPress={handleCadastro}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  datePickerButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  datePickerText: {
    color: '#fff',
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#f509e1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});