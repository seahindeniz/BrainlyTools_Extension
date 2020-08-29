import MakeExpire from "./MakeExpire";

export default function WaitForObject(
  expression: string,
  {
    expireTime,
    noError = false,
  }: { expireTime?: number; noError?: boolean } = {},
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
        // eslint-disable-next-line no-eval
        const obj = window.eval(expression);

        if (typeof obj !== "undefined") {
          clearInterval(intervalId);
          resolve(obj);
        }
      } catch (_) {
        //
      }
    });
  });
}
