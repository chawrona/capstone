import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

import { useAppStore } from "../store/useAppStore";

export default function useAuthentication() {
    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

    const authenticate = async () => {
        const VITE_APP_IP = import.meta.env.VITE_APP_IP;

        const lobbyId = route.params.id;

        try {
            const response = await fetch(`${VITE_APP_IP}/api/authentication`, {
                body: JSON.stringify({ lobbyId }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            });

            const data = await response.json();

            if (data.redirect) {
                return router.push(data.redirect);
            }

            if (lobbyId && !data.redirect) {
                throw new Error("Pokój nie istnieje");
            }

            router.push("/");
        } catch (error) {
            toast.error(error.message, {
                duration: 4000,
                position: "top-left",
                type: "error",
            });

            router.push("/");
        }
    };

    return { authenticate };
}
