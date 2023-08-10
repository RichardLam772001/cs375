// A game server keeps an instance of this object.
// It contains a list of all console lines sent so far.

const ConsoleLinesLog = (() => {

    let consoleLines = [];

    const addConsoleLine = (consoleLine) => {
        consoleLines.push(consoleLine);
    }
    const clearLines = () =>{
        consoleLines = [];
    }

    const allVisibility = "all";
    const getLinesWithVisibility = (visibility) => {
        return consoleLines.filter((line) => line.visibility === visibility || line.visibility === allVisibility);
    }

    const getHumanLines = () => {
        return getLinesWithVisibility("human");
    };
    const getAILines = () => {
        return getLinesWithVisibility("ai");
    }

    return {
        addConsoleLine,
        clearLines,
        getHumanLines,
        getAILines
    }
});

module.exports = { ConsoleLinesLog };