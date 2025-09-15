import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { doc, updateDoc, db, deleteDoc } from '../services/firebaseConfig';
import { format } from 'date-fns';
import { Timestamp } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";

export default function Tarefas(props: any) {
  const { colors } = useTheme();
  const [isCompleted, setIsCompleted] = useState(props.isCompleted);

  const formatedCreatedAt = format(props.createdAt.toDate(), "dd/MM/yyyy HH:mm");
  const formatedUpdatedAt = format(props.updatedAt.toDate(), "dd/MM/yyyy HH:mm");
  const formatedDueDate = format(props.dueDate.toDate(), "dd/MM/yyyy HH:mm");

  const updateIsCompleted = async () => {
    const produtoRef = doc(db, "items", props.id);

    await updateDoc(produtoRef, {
      isCompleted: isCompleted,
      updatedAt: Timestamp.now()
    });
  };

  useEffect(() => {
    updateIsCompleted();
  }, [isCompleted]);

  const deleteTarefa = async () => {
    Alert.alert("Deseja Excluir?", "Essa ação é irreversível!", [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => await deleteDoc(doc(db, "items", props.id))
      }
    ], { cancelable: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.texto, { color: colors.text, fontWeight: 'bold' }]}>{props.title}</Text>
        <Text style={[styles.texto, { color: colors.text }]}>{props.description}</Text>
        <Text style={[styles.texto, { color: colors.text }]}>Até: {formatedDueDate}</Text>
        <Text style={[styles.texto, { color: colors.text }]}>Criado em {formatedCreatedAt}</Text>
        <Text style={[styles.texto, { color: colors.text }]}>Última modificação: {formatedUpdatedAt}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => setIsCompleted(!isCompleted)}>
          {isCompleted ? (
            <FontAwesome name='check-circle' size={28} color={colors.success} />
          ) : (
            <FontAwesome name='check-circle-o' size={28} color={colors.text} />
          )}
        </Pressable>
        <Pressable onPress={deleteTarefa}>
          <MaterialIcons name='delete' size={28} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 3.84,
    elevation: 5, // sombra no Android
  },
  textContainer: {
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  }
});