import { View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskFlow</Text>
      <Text style={styles.subtitle}>Mis tareas</Text>
      <Text style={styles.status}>Todavía no hay tareas cargadas.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 60,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 12,
  },

  status: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});