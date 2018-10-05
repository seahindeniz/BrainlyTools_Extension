import ext from "../../utils/ext";
import Storage from "../../helpers/extStorage";
import Notification from "../components/Notification";
import send2AllBrainlyTabs from "../helpers/send2AllBrainlyTabs";

const OtherOptions = (options, callback) => {
	let $otherOptions = $(`
	<div class="field is-horizontal">
		<div class="field-label has-text-centered">
			<label class="label">${""/*System.data.locale.texts.extension_options.themeColor.choose_color*/}</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control">
					<label class="checkbox" title="${System.data.locale.texts.extension_options.otherOptions.extendMessagesLayout.description}">
						<input id="extendMessagesLayout" type="checkbox"${options.extendMessagesLayout ? " checked" : ""}> ${System.data.locale.texts.extension_options.otherOptions.extendMessagesLayout.title}
					</label>
				</div>
			</div>
			<div class="field is-grouped">
				<div class="control">
					<label class="checkbox">
						${System.data.locale.texts.extension_options.otherOptions.extensionLanguage}
					</label>
				</div>
				<div class="control is-expanded">
					<div class="dropdown is-active">
						<div class="dropdown-trigger">
							<button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
						<span>Dropdown button</span>
						<span class="icon is-small">
							<i class="fas fa-angle-down" aria-hidden="true"></i>
						</span>
						</button>
						</div>
						<div class="dropdown-menu" id="dropdown-menu" role="menu">
							<div class="dropdown-content">
								<a href="#" class="dropdown-item">
									Dropdown item
								</a>
								<a class="dropdown-item">
									Other dropdown item
								</a>
								<a href="#" class="dropdown-item is-active">
									Active dropdown item
								</a>
								<a href="#" class="dropdown-item">
									Other dropdown item
								</a>
								<hr class="dropdown-divider">
								<a href="#" class="dropdown-item">
									With a divider
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`);

	$("#extendMessagesLayout", $otherOptions).change(function() {
		Notification("Layout " + (this.checked ? "extended" : "switched back to normal"));
		Storage.set({ extendMessagesLayout: this.checked });
		send2AllBrainlyTabs(tab => {
			var message = { action: "extendMessagesLayout", url: tab.url, data: this.checked };
			ext.tabs.sendMessage(tab.id, message);
		});
	});
	callback($otherOptions);
};

export default OtherOptions
