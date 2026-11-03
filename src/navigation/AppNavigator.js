
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import TaskForm from "../components/TaskForm";

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

export default function AppNavigator() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
