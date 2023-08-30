const { randomInt } = require("../utils.js");

const setAiRole = () => {

    const IS_EVIL = Boolean(randomInt(0, 1));
    
    // move balancing for each AI role into here
    // use AI_ROLE in game.js to fetch any values that differ between good/evil AI
    // easier if we make future balancing changes
    const ROLE_VALUES = {
        scrambleWeights: IS_EVIL ? [70, 15, 15] : [70, 15, 15],
        assistAlertChance: IS_EVIL ? 100 : 25
        // etc.
    }

    console.log("AI is evil:", IS_EVIL); // for testing, remove when AI role is visible to client

    const isAiEvil = () => {
        return IS_EVIL;
    }

    const roleToString = () => {
        return IS_EVIL ? "EVIL" : "GOOD";
    }

    const getScrambleWeights = () => {
        return ROLE_VALUES.scrambleWeights;
    }

    const getAssistAlertChance = () => {
        return ROLE_VALUES.assistAlertChance;
    }

    return {
        isAiEvil,
        roleToString,
        getScrambleWeights,
        getAssistAlertChance
    }
}

module.exports = { setAiRole };