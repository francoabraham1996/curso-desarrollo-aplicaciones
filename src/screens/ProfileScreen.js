import { View, Text, StyleSheet } from "react-native";
import { ProfileCard } from "../components/ProfileCard";
import { colors } from "../constants/colors";

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>

      <ProfileCard
        name="Franco Abraham"
        role="Usuario de TaskFlow"
        image="https://i.pravatar.cc/150?img=12"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 10,
  },
});