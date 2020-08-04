import MakeExpire from "../helpers/MakeExpire";

const Console = console;
Object.freeze(console);

function preventConsolePreventer() {
  let _loopConsole_expire = MakeExpire();
  let _loopConsole = setInterval(() => {
    if (_loopConsole_expire < new Date().getTime())
      return clearInterval(_loopConsole);

    console = Console;
  });
}

export default preventConsolePreventer()
