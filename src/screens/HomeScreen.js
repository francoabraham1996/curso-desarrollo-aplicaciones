import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

export const HomeScreen = ({ navigation, route }) => {
  const [tasks, setTasks] = useState([]);

useEffect(() => {
  if (route.params?.nuevaTarea) {
    const task = {
      ...route.params.nuevaTarea,
      id: Date.now().toString(),
    };

    setTasks((anterior) => [...anterior, task]);

    navigation.setParams({ nuevaTarea: undefined });
  }
}, [route.params?.nuevaTarea, navigation]);

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

      {tasks.length === 0 ? (
        <Text style={styles.status}>
          ¡No tienes tareas pendientes! Empieza por crear una.
        </Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.task}
              onPress={() => navigation.navigate("TaskDetail", { task: item })}
            >
              <Text>{item.title}</Text>
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
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    color: colors.primary,
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
  },
  task: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
});
