const MINI_GAME_HANDLER = (() => {

    const typingMiniGame = document.getElementById("typing-minigame");
    const shootingMiniGame = document.getElementById("shooting-minigame");
    const memoryMiniGame = document.getElementById("memory-minigame");

    const hideMinigames = () => {
        shootingMiniGame.style.display = "none";
        typingMiniGame.style.display = "none";
        memoryMiniGame.style.display = "none";
    }

    const startTypingGame = () => {
        hideMinigames();
        TYPING_GAME.startGame();
        typingMiniGame.style.display = "block";
    }
    const startShootingGame = () => {
        hideMinigames();
        SHOOTING_GAME.startGame();
        shootingMiniGame.style.display = "block";
    }
    const startMemoryGame = () => {
        hideMinigames();
        MEMORY_GAME.startGame();
        memoryMiniGame.style.display = "block";
    }

    /**
     * Given a threat type, displays the appropriate minigame
     * @param {string} threatType e.g. "fire", "breach", "invader" 
     */
    const showMiniGame = (threatType) => {
        setTimeout(() => startMinigame(threatType), 500); //brief pause before minigame popup is shown
    }
    
    const startMinigame = (threatType) => {
        switch (threatType) {
            case "fire":
                startTypingGame();
                break;
            case "breach":
                startMemoryGame();
                break;
            case "invader":
                startShootingGame();
                break;
        }
    }

    const finishShootingGame = () => {
        finishMinigame();
    }
    const finishTypingGame = () => {
        finishMinigame();
    }
    const finishMemoryGame = () => {
        finishMinigame();
    }
    const finishMinigame = () => {
        HUMAN.finishMinigame();
        setTimeout(hideMinigames, 500);
    }

    SHOOTING_GAME.setOnComplete(finishShootingGame);
    TYPING_GAME.setOnComplete(finishTypingGame);
    MEMORY_GAME.setOnComplete(finishMemoryGame);

    return {
        showMiniGame,
    }
})();
