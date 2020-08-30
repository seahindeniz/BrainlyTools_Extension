import { QuickDeleteButtonReasonsType } from "@root/controllers/System";
import storage from "../../helpers/extStorage";
import Dropdown from "../helpers/Dropdown";
import send2AllBrainlyTabs from "../helpers/send2AllBrainlyTabs";
import notification from "./notification";

export type StorageDataType = {
  extendMessagesLayout?: boolean;
  notifier?: boolean;
  language?: string;
  themeColor?: string;
  quickDeleteButtonsReasons?: QuickDeleteButtonReasonsType;
};

class OtherOptions {
  storageData: StorageDataType;

  $layout: JQuery<HTMLDivElement>;
  $container: JQuery<HTMLDivElement>;
  $extendMessageLayoutCheckbox: JQuery<HTMLDivElement>;
  $notifierCheckbox: JQuery<HTMLDivElement>;
  $languageDropdown: JQuery<HTMLDivElement>;
  $languagesContainer: JQuery<HTMLDivElement>;
  $dropdownText: JQuery<HTMLDivElement>;

  constructor(storageData: StorageDataType) {
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
									<label class="checkbox" title="${
                    System.data.locale.popup.extensionOptions.otherOptions
                      .extendMessagesLayout.title
                  }">
										<input id="extendMessagesLayout" type="checkbox"${
                      this.storageData.extendMessagesLayout ||
                      typeof this.storageData.extendMessagesLayout ===
                        "undefined"
                        ? " checked"
                        : ""
                    }> ${
      System.data.locale.popup.extensionOptions.otherOptions
        .extendMessagesLayout.text
    }
									</label>
								</div>
							</div>

							<!-- Browser notifications -->
							<div class="field is-hidden">
								<div class="control">
									<label class="checkbox" title="${
                    System.data.locale.popup.extensionOptions.otherOptions
                      .notifier.title
                  }">
										<input id="notifier" type="checkbox"${
                      this.storageData.notifier ? " checked" : ""
                    }> ${
      System.data.locale.popup.extensionOptions.otherOptions.notifier.text
    }
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
												<span>${
                          System.data.locale.popup.extensionOptions.otherOptions
                            .extensionLanguage.chooseLanguage
                        }</span>
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

    this.$extendMessageLayoutCheckbox = $(
      "#extendMessagesLayout",
      this.$layout,
    );
    this.$notifierCheckbox = $("#notifier", this.$layout);

    this.$languageDropdown = Dropdown($(".dropdown", this.$layout));
    this.$languagesContainer = $(
      ".dropdown-menu > .dropdown-content",
      this.$languageDropdown,
    );
    this.$dropdownText = $(
      ".dropdown-trigger > button.button > span:not(.icon)",
      this.$languageDropdown,
    );
  }

  SetInputsValues() {
    if (typeof this.storageData.extendMessagesLayout === "boolean") {
      this.$extendMessageLayoutCheckbox.prop(
        "checked",
        this.storageData.extendMessagesLayout,
      );
    }

    if (typeof this.storageData.notifier === "boolean") {
      this.$notifierCheckbox.prop("checked", this.storageData.notifier);
    }

    const selectedLanguage: string = this.storageData.language;

    if (selectedLanguage) {
      const selected = System.data.config.extension.languages[selectedLanguage];

      if (selected) {
        this.$dropdownText.html(selected.name);
      }
    }

    Object.entries(System.data.config.extension.languages)
      .sort(([, a], [, b]) => (a.name > b.name ? 1 : -1))
      .forEach(([key, language]) => {
        let { name } = language;

        if (key !== "en_US")
          name += ` <i class="is-size-7">${language.progress}%</i>`;

        if ("author" in language)
          name += `<span class="is-pulled-right">${language.author}</span>`;

        const $option = `<a href="#" class="dropdown-item fix-padding${
          selectedLanguage === key ? " is-active" : ""
        }" value="${key}">${name}</a>`;

        if (System.data.Brainly.defaultConfig.locale.LANGUAGE === key)
          this.$languagesContainer.prepend($option);
        else this.$languagesContainer.append($option);
      });
  }

  BindHandlers() {
    this.$extendMessageLayoutCheckbox.on("change",
      this.ExtendMessagesLayout.bind(this),
    );
    this.$notifierCheckbox.on("change", this.NotifierChangeState.bind(this));
    this.$languageDropdown.on("change", this.SetLanguage.bind(this));
  }

  ExtendMessagesLayout() {
    const isChecked = this.$extendMessageLayoutCheckbox.prop("checked");

    storage("set", { extendMessagesLayout: isChecked });
    send2AllBrainlyTabs("extendMessagesLayout", isChecked);
    notification(
      System.data.locale.popup.notificationMessages[
        isChecked ? "layoutExtended" : "switchedToNormal"
      ],
    );
  }

  NotifierChangeState() {
    const isChecked = this.$notifierCheckbox.prop("checked");

    storage("set", { notifier: isChecked });
    System.toBackground("notifierChangeState", isChecked);
    notification(
      System.data.locale.popup.notificationMessages[
        isChecked ? "notifierOn" : "notifierOff"
      ],
    );
  }

  async SetLanguage() {
    const language = this.$languageDropdown.val();
    /* let localeData =  */
    await System.PrepareLanguageFile(String(language));
    /* System.data.locale = localeData; */

    storage("set", { language });
    notification(
      System.data.locale.popup.notificationMessages.languageChanged,
      "success",
    );
  }
}

export default OtherOptions;
