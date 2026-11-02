
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("trabajo");

  const [touchedTitle, setTouchedTitle] = useState(false);
  const [touchedDescription, setTouchedDescription] = useState(false);
  const [focused, setFocused] = useState("");

  const handleAddTask = () => {
    setTouchedTitle(true);
    setTouchedDescription(true);

    if (title.trim().length < 5 || description.trim().length < 10) {
      return;
    }

    const task = {
      title: title.trim(),
      description: description.trim(),
      category: category,
      createdAt: new Date(),
    };

    console.log("Tarea creada:", task);
    onAddTask(task);
    Alert.alert("Éxito", "Tarea capturada localmente");

    setTitle("");
    setDescription("");
    setCategory("trabajo");
    setTouchedTitle(false);
    setTouchedDescription(false);
    setFocused("");
  };

  const titleError = touchedTitle && title.trim().length < 5;
  const descriptionError =
    touchedDescription && description.trim().length < 10;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Nueva tarea</Text>

        <Text style={styles.label}>Título</Text>

        <TextInput
          style={[
            styles.input,
            focused === "title" && styles.inputFocused,
            titleError && styles.errorInput,
          ]}
          placeholder="Título de la tarea"
          value={title}
          onChangeText={setTitle}
          onFocus={() => setFocused("title")}
          onBlur={() => {
            setFocused("");
            setTouchedTitle(true);
          }}
          autoCapitalize="sentences"
          returnKeyType="next"
        />

        {titleError && (
          <Text style={styles.error}>
            El título debe tener al menos 5 caracteres
          </Text>
        )}

        <Text style={styles.label}>Descripción</Text>

        <TextInput
          style={[
            styles.input,
            styles.descriptionInput,
            focused === "description" && styles.inputFocused,
            descriptionError && styles.errorInput,
          ]}
          placeholder="Descripción de la tarea"
          value={description}
          onChangeText={setDescription}
          onFocus={() => setFocused("description")}
          onBlur={() => {
            setFocused("");
            setTouchedDescription(true);
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {descriptionError && (
          <Text style={styles.error}>
            La descripción debe tener al menos 10 caracteres
          </Text>
        )}

        <Text style={styles.label}>Categoría</Text>

        <View style={styles.categories}>
          <TouchableOpacity onPress={() => setCategory("trabajo")}>
            <Text
              style={[
                styles.category,
                category === "trabajo" && styles.categorySelected,
              ]}
            >
              Trabajo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCategory("personal")}>
            <Text
              style={[
                styles.category,
                category === "personal" && styles.categorySelected,
              ]}
            >
              Personal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCategory("estudio")}>
            <Text
              style={[
                styles.category,
                category === "estudio" && styles.categorySelected,
              ]}
            >
              Estudio
            </Text>
          </TouchableOpacity>
        </View>

        <Text>Categoría seleccionada: {category}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddTask}
        >
          <Text style={styles.buttonText}>Guardar tarea</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  inputFocused: {
    borderColor: "blue",
    borderWidth: 2,
  },
  descriptionInput: {
    height: 100,
  },
  errorInput: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  categories: {
    flexDirection: "row",
    marginBottom: 15,
  },
  category: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#dddddd",
    borderRadius: 5,
  },
  categorySelected: {
    backgroundColor: "#2563eb",
    color: "white",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
