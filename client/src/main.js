import { createPinia } from "pinia";
import { createApp } from "vue";
import ToastPlugin from "vue-toast-notification";

import App from "./App.vue";
import "vue-toast-notification/dist/theme-bootstrap.css";

import "./styles/index.scss";
import "./styles/app.scss";
import "./styles/toasts.scss";
import router from "./router";

const app = createApp(App);
app.use(ToastPlugin);
app.use(router);
app.use(createPinia());

router.isReady().then(() => {
    app.mount("#app");
});
