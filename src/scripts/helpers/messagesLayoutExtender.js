"use strict";

import WaitForElm from "./WaitForElm";

const resizeIt = (elm) => {
	let wh = window.innerHeight;
	elm.innerHTML = `
	@media (min-width: 1024px){
		.sg-layout__container{
			max-width: unset;
			padding: 0;
			margin: 3.7rem 0 0;
		}
	}
	@media (min-width: 768px){
		.sg-layout__box {
			margin: 0;
		}
	}
	.brn-messages__conversations,
	.brn-messages__chatbox {
		height: ${wh - 107}px;
	}
	section.brn-messages__conversations ul.brn-messages__list {
		height: ${wh - 227}px;
		max-height: unset;
		min-height: unset;
	}
	.brn-messages__chatbox .brn-chatbox__chat {
		height: ${wh - 210}px;
		min-height: unset;
		max-height: unset;
	}
	`;
}
const resizer = status => {
	WaitForElm("head", head => {
		if (head) {
			head = head[0];
			let $cssExtendMessagesLayout = document.getElementById("cssExtendMessagesLayout");
			if (!$cssExtendMessagesLayout) {
				head.innerHTML += `<style id="cssExtendMessagesLayout"></style>`;
				$cssExtendMessagesLayout = document.getElementById("cssExtendMessagesLayout");
			}

			if (status) {
				resizeIt($cssExtendMessagesLayout);
				window.onresize = () => resizeIt($cssExtendMessagesLayout);
			}
			else {
				$cssExtendMessagesLayout.innerHTML = "";
				window.onresize = undefined;
			}
		}
	});
};

export default resizer