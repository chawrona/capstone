import { createRouter, createWebHistory } from "vue-router";
import { useToast } from "vue-toast-notification";

import { soundBus } from "@/audio/soundBus";

import { useAppStore } from "../store/useAppStore.js";

const routes = [
    {
        component: () => import("@/pages/HomePage.vue"),
        name: "home",
        path: "/",
    },
    {
        component: () => import("@/pages/games/ludo/Ludo.vue"),
        name: "ludo",
        path: "/:id/ludo",
    },
    {
        component: () => import("@/pages/games/craftsmen/Craftsmen.vue"),
        name: "craftsmen",
        path: "/:id/craftsmen",
    },
    {
        component: () => import("@/pages/games/craftsmen2/Craftsmen.vue"),
        name: "craftsmen2",
        path: "/:id/craftsmen2",
    },
    {
        component: () => import("@/pages/games/eurobusiness/Eurobusiness.vue"),
        name: "eurobusiness",
        path: "/:id/eurobusiness",
    },
    {
        component: () => import("@/pages/games/brianboru/BrianBoru.vue"),
        name: "brianboru",
        path: "/:id/brianboru",
    },
    {
        component: () =>
            import("@/pages/games/philanthropists/Philanthropists.vue"),
        name: "philanthropists",
        path: "/:id/philanthropists",
    },
    {
        component: () => import("@/pages/lobby/LobbyPage.vue"),
        name: "lobby",
        path: "/:id",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const store = useAppStore();
    const toast = useToast();

    if (to.name === "home") {
        store.disconnectSocket();
    } else if (to.params.id) {
        store.connectSocket(to.params.id, router, toast);
    }

    // Pozwalamy na przejście do docelowej ścieżki
    next();
});

export default router;
