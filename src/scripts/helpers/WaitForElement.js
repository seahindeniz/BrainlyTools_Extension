import MakeExpire from "./MakeExpire";

/**
 * A function for, do someting when the element's are found on DOM
 * @param {string} query - Element selector string
 * @param {number=} atLeast - If you want to find elements at least n
 * @param {boolean=} noError - Set it true to avoid errors when specified element wasn't found
 * @returns {Promise<NodeListOf<Element>>}
 **/
export default function WaitForElement(query, atLeast = 1, noError = false) {
  if (typeof atLeast == "boolean") {
    noError = atLeast;
    atLeast = 1;
  }

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

      elements = document.querySelectorAll(query);

      if (elements.length >= atLeast) {
        clearInterval(_loop);
        resolve(elements);
      }
    });
  });
}
