import { defineStore } from "pinia";
import io from "socket.io-client";

export const useAppStore = defineStore("socket", {
    actions: {
        connectSocket(lobbyId, router, toast) {
            if (this.socket && this.socket.connected) return;

            // Połączenie socket.io
            const VITE_APP_IP = import.meta.env.VITE_APP_IP;
            this.socket = io(VITE_APP_IP, {
                auth: { lobbyId },
                withCredentials: true,
            });

            // Ścieżki
            this.socket.on("homepage", (payload) => router.push("/"));
            this.socket.on("lobby", (lobbyId) => router.push(`/${lobbyId}`));
            this.socket.on("game", (data) =>
                router.push(`/${data.lobbyId}/${data.gameTitle}`),
            );

            // Błędy i informacje
            this.socket.on("error", (payload) => {
                if (payload) {
                    toast.error(payload.error, {
                        duration: 4000,
                        position: "top",
                        type: "error",
                    });
                }
            });

            this.socket.on("info", (payload) => {
                if (payload) {
                    toast.success(payload.info, {
                        dismissible: false,
                        duration: 4000,
                        position: "top-left",
                    });
                }
            });

            this.socket.on("connect_error", () => {
                this.disconnectSocket();
                toast.error(
                    "Połączenie zostało zerwane. Naciśnij F5, aby odświeżyć stronę",
                    {
                        duration: 0,
                        position: "top",
                    },
                );
            });
        },

        disconnectSocket() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
            }
        },

        emit(event, data) {
            if (this.socket) {
                this.socket.emit(event, { data });
            }
        },
    },
    state: () => ({
        isLoading: true,

        socket: null,
        userId: undefined,
    }),
});
