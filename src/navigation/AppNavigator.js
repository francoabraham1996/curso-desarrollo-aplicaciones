import { useDispatch } from "react-redux";
import { clearTasks } from "../redux/taskSlice";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import TaskForm from "../components/TaskForm";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TaskStack() {
    return (
        <Stack.Navigator>
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
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={TaskStack}
                options={{ title: "Tareas", headerShown: false }}
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


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usuario) => {
            setUser(usuario);
            setLoading(false);

            if (!usuario) {
                dispatch(clearTasks());
            }
        });

        return unsubscribe;
    }, [dispatch]);


    if (loading) {
        return (
            <View>
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? (
                <MainTabs />
            ) : (
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ title: "Iniciar sesión" }}
                    />

                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ title: "Crear cuenta" }}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}
