import MakeExpire from "./MakeExpire";

/**
 * A function for, do something when the element's are found on DOM
 * @param {string} query - Element selector string
 * @param {{
 *  parent?: HTMLElement | Document,
 *  atLeast?: number,
 *  noError?: boolean,
 * }} [param1]
 * @returns {Promise<NodeListOf<Element>>}
 **/
export default function WaitForElements(query, {
  atLeast = 1,
  noError,
  parent = document,
} = {}) {
  return new Promise((resolve, reject) => {
    let elements,
      _loop_expireTime = MakeExpire();

    let _loop = setInterval(() => {
      if (_loop_expireTime < Date.now()) {
        clearInterval(_loop);
        if (!noError) {
          reject("Can't find anything with: " + query);
        }

        return false;
      }

      elements = parent.querySelectorAll(query);

      if (elements.length >= atLeast) {
        clearInterval(_loop);
        resolve(elements);
      }
    });
  });
}
