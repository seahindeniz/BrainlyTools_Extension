import ServerReq from "@ServerReq";
import ext from "../../scripts/utils/ext";

class LinkShortener {
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
    this.$input.click(this.$input.select);
    this.$button.on("click", this.LinkShortenerHandler.bind(this));
  }
  async LinkShortenerHandler() {
    this.$button.addClass("is-loading").attr("disabled", "true");

    let currentTab = await this.GetActiveTab();
    let shortCode = await this.CreateLink(currentTab.url);
    let shortLink = `${System.data.config.extension.shortenedLinkURL}/${shortCode}`;

    this.$input.val(shortLink);

    this.$shorterInputContainer.removeClass("is-hidden");
    this.$button.removeClass("is-loading").removeAttr("disabled");
    this.CopyInputTextToClipboard();
  }
  GetActiveTab() {
    return new Promise(async (resolve, reject) => {
      try {
        let tabs = await ext.tabs.query({ active: true, currentWindow: true });

        resolve(tabs[0]);
      } catch (error) {
        reject(error);
      }
    });
  }
  CreateLink(url) {
    return new Promise(async (resolve, reject) => {
      let resCreated = await new ServerReq().CreateShortLink(url);

      if (!resCreated) {
        notification("Server error", "danger");
        this.$button.removeClass("is-loading").removeAttr("disabled");
        reject();
      } else {
        if (!resCreated.success || !resCreated.shortCode) {
          notification(resCreated.message || "Unknown error", "danger");
          this.$button.removeClass("is-loading");
          !resCreated.message && this.$button.removeAttr("disabled");
          reject();
        } else {
          resolve(resCreated.shortCode);
        }
      }
    })
  }
  CopyInputTextToClipboard() {
    const selected =
      document.getSelection().rangeCount > 0 ?
      document.getSelection().getRangeAt(0) :
      false;

    this.$input.select();
    document.execCommand('copy');

    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  }
}

export default LinkShortener
