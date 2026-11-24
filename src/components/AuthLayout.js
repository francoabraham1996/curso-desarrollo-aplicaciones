
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

export function AuthLayout({
    title,
    subtitle,
    children,
    footer,
}) {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.wrapper}>
                        <View style={styles.brand}>
                            <View style={styles.logo}>
                                <Ionicons
                                    name="checkmark-done"
                                    size={38}
                                    color="#FFFFFF"
                                />
                            </View>

                            <Text style={styles.brandName}>TaskFlow</Text>

                            <Text style={styles.tagline}>
                                Organizá tu día, alcanzá tus objetivos.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.subtitle}>{subtitle}</Text>

                            {children}
                        </View>

                        {footer}

                        <Text style={styles.version}>
                            TaskFlow · Versión 1.0.0
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export function AuthInput({
    label,
    icon,
    password = false,
    error,
    ...props
}) {
    const [visible, setVisible] = useState(false);
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>

            <View
                style={[
                    styles.inputContainer,
                    focused && styles.inputFocused,
                    !!error && styles.inputError,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={focused ? colors.primary : colors.textSecondary}
                />

                <TextInput
                    {...props}
                    style={styles.input}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={password && !visible}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />

                {password && (
                    <TouchableOpacity
                        onPress={() => setVisible(!visible)}
                        accessibilityLabel={
                            visible ? "Ocultar contraseña" : "Mostrar contraseña"
                        }
                        style={styles.eyeButton}
                    >
                        <Ionicons
                            name={visible ? "eye-off-outline" : "eye-outline"}
                            size={21}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {!!error && (
                <Text style={styles.fieldError}>{error}</Text>
            )}
        </View>
    );
}

export function AuthButton({ title, loading, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.button, loading && styles.disabled]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

export function AuthError({ message }) {
    if (!message) return null;

    return (
        <View style={styles.errorBox}>
            <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#B91C1C"
            />
            <Text style={styles.errorText}>{message}</Text>
        </View>
    );
}

export function AuthFooter({ text, action, onPress, disabled }) {
    return (
        <View style={styles.footer}>
            <Text style={styles.footerText}>{text}</Text>

            <TouchableOpacity onPress={onPress} disabled={disabled}>
                <Text style={styles.link}>{action}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 22,
        paddingVertical: 30,
    },
    wrapper: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
    },
    brand: {
        alignItems: "center",
        marginBottom: 28,
    },
    logo: {
        width: 68,
        height: 68,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    brandName: {
        fontSize: 32,
        fontWeight: "bold",
        color: colors.primary,
    },
    tagline: {
        color: colors.textSecondary,
        fontSize: 13,
        marginTop: 6,
        textAlign: "center",
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 22,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: colors.text,
    },
    subtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 6,
        marginBottom: 24,
    },
    field: {
        marginBottom: 17,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 11,
        paddingHorizontal: 12,
        minHeight: 50,
        gap: 10,
    },
    inputFocused: {
        borderColor: colors.primary,
        backgroundColor: "#FFFFFF",
    },
    inputError: {
        borderColor: "#DC2626",
    },
    input: {
        flex: 1,
        minWidth: 0,
        color: colors.text,
        fontSize: 14,
        paddingVertical: 12,
    },
    eyeButton: {
        padding: 4,
    },
    fieldError: {
        fontSize: 12,
        color: "#DC2626",
        marginTop: 6,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 11,
        alignItems: "center",
        marginTop: 8,
        minHeight: 50,
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    disabled: {
        opacity: 0.65,
    },
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#FEF2F2",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    errorText: {
        flex: 1,
        color: "#B91C1C",
        fontSize: 13,
    },
    footer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        marginTop: 22,
    },
    footerText: {
        color: colors.textSecondary,
        fontSize: 13,
    },
    link: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: "700",
    },
    version: {
        color: "#9CA3AF",
        textAlign: "center",
        fontSize: 11,
        marginTop: 28,
    },
});
