
import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import TaskForm from "./src/components/TaskForm";
import TaskDetailScreen from "./src/screens/TaskDetailScreen";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setShowForm(false);
  };

  if (selectedTask) {
    return (
      <TaskDetailScreen
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  if (showForm) {
    return <TaskForm onAddTask={addTask} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.buttonText}>+ Nueva tarea</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mis tareas</Text>

      {tasks.length === 0 ? (
        <Text>No tienes tareas pendientes. ¡Creá una!</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.task}
              onPress={() => setSelectedTask(item)}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
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
