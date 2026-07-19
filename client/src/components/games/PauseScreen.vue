<script setup></script>

<template>
    <div class="pause">
        <div>
            <h1>Gra wstrzymana.</h1>
            <h2>Jeden z graczy opuścił rozgrywkę.</h2>
        </div>
    </div>
</template>

<style scoped lang="scss">
.pause {
    position: absolute;
    z-index: 9998;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.745);
    display: grid;
    color: white;
    font-family: sans-serif;
    place-items: center;
    h1 {
        max-width: 700px;
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
    h2 {
        font-size: 1.5rem;
    }
}
</style>
