import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { auth, db, collection, addDoc } from "../src/services/firebaseConfig";
import { Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import ThemeToggleButton from '../src/components/ThemeToggleButton';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
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
        Alert.alert('Permissão necessária', 'Você precisa permitir notificações para ser lembrado de suas tarefas!');
      }
    }
    requestPermissions();
  }, []);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => showMode('date');

  const onChange = (event, selectedDate) => {
    setShow(false);
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      if (mode === 'date') showMode('time');
    }
  };

  const scheduleTaskNotification = async (taskTitle, taskDescription, taskDate) => {
    if (taskDate.getTime() <= Date.now()) return;
    await Notifications.scheduleNotificationAsync({
      content: { title: `Lembrete: ${taskTitle}`, body: taskDescription, sound: 'default' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: taskDate },
    });
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
        title,
        description,
        isCompleted: false,
        dueDate: Timestamp.fromDate(date),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      await scheduleTaskNotification(title, description, date);

      Alert.alert("Sucesso", "Tarefa salva e notificação agendada!");
      setTitle('');
      setDescription('');
      setDate(new Date());
      router.push('/HomeScreen');

    } catch (e) {
      console.log("Erro ao criar a tarefa:", e);
      Alert.alert("Erro", "Não foi possível salvar a tarefa.");
    }
  };

  const formatDateTime = (date) =>
    date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 20 },
    themeButtonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
    titulo: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 30, textAlign: 'center' },
    input: { backgroundColor: colors.inputBackground, color: colors.text, borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: colors.border },
    datePickerButton: { backgroundColor: colors.inputBackground, borderRadius: 10, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    datePickerText: { color: colors.text, fontSize: 16 },
    botao: { backgroundColor: colors.button, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    textoBotao: { color: colors.buttonText, fontSize: 18, fontWeight: 'bold' },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.themeButtonContainer}>
        <ThemeToggleButton />
      </View>

      <Text style={dynamicStyles.titulo}>Criar Tarefa</Text>

      <TextInput
        style={dynamicStyles.input}
        placeholder="Título da tarefa"
        placeholderTextColor={colors.text}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={dynamicStyles.input}
        placeholder="Descrição da tarefa"
        placeholderTextColor={colors.text}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={dynamicStyles.datePickerButton} onPress={showDatepicker}>
        <Text style={dynamicStyles.datePickerText}>Data/Hora: {formatDateTime(date)}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <TouchableOpacity style={dynamicStyles.botao} onPress={handleCadastro}>
        <Text style={dynamicStyles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}