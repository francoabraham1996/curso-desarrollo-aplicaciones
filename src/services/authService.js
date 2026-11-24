
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
    );
};

export const getAuthError = (error) => {
    switch (error.code) {
        case "auth/invalid-email":
            return "El correo electrónico no es válido.";

        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "El correo o la contraseña son incorrectos.";

        case "auth/email-already-in-use":
            return "Ya existe una cuenta con este correo.";

        case "auth/weak-password":
            return "La contraseña debe tener al menos 6 caracteres.";

        case "auth/network-request-failed":
            return "No hay conexión a internet. Intentá nuevamente.";

        case "auth/too-many-requests":
            return "Demasiados intentos. Probá más tarde.";

        case "auth/user-disabled":
            return "Esta cuenta se encuentra deshabilitada.";

        default:
            return "Ocurrió un error. Intentá nuevamente.";
    }
};
