/**
 *
 * @param {string} text - Message text
 * @param {string} type - primary = $turquoise, link = $blue, info = $cyan, success = $green, warning = $yellow, danger = $red
 */
function notification(text, type = "success") {
  let $notify = $(`<div class="notification is-${type}">${text}</div>`);
  $notify.prependTo('.notification-list');
  setTimeout(() => $notify.slideUp(), 3000);
  $notify.click(function() {
    $(this).slideUp("normal", function() { this.remove(); });
  });
  return true;
}

export default notification
