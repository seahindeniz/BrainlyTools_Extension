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
					<label class="checkbox" title="${System.data.locale.texts.extension_options.extendMessagesLayout.description}">
						<input id="extendMessagesLayout" type="checkbox"${options.extendMessagesLayout ? " checked" : ""}> ${System.data.locale.texts.extension_options.extendMessagesLayout.title}
					</label>
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
