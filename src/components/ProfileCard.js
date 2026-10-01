import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

// View será el contenedor de la tarjeta, Text mostrará nombre y rol, Image mostrará el avatar y StyleSheet nos permitirá diseñarla sin meter estilos grandes directamente en el JSX.

export const ProfileCard = ({ name, role, image }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: image }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    // hace que la foto y los textos queden uno al lado del otro. 
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    margin: 16,
    elevation: 4,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  info: {
    marginLeft: 16,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },

  role: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
});