import { defineStore } from "pinia";

export const useAppStore = defineStore("socket", {
    actions: {
        emit(event, data) {
            this.socket.emit(event, {
                data,
                userId: this.userId,
            });
        },

        getIsLoading() {
            return this.isLoading;
        },

        setLoading(isLoading) {
            this.isLoading = isLoading;
        },

        setSocket(socketInstance) {
            this.socket = socketInstance;
        },

        setUserId(userId) {
            this.userId = userId;
        },
    },
    state: () => ({
        initialRequestData: false,
        isLoading: true,
        socket: null,
        userId: undefined,
    }),
});
