/**
 * - type:
 *  - primary = $turquoise
 *  - link = $blue
 *  - info = $cyan
 *  - success = $green
 *  - warning = $yellow
 *  - danger = $red
 */
export default function PopupNotification(text: string, type = "success") {
  const $notify = $(`<div class="notification is-${type}">${text}</div>`);

  $notify.prependTo(".notification-list");
  setTimeout(() => $notify.slideUp(), 3000);

  $notify.on("click", function () {
    $(this).slideUp("normal", function () {
      this.remove();
    });
  });
  return true;
}
