import ext from "../utils/ext";
import WaitForFn from "../helpers/WaitForFn";
import Notification from "../components/Notification";
import Request from "./Request";

class _System {
	constructor() {
		this.data = {
			Brainly: {
				Routing: {
					prefix: undefined,
					routes: undefined
				}
			},
			meta: {},
			locale: {},
			config: {}
		}
	}
	init() {
		console.log("System initalized");
	}
	printLoadedTime() {
		console.log("Brainly Tools loaded in", Number((performance.now() - window.performanceStartTiming).toFixed(2)), "milliseconds");
	}
	Auth(callback) {
		let data = {
			clientID: System.data.meta.manifest.clientID,
			clientVersion: System.data.meta.manifest.version,
			isoLocale: System.data.Brainly.userData.user.iso_locale,
			marketName: System.data.meta.marketName,
			user: {
				id: System.data.Brainly.userData.user.id,
				nick: System.data.Brainly.userData.user.nick
			}
		}
		let authRequestHandler = res => {
			console.log(res);
			if (res && res.success && res.data.probatus) {
				System.data.Brainly.userData.secretKey = res.data.secretKey;
				callback(JSON.parse(atob(res.data.hash)));
			}
			else {
				Notification(System.data.locale.texts.globals.errors.permission_error.description, "error", true);
			}
		};
		Request.ExtensionServerReq("POST", "/auth", data, authRequestHandler);
	}
	getDeleteReasons(callback) {
		Request.ExtensionServerReq("POST", "/deleteReasons", { secretKey: System.data.Brainly.userData.secretKey }, res => {
			if (res && res.success) {
				callback(res.data.deleteReasons);
			}
		});
		/*$.get("admin/del_reasons/reasons/1", res => {
			console.log($("table tr[id]", `<div>${res}</div>`));
		});*/
	}
	checkRoute(index, str) {
		let curr_path = location.pathname.split("/"),
			result = false;
		if (curr_path.length >= 2) {
			if (curr_path[index] == str) {
				result = true;
			}
			else {
				let route = System.data.Brainly.Routing.routes[str] || System.data.Brainly.Routing.routes[System.data.Brainly.Routing.prefix + str]
				if (route) {
					let tokens = route.tokens;
					if (!tokens)
						console.error("Route tokens not found");
					else {
						for (let i = 0; (i < tokens.length && typeof tokens != "string"); i++)
							tokens = tokens.pop();
						if (!tokens)
							console.error("Route tokens not found");
						else {
							if (tokens == "/" + curr_path[index]) {
								result = true;
							}
						}
					}
				}
			}
		}
		return result;
	}
	shareGatheredData2Background(callback) {
		ext.runtime.sendMessage(System.data.meta.extension.id, { action: "setMarketData", data: System.data }, res => {
			if (!res || res != "done") {
				console.error("I couldn't share the System data variable to background");
			}
			else {
				callback && callback();
			}
		})
	}
	enableExtensionIcon() {
		ext.runtime.sendMessage(System.data.meta.extension.id, { action: "enableExtensionIcon" })
	}
	changeBadgeColor(status){
		ext.runtime.sendMessage(System.data.meta.extension.id, { action: "changeBadgeColor", status})
	}
}
export default _System;