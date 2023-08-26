const COOKIES = (() => {
    const cookiesList = document.cookie.split("; ");
    const cookiesObject = {};
    for (const cookie of cookiesList) {
        const [name, value] = cookie.split("=");
        cookiesObject[name] = value;
    }
    return cookiesObject;
})();

const USERNAME_COOKIE = COOKIES.username ?? Math.floor(Math.random()*10000);
const GAME_ID_COOKIE = COOKIES.gameId ?? null;
