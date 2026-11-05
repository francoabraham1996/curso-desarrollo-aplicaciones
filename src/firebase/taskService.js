
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

import { db } from "./firebaseConfig";

// Guardar una tarea
export const saveTask = async (task, userId) => {
    const nuevaTarea = {
        title: task.title,
        description: task.description,
        category: task.category,
        completed: false,
        createdAt: new Date().toISOString(),
        userId: userId,
    };

    const resultado = await addDoc(collection(db, "tasks"), nuevaTarea);
    return resultado.id;
};

// Obtener tareas del usuario
export const getTasks = async (userId) => {
    const consulta = query(
        collection(db, "tasks"),
        where("userId", "==", userId)
    );

    const resultado = await getDocs(consulta);

    return resultado.docs.map((documento) => ({
        ...documento.data(),
        id: documento.id,
    }));
};

// Cambiar el estado de una tarea
export const updateTaskStatus = async (taskId, completed) => {
    await updateDoc(doc(db, "tasks", taskId), {
        completed: completed,
    });
};

// Eliminar una tarea
export const removeTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
};
