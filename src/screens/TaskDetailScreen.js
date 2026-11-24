
import { useState, useRef } from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import {
    updateTaskStatus,
    removeTask,
} from "../firebase/taskService";

import { colors } from "../constants/colors";

export default function TaskDetailScreen({
    navigation,
    route,
}) {
    const taskId = route.params?.taskId;

    const { items: tasks, loading } = useSelector(
        (state) => state.tasks
    );

    const [busy, setBusy] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState("");

    const busyRef = useRef(false);

    const task = tasks.find(
        (item) => item.id === taskId
    );

    const handleComplete = async () => {
        if (!task || busyRef.current) return;

        busyRef.current = true;
        setBusy("update");
        setError("");

        try {
            await updateTaskStatus(
                taskId,
                !task.completed
            );
        } catch {
            setError(
                "No se pudo actualizar la tarea."
            );
        } finally {
            busyRef.current = false;
            setBusy("");
        }
    };

    const handleDelete = async () => {
        if (!task || busyRef.current) return;

        busyRef.current = true;
        setBusy("delete");
        setError("");

        try {
            await removeTask(taskId);

            if (navigation.isFocused()) {
                navigation.goBack();
            }
        } catch {
            setError(
                "No se pudo eliminar la tarea."
            );
        } finally {
            busyRef.current = false;
            setBusy("");
            setConfirmDelete(false);
        }
    };

    if (!task) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.empty}>
                    {loading || busy === "delete" ? (
                        <>
                            <ActivityIndicator
                                color={colors.primary}
                                size="large"
                            />

                            <Text style={styles.emptyText}>
                                {busy === "delete"
                                    ? "Eliminando o esperando conexión..."
                                    : "Cargando tarea..."}
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.emptyText}>
                            Esta tarea ya no está disponible.
                        </Text>
                    )}

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backText}>
                            Volver a mis tareas
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={styles.container}
            edges={["left", "right", "bottom"]}
        >
            <ScrollView
                contentContainerStyle={styles.content}
            >
                <View style={styles.card}>
                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor: task.completed
                                    ? "#DCFCE7"
                                    : "#FEF3C7",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                color: task.completed
                                    ? "#16A34A"
                                    : "#D97706",
                                fontWeight: "600",
                                fontSize: 12,
                            }}
                        >
                            {task.completed
                                ? "✓ Completada"
                                : "○ Pendiente"}
                        </Text>
                    </View>

                    <Text style={styles.title}>
                        {task.title}
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.label}>
                        Descripción
                    </Text>

                    <Text style={styles.description}>
                        {task.description}
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.label}>
                        Categoría
                    </Text>

                    <Text style={styles.category}>
                        {task.category}
                    </Text>

                    <Text style={styles.label}>
                        Fecha de creación
                    </Text>

                    <Text style={styles.value}>
                        {task.createdAt
                            ? new Date(task.createdAt)
                                .toLocaleDateString("es-AR")
                            : "Sin fecha"}
                    </Text>
                </View>

                {!!error && (
                    <Text style={styles.error}>
                        {error}
                    </Text>
                )}

                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: task.completed
                                ? colors.primary
                                : "#16A34A",
                        },
                        !!busy && styles.disabled,
                    ]}
                    disabled={!!busy}
                    onPress={handleComplete}
                >
                    {busy === "update" ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {task.completed
                                ? "Marcar como pendiente"
                                : "✓ Completar tarea"}
                        </Text>
                    )}
                </TouchableOpacity>

                {!!busy && (
                    <Text style={styles.emptyText}>
                        Guardando cambios o esperando conexión.
                    </Text>
                )}

                {confirmDelete ? (
                    <View style={styles.confirmCard}>
                        <Text style={styles.confirmTitle}>
                            ¿Eliminar esta tarea?
                        </Text>

                        <Text style={styles.confirmDescription}>
                            Esta acción no se puede deshacer.
                        </Text>

                        <View style={styles.confirmActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                disabled={!!busy}
                                onPress={() => setConfirmDelete(false)}
                            >
                                <Text style={styles.cancelText}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.confirmButton}
                                disabled={!!busy}
                                onPress={handleDelete}
                            >
                                {busy === "delete" ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Eliminar
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        disabled={!!busy}
                        onPress={() => setConfirmDelete(true)}
                    >
                        <Text style={styles.deleteText}>
                            Eliminar tarea
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>
                        Volver a mis tareas
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 18,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 22,
    },
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        marginBottom: 14,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 20,
    },
    label: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: colors.text,
        lineHeight: 23,
    },
    category: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.primary,
        textTransform: "capitalize",
        marginBottom: 22,
    },
    value: {
        fontSize: 15,
        color: colors.text,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 15,
    },
    disabled: {
        opacity: 0.6,
    },
    deleteButton: {
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA",
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        alignItems: "center",
        marginTop: 12,
    },
    deleteText: {
        color: "#DC2626",
        fontWeight: "600",
    },
    backButton: {
        padding: 15,
        alignItems: "center",
        marginTop: 12,
    },
    backText: {
        color: colors.textSecondary,
        fontWeight: "500",
    },
    confirmCard: {
        backgroundColor: colors.surface,
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FECACA",
        marginTop: 14,
    },
    confirmTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: colors.text,
    },
    confirmDescription: {
        color: colors.textSecondary,
        fontSize: 13,
        marginTop: 6,
    },
    confirmActions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 18,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    cancelText: {
        color: colors.text,
        fontWeight: "600",
    },
    confirmButton: {
        flex: 1,
        backgroundColor: "#DC2626",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    error: {
        color: "#DC2626",
        backgroundColor: "#FEF2F2",
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
    },
    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
    },
    emptyText: {
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: 12,
        fontSize: 13,
    },
});
