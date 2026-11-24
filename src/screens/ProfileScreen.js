
import { useState, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";
import { ProfileCard } from "../components/ProfileCard";
import { colors } from "../constants/colors";
import { setAvatar } from "../redux/profileSlice";
import { saveAvatar } from "../services/profileService";

export const ProfileScreen = () => {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile);
  const tasks = useSelector((state) => state.tasks.items);

  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [error, setError] = useState("");

  const pickingImage = useRef(false);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const handleChangeImage = async () => {
    if (!profile.uid || pickingImage.current) return;

    const uid = profile.uid;

    pickingImage.current = true;
    setLoadingImage(true);
    setError("");

    try {
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: Platform.OS === "web",
        });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      if (auth.currentUser?.uid !== uid) return;

      const avatar = await saveAvatar(
        uid,
        result.assets[0]
      );

      if (auth.currentUser?.uid !== uid) return;

      dispatch(
        setAvatar({
          uid,
          avatar,
        })
      );
    } catch {
      setError(
        "No se pudo seleccionar o guardar la imagen. Revisá los permisos e intentá nuevamente."
      );
    } finally {
      pickingImage.current = false;
      setLoadingImage(false);
    }
  };

  const handleLogout = async () => {
    if (loadingLogout || loadingImage) return;

    setLoadingLogout(true);
    setError("");

    try {
      await signOut(auth);
    } catch {
      setError(
        "No se pudo cerrar la sesión. Intentá nuevamente."
      );
    } finally {
      setLoadingLogout(false);
      setConfirmLogout(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mi perfil</Text>

          <Text style={styles.subtitle}>
            Administrá tu cuenta y tu actividad.
          </Text>
        </View>

        <ProfileCard
          name={profile.name || "Usuario"}
          role={profile.email || "Usuario de TaskFlow"}
          image={profile.avatar}
          onChangeImage={handleChangeImage}
          loading={loadingImage}
        />

        <Text style={styles.sectionTitle}>
          Resumen de actividad
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {totalTasks}
            </Text>
            <Text style={styles.statLabel}>Tareas</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text
              style={[
                styles.statNumber,
                { color: "#16A34A" },
              ]}
            >
              {completedTasks}
            </Text>
            <Text style={styles.statLabel}>
              Completadas
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text
              style={[
                styles.statNumber,
                { color: "#D97706" },
              ]}
            >
              {pendingTasks}
            </Text>
            <Text style={styles.statLabel}>
              Pendientes
            </Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              Progreso general
            </Text>

            <Text style={styles.progressValue}>
              {progress}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.progressDescription}>
            Completaste {completedTasks} de {totalTasks} tareas.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Mi cuenta</Text>

        <View style={styles.accountCard}>
          <Text style={styles.accountLabel}>
            Correo electrónico
          </Text>

          <Text style={styles.accountValue}>
            {profile.email}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.accountLabel}>
            Tipo de cuenta
          </Text>

          <Text style={styles.accountValue}>
            Usuario de TaskFlow
          </Text>
        </View>

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        {confirmLogout ? (
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>
              ¿Querés cerrar sesión?
            </Text>

            <Text style={styles.confirmDescription}>
              Tus tareas permanecerán guardadas.
            </Text>

            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                disabled={loadingLogout}
                onPress={() => setConfirmLogout(false)}
              >
                <Text style={styles.cancelText}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
                disabled={loadingLogout || loadingImage}
              >
                {loadingLogout ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    Cerrar sesión
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.logoutButton}
            disabled={loadingImage || loadingLogout}
            onPress={() => setConfirmLogout(true)}
          >
            <Text style={styles.logoutText}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.version}>
          TaskFlow · Versión 1.0.0
        </Text>
      </ScrollView>
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

  header: {
    marginBottom: 20,
    marginTop: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 27,
    color: colors.primary,
    fontWeight: "bold",
  },

  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 5,
  },

  statDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
  },

  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  progressValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },

  progressTrack: {
    height: 9,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 12,
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  progressDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 10,
  },

  accountCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  accountLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  accountValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 15,
  },

  logoutButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    padding: 15,
    marginTop: 22,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DC2626",
  },

  confirmCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  confirmTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },

  confirmDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },

  confirmActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  cancelButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },

  cancelText: {
    color: colors.text,
    fontWeight: "600",
  },

  confirmButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#DC2626",
    borderRadius: 10,
  },

  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 13,
  },

  version: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 24,
  },
});
