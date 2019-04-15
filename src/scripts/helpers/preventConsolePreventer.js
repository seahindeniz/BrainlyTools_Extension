import MakeExpire from "./MakeExpire";

/**
 * Preventing the console methods preventer
 */
function preventConsolePreventer() {
  window.Console = console;
  let _loopConsole_expire = MakeExpire();
  let _loopConsole = setInterval(() => {
    if (_loopConsole_expire < new Date().getTime()) {
      clearInterval(_loopConsole);
    }
    console = Console;
  });
}

export default preventConsolePreventer()
