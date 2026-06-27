export default function parseCookie(cookieHeader, name) {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
    }, {});

    return cookies[name] ?? null;
}
