import MakeExpire from "./MakeExpire";

/**
 * @param {function|function[]} funcs
 * @param {{expireTime:number, intervalTime:number}} options - expireTime in milliseconds, intervalTime in seconds
 */
function TimedLoop(funcs, { expireTime, intervalTime } = {}) {
	if (!funcs || !(typeof funcs == "function" || funcs instanceof Array))
		throw "You need to pass a function";

	let _loop_expire = MakeExpire(expireTime);
	let _loop = setInterval(() => {
		if (_loop_expire < new Date().getTime()) {
			clearInterval(_loop);
		}

		if (funcs instanceof Array) {
			return funcs.forEach(func => func());
		}

		funcs();
	}, intervalTime);

	return _loop;
}

export default TimedLoop
