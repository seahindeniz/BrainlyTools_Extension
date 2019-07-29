/**
 * Brainly's flash notification function
 * @param {string} message - Message content as HTML or Text
 * @param {string} type - typeof message > ["", "success", "info", "warning", "failure", "error"]
 * @param {boolean} permanent - To make it permanent
 */
function notification(message, type = "", permanent = false) {
  if (!message || message == "")
    return false;

  message = message.trim();

  let extIcon = `<img src="${System.data.meta.extension.URL}/icons/icon24.png" alt="Brainly Tools" class="notification-brainlyToolsImg">`;

  /**
   * Determine if notification was created on old UI.
   * Old UI has the Zadanium object init.
   */
  if (window.Zadanium) {
    if (type === "error")
      type = "failure";

    Zadanium.namespace('flash_msg').flash.setMsg(extIcon + message, type);
  } else if (window.Application) {
    if (type === "warning" || type == "failure")
      type = "error";

    Application.alert.flash.addMessage(extIcon + message, type)
  } else {
    if (type === "warning" || type == "failure")
      type = "error";

    if (type != "")
      type = " sg-flash__message--" + type;

    let flash = $(`
    <div class="sg-flash">
      <div class="sg-flash__message sg-flash__message--${type} js-flash-message">
        <div class="sg-text sg-text--bold sg-text--small">${extIcon}${message}</div>
      </div>
    </div>`);

    flash.appendTo(".flash-messages-container");

    let flashClickHandler = () => flash.remove();

    flash.click(flashClickHandler);
    !permanent && setTimeout(flashClickHandler, 10000);

    return flash;
  }
}

export default notification
