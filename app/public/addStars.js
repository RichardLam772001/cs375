const body = document.querySelector(".body");

const randomInt = (a, b) => a + Math.floor(Math.random()*((b-a)+1));

const starMap = {
    0 : "small-star",
    1 : "medium-star",
    2 : "large-star"
};

/**
 * Creates stars recursively. Done recursively b/c we want spawn them with a delay
 * so each star's y-pos is different from the other ones.
 */
const addStars = (i) => {
    if (i <= 0) {
        return;
    }
    i--;
    const starDiv = document.createElement("div");
    starDiv.style.left = `${Math.random()* body.offsetWidth}px`;
    starDiv.classList.add("star");
    starDiv.classList.add(starMap[randomInt(0, 2)]);
    body.appendChild(starDiv);
    setTimeout(() => addStars(i), 100);
}

addStars(200);
