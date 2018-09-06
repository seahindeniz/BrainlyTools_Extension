"use strict"

import ext from "./utils/ext";
//import { storageS, storageL } from "./utils/storage";
import Storage from "./helpers/extStorage";

window.System = {
	data: {}
};
let _brainly_regexp = /:\/\/(?:www\.)?((?:eodev|znanija)\.com|zadane\.pl|nosdevoirs\.fr|brainly(?:(?:\-thailand\.com)|(?:\.(?:com+(?:\.br|\.ng|)|co\.(?:id|za)|lat|in|my|ph|ro))))/i;

let save2Storage = (data) => {
	storageS.get(res => {
		let data = {};
		let marketKey = System.data.meta.marketName + "_" + System.data.Brainly.userData.user.id;
		data[marketKey] = { ...data, ...res[marketKey] };
		storageS.set(data, resSave => {
			//sendResponse(true);
			console.log(resSave);
		});
	})
};
let send2AllBrainlyTabs = (callback) => {
	ext.tabs.query({}, function (tabs) {
		for (var i = 0; i < tabs.length; ++i) {
			if (_brainly_regexp.test(tabs[i].url)) {
				callback(tabs[i]);
			}
		}
	});
}
let loadErrorTemplate = () => {
	return `
	<section class="hero is-medium is-danger is-bold">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					Error
				</h1>
				<h2 class="subtitle">
					I'm unable to fetch your data from Brainly<br><br>
					Please go to Brainly's homepage or reload the page
				</h2>
			</div>
		</div>
	</section>`
}
let makeNotification = (text, type = "success") => {
	let notify = $(`<div class="notification is-${type}">${text}</div>`);
	notify.prependTo('.notification-list');
	setTimeout(() => notify.slideUp(), 3000);
}
let appTemplate = data => {
	let avatar = System.data.Brainly.userData.user.avatars[100] || `https://${System.data.meta.marketName}/img/avatars/100-ON.png`;
	return `
	<div class="notification-list"></div>
	<section class="hero is-success is-halfheight">
		<div class="hero-body">
			<div class="container">
				<div class="column">
					<h3 class="title has-text-grey has-text-centered">${System.data.meta.manifest.short_name} for</h3>
					<h3 class="title has-text-grey has-text-centered marketName">${System.data.meta.marketName}</h3>
					<div class="box">
						<figure class="avatar has-text-centered">
							<img src="${avatar}" title="${System.data.Brainly.userData.user.nick} - ${System.data.Brainly.userData.user.id}">
						</figure>
						<h4 class="title is-4 has-text-centered">${System.data.locale.texts.extension_options.title}</h4>

						<div id="themeColor" class="column is-narrow">
							<article class="message is-info">
								<div class="message-header">
									<p>${System.data.locale.texts.extension_options.themeColor.title}</p>
								</div>
								<div class="message-body">${data.themeColor}</div>
							</article>
						</div>
						<div id="quickDeleteButtons" class="column is-narrow">
							<article class="message is-danger">
								<div class="message-header">
									<p>${System.data.locale.texts.extension_options.quick_delete_buttons.title}</p>
								</div>
								<div class="message-body">${data.deleteButonOptions}</div>
							</article>
						</div>
						<div id="otherOptions" class="column is-narrow">
							<article class="message is-dark">
								<div class="message-header">
									<p>${System.data.locale.texts.extension_options.otherOptions.title}</p>
								</div>
								<div class="message-body">${data.otherOptions}</div>
							</article>
						</div>
						
					</div>
				</div>
			</div>
		</div>
	</section>
	<footer class="footer">
		<p class="title is-7 has-text-centered">
			<a href="https://chrome.google.com/webstore/detail/${System.data.meta.extension.id}" class="has-text-grey" target="_blank">Brainly Tools v${System.data.meta.manifest.version}</a>
		</p>
	</footer>`;
}
let renderBody = template => {
	$("body").html(template);

	$(".board-item[data-type] select").each((i, select) => {
		let selectedItem = $("option:selected", select).val();
		$("option:gt(0)", select).sort((a, b) => $(b).text() < $(a).text() ? 1 : -1).appendTo(select);
		$(select).val(selectedItem);
	});
	$(".box > .title").on("click", function () {
		$(this).parent().toggleClass("is-active");
	})
	$(".message-header > p").on("click", function () {
		$(this).parents("article").toggleClass("is-active");
	})
	let $quickDeleteButtonsSelect = $("#quickDeleteButtons select");
	$quickDeleteButtonsSelect.on("change", function () {
		makeNotification("Button selections saved");
		let data = {};
		$quickDeleteButtonsSelect.each((i, elm) => {
			let reasonType = $(elm).parents(".board-item").data("type");
			!data[reasonType] && (data[reasonType] = []);
			data[reasonType].push($('option:selected', elm).data("key"));
		});
		Storage.set({ quickDeleteButtonsReasons: data });
	})
	$(".dropdown-trigger").on("click", function () {
		$(this).parent().toggleClass("is-active");
	});
	$(".dropdown-menu .dropdown-item").on("click", function () {
		let dropdown = $(this).parents('.dropdown');
		dropdown.toggleClass("is-active");
		let trigger = $(".dropdown-trigger", dropdown);
		$("button > label", trigger).text(this.innerText);
		$(dropdown).change();
	});

	let $colorPicker = $("#colorPicker");
	let $colorValue = $("#colorValue");
	let $rainbow = $("#rainbow");
	let changeColor = color => {
		send2AllBrainlyTabs(tab => {
			var message = { action: "changeColor", url: tab.url, data: color };
			ext.tabs.sendMessage(tab.id, message);
		});
	}
	let colorInputHandler = function () {
		let color = this.value;
		$colorValue.val(color);
		color.indexOf(",") == 0 && $colorPicker.val(color);
		changeColor(color);
	}
	$colorPicker.on("change input", colorInputHandler);
	$colorValue.on("input change", colorInputHandler);
	$rainbow.on("change", function () {
		let rainbowColors = "#ff796b, #ecb444, #fec83c, #53cf92, #57b2f8, #7a8adb, #ffb3ae"
		if (!this.checked) {
			rainbowColors = "#57b2f8";
		}
		$colorValue.val(rainbowColors).change();
	})
	$("#themeColor button").click(() => {
		makeNotification("Color saved");
		Storage.set({ themeColor: $colorValue.val() });
	});

	$("#extendMessagesLayout").change(function () {
		makeNotification("Layout " + (this.checked ? "extended" : "switched back to normal"));
		Storage.set({ extendMessagesLayout: this.checked });
		send2AllBrainlyTabs(tab => {
			var message = { action: "extendMessagesLayout", url: tab.url, data: this.checked };
			ext.tabs.sendMessage(tab.id, message);
		});
	});
}
let renderThemeColor = (color = "") => {
	return `
	<div class="field is-horizontal">
		<div class="field-label has-text-centered">
			<label class="label">${System.data.locale.texts.extension_options.themeColor.choose_color}</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control">
					<label class="checkbox">
						<input id="rainbow" type="checkbox"> 🌈 ${System.data.locale.texts.extension_options.themeColor.rainbow}
					</label>
				</div>
			</div>
			<div class="field is-expanded">
				<div class="field has-addons">
					<datalist id="flatColors">
						<option value="#1abc9c">Turquoise</option><option value="#2ecc71">Emerland</option><option value="#3498db">Peterriver</option><option value="#9b59b6">Amethyst</option><option value="#34495e">Wetasphalt</option><option value="#16a085">Greensea</option><option value="#27ae60">Nephritis</option><option value="#2980b9">Belizehole</option><option value="#8e44ad">Wisteria</option><option value="#2c3e50">Midnightblue</option><option value="#f1c40f">Sunflower</option><option value="#e67e22">Carrot</option><option value="#e74c3c">Alizarin</option><option value="#ecf0f1">Clouds</option><option value="#95a5a6">Concrete</option><option value="#f39c12">Orange</option><option value="#d35400">Pumpkin</option><option value="#c0392b">Pomegranate</option><option value="#bdc3c7">Silver</option><option value="#7f8c8d">Asbestos</option>
					</datalist>
					<p class="control is-expanded">
						<input id="colorPicker" list="flatColors" class="input" type="color" placeholder="Text input" value="${color}">
					</p>
					<p class="control">
						<input id="colorValue" list="flatColors" class="input" type="text" placeholder="${System.data.locale.texts.extension_options.themeColor.choose_color}"
						${color && ' value="' + color + '"'}>
					</p>
				</div>
				<p class="help">${System.data.locale.texts.extension_options.themeColor.fontColorExample}</p>
			</div>
		</div>
	</div>
	<div class="field is-horizontal">
		<div class="field-label"></div>
		<div class="field-body">
			<div class="field is-grouped is-grouped-right">
				<div class="control">
					<button class="button is-primary">${System.data.locale.texts.globals.save}</button>
				</div>
			</div>
		</div>
	</div>`;
}
let renderDeleteButtonOptions = quickDeleteButtonsReasons => {
	let fields = "";
	if (!System.data.Brainly.deleteReasons) {
		renderBody(loadErrorTemplate());
	}
	else {
		let reasonTypeKeys = Object.keys(System.data.Brainly.deleteReasons).reverse();
		reasonTypeKeys.forEach(reasonTypeKey => {
			let dropDownFields = "";
			var listOptions = i => {
				let options = "";
				Object.keys(System.data.Brainly.deleteReasons[reasonTypeKey]).forEach(reasonKey => {
					if (reasonKey != "__categories") {
						let contentType = System.data.Brainly.deleteReasons[reasonTypeKey];
						let reason = contentType[reasonKey];
						let category = contentType.__categories[reason.category_id];
						let buttonDefaultSelectedItem = (quickDeleteButtonsReasons && quickDeleteButtonsReasons[reasonTypeKey][i]) || System.data.locale.config.quickDeleteButtonsDefaultReasons[reasonTypeKey][i]
						options += `<option data-cat-id="${category.id}" data-key="${reasonKey}" title="${reason.text}"${buttonDefaultSelectedItem == reasonKey ? " selected" : ""}>${category.text == reasonKey ? reasonKey : category.text + " - " + reasonKey}</option>`
					}
				});
				return options;
			}
			for (let i = 0; i < (System.data.config.quickDeleteButtonsReasons[reasonTypeKey].length); i++) {
				dropDownFields += `
				<div class="control title is-6 has-text-centered">
					<div class="select">
						<select>
							<option disabled>Select a reason</option>
							${listOptions(i)}
						</select>
					</div>
				</div>`;
			}
			fields += `
			<div class="board-item" data-type="${reasonTypeKey}">
				<div class="board-item-content">
					<span>${System.data.locale.texts.extension_options.quick_delete_buttons[reasonTypeKey]}</span>
					${dropDownFields}
				</div>
			</div>`
		});
	}
	return fields;
}
let renderOtherOptions = (options) => {
	return `
	<div class="field is-horizontal">
		<div class="field-label has-text-centered">
			<label class="label">${""/*System.data.locale.texts.extension_options.themeColor.choose_color*/}</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control">
					<label class="checkbox" title="${System.data.locale.texts.extension_options.extendMessagesLayout.description}">
						<input id="extendMessagesLayout" type="checkbox"${options.extendMessagesLayout ? " checked" : ""}> ${System.data.locale.texts.extension_options.extendMessagesLayout.title}
					</label>
				</div>
			</div>
		</div>
	</div>`;
};
$(() => {
	var messageDone = () => {
		messageDone = () => { };
		ext.runtime.sendMessage({ action: "getMarketData" }, function (res) {
			console.log(res);
			if (res) {
				System.data = res;
				Storage.get(["user", "themeColor", "quickDeleteButtonsReasons", "extendMessagesLayout"], res => {
					console.log("storageUser: ", res);
					if (res && res.user && res.user.user && res.user.user.id && res.user.user.id == res.user.user.id) {
						let data = {
							themeColor: renderThemeColor(res.themeColor || "#57b2f8"),
							deleteButonOptions: renderDeleteButtonOptions(res.quickDeleteButtonsReasons),
							otherOptions: renderOtherOptions(res)
						}
						renderBody(appTemplate(data));
					}
					else {
						renderBody(loadErrorTemplate());
					}
				});
			} else {
				renderBody(loadErrorTemplate());
			}
		});
	}

	ext.tabs.query({}, function (tabs) {
		for (var i = 0; i < tabs.length; ++i) {
			if (_brainly_regexp.test(tabs[i].url)) {
				var message = { action: "shareGatheredData2Background", url: tabs[i].url };
				ext.tabs.sendMessage(tabs[i].id, message, res => {
					messageDone();
				});
			}
		}
	});


});
