import ThemeColorChanger from "./ThemeColorChanger";

function preExecuteScripts() {
	let color = window.localStorage.getItem("themeColor");

	window.coloring = new ThemeColorChanger(color);

	let _loop_removeElement = setInterval(() => {
		let elements = document.querySelectorAll(".brn-ads-box, div.js-feed>div>div.sg-layout>div.sg-layout__container>div.sg-layout__content>div>div.sg-layout__box");

		if (elements && elements.length > 0)
			elements.forEach(element => element.remove());
	});

	window.addEventListener("load", () => clearInterval(_loop_removeElement));
	setTimeout(() => clearInterval(_loop_removeElement), 10000);
}

export default preExecuteScripts()
