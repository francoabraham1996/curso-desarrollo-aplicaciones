
import { useState, useRef } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

import {
    AuthLayout,
    AuthInput,
    AuthButton,
    AuthError,
    AuthFooter,
} from "../components/AuthLayout";

import {
    isValidEmail,
    getAuthError,
} from "../services/authService";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const loadingRef = useRef(false);

    const emailError =
        submitted && !isValidEmail(email)
            ? "Ingresá un correo válido."
            : "";

    const passwordError =
        submitted && !password
            ? "Ingresá tu contraseña."
            : "";

    const handleLogin = async () => {
        if (loadingRef.current) return;

        setSubmitted(true);
        setError("");

        if (!isValidEmail(email) || !password) {
            return;
        }

        loadingRef.current = true;
        setLoading(true);

        try {
            await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );
        } catch (error) {
            setError(getAuthError(error));
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="¡Bienvenido!"
            subtitle="Iniciá sesión para acceder a tus tareas."
            footer={
                <AuthFooter
                    text="¿Todavía no tenés cuenta?"
                    action="Crear cuenta"
                    disabled={loading}
                    onPress={() => navigation.navigate("Register")}
                />
            }
        >
            <AuthInput
                label="Correo electrónico"
                icon="mail-outline"
                placeholder="usuario@email.com"
                value={email}
                onChangeText={(value) => {
                    setEmail(value);
                    setError("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                editable={!loading}
                error={emailError}
            />

            <AuthInput
                label="Contraseña"
                icon="lock-closed-outline"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChangeText={(value) => {
                    setPassword(value);
                    setError("");
                }}
                password
                autoCapitalize="none"
                autoComplete="current-password"
                editable={!loading}
                error={passwordError}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
            />

            <AuthError message={error} />

            <AuthButton
                title="Iniciar sesión"
                loading={loading}
                onPress={handleLogin}
            />
        </AuthLayout>
    );
}
