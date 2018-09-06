/**
 * 
 * @param {number} expireTime - Set custom expire time. Default is 30 seconds
 * @return {number} 
 */
const make_expire = expireTime => {
	if (typeof expireTime !== 'number')
		expireTime = 30;
	let date = new Date();
	return date.setSeconds(date.getSeconds() + expireTime);
};

export default make_expire;