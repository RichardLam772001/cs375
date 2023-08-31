const MINI_GAME_HANDLER = (() => {

    const typingMiniGame = document.getElementById("typing-minigame");
    const shootingMiniGame = document.getElementById("shooting-minigame");

    const hideMinigames = () => {
        shootingMiniGame.style.display = "none";
        typingMiniGame.style.display = "none";
    }

    const startTypingGame = () => {
        hideMinigames();
        TYPING_GAME.renderNewQuote();
        typingMiniGame.style.display = "block";
    }
    const startShootingGame = () => {
        hideMinigames();
        shootingMiniGame.style.display = "block";
    }

    /**
     * Given a threat type, displays the appropriate minigame
     * @param {string} threatType e.g. "fire", "breach", "invader" 
     */
    const showMiniGame = (threatType) => {
        switch (threatType) {
            case "fire": // Need minigame for fire
            case "breach":
                startTypingGame();
                break;
            case "invader":
                startShootingGame();
                break;
        }
    }

    const finishShootingGame = () => {
        hideMinigames();
    }
    const finishTypingGame = () => {
        hideMinigames();
    }

    SHOOTING_GAME.setOnComplete(finishShootingGame);
    TYPING_GAME.setOnComplete(finishTypingGame);

    return {
        showMiniGame,
    }
})();
