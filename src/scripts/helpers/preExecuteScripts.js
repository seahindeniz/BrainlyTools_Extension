//import WaitForElm from "./WaitForElm";
import themeColorChanger from "./themeColorChanger";

export default function () {
	themeColorChanger("transparent");
	let _loop_removeElement = setInterval(() => {
		let elements = document.querySelectorAll(".brn-ads-box");
		if (elements.length > 0) {
			if (elements && elements.length > 0) {
				elements.forEach(element => {
					element.remove();
				});
			}
		}
	});
	window.addEventListener("load", function load(event) {
		clearInterval(_loop_removeElement);
	});
}