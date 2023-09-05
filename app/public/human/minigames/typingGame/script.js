const TYPING_GAME = (() => {

    const minigameElement = document.getElementById("typing-minigame");
    const messageElement = minigameElement.getElementsByClassName("minigame-message")[0];

    const spaceQuotes = [
        "bad fire bad fire bad fire",
        "hot hot hot"        
    ]
    const quoteDisplay = document.getElementById("quoteDisplay");
    const quoteInput = document.getElementById("quoteInput");
    let onComplete = () => {};

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
        if (correct) {
            messageElement.textContent = "FIRE RESOLVED";
            onComplete();
        }
    });

    function getRandomQuote() {
        const index = Math.floor(Math.random() * spaceQuotes.length);
        return spaceQuotes[index];
    }

    function renderNewQuote() {
        messageElement.textContent = "TYPE THE PHRASE:";
        const quote = getRandomQuote();
        quoteDisplay.innerText = "";
        quote.split("").forEach(character => {
            const characterSpan = document.createElement("span");
            characterSpan.innerText = character;
            quoteDisplay.appendChild(characterSpan);
        });
        quoteInput.value = null;
    }
    /**
     * Accepts a function to be run when the game completes
     * @param {function} onCompleteFunction 
     */
    const setOnComplete = (onCompleteFunction) => {
        onComplete = onCompleteFunction;
    }
    return {
        renderNewQuote,
        setOnComplete,
    }
})();
