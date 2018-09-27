import ext from "../../utils/ext";
import Storage from "../../helpers/extStorage";
import Notification from "../components/Notification";
import send2AllBrainlyTabs from "../helpers/send2AllBrainlyTabs";

let ThemeColor = (color = "#57b2f8", callback) => {
	let $themeColor = $(`
	<div class="field is-horizontal">
		<div class="field-label has-text-centered">
			<label class="label">${System.data.locale.texts.extension_options.themeColor.choose_color}</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control">
					<label class="checkbox">
						<input id="rainbow" type="checkbox"> 🌈 ${System.data.locale.texts.extension_options.themeColor.rainbow}
					</label>
				</div>
			</div>
			<div class="field is-expanded">
				<div class="field has-addons">
					<datalist id="flatColors">
						<option value="#1abc9c">Turquoise</option><option value="#2ecc71">Emerland</option><option value="#3498db">Peterriver</option><option value="#9b59b6">Amethyst</option><option value="#34495e">Wetasphalt</option><option value="#16a085">Greensea</option><option value="#27ae60">Nephritis</option><option value="#2980b9">Belizehole</option><option value="#8e44ad">Wisteria</option><option value="#2c3e50">Midnightblue</option><option value="#f1c40f">Sunflower</option><option value="#e67e22">Carrot</option><option value="#e74c3c">Alizarin</option><option value="#ecf0f1">Clouds</option><option value="#95a5a6">Concrete</option><option value="#f39c12">Orange</option><option value="#d35400">Pumpkin</option><option value="#c0392b">Pomegranate</option><option value="#bdc3c7">Silver</option><option value="#7f8c8d">Asbestos</option>
					</datalist>
					<p class="control is-expanded">
						<input id="colorPicker" list="flatColors" class="input" type="color" placeholder="Text input" value="${color}">
					</p>
					<p class="control">
						<input id="colorValue" list="flatColors" class="input" type="text" placeholder="${System.data.locale.texts.extension_options.themeColor.choose_color}"
						${color && ' value="' + color + '"'}>
					</p>
				</div>
				<p class="help">${System.data.locale.texts.extension_options.themeColor.fontColorExample}</p>
			</div>
		</div>
	</div>
	<div class="field is-horizontal">
		<div class="field-label"></div>
		<div class="field-body">
			<div class="field is-grouped is-grouped-right">
				<div class="control">
					<button class="button is-primary save">${System.data.locale.texts.globals.save}</button>
				</div>
			</div>
		</div>
	</div>`);
	let $colorPicker = $("#colorPicker", $themeColor);
	let $colorValue = $("#colorValue", $themeColor);
	let $rainbow = $("#rainbow", $themeColor);

	let changeColor = color => {
		send2AllBrainlyTabs(tab => {
			var message = { action: "changeColor", url: tab.url, data: color };
			ext.tabs.sendMessage(tab.id, message);
		});
	}
	let colorInputHandler = function() {
		let color = this.value;
		$colorValue.val(color);
		color.indexOf(",") == 0 && $colorPicker.val(color);
		changeColor(color);
	}
	$colorPicker.on("change input", colorInputHandler);
	$colorValue.on("input change", colorInputHandler);
	$rainbow.on("change", function() {
		let rainbowColors = "#ff796b, #ecb444, #fec83c, #53cf92, #57b2f8, #7a8adb, #ffb3ae"
		if (!this.checked) {
			rainbowColors = "#57b2f8";
		}
		$colorValue.val(rainbowColors).change();
	})
	$("button.save", $themeColor).click(() => {
		Notification("Color saved");
		Storage.set({ themeColor: $colorValue.val() });
	});

	callback($themeColor);
}

export default ThemeColor
