import { ref, onMounted, onBeforeUnmount } from "vue";

export function useGameResize(baseWidth = 1920, baseHeight = 950) {
    const scale = ref(1);

    const resizeGame = () => {
        const vw = Math.min(window.innerWidth, baseWidth);
        const vh = window.innerHeight;
        scale.value = Math.min(vw / baseWidth, vh / baseHeight);
    };

    onMounted(() => {
        window.addEventListener("resize", resizeGame);
        resizeGame();
    });

    onBeforeUnmount(() => {
        window.removeEventListener("resize", resizeGame);
    });

    return { scale };
}
