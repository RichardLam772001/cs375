const { randomInt } = require("../utils.js");

const setAiRole = () => {

    // Good values at index 0, Evil values at index 1
    const ROLE_VALUES = {
        scrambleWeights: [[70, 15, 15], [70, 15, 15]],
        assistAlertChance: [0.25, 1],
    }

    const IS_EVIL = Boolean(randomInt(0, 1));
    
    // move balancing for each AI role into here
    // use AI_ROLE in game.js to fetch any values that differ between good/evil AI
    // easier if we make future balancing changes
    const CURRENT_ROLE_VALUES = {
        scrambleWeights: ROLE_VALUES.scrambleWeights[+IS_EVIL],
        assistAlertChance: ROLE_VALUES.assistAlertChance[+IS_EVIL]
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
        return CURRENT_ROLE_VALUES.scrambleWeights;
    }

    const getAssistAlertChance = () => {
        return CURRENT_ROLE_VALUES.assistAlertChance;
    }

    return {
        ROLE_VALUES,
        isAiEvil,
        roleToString,
        getScrambleWeights,
        getAssistAlertChance
    }
}

module.exports = { setAiRole };