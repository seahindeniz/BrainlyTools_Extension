import MakeExpire from "./MakeExpire";

function TimedLoop(func, expireTime) {
	let _loop_personalColors_expire = MakeExpire(expireTime);
	let _loop_personalColors = setInterval(() => {
		if (_loop_personalColors_expire < new Date().getTime()) {
			clearInterval(_loop_personalColors);
		}

		func && func();
	});
}

export default TimedLoop
