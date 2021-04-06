import MakeExpire from "./MakeExpire";

type Props = { expireTime?: number; noError?: boolean };

function WaitForObject(expression: string, props?: Props): Promise<any>;
function WaitForObject<T>(expression: () => T, props?: Props): Promise<T>;

function WaitForObject(
  expression: string | (() => void),
  { expireTime, noError = false }: Props = {},
) {
  return new Promise((resolve, reject) => {
    const loopExpireTime = MakeExpire(expireTime);

    const intervalId = setInterval(() => {
      if (loopExpireTime < Date.now()) {
        clearInterval(intervalId);

        if (!noError) {
          reject(Error(`The ${expression} object cannot be found`));
        }

        return;
      }

      try {
        let obj;

        if (typeof expression === "string")
          // eslint-disable-next-line no-eval
          obj = window.eval(expression);
        else {
          obj = expression();
        }

        if (obj !== undefined) {
          clearInterval(intervalId);
          resolve(obj);
        }
      } catch (_) {
        //
      }
    });
  });
}

export default WaitForObject;
