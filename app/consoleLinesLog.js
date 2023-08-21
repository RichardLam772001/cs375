// A game server keeps an instance of this object.
// It contains a list of all console lines sent so far.

const ALL_VISIBILITY = "all";
const HUMAN = "human";
const AI = "ai";

const ConsoleLinesLog = (() => {

    let consoleLines = [];

    const addConsoleLine = (consoleLine) => {
        consoleLines.push(consoleLine);
    }
    const clearLines = () =>{
        consoleLines = [];
    }

    const getLinesWithVisibility = (visibility) => {
        return consoleLines.filter((line) => isLineVisibleTo(line, visibility));
    }

    const getHumanLines = () => {
        return getLinesWithVisibility(HUMAN);
    };
    const getAILines = () => {
        return getLinesWithVisibility(AI);
    }

    return {
        addConsoleLine,
        clearLines,
        getHumanLines,
        getAILines
    }
});

const isLineVisibleTo = (consoleLine, targetVisibility) => {
    const lineVisibility = consoleLine.visibility;
    return lineVisibility == targetVisibility || lineVisibility == ALL_VISIBILITY || lineVisibility == undefined;
}
const isLineVisibleToHuman = (consoleLine) =>{
    return isLineVisibleTo(consoleLine, HUMAN);
}
const isLineVisibleToAI = (consoleLine) =>{
    return isLineVisibleTo(consoleLine, AI);
}

module.exports = { ConsoleLinesLog, isLineVisibleToHuman, isLineVisibleToAI};