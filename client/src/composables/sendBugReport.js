import { useToast } from "vue-toast-notification";

// Wspólne wysyłanie zgłoszeń (homepage, lobby, gra) - zwraca true jak się udało
export const sendBugReport = async (message) => {
    const toast = useToast();
    const VITE_APP_IP = import.meta.env.VITE_APP_IP;

    try {
        const response = await fetch(`${VITE_APP_IP}/api/bugReport`, {
            body: JSON.stringify({ message }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        toast.info(data.message, {
            duration: 4000,
            position: "top-left",
        });
        return true;
    } catch (error) {
        toast.error(error.message || "Nie udało się wysłać zgłoszenia.", {
            duration: 4000,
            position: "top-left",
            type: "error",
        });
        return false;
    }
};
