import MakeExpire from "./MakeExpire";

type CommonPropsType = {
  parent?: HTMLElement | Document;
  atLeast?: number;
  noError?: boolean;
};

function WaitForElement(
  query?: string,
  param1?: { multiple?: false } & CommonPropsType,
): Promise<HTMLElement>;

function WaitForElement(
  query?: string,
  param1?: ({ multiple: true } & CommonPropsType) | undefined,
): Promise<NodeListOf<HTMLElement>>;

function WaitForElement(
  query: string,
  {
    atLeast = 1,
    multiple,
    noError = false,
    parent = document,
  }: { multiple?: boolean } & CommonPropsType = {},
) {
  return new Promise((resolve, reject) => {
    let elements: Element | NodeListOf<Element>;
    const expireTime = MakeExpire();

    const intervalId = setInterval(() => {
      if (expireTime < Date.now()) {
        clearInterval(intervalId);
        if (!noError) {
          reject(Error(`Can't find anything with: ${query}`));
        }

        return;
      }

      if (!multiple) elements = parent.querySelector(query);
      else elements = parent.querySelectorAll(query);

      if (
        elements &&
        (!multiple ||
          (elements instanceof NodeList && elements.length >= atLeast))
      ) {
        clearInterval(intervalId);
        resolve(elements);
      }
    });
  });
}

export default WaitForElement;
