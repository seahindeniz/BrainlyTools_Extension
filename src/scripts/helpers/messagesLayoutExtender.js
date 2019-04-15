"use strict";

import WaitForElement from "./WaitForElement";

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
		height: ${wh - 220}px;
		min-height: unset;
		max-height: unset;
	}
	`;
}
let $cssExtendMessagesLayout;
const resizer = async status => {
  let head = await WaitForElement("head");

  if (head) {
    head = head[0];
    $cssExtendMessagesLayout = document.getElementById("cssExtendMessagesLayout");
    let $private_messages_container = document.getElementById("private-messages-container");
    if ($private_messages_container) {
      if (!$cssExtendMessagesLayout) {
        head.innerHTML += `<style id="cssExtendMessagesLayout"></style>`;
        $cssExtendMessagesLayout = document.getElementById("cssExtendMessagesLayout");
        window.addEventListener("resize", () => {
          if ($private_messages_container && $private_messages_container.classList.contains("extendedLayout"))
            resizeIt($cssExtendMessagesLayout)
        }, true);
      }
      if (status) {
        resizeIt($cssExtendMessagesLayout);
        $private_messages_container && $private_messages_container.classList.add("extendedLayout");
      } else {
        $cssExtendMessagesLayout.innerHTML = "";
        $private_messages_container && $private_messages_container.classList.remove("extendedLayout");
      }
    }
  }
};

export default resizer
