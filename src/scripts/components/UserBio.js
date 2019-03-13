"use strict";

import notification from "./notification";
import { ChangeBio } from "../controllers/ActionsOfBrainly";

export default (bioText = "") => {
	let $userBio = $(`
	<div class="userBio" title="${System.data.locale.userProfile.userBio.description}">
		<b>${System.data.locale.userProfile.userBio.title}:</b>
		<pre class="sg-text sg-text--xsmall bio-content"${myData.id ==profileData.id ? " contenteditable":""}>${bioText || " -"}</pre>
	</div>`);

	let $bioContent = $(".bio-content[contenteditable]", $userBio);

	$bioContent.on({
		mousedown: function() {
			if (this.innerText == "-" || this.innerText == " -") {
				this.innerText = "";
			}
		},
		blur: async function() {
			if (bioText.replace(/<br\s*[\/]?>/gi, "\n") != this.innerText) {
				this.innerText = bioText = this.innerText.trim();

				let resBio = await ChangeBio(bioText.replace(/\n/gm, "\\n"));

				if (resBio.errors) {
					notification(System.data.locale.userProfile.notificationMessages.cannotChangeBio, "error");
				} else {
					notification(System.data.locale.popup.notificationMessages.updatedMessage, "success");
				}
			}

			if (bioText == "") {
				this.innerText = " -";
			}
		},
		paste: function(e) {
			e.preventDefault();

			let text = (e.originalEvent || e).clipboardData.getData("text/plain");

			document.execCommand("insertText", false, text);
		}
	});

	$userBio.insertAfter("#main-left > div.personal_info > div.previousNicks")
}
