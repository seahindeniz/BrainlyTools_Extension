import FlashMessage, { FlashMessageProps } from "@style-guide/FlashMessage";
// TODO rename this file
function Clear(element: MouseEvent | HTMLElement | EventTarget) {
  // eslint-disable-next-line no-param-reassign
  if (element instanceof MouseEvent) element = element.currentTarget;

  if (element instanceof Element) element.remove();
}

export function GetFlashMessageContainer() {
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

export type NotificationPropsType = {
  permanent?: boolean;
  timeOut?: number;
} & FlashMessageProps;

export default function notification({
  permanent,
  timeOut,
  ...props
}: NotificationPropsType) {
  const flash = FlashMessage(props);
  const container = GetFlashMessageContainer();

  container.append(flash);

  if (!permanent) {
    flash.addEventListener("click", Clear, false);
    setTimeout(() => Clear(flash), timeOut || 10000);
  }

  return flash;
}
