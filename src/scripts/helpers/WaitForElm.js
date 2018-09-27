import MakeExpire from "./MakeExpire";

/**
 * A function for, do someting when the element's are found on DOM
 * @param {string} query - Element selector string
 * @param {Function} callback - Do something when elements are found
 * @param {number} minimum_number_of_element - If you want to find elements at least n
**/

const WaitForElm = (query, callback, minimum_number_of_element) => {
	let elements,
		_loop_expire = MakeExpire();
	let _loop = setInterval(() => {
		if (_loop_expire < new Date().getTime()) {
			clearInterval(_loop);
			callback();
		}
		elements = document.querySelectorAll(query);
		if (elements.length >= (minimum_number_of_element || 1) ) {
			clearInterval(_loop);
			callback(elements);
		}

	});
}

export default WaitForElm;