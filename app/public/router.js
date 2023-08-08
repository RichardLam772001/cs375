const ROUTER = (() => {

    const route = (route) => {
        redirect = `http://${window.location.host}${route}`;
        window.location.href = redirect;
    }

    return {
        route
    }
})();
