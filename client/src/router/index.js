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
        component: () => import("@/pages/games/PhilanthropistsPage.vue"),
        name: "philanthropists",
        path: "/:id/philanthropists",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
