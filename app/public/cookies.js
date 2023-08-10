const COOKIES = (() => {
    const cookiesList = document.cookie.split("; ");
    const cookiesObject = {};
    for (const cookie of cookiesList) {
        const [name, value] = cookie.split("=");
        cookiesObject[name] = value;
    }
    return cookiesObject;
})();

const USERNAME_COOKIE = COOKIES.username ?? null;
const GAME_ID_COOKIE = COOKIES.gameId ?? null;
