import MakeExpire from "./MakeExpire";

/**
 * - expireTime in seconds
 * - intervalTime in milliseconds
 */
function TimedLoop(
  funcs: () => any | (() => any)[],
  {
    expireTime,
    intervalTime,
  }: {
    expireTime?: number;
    intervalTime?: number;
  } = {},
) {
  if (!funcs || !(funcs instanceof Array || typeof funcs === "function"))
    throw Error("You need to pass a function");

  const loopExpire = MakeExpire(expireTime);

  const loop = setInterval(() => {
    if (loopExpire < new Date().getTime()) {
      clearInterval(loop);
    }

    if (funcs instanceof Array) {
      funcs.forEach(func => func());

      return;
    }

    funcs();
  }, intervalTime);

  return loop;
}

export default TimedLoop;
