const ROUTER = (() => {

    const route = (route) => {
        redirect = `${IS_PROD ? "https" : "http"}://${window.location.host}${route}`;
        window.location.href = redirect;
    }

    return {
        route
    }
})();
