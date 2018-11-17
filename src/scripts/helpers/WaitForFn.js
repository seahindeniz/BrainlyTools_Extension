import MakeExpire from "./MakeExpire";

/**
 * A function that checks that the object in the parameter are defined
 * @param {string} fn - Element selector string
 * @param {Function} callback - Do something when elements are found
 * @param {number} expireTime - Set number of expire in seconds
**/

const wait_for_element = (fn, callback, expireTime) => {
	let obj,
		_loop_expire = MakeExpire(expireTime);
	let _loop = setInterval(() => {
		if (_loop_expire < new Date().getTime()) {
			clearInterval(_loop);
			console.warn("The '", fn, "' object cannot be found");
			callback(false);
		} else {
			try {
				obj = eval(fn);
				if (typeof obj !== "undefined") {
					clearInterval(_loop);
					callback(obj);
				}
			} catch (e) {
			}
		}

	});
}

export default wait_for_element;