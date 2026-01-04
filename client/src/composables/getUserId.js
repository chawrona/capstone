export default function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                const r = (Math.random() * 16) | 0;
                const v = c === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            },
        );
        localStorage.setItem("userId", userId);
    }

    return userId;
}
