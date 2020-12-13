/**
 * - primary = turquoise
 * - link = blue
 * - info = cyan
 * - success = green
 * - warning = yellow
 * - danger = red
 */

type NotificationTypeType =
  | "primary"
  | "link"
  | "info"
  | "success"
  | "warning"
  | "danger";

export default function PopupNotification(
  text: string,
  type: NotificationTypeType = "success",
  sticky?: boolean,
) {
  const $notify = $(
    `<div class="notification is-${type}" has-text-weight-bold>${text}</div>`,
  );

  $notify.prependTo(".notification-list");

  if (!sticky) {
    setTimeout(() => $notify.slideUp(), 3000);
  }

  $notify.on("click", () => $notify.slideUp("normal", () => $notify.remove()));

  return true;
}
