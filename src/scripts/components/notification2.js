import { FlashMessage } from "./style-guide";

/**
 * @typedef {import("./style-guide/FlashMessage").Properties & {permanent?: boolean}} Properties
 * @param {Properties} param0
 */
export default function notification({ permanent = false, ...props }) {
  let flash = FlashMessage(props);
  let container = Container();

  container.append(flash);

  flash.addEventListener("click", Clear, false);

  if (!permanent)
    setTimeout(() => Clear(flash), 10000);

  return flash;
}

function Container() {
  let container = document.querySelector(
    ".flash-messages-container, body > #main-panel"
  );

  if (!container) {
    container = document.createElement("div");
    container.className = "flash-messages-container";

    let header = document.querySelector("body > #main-panel, body");

    if (header)
      header.append(container);
  }

  return container;
}

/**
 * @param { MouseEvent | HTMLElement | EventTarget} element
 */
function Clear(element) {
  if (element instanceof MouseEvent)
    element = element.currentTarget;

  if ("remove" in element)
    element.remove();
}
