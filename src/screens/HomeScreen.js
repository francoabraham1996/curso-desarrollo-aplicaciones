
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "../redux/taskSlice";
import { colors } from "../constants/colors";

const filters = [
  { label: "Todas", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Completadas", value: "completed" },
];

export const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const {
    items: tasks,
    filter,
    loading,
    error,
    fromCache,
    hasPendingWrites,
  } = useSelector((state) => state.tasks);

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  const progress = total
    ? Math.round((completed / total) * 100)
    : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;

    return true;
  });

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={styles.task}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("TaskDetail", {
          taskId: item.id,
        })
      }
    >
      <View style={styles.taskRow}>
        <View
          style={[
            styles.taskIcon,
            item.completed && styles.completedIcon,
          ]}
        >
          <Text style={styles.iconText}>
            {item.completed ? "✓" : "○"}
          </Text>
        </View>

        <View style={styles.taskInfo}>
          <Text
            style={styles.taskTitle}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text style={styles.category}>
            {item.category}
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </View>

      <Text
        style={[
          styles.taskStatus,
          {
            color: item.completed
              ? "#16A34A"
              : "#D97706",
          },
        ]}
      >
        {item.completed ? "Completada" : "Pendiente"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right"]}
    >
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>TaskFlow</Text>

            <Text style={styles.subtitle}>
              Organizá tu día, alcanzá tus objetivos.
            </Text>

            <View style={styles.dashboard}>
              <Text style={styles.dashboardTitle}>
                Tu productividad
              </Text>

              <View style={styles.stats}>
                {[
                  { value: total, label: "Total" },
                  {
                    value: completed,
                    label: "Completadas",
                  },
                  {
                    value: pending,
                    label: "Pendientes",
                  },
                ].map((item) => (
                  <View
                    key={item.label}
                    style={styles.stat}
                  >
                    <Text style={styles.statNumber}>
                      {item.value}
                    </Text>

                    <Text style={styles.statLabel}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%` },
                  ]}
                />
              </View>

              <Text style={styles.progressText}>
                {progress}% de tus tareas completadas
              </Text>
            </View>

            <Text
              style={[
                styles.syncText,
                {
                  color:
                    error ||
                      fromCache ||
                      hasPendingWrites
                      ? "#D97706"
                      : "#16A34A",
                },
              ]}
            >
              {loading
                ? "Cargando tareas..."
                : error
                  ? error
                  : hasPendingWrites
                    ? "Cambios pendientes de sincronización"
                    : fromCache
                      ? "Mostrando datos en caché"
                      : "✓ Tareas sincronizadas"}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("TaskForm")
              }
            >
              <Text style={styles.buttonText}>
                + Nueva tarea
              </Text>
            </TouchableOpacity>

            <View style={styles.filters}>
              {filters.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() =>
                    dispatch(setFilter(item.value))
                  }
                  style={[
                    styles.filter,
                    filter === item.value &&
                    styles.filterSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === item.value &&
                      styles.filterTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
              />
            ) : (
              <>
                <Text style={styles.emptyIcon}>☷</Text>

                <Text style={styles.emptyTitle}>
                  {error
                    ? "Error de sincronización"
                    : fromCache && !tasks.length
                      ? "Datos no disponibles"
                      : tasks.length === 0
                        ? "Todavía no tenés tareas"
                        : "No hay tareas con este filtro"}
                </Text>

                <Text style={styles.emptyText}>
                  {error
                    ? "Revisá tu conexión o volvé a iniciar sesión."
                    : fromCache && !tasks.length
                      ? "Conectate a internet para consultar tus tareas."
                      : tasks.length === 0
                        ? "Creá tu primera tarea para empezar."
                        : "Probá seleccionando otro filtro."}
                </Text>
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
    marginBottom: 22,
  },
  dashboard: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 20,
  },
  dashboardTitle: {
    color: "#E0E7FF",
    fontSize: 15,
    fontWeight: "600",
  },
  stats: {
    flexDirection: "row",
    marginVertical: 20,
  },
  stat: {
    flex: 1,
  },
  statNumber: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#E0E7FF",
    fontSize: 12,
    marginTop: 4,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#818CF8",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 10,
  },
  syncText: {
    fontSize: 12,
    marginVertical: 14,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 18,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  filters: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#E9EBF3",
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  filter: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 9,
  },
  filterSelected: {
    backgroundColor: "#FFFFFF",
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  filterTextSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  task: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  completedIcon: {
    backgroundColor: "#DCFCE7",
  },
  iconText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  taskInfo: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: "capitalize",
    marginTop: 4,
  },
  arrow: {
    color: "#9CA3AF",
    fontSize: 25,
  },
  taskStatus: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 12,
  },
  empty: {
    alignItems: "center",
    padding: 30,
  },
  emptyIcon: {
    fontSize: 45,
    color: colors.primary,
    marginBottom: 10,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
});
