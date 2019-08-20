import MakeExpire from "./MakeExpire";

/**
 * A function that checks that the object in the parameter are defined
 * @param {string} expression - Element selector string
 * @typedef {number} expireTime - Set number of expire in seconds
 * @typedef {boolean} noError - Do something when elements are found
 * @param {{expireTime?: expireTime, noError?: noError}} param1
 **/
export default function WaitForObject(expression, { expireTime, noError = false } = {}) {
  return new Promise((resolve, reject) => {
    let obj,
      _loop_expireTime = MakeExpire(expireTime);

    let _loop = setInterval(() => {
      if (_loop_expireTime < Date.now()) {
        clearInterval(_loop);
        if (!noError) {
          reject(`The ${expression} object cannot be found`);
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
