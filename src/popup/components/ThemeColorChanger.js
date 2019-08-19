import storage from "../../scripts/helpers/extStorage";
import notification from "../components/notification";
import send2AllBrainlyTabs from "../helpers/send2AllBrainlyTabs";

let System = require("../../scripts/helpers/System");

const DEFAULT_THEME_COLOR = "#4fb3f6";

class ThemeColorChanger {
  constructor(color = DEFAULT_THEME_COLOR) {
    this.color = color;

    if (typeof System == "function")
      // @ts-ignore
      System = System();

    this.Render();
    this.BindHandlers();
  }
  Render() {
    this.$layout = $(`
		<div id="themeColor" class="column is-narrow">
			<article class="message is-info">
				<div class="message-header">
					<p>${System.data.locale.popup.extensionOptions.themeColor.title}</p>
				</div>
				<div class="message-body">
					<div class="field is-horizontal">
						<div class="field-label has-text-centered">
							<label class="label">${System.data.locale.popup.extensionOptions.themeColor.setYourColor}</label>
						</div>
						<div class="field-body">
							<div class="field">
								<div class="control">
									<label class="checkbox">
										<input id="rainbow" type="checkbox"> 🌈 ${System.data.locale.popup.extensionOptions.themeColor.rainbow}
									</label>
								</div>
							</div>
							<div class="field">
								<datalist id="flatColors">
									<option value="#1abc9c">Turquoise</option><option value="#2ecc71">Emerland</option><option value="#3498db">Peterriver</option><option value="#9b59b6">Amethyst</option><option value="#34495e">Wetasphalt</option><option value="#16a085">Greensea</option><option value="#27ae60">Nephritis</option><option value="#2980b9">Belizehole</option><option value="#8e44ad">Wisteria</option><option value="#2c3e50">Midnightblue</option><option value="#f1c40f">Sunflower</option><option value="#e67e22">Carrot</option><option value="#e74c3c">Alizarin</option><option value="#ecf0f1">Clouds</option><option value="#95a5a6">Concrete</option><option value="#f39c12">Orange</option><option value="#d35400">Pumpkin</option><option value="#c0392b">Pomegranate</option><option value="#bdc3c7">Silver</option><option value="#7f8c8d">Asbestos</option>
								</datalist>
								<p class="control is-expanded">
									<input id="colorPicker" list="flatColors" class="input" type="color" placeholder="Text input" value="${this.color}">
								</p>
							</div>
							<div class="field">
								<p class="control">
									<input id="colorValue" list="flatColors" class="input" type="text" placeholder="${System.data.locale.popup.extensionOptions.themeColor.pickAColor}"
									${this.color && ' value="' + this.color + '"'}>
								</p>
							</div>
							<p class="help">${System.data.locale.popup.extensionOptions.themeColor.colorFormatInfo}</p>
						</div>
					</div>
					<div class="field is-horizontal">
						<div class="field-label"></div>
						<div class="field-body">
							<div class="field is-grouped is-grouped-right">
								<div class="control">
									<button class="button is-primary save">${System.data.locale.common.save}</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
		</div>`);

    this.$rainbow = $("#rainbow", this.$layout);
    this.$colorValue = $("#colorValue", this.$layout);
    this.$saveButton = $("button.save", this.$layout);
    this.$colorPicker = $("#colorPicker", this.$layout);
  }
  BindHandlers() {
    this.$colorPicker.on("input", event => this.ColorInputHandler(event.target.value));
    this.$colorValue.on("input change", event => this.ColorInputHandler(event.target.value));
    this.$saveButton.click(this.SaveToStorage.bind(this));

    this.$rainbow.on("change", () => {
      let colors = System.constants.config.RAINBOW_COLORS;

      if (!this.$rainbow.is(":checked")) {
        colors = DEFAULT_THEME_COLOR;
      }

      this.$colorValue.val(colors).change();
    })
  }
  ColorInputHandler(color) {
    this.$colorValue.val(color);

    if (color.indexOf(",") == 0) {
      this.$colorPicker.val(color);
    }

    this.ChangeColor(color);
  }
  ChangeColor(color) {
    send2AllBrainlyTabs("previewColor", color);
  }
  SaveToStorage() {
    let color = this.$colorValue.val();

    notification("Color saved");
    send2AllBrainlyTabs("changeColors", color);
    storage("set", { themeColor: color });
  }
}

export default ThemeColorChanger
