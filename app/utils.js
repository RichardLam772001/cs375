/**
 * @param {number} a 
 * @param {number} b 
 * @returns random int between a and b (inclusive)
 */
const randomInt = (a, b) => a + Math.floor(Math.random()*((b-a)+1));

/**
 * @param {any[]} lst array of items
 * @param {any} currentValue currently select item in array
 * @returns {any} randomly selected item that is not currentValue
 */
const randomSelect = (lst, currentValue) => {
	lst = lst.filter((item) => item !== currentValue);
	return lst[randomInt(0, lst.length-1)];
}

/**
 * @returns a function that, when called, will generate a new ID each time
 */
const idGenerator = () => {
	let id = 0;
	return () => id++;
};

module.exports = { randomInt, idGenerator, randomSelect }
