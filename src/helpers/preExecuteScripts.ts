import InjectIcons from "@components/SVG/index";
import ThemeColorChanger from "./ThemeColorChanger";

function preExecuteScripts() {
  const color = window.localStorage.getItem("themeColor");

  window.coloring = new ThemeColorChanger(color);

  const loopRemoveElement = setInterval(() => {
    const elements = document.querySelectorAll(
      ".brn-ads-box, div.js-feed>div>div.sg-layout>div.sg-layout__container>div.sg-layout__content>div>div.sg-layout__box",
    );

    if (elements && elements.length > 0)
      elements.forEach(element => element.remove());
  });

  window.addEventListener("load", () => {
    InjectIcons();
    clearInterval(loopRemoveElement);
  });
  setTimeout(() => clearInterval(loopRemoveElement), 10000);
}

export default preExecuteScripts();
