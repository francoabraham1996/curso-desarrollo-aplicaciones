
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { File, Paths } from "expo-file-system";

const avatarKey = (uid) => `taskflow_avatar_${uid}`;

export const saveAvatar = async (uid, asset) => {
    let avatar;

    if (Platform.OS === "web") {
        if (!asset.base64) {
            throw new Error("No se pudo procesar la imagen");
        }

        avatar = `data:image/jpeg;base64,${asset.base64}`;
    } else {
        const source = new File(asset.uri);

        const extension =
            asset.uri.split(".").pop()?.split("?")[0] || "jpg";

        const destination = new File(
            Paths.document,
            `avatar_${uid}_${Date.now()}.${extension}`
        );

        source.copy(destination);
        avatar = destination.name;
    }

    const previous = await AsyncStorage.getItem(avatarKey(uid));

    await AsyncStorage.setItem(avatarKey(uid), avatar);

    if (previous && Platform.OS !== "web") {
        try {
            const oldFile = new File(Paths.document, previous);

            if (oldFile.exists) {
                oldFile.delete();
            }
        } catch {
            // La imagen nueva ya fue guardada.
        }
    }

    return Platform.OS === "web"
        ? avatar
        : new File(Paths.document, avatar).uri;
};

export const getAvatar = async (uid) => {
    const avatar = await AsyncStorage.getItem(avatarKey(uid));

    if (!avatar) return null;

    if (Platform.OS === "web") {
        return avatar;
    }

    const file = new File(Paths.document, avatar);

    return file.exists ? file.uri : null;
};
