const post = (route, body) => {
    return fetch(route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
}

const get = (route) => {
    return fetch(route, {
        method: "GET"
    });
}
