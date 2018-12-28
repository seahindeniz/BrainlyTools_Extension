"use strict";

import WaitForElement from "./WaitForElement";
import MakeExpire from "./MakeExpire";

const DEFAULT_THEME_COLOR = "#57b2f8";

export default async (color, isPreview) => {
	let rainbow = false;
	let localStoredColor = localStorage.getItem("themeColor");

	if (color != localStoredColor && !isPreview) {
		localStorage.setItem("themeColor", color);
	}

	if (color.indexOf(",") >= 0) {
		rainbow = color;
		color = DEFAULT_THEME_COLOR;
	}

	let personalColors = `
	.sg-header__container,
	.sg-button-primary--alt,
	.sg-button-secondary--alt,
	.mint-tabs__tab--active,
	#html .mint .mint-header,
	#html .mint #tabs-doj #main_menu>li.active,
	#html .mint #footer,
	.sg-box--blue {
		${!rainbow ? `background-color: ${color} !important;` : `background-image: linear-gradient(to right, ${rainbow}) !important; color: #fff !important;`}
	}

	.sg-menu-list__link,
	.sg-link:not([class*="gray"]):not([class*="light"]):not([class*="mustard"]):not([class*="peach"]),
	#html .mint #profile #main-left .personal_info .helped_subjects>li,
	#html .mint #profile #main-left .personal_info .helped_subjects>li .bold,
	#html .mint #profile #main-left .personal_info .helped_subjects>li .bold a,
	#html .mint #profile #main-left .personal_info .helped_subjects>li .green,
	#html .mint .mod-profile-panel a,
	#html .mint .mod-profile-panel .pseudolink,
	#html .mint .mod-profile-panel .orange,
	#html .mint .mod-profile-panel .onlylink,
	div#content-old .editProfileContent .profileListEdit,
	#main-panel .menu-right .menu-element#panel-notifications .notifications-container .notifications li.notification .main .content .nick,
	#main-panel .menu-right .menu-element#panel-notifications .notifications-container .notification-wrapper .main .content .nick {
		color: ${color} !important;
	}

	.sg-button-secondary--alt-inverse,
	.sg-sticker__front {
		color: ${color} !important;
		fill: ${color} !important;
	}
	`;
	let head = await WaitForElement("head");

	if (head) {
		head = head[0];
		let $personalColors = document.getElementById("personalColors");

		if ($personalColors) {
			$personalColors.innerHTML = personalColors;
		} else {
			//head.innerHTML += `<style id="personalColors">${personalColors}</style>`;
			$personalColors = document.createElement('style');
			$personalColors.type = 'text/css';
			$personalColors.id = "personalColors"

			//var styles = `<style id="personalColors">${personalColors}</style>`;

			if ($personalColors.styleSheet) {
				$personalColors.styleSheet.cssText = personalColors;
			} else {
				$personalColors.appendChild(document.createTextNode(personalColors));
			}

			head.appendChild($personalColors);

		}

		let _loop_personalColors_expire = MakeExpire(6);
		let _loop_personalColors = setInterval(() => {
			if (_loop_personalColors_expire < new Date().getTime()) {
				clearInterval(_loop_personalColors);
			}

			$personalColors.parentNode && $personalColors.parentNode.appendChild($personalColors);
		});
	}
}
