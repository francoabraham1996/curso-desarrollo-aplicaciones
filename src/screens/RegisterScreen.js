
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        if (!email.trim() || password.length < 6) {
            Alert.alert("Error", "Ingresá un correo y una contraseña de al menos 6 caracteres.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email.trim(), password);
        } catch (error) {
            Alert.alert("Error", "No se pudo crear la cuenta. Revisá los datos.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cuenta</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña (mínimo 6 caracteres)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarme</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.link}>Ya tengo una cuenta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        backgroundColor: "white",
        padding: 12,
        marginBottom: 15,
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#2563eb",
        padding: 15,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
    },
    link: {
        color: "#2563eb",
        textAlign: "center",
        marginTop: 20,
    },
});
