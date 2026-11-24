
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
} from "react-native";

import {
    NavigationContainer,
    DefaultTheme,
} from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

import { clearTasks } from "../redux/taskSlice";
import {
    setProfile,
    clearProfile,
} from "../redux/profileSlice";

import { getAvatar } from "../services/profileService";
import { useTaskSync } from "../hooks/useTaskSync";
import { colors } from "../constants/colors";

import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import TaskForm from "../components/TaskForm";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: "#E5E7EB",
    },
};

function TaskStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    fontWeight: "600",
                    color: colors.text,
                },
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: colors.background,
                },
                contentStyle: {
                    backgroundColor: colors.background,
                },
            }}
        >
            <Stack.Screen
                name="TaskList"
                component={HomeScreen}
                options={{ title: "Mis tareas" }}
            />

            <Stack.Screen
                name="TaskDetail"
                component={TaskDetailScreen}
                options={{ title: "Detalle de tarea" }}
            />

            <Stack.Screen
                name="TaskForm"
                component={TaskForm}
                options={{ title: "Nueva tarea" }}
            />
        </Stack.Navigator>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,

                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: "#E5E7EB",
                    paddingTop: 6,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused
                            ? "list-circle"
                            : "list-circle-outline";
                    } else {
                        iconName = focused
                            ? "person-circle"
                            : "person-circle-outline";
                    }

                    return (
                        <View
                            style={[
                                styles.tabIcon,
                                focused && styles.tabIconActive,
                            ]}
                        >
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={TaskStack}
                options={{ title: "Tareas" }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: "Perfil" }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const dispatch = useDispatch();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useTaskSync(loading ? null : user?.uid);

    useEffect(() => {
        let active = true;
        let requestId = 0;

        const unsubscribe = onAuthStateChanged(
            auth,
            async (usuario) => {
                const currentRequest = ++requestId;

                if (!active) return;

                setLoading(true);

                dispatch(clearTasks());
                dispatch(clearProfile());

                if (!usuario) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                let avatar = null;

                try {
                    avatar = await getAvatar(usuario.uid);
                } catch {
                    avatar = null;
                }

                if (
                    !active ||
                    currentRequest !== requestId ||
                    auth.currentUser?.uid !== usuario.uid
                ) {
                    return;
                }

                dispatch(
                    setProfile({
                        uid: usuario.uid,
                        name:
                            auth.currentUser.displayName ||
                            usuario.email?.split("@")[0] ||
                            "Usuario",
                        email: usuario.email || "",
                        avatar,
                    })
                );

                setUser(usuario);
                setLoading(false);
            }
        );

        return () => {
            active = false;
            unsubscribe();
        };
    }, [dispatch]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.logo}>
                    <Ionicons
                        name="checkmark-done"
                        size={42}
                        color="#FFFFFF"
                    />
                </View>

                <Text style={styles.brandName}>
                    TaskFlow
                </Text>

                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />

                <Text style={styles.loadingText}>
                    Preparando tu espacio de trabajo...
                </Text>
            </View>
        );
    }

    return (
        <NavigationContainer theme={navigationTheme}>
            {user ? (
                <MainTabs key={user.uid} />
            ) : (
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                >
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                    />

                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
        padding: 20,
    },

    logo: {
        width: 75,
        height: 75,
        borderRadius: 22,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },

    brandName: {
        fontSize: 32,
        fontWeight: "bold",
        color: colors.primary,
        marginBottom: 35,
    },

    loadingText: {
        marginTop: 14,
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: "center",
    },

    tabIcon: {
        paddingHorizontal: 18,
        paddingVertical: 2,
        borderRadius: 14,
    },

    tabIconActive: {
        backgroundColor: "#EEF2FF",
    },
});
