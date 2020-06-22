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
 * */

/**
 * @typedef {{
 *  parent?: HTMLElement | Document,
 *  atLeast?: number,
 *  noError?: boolean,
 * }} OptionsType
 * @typedef {(query: string, param1: {single?: true} & OptionsType) => Promise<Element>} SingleType
 * @typedef {(query: string, param1?: ({single?: false | undefined} & OptionsType) | undefined) => Promise<NodeListOf<Element>>} MultipleType
 *
 * @type {SingleType & MultipleType}
 */
const WaitForElements = (
  query,
  { atLeast = 1, single = false, noError, parent = document } = {},
) => {
  return new Promise((resolve, reject) => {
    let elements;
    const expireTime = MakeExpire();

    const intervalId = setInterval(() => {
      if (expireTime < Date.now()) {
        clearInterval(intervalId);
        if (!noError) {
          reject(Error(`Can't find anything with: ${query}`));
        }

        return;
      }

      if (single) elements = parent.querySelector(query);
      else elements = parent.querySelectorAll(query);

      if (elements && (single || elements.length >= atLeast)) {
        clearInterval(intervalId);
        resolve(elements);
      }
    });
  });
};

export default WaitForElements;
