import themeColorChanger from "./themeColorChanger";

function preExecuteScripts() {
	let color = localStorage.getItem("themeColor");

	themeColorChanger(color || "transparent");

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

export default preExecuteScripts()
