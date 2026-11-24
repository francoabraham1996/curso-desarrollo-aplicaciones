
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";

import { db, auth } from "./firebaseConfig";

const getUserTasksQuery = (userId) => {
    return query(
        collection(db, "tasks"),
        where("userId", "==", userId)
    );
};

const mapTasks = (snapshot) => {
    return snapshot.docs
        .map((documento) => ({
            ...documento.data(),
            id: documento.id,
        }))
        .sort((a, b) =>
            (b.createdAt || "").localeCompare(a.createdAt || "")
        );
};

export const saveTask = async (task, userId) => {
    if (!userId || auth.currentUser?.uid !== userId) {
        throw new Error("Usuario no autenticado");
    }

    const nuevaTarea = {
        title: task.title.trim(),
        description: task.description.trim(),
        category: task.category,
        completed: false,
        createdAt: new Date().toISOString(),
        userId,
    };

    const resultado = await addDoc(
        collection(db, "tasks"),
        nuevaTarea
    );

    return resultado.id;
};

export const getTasks = async (userId) => {
    const resultado = await getDocs(
        getUserTasksQuery(userId)
    );

    return mapTasks(resultado);
};

export const subscribeToTasks = (
    userId,
    onUpdate,
    onError
) => {
    return onSnapshot(
        getUserTasksQuery(userId),
        { includeMetadataChanges: true },
        (snapshot) => {
            onUpdate({
                tasks: mapTasks(snapshot),
                fromCache: snapshot.metadata.fromCache,
                hasPendingWrites: snapshot.metadata.hasPendingWrites,
            });
        },
        onError
    );
};

export const updateTaskStatus = async (taskId, completed) => {
    if (!auth.currentUser) {
        throw new Error("Usuario no autenticado");
    }

    await updateDoc(doc(db, "tasks", taskId), {
        completed,
    });
};

export const removeTask = async (taskId) => {
    if (!auth.currentUser) {
        throw new Error("Usuario no autenticado");
    }

    await deleteDoc(doc(db, "tasks", taskId));
};
