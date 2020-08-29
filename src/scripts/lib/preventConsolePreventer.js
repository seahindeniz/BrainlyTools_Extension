const Console = console;
Object.freeze(console);

function MakeExpire(expireTime = 30) {
  return Date.now() + expireTime * 1000;
}

function preventConsolePreventer() {
  const loopConsoleExpire = MakeExpire();
  const loopConsole = setInterval(() => {
    if (loopConsoleExpire < new Date().getTime()) {
      clearInterval(loopConsole);

      return;
    }

    // eslint-disable-next-line no-global-assign
    console = Console;
  });
}

export default preventConsolePreventer();
