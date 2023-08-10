/**
 * @param {number} a 
 * @param {number} b 
 * @returns random int between a and b (inclusive)
 */
const randomInt = (a, b) => a + Math.floor(Math.random()*(b+1));

/**
 * @returns a function that, when called, will generate a new ID each time
 */
const idGenerator = () => {
	let id = 0;
	return () => id++;
};

const randomChoice = (choiceList) => {
    let remainingProb = 0;

    for(choice of choiceList){
        remainingProb += choiceProbability(choice);
    }

    for(choice of choiceList){
        let probability = choiceProbability(choice);
        if(Math.random()*remainingProb <= probability){
            return choiceValue(choice);
        }else{
            remainingProb -= probability;
        }
    }
    return undefined;
}
const choiceProbability = (choice) => choice[0];
const choiceValue = (choice) => choice[1];

module.exports = { randomInt, idGenerator, randomChoice}
