import { FlashMessage } from "./style-guide";

/**
 * @param { MouseEvent | HTMLElement | EventTarget} element
 */
function Clear(element) {
  // eslint-disable-next-line no-param-reassign
  if (element instanceof MouseEvent) element = element.currentTarget;

  if ("remove" in element) element.remove();
}

function Container() {
  let container = document.querySelector(
    ".flash-messages-container, body > #main-panel",
  );

  if (!container) {
    container = document.createElement("div");
    container.className = "flash-messages-container";

    const header = document.querySelector("body > #main-panel, body");

    if (header) header.append(container);
  }

  return container;
}

/**
 * @typedef {import("./style-guide/FlashMessage").Properties & {permanent?: boolean}} NotificationPropertiesType
 * @param {NotificationPropertiesType} param0
 */
export default function notification({ permanent = false, ...props }) {
  const flash = FlashMessage(props);
  const container = Container();

  container.append(flash);

  if (!permanent) {
    flash.addEventListener("click", Clear, false);
    setTimeout(() => Clear(flash), 10000);
  }

  return flash;
}
