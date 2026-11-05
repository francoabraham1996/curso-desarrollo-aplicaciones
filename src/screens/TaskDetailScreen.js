
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleTaskStatus, deleteTask } from "../redux/taskSlice";

export default function TaskDetailScreen({ navigation, route }) {
  const { taskId } = route.params;

  const tasks = useSelector((state) => state.tasks.items);
  const dispatch = useDispatch();

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Tarea no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    dispatch(deleteTask(taskId));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de tarea</Text>

      <Text>Título: {task.title}</Text>
      <Text>Descripción: {task.description}</Text>
      <Text>Categoría: {task.category}</Text>
      <Text>Fecha: {new Date(task.createdAt).toLocaleDateString()}</Text>

      <Text>
        Estado: {task.completed ? "Completada" : "Pendiente"}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => dispatch(toggleTaskStatus(taskId))}
      >
        <Text style={styles.buttonText}>
          {task.completed ? "Marcar pendiente" : "Completar tarea"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Eliminar tarea</Text>
      </TouchableOpacity>

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
  deleteButton: {
    backgroundColor: "red",
    padding: 15,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});
