import ext from "../../scripts/utils/ext";
import Storage from "../../scripts/helpers/extStorage";
import notification from "../components/Notification";
import send2AllBrainlyTabs from "../helpers/send2AllBrainlyTabs";
import Inject2body from "../../scripts/helpers/Inject2body";
import Dropdown from "../helpers/Dropdown";

const OtherOptions = (options, callback) => {
	let $otherOptions = $(`
	<div class="field is-horizontal">
		<div class="field-label has-text-centered">
			<label class="label">${""/*System.data.locale.*/}</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control">
					<label class="checkbox" title="${System.data.locale.popup.extensionOptions.otherOptions.extendMessagesLayout.title}">
						<input id="extendMessagesLayout" type="checkbox"${options.extendMessagesLayout ? " checked" : ""}> ${System.data.locale.popup.extensionOptions.otherOptions.extendMessagesLayout.text}
					</label>
				</div>
			</div>
			<div class="field">
				<div class="control">
					<label class="checkbox" title="${System.data.locale.popup.extensionOptions.otherOptions.notifier.title}">
						<input id="notifier" type="checkbox"${options.notifier ? " checked" : ""}> ${System.data.locale.popup.extensionOptions.otherOptions.notifier.text}
					</label>
				</div>
			</div>
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
		</div>
	</div>`);

	callback($otherOptions);

	let $dropdown = Dropdown($(".dropdown", $otherOptions));
	let $languagesContainer = $(".dropdown-menu > .dropdown-content", $dropdown);
	let $dropdownText = $(".dropdown-trigger > button.button > span:not(.icon)", $dropdown);
	let $extendMessageLayoutCheckbox = $("#extendMessagesLayout", $otherOptions);
	let $notifierCheckbox = $("#notifier", $otherOptions);

	/**
	 * Message layout option
	 */
	Storage.get("extendMessagesLayout", selectedLang => {
		if (selectedLang) {
			$extendMessageLayoutCheckbox.prop("checked", selectedLang);
		}
	});
	$extendMessageLayoutCheckbox.change(function() {
		notification(System.data.locale.popup.notificationMessages[this.checked ? "layoutExtended" : "switchedToNormal"]);
		Storage.set({ extendMessagesLayout: this.checked });
		send2AllBrainlyTabs("extendMessagesLayout", this.checked);
	});

	/**
	 * Notifier option
	 */
	Storage.get("notifier", isActive => {
		console.log("notifier:", isActive);
		if (isActive) {
			$notifierCheckbox.prop("checked", !!isActive);
		}
	});
	$notifierCheckbox.change(function() {
		notification(System.data.locale.popup.notificationMessages[this.checked ? "notifierOn" : "notifierOff"]);
		//Storage.set({ notifier: this.checked });
		//send2AllBrainlyTabs("notifier", this.checked);
		System.toBackground("notifierChangeState", this.checked);
		Storage.set({ notifier: this.checked });
	});

	/**
	 * Language option
	 */
	Storage.get("language", selectedLang => {
		if (selectedLang) {
			let selected = System.data.config.availableLanguages.find(lang => lang.key == selectedLang);

			if (selected) {
				$dropdownText.html(selected.title.replace(/<.*>/, ""));
			}
		}

		System.data.config.availableLanguages.forEach(lang => {
			let $lang = `<a href="#" class="dropdown-item${selectedLang && selectedLang == lang.key ? " is-active" : ""}" value="${lang.key}">${lang.title}</a>`;

			if (System.data.Brainly.defaultConfig.locale.LANGUAGE == lang.key) {
				$languagesContainer.prepend($lang);
			} else {
				$languagesContainer.append($lang);
			}
		});
	});

	$dropdown.change(async function() {
		let localeData = await System.prepareLangFile(this.value);
		System.data.locale = localeData;

		notification(System.data.locale.popup.notificationMessages.languageChanged, "success");
		console.log(this.value);
		Storage.set({ language: this.value });
	});
};

export default OtherOptions
