
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { auth } from "../firebase/firebaseConfig";
import { subscribeToTasks } from "../firebase/taskService";

import {
    setTasksSync,
    setTasksLoading,
    setTasksError,
} from "../redux/taskSlice";

export const useTaskSync = (userId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) return;

        let active = true;

        dispatch(setTasksLoading(true));

        const unsubscribe = subscribeToTasks(
            userId,

            (data) => {
                if (!active) return;
                if (auth.currentUser?.uid !== userId) return;

                dispatch(setTasksSync(data));
            },

            (error) => {
                if (!active) return;
                if (auth.currentUser?.uid !== userId) return;

                const message =
                    error.code === "permission-denied"
                        ? "No tenés permisos para acceder a estas tareas."
                        : "No se pudieron sincronizar las tareas.";

                dispatch(setTasksError(message));
            }
        );

        return () => {
            active = false;
            unsubscribe();
        };
    }, [userId, dispatch]);
};
