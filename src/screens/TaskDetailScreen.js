
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TaskDetailScreen({ navigation, route }) {
  const { task } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de tarea</Text>

      <Text>Título: {task.title}</Text>
      <Text>Descripción: {task.description}</Text>
      <Text>Categoría: {task.category}</Text>
      <Text>
        Fecha: {new Date(task.createdAt).toLocaleDateString()}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});
