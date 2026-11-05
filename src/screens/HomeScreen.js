
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "../redux/taskSlice";
import { colors } from "../constants/colors";

export const HomeScreen = ({ navigation }) => {
  const tasks = useSelector((state) => state.tasks.items);
  const filter = useSelector((state) => state.tasks.filter);
  const dispatch = useDispatch();

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    }

    if (filter === "pending") {
      return !task.completed;
    }

    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskFlow</Text>
      <Text style={styles.subtitle}>Mis tareas</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TaskForm")}
      >
        <Text style={styles.buttonText}>+ Nueva tarea</Text>
      </TouchableOpacity>

      <View style={styles.filters}>
        <TouchableOpacity onPress={() => dispatch(setFilter("all"))}>
          <Text>Todos </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => dispatch(setFilter("pending"))}>
          <Text>Pendientes </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => dispatch(setFilter("completed"))}>
          <Text>Completadas</Text>
        </TouchableOpacity>
      </View>

      {filteredTasks.length === 0 ? (
        <Text style={styles.status}>
          {tasks.length === 0
            ? "¡No tienes tareas pendientes! Empieza por crear una arriba."
            : "No hay tareas con este filtro."}
        </Text>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.task}
              onPress={() =>
                navigation.navigate("TaskDetail", { taskId: item.id })
              }
            >
              <Text>{item.title}</Text>
              <Text>{item.completed ? "Completada" : "Pendiente"}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: colors.primary,
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  status: {
    color: colors.textSecondary,
  },
  task: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
  },
});
