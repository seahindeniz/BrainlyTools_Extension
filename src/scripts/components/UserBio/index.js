"use strict";

import { ChangeBio } from "../../controllers/ActionsOfBrainly";
import Notification from "../../components/Notification";

export default description => {
	let $userBio = $(`
	<div class="userBio" title="${System.data.locale.userProfile.userBio.description}">
		<b>${System.data.locale.userProfile.userBio.title}:</b>
		<pre class="sg-text sg-text--xsmall bio-content"${myData.id ==profileData.id ? " contenteditable":""}>${description || " -"}</pre>
	</div>`);

	let $bioContent = $(".bio-content[contenteditable]", $userBio);

	let bioVal = description || ""
	$bioContent.on({
		mousedown: function() {
			if (this.innerText == "-" || this.innerText == " -") {
				this.innerText = "";
			}
		},
		blur: function() {
			if (bioVal.replace(/<br\s*[\/]?>/gi, "\n") != this.innerText) {
				this.innerText = bioVal = this.innerText.trim();

				ChangeBio(bioVal.replace(/\n/gm, "\\n"), res => {
					console.log(res);
					if (res.errors) {
						Notification(System.data.locale.userProfile.notificationMessages.cannotChangeBio, "error");
						return false;
					}

					Notification(System.data.locale.popup.notificationMessages.updatedMessage, "success");
				});
			}
			if (bioVal == "") {
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
