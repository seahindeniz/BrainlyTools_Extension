"use strict";

import WaitForElement from "./WaitForElement";
import Color from "color";
import TimedLoop from "./TimedLoop";

const DEFAULT_THEME_COLOR = "#57b2f8";

export default async (primaryColor, isPreview) => {
	let background;
	let rainbow = false;
	let fontColor = "#fff";
	let easeSpeed = 4.5;
	let localStoredColor = localStorage.getItem("themeColor");

	if (primaryColor != localStoredColor && !isPreview) {
		localStorage.setItem("themeColor", primaryColor);
	}

	if (primaryColor.indexOf(",") >= 0) {
		rainbow = primaryColor;
		primaryColor = DEFAULT_THEME_COLOR;
	}

	if (!rainbow) {
		primaryColor = Color(primaryColor);
		let secondaryColor = primaryColor.lighten(0.4);

		if (primaryColor.isLight()) {
			if (primaryColor.hex().toLowerCase() != DEFAULT_THEME_COLOR.toLowerCase()) {
				fontColor = "#000";
			}

			secondaryColor = primaryColor.darken(0.2);
		}

		background = `background: linear-gradient(180deg, ${primaryColor},${secondaryColor}); color: ${fontColor} !important;`;
	} else {
		easeSpeed = 6;
		background = `background: linear-gradient(180deg, ${rainbow}); color: #fff !important;`;
	}

	let personalColors = `
@keyframes BackgroundAnimation {
  50% {
    background-position: 0% 100%
  }
}
.sg-header__container,
.sg-button-primary--alt,
.sg-button-secondary--alt,
.mint-tabs__tab--active,
#html .mint .mint-header,
#html .mint #tabs-doj #main_menu>li.active,
#html .mint #footer,
.sg-box--blue {
	${background}
	background-size: 1% 10000%;
	animation: BackgroundAnimation ${easeSpeed}s ease infinite;
	transform: translateZ(0);
	will-change: background-position;
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
	color: ${primaryColor} !important;
}

.sg-button-secondary--alt-inverse,
.sg-sticker__front {
	color: ${primaryColor} !important;
	fill: ${primaryColor} !important;
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

		TimedLoop(() => {
			$personalColors.parentNode && $personalColors.parentNode.appendChild($personalColors);
		});
	}
}
