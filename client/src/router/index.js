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
        component: () => import("@/pages/LobbyPage.vue"),
        name: "lobby",
        path: "/:id",
    },
    {
        component: () => import("@/pages/games/CraftsmenPage.vue"),
        name: "craftsmen",
        path: "/:id/craftsmen",
    },
    {
        component: () => import("@/pages/games/BrianBoruPage.vue"),
        name: "brianboru",
        path: "/:id/brianboru",
    },
    {
        component: () => import("@/pages/games/PhilanthropistsPAge.vue"),
        name: "philanthropists",
        path: "/:id/philanthropists",
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

    next();
});

export default router;
