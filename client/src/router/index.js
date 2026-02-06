import { createRouter, createWebHistory } from "vue-router";

import { soundBus } from "@/audio/soundBus";

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
        component: () => import("@/pages/lobby/LobbyPage.vue"),
        name: "lobby",
        path: "/:id",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router.beforeEach(() => {
//     soundBus.unloadAll();
//     soundBus.stopMusic();
// });

export default router;
