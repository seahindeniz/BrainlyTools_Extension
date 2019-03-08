"use strict";

import storage from "../../../helpers/extStorage";

export default async () => {
	let halloween = await storage("getL", "halloween2018");
	if (!halloween) {
		let finishScaring = () => {
			alert(System.data.locale.common.halloween.happyHalloween.replace("%{userNick}", ` ${System.data.Brainly.userData.user.nick} `));

			alert(`\n\n${System.data.locale.common.halloween.imSorry} :P\n\n\n`);

			storage("setL", { halloween2018: true }, () => location.reload());
		}
		setTimeout(() => {
			$("body")
				.addClass("halloween")
				.append(`
					<div class="halloween">
						<video id="halloween" playsinline autoplay muted loop>
							<source src="${System.data.meta.extension.URL}/images/halloween.webm" type="video/webm">
						</video>
					</div>`)
				.click(finishScaring);
			setTimeout(finishScaring, 15000);
		}, 3000);
	}
}
