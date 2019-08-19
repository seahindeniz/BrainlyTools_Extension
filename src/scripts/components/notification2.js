import { FlashMessage } from "./style-guide";

/**
 * @typedef {import("./style-guide/FlashMessage").Properties & {permanent?: boolean}} Properties
 * @param {Properties} param0
 */
export default function notification({ permanent = false, ...props }) {
  let flash = FlashMessage(props);
  let container = Container();

  container.appendChild(flash);

  flash.addEventListener("click", Clear, false);

  if (!permanent)
    setTimeout(() => Clear(flash), 10000);

  return flash;
}

function Container() {
  let container = document.querySelector(".flash-messages-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "flash-messages-container";

    document.body.appendChild(container);
  }

  return container;
}

/**
 * @param { MouseEvent | HTMLElement | EventTarget} element
 */
function Clear(element) {
  if (element instanceof MouseEvent)
    element = element.currentTarget;

  element.remove();
}
/* if (window.Zadanium) {
    if (type === "error")
      type = "failure";

    let flash = Zadanium.namespace('flash_msg').flash;

    flash.setMsg(extIcon + message, type);

    let flashElements = Array.from(flash.elements.main);
    let flashElement = flashElements[flashElements.length - 1];

    if (!permanent)
      Clear(flashElement);

    return flashElement;
  } else {
    if (type === "warning" || type == "failure")
      type = "error";

    if (window.Application) {
      Application.alert.flash.addMessage(extIcon + message, type);
      let flashElements = document.querySelectorAll(".js-flash-messages-container");
      let flashElement = flashElements[flashElements.length - 1];

      if (!permanent)
        Clear(flashElement);

      return flashElement;
    } else {}
  } */
