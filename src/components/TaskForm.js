
import { useState, useRef } from "react";

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebase/firebaseConfig";
import { saveTask } from "../firebase/taskService";
import { colors } from "../constants/colors";

const categories = [
    { value: "trabajo", label: "Trabajo" },
    { value: "personal", label: "Personal" },
    { value: "estudio", label: "Estudio" },
];

export default function TaskForm({ navigation }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("trabajo");

    const [touchedTitle, setTouchedTitle] = useState(false);
    const [touchedDescription, setTouchedDescription] =
        useState(false);

    const [focused, setFocused] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const savingRef = useRef(false);
    const descriptionRef = useRef(null);

    const titleError =
        touchedTitle && title.trim().length < 5;

    const descriptionError =
        touchedDescription && description.trim().length < 10;

    const handleAddTask = async () => {
        if (savingRef.current) return;

        setTouchedTitle(true);
        setTouchedDescription(true);
        setError("");

        if (
            title.trim().length < 5 ||
            description.trim().length < 10
        ) {
            return;
        }

        const userId = auth.currentUser?.uid;

        if (!userId) {
            setError("Debés iniciar sesión nuevamente.");
            return;
        }

        savingRef.current = true;
        setSaving(true);

        try {
            await saveTask(
                {
                    title: title.trim(),
                    description: description.trim(),
                    category,
                },
                userId
            );

            if (
                auth.currentUser?.uid === userId &&
                navigation.isFocused()
            ) {
                navigation.popTo("TaskList");
            }
        } catch {
            setError(
                "No se pudo guardar la tarea. Intentá nuevamente."
            );
        } finally {
            savingRef.current = false;
            setSaving(false);
        }
    };

    return (
        <SafeAreaView
            style={styles.container}
            edges={["left", "right", "bottom"]}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={styles.form}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>
                        Creá una tarea
                    </Text>

                    <Text style={styles.subtitle}>
                        Organizá tus actividades en un solo lugar.
                    </Text>

                    <View style={styles.card}>
                        <Text style={styles.label}>Título</Text>

                        <TextInput
                            style={[
                                styles.input,
                                focused === "title" &&
                                styles.inputFocused,
                                titleError && styles.errorInput,
                            ]}
                            placeholder="Ej. Preparar presentación"
                            placeholderTextColor="#9CA3AF"
                            value={title}
                            onChangeText={setTitle}
                            editable={!saving}
                            onFocus={() => setFocused("title")}
                            onBlur={() => {
                                setFocused("");
                                setTouchedTitle(true);
                            }}
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                descriptionRef.current?.focus()
                            }
                            maxLength={100}
                        />

                        {titleError && (
                            <Text style={styles.error}>
                                El título debe tener al menos 5 caracteres.
                            </Text>
                        )}

                        <Text style={styles.label}>Descripción</Text>

                        <TextInput
                            ref={descriptionRef}
                            style={[
                                styles.input,
                                styles.descriptionInput,
                                focused === "description" &&
                                styles.inputFocused,
                                descriptionError && styles.errorInput,
                            ]}
                            placeholder="Describí qué necesitás hacer..."
                            placeholderTextColor="#9CA3AF"
                            value={description}
                            onChangeText={setDescription}
                            editable={!saving}
                            onFocus={() => setFocused("description")}
                            onBlur={() => {
                                setFocused("");
                                setTouchedDescription(true);
                            }}
                            multiline
                            textAlignVertical="top"
                            maxLength={1000}
                        />

                        {descriptionError && (
                            <Text style={styles.error}>
                                La descripción debe tener al menos 10 caracteres.
                            </Text>
                        )}

                        <Text style={styles.label}>Categoría</Text>

                        <View style={styles.categories}>
                            {categories.map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    disabled={saving}
                                    onPress={() => setCategory(item.value)}
                                    style={[
                                        styles.category,
                                        category === item.value &&
                                        styles.categorySelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            category === item.value &&
                                            styles.categoryTextSelected,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {!!error && (
                        <Text style={styles.errorBox}>
                            {error}
                        </Text>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            saving && styles.disabled,
                        ]}
                        onPress={handleAddTask}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>
                                Guardar tarea
                            </Text>
                        )}
                    </TouchableOpacity>

                    {saving && (
                        <Text style={styles.savingText}>
                            Guardando o esperando conexión.
                            Podés volver a la lista para consultar
                            el estado de sincronización.
                        </Text>
                    )}

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelText}>
                            {saving ? "Volver a mis tareas" : "Cancelar"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    form: {
        padding: 18,
        paddingBottom: 35,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 6,
        marginBottom: 22,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginTop: 12,
        marginBottom: 9,
    },
    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        padding: 13,
        color: colors.text,
        fontSize: 15,
        backgroundColor: "#FFFFFF",
    },
    inputFocused: {
        borderColor: colors.primary,
    },
    descriptionInput: {
        minHeight: 120,
    },
    errorInput: {
        borderColor: "#DC2626",
    },
    error: {
        color: "#DC2626",
        fontSize: 12,
        marginTop: 6,
    },
    categories: {
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
        marginBottom: 8,
    },
    category: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    categorySelected: {
        backgroundColor: "#EEF2FF",
        borderWidth: 1,
        borderColor: colors.primary,
    },
    categoryText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    categoryTextSelected: {
        color: colors.primary,
        fontWeight: "600",
    },
    button: {
        backgroundColor: colors.primary,
        padding: 16,
        marginTop: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    disabled: {
        opacity: 0.65,
    },
    cancelButton: {
        padding: 15,
        alignItems: "center",
        marginTop: 8,
    },
    cancelText: {
        color: colors.textSecondary,
        fontWeight: "500",
    },
    errorBox: {
        backgroundColor: "#FEF2F2",
        color: "#B91C1C",
        borderRadius: 10,
        padding: 12,
        marginTop: 12,
    },
    savingText: {
        color: colors.textSecondary,
        fontSize: 12,
        textAlign: "center",
        marginTop: 12,
    },
});
