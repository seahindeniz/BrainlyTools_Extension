/**
 * Returns a timestamp of next n seconds from now
 * @param {number} [expireTime=30] - Set custom expire time in seconds. Default is 30 seconds
 * @return {number} - Example > 1542651095725
 */
export default function MakeExpire(expireTime = 30) {
  /*let date = new Date();
  return date.setSeconds(date.getSeconds() + expireTime);*/
  return Date.now() + (expireTime * 1000)
};

//export default MakeExpire;
