//Son los componentes core de React Native
import {View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";


// """ 
// Count → es nuestro componente. 
// useState(0) → crea un estado que empieza en 0. 
// contador → guarda el número actual. 
// setContador → nos permite cambiar ese número. 
// decrementar → función para restar 1 al contador.
// if (contador > 0) → solo resta si el contador es mayor que 0.
// Así evitamos números negativos.
// """

export const Count = () => {
    const [contador, setContador] = useState(0);
    const decrementar = () => {
        if  (contador > 0) {
            setContador(contador - 1);
        }
    }
    
    
    // View → contenedor. Pensalo parecido a un div en web.
    // Text → muestra texto.
    // {contador} → muestra en pantalla el valor del estado, que inicialmente es 0.
    // Pressable → elemento que podemos presionar.
    // onPress → indica qué ocurre cuando lo presionamos.
    // setContador(contador + 1) → aumenta el contador en 1.
   return (
    <View style={style.container}>
        <Text style={style.title}>TaskFlow</Text>
        <Text>Contador de tareas</Text>
        <Text style={style.counter}>{contador}</Text>

        <View style={style.buttons}>
            <Pressable style={style.button} onPress={decrementar}>
                <Text style={style.buttonText}>-</Text>
            </Pressable>

            <Pressable
                style={style.button}
                onPress={() => setContador(contador + 1)}
            >
                <Text style={style.buttonText}>+</Text>
            </Pressable>
        </View>
    </View>
);
}
// StyleSheet.create() → crea nuestros estilos en React Native.

// flex: 1 → hace que el contenedor ocupe el espacio disponible.

// justifyContent: "center" → centra verticalmente.

// alignItems: "center" → centra horizontalmente.

// flexDirection: "row" → pone los botones uno al lado del otro.

// backgroundColor y borderRadius → apariencia del botón.

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
    },

    counter: {
        fontSize: 40,
        marginVertical: 20,
    },

    buttons: {
        flexDirection: "row",
        gap: 15,
    },

    button: {
        width: 60,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
        borderRadius: 8,
    },

    buttonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    },
});


