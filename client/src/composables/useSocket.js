import io from "socket.io-client";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";

import { soundBus } from "../audio/soundBus";
import { useAppStore } from "../store/useAppStore";
import getUserId from "./getUserId";

export default function useSocket() {
    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();
    const reconnectAttemptCount = ref(0);
    const socket = io("http://localhost:3000", {
        reconnectionAttempts: 2,
        reconnectionDelay: 5000,
    });
    // const socket = io("http://100.105.85.19:3000");

    let userId = getUserId();

    socket.on("connect", () => {
        reconnectAttemptCount.value = 0;
        store.setSocket(socket);
        store.setUserId(userId);
        store.emit("initialRequest", {
            lobbyId: route.params.id,
            username: localStorage.getItem("username"),
        });
    });

    socket.on("homepage", (payload) => {
        router.push("/");
        store.setLoading(false);

        if (payload) {
            toast.error(payload.error, {
                duration: 4000,
                position: "top-left",
                type: "error",
            });
        }
    });

    socket.on("lobby", (lobbyId) => {
        store.setLoading(true);
        setTimeout(() => {
            router.push(`/${lobbyId}`);
        }, 1000);
    });

    socket.on("game", (data) => {
        store.setLoading(true);
        setTimeout(() => {
            router.push(`/${data.lobbyId}/${data.gameTitle}`);
        }, 3000);
    });

    socket.on("error", (payload) => {
        if (payload) {
            toast.error(payload.error, {
                duration: 4000,
                position: "top",
                type: "error",
            });
        }
    });

    socket.on("info", (payload) => {
        if (payload) {
            toast.success(payload.info, {
                dismissible: false,
                duration: 4000,
                position: "top-left",
                type: "info",
            });
        }
    });

    // socket.on("disconnect", () => {

    //     store.setLoading(true);
    //     store.setSocket(null);
    // });

    socket.on("connect_error", () => {
        reconnectAttemptCount.value++;
        toast.error(
            "Nie można nawiązać połączenia z serwerem. \n Próba ponownego połączenia...",
            {
                duration: 5000,
                position: "top",
                type: "error",
            },
        );
        store.setLoading(true);
        store.setSocket(null);

        if (reconnectAttemptCount.value === 3) {
            setTimeout(() => {
                toast.error(
                    "Połączenie zostało zerwane. Naciśnij F5, aby odświeżyć stronę",
                    {
                        duration: 0,
                        position: "top",
                    },
                );
            }, 6000);
        }
    });
}
