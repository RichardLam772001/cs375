//Maybe replace spaceQuotes with random quote API?
const spaceQuotes = [
    "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
    "Sometimes it seems as though each new step towards AI, rather than producing something which everyone agrees is real intelligence, merely reveals what real intelligence is not.",
    "People worry that computers will get too smart and take over the world, but the real problem is that they're too stupid and they've already taken over the world.",
    "By far the greatest danger of Artificial Intelligence is that people conclude too early that they understand it.",
    "The AI does not hate you, nor does it love you, but you are made out of atoms which it can use for something else.",
    "With few ambitions, most people allowed efficient machines to perform everyday tasks for them. Gradually, humans ceased to think, or dream... or truly live."
]
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteInput = document.getElementById("quoteInput");
const messageDisplay = document.getElementById("messageDisplay");

quoteInput.addEventListener("input", () => {
    const arrayQuote = quoteDisplay.querySelectorAll("span");
    const arrayValue = quoteInput.value.split("");
    let correct = true;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else if (isNaN(characterSpan.innerText.charCodeAt(0))) { //ignore line breaks made in <textarea>
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.remove("correct");
            characterSpan.classList.add("incorrect");
            correct = false;
        }
    });
    if (correct)
        quoteInput.setAttribute("disabled", "");
});

function getRandomQuote() {
    const index = Math.floor(Math.random() * spaceQuotes.length);
    return spaceQuotes[index];
}

async function renderNewQuote() {
    const quote = getRandomQuote();
    quoteDisplay.innerText = "";
    quote.split("").forEach(character => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        quoteDisplay.appendChild(characterSpan);
    });
    quoteInput.value = null;
}

renderNewQuote();