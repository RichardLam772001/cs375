
// This class is given a list of choice with their associated weights/probabilities

const RandomBag = (choiceList) => {
    let totalProbability = 0;

    for(const choice of choiceList){
        totalProbability += choiceProbability(choice);
    }

    // Randomly select a choice, considering the weights of all choices.
    // If `replace` is false, the choice is removed from the bag
    function pull(replace = true){
        let remainingProbability = totalProbability;
        for(let c = 0; c < choiceList.length; ++c){
            const choice = choiceList[c];
            let probability = choiceProbability(choice);
            if(Math.random()*remainingProbability <= probability){
                if(!replace){
                    removeChoice(c);
                }
                return choiceValue(choice);
            }else{
                remainingProbability -= probability;
            }
        }
    }

    function removeChoice(index){
        const choice = choiceList[index];
        totalProbability -= choiceProbability(choice);
        choiceList.splice(index, 1);
    }

    
    return {
        pull
    };
}
const choiceProbability = (choice) => choice[0];
const choiceValue = (choice) => choice[1];

module.exports = {RandomBag};
