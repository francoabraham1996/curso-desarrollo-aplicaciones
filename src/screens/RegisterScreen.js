
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";

import {
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";
import { setProfileName } from "../redux/profileSlice";

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

export default function RegisterScreen({ navigation }) {
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const loadingRef = useRef(false);

    const nameError =
        submitted && name.trim().length < 2
            ? "Ingresá tu nombre."
            : "";

    const emailError =
        submitted && !isValidEmail(email)
            ? "Ingresá un correo válido."
            : "";

    const passwordError =
        submitted && password.length < 6
            ? "Debe tener al menos 6 caracteres."
            : "";

    const confirmError =
        submitted &&
            (!confirmPassword || password !== confirmPassword)
            ? "Las contraseñas no coinciden."
            : "";

    const handleRegister = async () => {
        if (loadingRef.current) return;

        setSubmitted(true);
        setError("");

        if (
            name.trim().length < 2 ||
            !isValidEmail(email) ||
            password.length < 6 ||
            password !== confirmPassword
        ) {
            return;
        }

        loadingRef.current = true;
        setLoading(true);

        try {
            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email.trim(),
                    password
                );

            try {
                await updateProfile(credential.user, {
                    displayName: name.trim(),
                });

                if (
                    auth.currentUser?.uid === credential.user.uid
                ) {
                    dispatch(
                        setProfileName({
                            uid: credential.user.uid,
                            name: name.trim(),
                        })
                    );
                }
            } catch {
                // La cuenta ya existe y el usuario está autenticado.
                // Si falla el nombre, se utilizará el correo.
            }
        } catch (error) {
            setError(getAuthError(error));
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Creá tu cuenta"
            subtitle="Empezá a organizar tus tareas con TaskFlow."
            footer={
                <AuthFooter
                    text="¿Ya tenés una cuenta?"
                    action="Iniciar sesión"
                    disabled={loading}
                    onPress={() => navigation.goBack()}
                />
            }
        >
            <AuthInput
                label="Nombre completo"
                icon="person-outline"
                placeholder="Tu nombre"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                editable={!loading}
                error={nameError}
                maxLength={80}
            />

            <AuthInput
                label="Correo electrónico"
                icon="mail-outline"
                placeholder="usuario@email.com"
                value={email}
                onChangeText={setEmail}
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={setPassword}
                password
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!loading}
                error={passwordError}
            />

            <AuthInput
                label="Confirmar contraseña"
                icon="lock-closed-outline"
                placeholder="Repetí tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                password
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!loading}
                error={confirmError}
                returnKeyType="go"
                onSubmitEditing={handleRegister}
            />

            <AuthError message={error} />

            <AuthButton
                title="Crear mi cuenta"
                loading={loading}
                onPress={handleRegister}
            />
        </AuthLayout>
    );
}
