import MakeExpire from "./MakeExpire";

/**
 * A function that checks that the object in the parameter are defined
 * @param {string} expression - Element selector string
 * @param {number=} expireTime - Set number of expire in seconds
 * @param {boolean=} noError - Do something when elements are found
 **/
export default function WaitForObject(expression, expireTime, noError = false) {
	if (typeof expireTime == "boolean") {
		noError = expireTime;
		expireTime = undefined;
	}

	return new Promise((resolve, reject) => {
		let obj,
			_loop_expireTime = MakeExpire(expireTime);

		let _loop = setInterval(() => {
			if (_loop_expireTime < Date.now()) {
				clearInterval(_loop);
				if (!noError) {
					reject("The '", expression, "' object cannot be found");
				}

				return false;
			}

			try {
				obj = eval(expression);

				if (typeof obj !== "undefined") {
					clearInterval(_loop);
					resolve(obj);
				}
			} catch (_) {}
		});
	});
}
