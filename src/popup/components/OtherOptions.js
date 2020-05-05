import storage from "../../scripts/helpers/extStorage";
import notification from "../components/notification";
import send2AllBrainlyTabs from "../helpers/send2AllBrainlyTabs";
import Dropdown from "../helpers/Dropdown";

class OtherOptions {
  constructor(storageData) {
    this.storageData = storageData;

    this.Render();
    this.SetInputsValues();
    this.BindHandlers();
  }
  Render() {
    this.$layout = $(`
		<div id="otherOptions" class="column is-narrow">
			<article class="is-dark">
				<div class="message-header">
					<p>${System.data.locale.popup.extensionOptions.otherOptions.title}</p>
				</div>
				<div class="message-body">
					<div class="field is-horizontal">
						<div class="field-body">
							<!-- Messages layout extender -->
							<div class="field">
								<div class="control">
									<label class="checkbox" title="${System.data.locale.popup.extensionOptions.otherOptions.extendMessagesLayout.title}">
										<input id="extendMessagesLayout" type="checkbox"${this.storageData.extendMessagesLayout || typeof this.storageData.extendMessagesLayout == "undefined" ? " checked" : ""}> ${System.data.locale.popup.extensionOptions.otherOptions.extendMessagesLayout.text}
									</label>
								</div>
							</div>

							<!-- Browser notifications -->
							<div class="field is-hidden">
								<div class="control">
									<label class="checkbox" title="${System.data.locale.popup.extensionOptions.otherOptions.notifier.title}">
										<input id="notifier" type="checkbox"${this.storageData.notifier ? " checked" : ""}> ${System.data.locale.popup.extensionOptions.otherOptions.notifier.text}
									</label>
								</div>
							</div>

							<!-- Extension language settings -->
							<div class="field is-grouped">
								<div class="control tags">
									<label class="checkbox">
										${System.data.locale.popup.extensionOptions.otherOptions.extensionLanguage.text}
									</label>
								</div>
								<div class="control is-expanded">
									<div class="dropdown">
										<div class="dropdown-trigger">
											<button class="button level" aria-haspopup="true" aria-controls="dropdown-menu">
												<span>${System.data.locale.popup.extensionOptions.otherOptions.extensionLanguage.chooseLanguage}</span>
												<span class="icon is-small">
													<i class="fas fa-angle-down" aria-hidden="true"></i>
												</span>
											</button>
										</div>
										<div class="dropdown-menu" role="menu">
											<div class="dropdown-content">
												<hr class="dropdown-divider">
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Done -->
						</div>
					</div>
				</div>
			</article>
		</div>`);

    this.$container = $("> .message > .message-body", this.$layout);

    this.$extendMessageLayoutCheckbox = $("#extendMessagesLayout", this.$layout);
    this.$notifierCheckbox = $("#notifier", this.$layout);

    this.$languageDropdown = Dropdown($(".dropdown", this.$layout));
    this.$languagesContainer = $(".dropdown-menu > .dropdown-content", this.$languageDropdown);
    this.$dropdownText = $(".dropdown-trigger > button.button > span:not(.icon)", this.$languageDropdown);
  }
  SetInputsValues() {
    if (typeof this.storageData.extendMessagesLayout == "boolean") {
      this.$extendMessageLayoutCheckbox.prop("checked", this.storageData.extendMessagesLayout);
    }

    if (typeof this.storageData.notifier == "boolean") {
      this.$notifierCheckbox.prop("checked", this.storageData.notifier);
    }

    let selectedLanguage = this.storageData.language;

    if (selectedLanguage) {
      let selected = System.constants.config.availableLanguages.find(lang => lang.key == selectedLanguage);

      if (selected) {
        this.$dropdownText.html(selected.title.replace(/<.*>/, ""));
      }
    }

    System.constants.config.availableLanguages.forEach(language => {
      let $option = `<a href="#" class="dropdown-item${selectedLanguage && selectedLanguage == language.key ? " is-active" : ""}" value="${language.key}">${language.title}</a>`;

      if (System.data.Brainly.defaultConfig.locale.LANGUAGE == language.key) {
        this.$languagesContainer.prepend($option);
      } else {
        this.$languagesContainer.append($option);
      }
    });
  }
  BindHandlers() {
    let that = this;

    this.$extendMessageLayoutCheckbox.change(function() {
      that.ExtendMessagesLayout(this.checked);
    });

    this.$notifierCheckbox.change(function() {
      that.NotifierChangeState(this.checked);
    });

    this.$languageDropdown.change(function() {
      that.SetLanguage(this.value);
    });
  }
  ExtendMessagesLayout(isChecked) {
    storage("set", { extendMessagesLayout: isChecked });
    send2AllBrainlyTabs("extendMessagesLayout", isChecked);
    notification(System.data.locale.popup.notificationMessages[isChecked ? "layoutExtended" : "switchedToNormal"]);
  }
  NotifierChangeState(isChecked) {
    storage("set", { notifier: isChecked });
    System.toBackground("notifierChangeState", isChecked);
    notification(System.data.locale.popup.notificationMessages[isChecked ? "notifierOn" : "notifierOff"]);
  }
  async SetLanguage(language) {
    /* let localeData =  */
    await System.PrepareLanguageFile(language);
    /* System.data.locale = localeData; */

    storage("set", { language });
    notification(System.data.locale.popup.notificationMessages.languageChanged, "success");
  }
}

export default OtherOptions
