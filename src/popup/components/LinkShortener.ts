import ServerReq from "@root/controllers/Req/Server";
import ext from "webextension-polyfill";
import PopupNotification from "./notification";

async function GetActiveTab() {
  const [tab] = await ext.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
}

class LinkShortener {
  $layout: JQuery<HTMLElement>;
  $shorterInputContainer: JQuery<HTMLElement>;
  $input: JQuery<HTMLElement>;
  $button: JQuery<HTMLElement>;

  constructor() {
    this.Render();
    this.BindHandlers();
  }

  Render() {
    this.$layout = $(`
		<div id="linkShorter" class="column">
			<div class="field is-grouped">
				<div class="control">
					<button class="button is-link" title="${System.data.locale.popup.createShortLinkButton.title}">${System.data.locale.popup.createShortLinkButton.text}</button>
				</div>
				<div class="control is-expanded has-icons-left has-icons-right is-hidden js-input">
					<input class="input is-success" type="text" readonly>
					<span class="icon is-small is-left">
						<i class="fas fa-globe"></i>
					</span>
					<p class="help is-success">${System.data.locale.popup.notificationMessages.shortLinkSuccessMessage}</p>
				</div>
			</div>
		</div>`);

    this.$shorterInputContainer = $(".js-input", this.$layout);
    this.$input = $("input.input", this.$shorterInputContainer);
    this.$button = $("button.button", this.$layout);
  }

  BindHandlers() {
    this.$input.on("click", this.$input.select);
    this.$button.on("click", this.LinkShortenerHandler.bind(this));
  }

  async LinkShortenerHandler() {
    this.$button.addClass("is-loading").attr("disabled", "true");

    const currentTab = await GetActiveTab();
    const shortCode = await this.CreateLink(currentTab.url);
    const shortLink = `${System.data.config.extension.shortenedLinkURL}/${shortCode}`;

    this.$input.val(shortLink);

    this.$shorterInputContainer.removeClass("is-hidden");
    this.$button.removeClass("is-loading").removeAttr("disabled");
    this.CopyInputTextToClipboard();
  }

  async CreateLink(url: string) {
    const resCreated = await new ServerReq().CreateShortLink(url);

    if (!resCreated) {
      PopupNotification("Server error", "danger");
      this.$button.removeClass("is-loading").removeAttr("disabled");
      throw Error("Server error");
    } else if (!resCreated.success || !resCreated.shortCode) {
      PopupNotification(resCreated.message || "Unknown error", "danger");
      this.$button.removeClass("is-loading");

      if (!resCreated.message) this.$button.removeAttr("disabled");

      throw Error(resCreated.message);
    }

    return resCreated.shortCode;
  }

  CopyInputTextToClipboard() {
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;

    // this.$input.select();
    // TODO test this to see if "trigger" is working
    this.$input.trigger("select");
    document.execCommand("copy");

    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  }
}

export default LinkShortener;
