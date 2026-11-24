
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { colors } from "../constants/colors";

export const ProfileCard = ({
  name,
  role,
  image,
  onChangeImage,
  loading = false,
}) => {
  const initials = (name || "Usuario")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={onChangeImage}
        disabled={loading}
        activeOpacity={0.8}
        accessibilityLabel="Cambiar foto de perfil"
        style={styles.avatarContainer}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.initials}>
              {initials}
            </Text>
          </View>
        )}

        <View style={styles.editBadge}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.editIcon}>✎</Text>
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.role}>{role}</Text>

      <TouchableOpacity
        onPress={onChangeImage}
        disabled={loading}
        style={styles.changeButton}
      >
        <Text style={styles.changeButtonText}>
          {loading ? "Guardando..." : "Cambiar foto de perfil"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  placeholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
  },

  initials: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary,
  },

  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  editIcon: {
    fontSize: 19,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  name: {
    fontSize: 23,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
  },

  role: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },

  changeButton: {
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 18,
  },

  changeButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
});
