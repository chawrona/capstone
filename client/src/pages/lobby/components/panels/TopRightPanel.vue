user-color
<script setup>
import ReadyWhite from "@/assets/ReadyWhite.svg";

const props = defineProps([
    "currentUser",
    "readyUsers",
    "currentGame",
    "lobbyUsers",
]);
</script>

<template>
    <div class="panel top-right">
        <p class="theme-title ready-count">
            <span class="count-description">Gotowi </span>
            <span>{{ `(${readyUsers}/${props.currentGame.maxPlayers})` }}</span>
        </p>

        <ul class="lobby-users">
            <li
                v-for="user in props.lobbyUsers"
                :key="user.publicId"
                :style="`--color: ${user.color ? user.color.hex : '#868686'}`"
                :class="{
                    'lobby-user': props.currentUser !== user.publicId,
                    'current-user': props.currentUser === user.publicId,
                    ready: user.isReady || user.isAdmin,
                }"
            >
                {{ user.username }}
                <span class="user-color">
                    <img
                        v-show="user.isReady || user.isAdmin"
                        :src="ReadyWhite"
                        class="ready-icon"
                        alt=""
                    />
                </span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.top-right {
    top: 0;
    right: 0;

    @media (width < 768px) {
        .top-right {
            order: 3;
        }

        .ready-count {
            text-align: center;
            transform: none;
        }
    }
}

.ready-count {
    text-align: right;
    font-size: 1.15rem;
    transform: translateX(1.5rem);
    font-family: "Cinzel";
}

.lobby-users {
    text-align: right;
    list-style: none;
    font-size: 1.25rem;
    letter-spacing: 0.02em;

    li {
        font-weight: bold;
        position: relative;
        color: hsl(from var(--color) h s calc(l * 1.2));

        @media (width < 768px) {
            text-align: center;
        }
    }

    .lobby-user {
        font-weight: 600;
        opacity: 0.6;
    }

    .user-color {
        position: absolute;
        display: block;

        height: 60%;
        top: 50%;
        transform: translate(150%, -55%);
        right: 0;
        aspect-ratio: 1 / 1;
        background: linear-gradient(
            135deg,
            var(--color),
            hsl(from var(--color) h s calc(l * 0.5))
        );
    }

    .ready {
        opacity: 1;
    }

    .ready-icon {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 130%;
        max-width: none;
    }
}
</style>
