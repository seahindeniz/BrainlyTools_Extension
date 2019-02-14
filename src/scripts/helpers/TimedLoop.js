import MakeExpire from "./MakeExpire";

/**
 * @param {function} func
 * @param {number} expireTime - in seconds
 */
function TimedLoop(func, expireTime) {
	let _loop_personalColors_expire = MakeExpire(expireTime);
	let _loop_personalColors = setInterval(() => {
		if (_loop_personalColors_expire < new Date().getTime()) {
			clearInterval(_loop_personalColors);
		}

		func();
	});
}

export default TimedLoop
