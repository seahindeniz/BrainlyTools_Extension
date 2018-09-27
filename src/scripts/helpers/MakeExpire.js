/**
 * 
 * @param {number} [expireTime=30] - Set custom expire time in seconds. Default is 30 seconds
 * @return {number} 
 */
const MakeExpire = (expireTime = 30) => {
	let date = new Date();
	return date.setSeconds(date.getSeconds() + expireTime);
};

export default MakeExpire;
