import WaitForElement from "./WaitForElement";

const resizeIt = elm => {
  const wh = window.innerHeight;

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
};

let $cssExtendMessagesLayout;

const resizer = async status => {
  const head = await WaitForElement("head");

  if (!head) return;

  $cssExtendMessagesLayout = document.getElementById("cssExtendMessagesLayout");

  const $privateMessagesContainer = document.getElementById(
    "private-messages-container",
  );

  if ($privateMessagesContainer) {
    if (!$cssExtendMessagesLayout) {
      head.innerHTML += `<style id="cssExtendMessagesLayout"></style>`;
      $cssExtendMessagesLayout = document.getElementById(
        "cssExtendMessagesLayout",
      );
      window.addEventListener(
        "resize",
        () => {
          if (
            $privateMessagesContainer &&
            $privateMessagesContainer.classList.contains("extendedLayout")
          )
            resizeIt($cssExtendMessagesLayout);
        },
        true,
      );
    }

    if (status) {
      resizeIt($cssExtendMessagesLayout);

      if ($privateMessagesContainer)
        $privateMessagesContainer.classList.add("extendedLayout");
    } else {
      $cssExtendMessagesLayout.innerHTML = "";

      if ($privateMessagesContainer)
        $privateMessagesContainer.classList.remove("extendedLayout");
    }
  }
};

export default resizer;
