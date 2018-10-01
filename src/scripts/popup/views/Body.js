import ext from "../../utils/ext";
import Storage from "../../helpers/extStorage";
import Notification from "../components/Notification"

const Layout = template => {
	$("body").append(template);
	setInterval(() => {
		$("[data-time]").each((i, elm) => {
			elm = $(elm);
			let time = $(elm).data("time");
			let timeLong = moment(time).fromNow(),
				timeShort = moment(time).fromNow(true);
			elm.attr("title", timeLong);
			elm.text(timeShort);
		});
	}, 1000);
	$(".box > .title").on("click", function() {
		$(this).parent().toggleClass("is-active");
	});
	$("body").on("click", ".message-header > p", function() {
		$(this).parents("article").toggleClass("is-active");
	});
	$(".dropdown-trigger").on("click", function() {
		$(this).parent().toggleClass("is-active");
	});
	$(".dropdown-menu .dropdown-item").on("click", function() {
		let dropdown = $(this).parents('.dropdown');
		dropdown.toggleClass("is-active");
		let trigger = $(".dropdown-trigger", dropdown);
		$("button > label", trigger).text(this.innerText);
		$(dropdown).change();
	});
	/* $(".board-item[data-type] select").each((i, select) => {
		let selectedItem = $("option:selected", select).val();
		$("option:gt(0)", select).sort((a, b) => $(b).text() < $(a).text() ? 1 : -1).appendTo(select);
		$(select).val(selectedItem);
	});
	let $quickDeleteButtonsSelect = $("#quickDeleteButtons select");
	$quickDeleteButtonsSelect.on("change", function() {
		Notification("Button selections saved");
		let data = {};
		$quickDeleteButtonsSelect.each((i, elm) => {
			let reasonType = $(elm).parents(".board-item").data("type");
			!data[reasonType] && (data[reasonType] = []);
			data[reasonType].push($('option:selected', elm).data("key"));
		});
		Storage.set({ quickDeleteButtonsReasons: data });
	}) */

	/* 	let $colorPicker = $("#colorPicker");
		let $colorValue = $("#colorValue");
		let $rainbow = $("#rainbow");
		let changeColor = color => {
			send2AllBrainlyTabs(tab => {
				var message = { action: "changeColor", url: tab.url, data: color };
				ext.tabs.sendMessage(tab.id, message);
			});
		}
		let colorInputHandler = function() {
			let color = this.value;
			$colorValue.val(color);
			color.indexOf(",") == 0 && $colorPicker.val(color);
			changeColor(color);
		}
		$colorPicker.on("change input", colorInputHandler);
		$colorValue.on("input change", colorInputHandler);
		$rainbow.on("change", function() {
			let rainbowColors = "#ff796b, #ecb444, #fec83c, #53cf92, #57b2f8, #7a8adb, #ffb3ae"
			if (!this.checked) {
				rainbowColors = "#57b2f8";
			}
			$colorValue.val(rainbowColors).change();
		})
		$("#themeColor button").click(() => {
			Notification("Color saved");
			Storage.set({ themeColor: $colorValue.val() });
		});

		$("#extendMessagesLayout").change(function() {
			Notification("Layout " + (this.checked ? "extended" : "switched back to normal"));
			Storage.set({ extendMessagesLayout: this.checked });
			send2AllBrainlyTabs(tab => {
				var message = { action: "extendMessagesLayout", url: tab.url, data: this.checked };
				ext.tabs.sendMessage(tab.id, message);
			});
		}); */
}

export default Layout
