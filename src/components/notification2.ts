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

    let header = document.querySelector(
      `body > #main-panel, header[class^="HeaderController"]`,
    );

    if (!header) {
      header = document.body;
    }

    if (header) header.append(container);
  } else {
    const newHeader = document.querySelector(
      `header[class^="HeaderController"]`,
    );

    newHeader?.append(container);
  }

  return container;
}

export type NotificationPropsType = {
  noRemoveOnClick?: boolean;
} & (
  | {
      sticky?: false;
      timeOut?: number;
    }
  | {
      sticky: true;
    }
) &
  FlashMessageProps;

export default function notification({
  sticky,
  noRemoveOnClick,
  ...props
}: NotificationPropsType) {
  const flash = FlashMessage(props);
  const container = GetFlashMessageContainer();

  container.append(flash);

  if (!noRemoveOnClick) {
    flash.addEventListener("click", Clear, false);
  }

  if (!sticky) {
    setTimeout(() => Clear(flash), "timeOut" in props ? props.timeOut : 10000);
  }

  return flash;
}
