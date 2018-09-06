"use strict";

import WaitForElm from "./WaitForElm";
export default color => {
	let rainbow = false;
	if (color.indexOf(",") == 0)
		rainbow = true;
	let personalColors = `
	.sg-header__container,
	.sg-button-primary--alt,
	.sg-button-secondary--alt,
	.mint-tabs__tab--active,
	#html .mint .mint-header,
	#html .mint #tabs-doj #main_menu>li.active,
	#html .mint #footer {
		${!rainbow ? "background-color: " + color + ";" : ""}
		${rainbow ? "background-image: linear-gradient(to right, " + color + "); color: #fff;" : ""}
	}
	
	.sg-link:not([class*="gray"]):not([class*="light"]):not([class*="mustard"]):not([class*="peach"]),
	#html .mint #profile #main-left .personal_info .helped_subjects>li,
	#html .mint #profile #main-left .personal_info .helped_subjects>li .bold,
	#html .mint #profile #main-left .personal_info .helped_subjects>li .bold a,
	#html .mint #profile #main-left .personal_info .helped_subjects>li .green{
		color: ${color};
	}
	.sg-button-secondary--alt-inverse {
		color: ${color};
		fill: ${color};
	}
	`;
	WaitForElm("head", head => {
		if (head) {
			head = head[0];
			let previousElm = document.getElementById("personalColors");
			if (previousElm) {
				previousElm.innerHTML = personalColors;
			}
			else {
				head.innerHTML += `<style id="personalColors">${personalColors}</style>`;
			}
		}
	});
}