import { ChangeBio } from "../controllers/ActionsOfBrainly";
import notification from "./notification";

class UserBio {
	constructor(bio = "", editable = false) {
		this.bio = bio;
		this.editable = editable;

		this.Render();
		this.BindEvents();
	}
	Render() {
		this.$ = $(`
		<div class="sg-actions-list sg-actions-list--no-wrap sg-actions-list--to-top">
			<div class="sg-actions-list__hole" title="${System.data.locale.userProfile.userBio.description}">
				<span class="sg-text sg-text--small sg-text--bold">${System.data.locale.userProfile.userBio.title}: </span>
			</div>
			<div class="sg-actions-list__hole sg-actions-list__hole--grow sg-text sg-text--xsmall">
				<p class="sg-text sg-text--xsmall" style="min-height:1.5rem;">${this.bio || " -"}</p>
			</div>
		</div>`);

		this.$bioContent = $("p", this.$);
		/**
		 * @type {HTMLParagraphElement}
		 */
		this.bioContent = this.$bioContent.get(0);

		this.$bioContent.prop("contenteditable", true || this.editable);
	}
	BindEvents() {
		this.$bioContent.on({
			mousedown: this.RemovePlaceholder.bind(this),
			paste: this.PaseHandler.bind(this),
			blur: this.UpdateIfChanged.bind(this)
		});
	}
	RemovePlaceholder() {
		if (!this.bio) {
			this.$bioContent.text("");
		}
	}
	AddPlaceholder() {
		if (this.bioContent.innerText.trim() == "") {
			this.bioContent.innerText = " -";
		}
	}
	PaseHandler(event) {
		event.preventDefault();

		let text = (event.originalEvent || event).clipboardData.getData("text/plain");

		document.execCommand("insertText", false, text);
	}
	async UpdateIfChanged() {
		if (this.bioContent.innerText != this.bio.replace(/\s{0,}<br\s*[\/]?>/gi, "\n")) {
			this.Update();
		}

		this.AddPlaceholder();
	}
	async Update() {
		let oldBio = this.bio;
		let newBio = this.bioContent.innerText.trim();

		let resBio = await ChangeBio(newBio.replace(/(?:\r\n|\n)/gm, "\\n"));

		if (resBio.errors) {
			this.bioContent.innerText = oldBio;

			notification(System.data.locale.userProfile.notificationMessages.cannotChangeBio, "error");
		} else {
			this.bio = newBio;

			notification(System.data.locale.popup.notificationMessages.updatedMessage, "success");
		}

		this.AddPlaceholder();
	}
}

export default UserBio
