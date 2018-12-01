import Request from "../../../controllers/Request";
import WaitForObject from "../../../helpers/WaitForObject";

/**
 * 
 * @param {function} resolve 
 * @param {function} reject 
 */
async function processDefaultConfig(reject, resolve) {
	let _Routing = await WaitForObject("Routing");

	if (_Routing && _Routing.b && _Routing.b.prefix && _Routing.d && _Routing.d.c) {
		System.data.Brainly.defaultConfig = window.__default_config;
		System.data.Brainly.defaultConfig.user.ME = JSON.parse(System.data.Brainly.defaultConfig.user.ME);
		System.data.Brainly.Routing.prefix = _Routing.b.prefix;
		System.data.Brainly.Routing.routes = _Routing.d.c;

		localStorage.setObject("_Routing", System.data.Brainly.Routing);
		localStorage.setObject("__default_config", System.data.Brainly.defaultConfig);
		resolve && resolve();
	} else {
		Console.error("Routing error", _Routing);
		reject && reject();
	}
}

/**
 * Fetch and prepare __default_config from Brainly
 * @param {function} resolve 
 * @param {function} reject 
 */
async function fetchDefaultConfig(reject, resolve) {
	let res = await Request.get("/question/add");

	if (res && res != "") {
		let matchConfig = (/(\{\s{1,}.*[\S\s]*\}\s{1,}\}\;)\s{1,}\<\/script/gmi).exec(res);
		let matchSecondConfig = (/\.config \= (.*)\;/gmi).exec(res);
		let matchAuthJSFile = res.match(/(\/sf\/js\/bundle\/include_auth\_[a-z\_\-]{1,}\-[a-z0-9]{1,}\.min\.js)/gmi);

		if (!matchConfig || matchConfig.length < 2) {
			Console.error("Config object not found");
			reject && reject();
		} else if (!matchSecondConfig || matchSecondConfig.length < 2) {
			Console.error("Second config object not found");
			reject && reject();
		} else if (!matchAuthJSFile || matchAuthJSFile.length < 1) {
			Console.error("Auth JS file not found");
			reject && reject();
		} else {
			System.data.Brainly.defaultConfig = new Function(`return ${matchConfig[matchConfig.length - 1]}`)();
			System.data.Brainly.defaultConfig.user.ME = JSON.parse(System.data.Brainly.defaultConfig.user.ME);
			System.data.Brainly.defaultConfig.config = JSON.parse(matchSecondConfig[matchSecondConfig.length - 1]);
			System.data.Brainly.defaultConfig.config.data.ranksWithId = {};
			System.data.Brainly.defaultConfig.config.data.ranksWithName = {};

			for (let i = 0, rank;
				(rank = System.data.Brainly.defaultConfig.config.data.ranks[i]); i++) {
				System.data.Brainly.defaultConfig.config.data.ranksWithId[rank.id] = {
					name: rank.name,
					color: rank.color,
					type: rank.type,
				};
				System.data.Brainly.defaultConfig.config.data.ranksWithName[rank.name] = {
					name: rank.name,
					color: rank.color,
					type: rank.type,
				};
			}

			window.defaultConfig = System.data.Brainly.defaultConfig;
			localStorage.setObject("__default_config", System.data.Brainly.defaultConfig);

			let resJS = await Request.get(matchAuthJSFile[matchAuthJSFile.length - 1]);

			if (resJS) {
				let matchRoutes = resJS.match(/(routes:.*scheme\:\"http\")/gmi);

				if (!matchRoutes || matchRoutes.length < 1) {
					Console.error("Routes not found", resJS);
					reject && reject();
				} else {
					let _Routing = new Function(`return {${matchRoutes[matchRoutes.length - 1]}}`)();
					System.data.Brainly.Routing.prefix = _Routing.prefix;
					System.data.Brainly.Routing.routes = _Routing.routes;

					localStorage.setObject("_Routing", System.data.Brainly.Routing);
					resolve && resolve();
				}
			}
		}
	}
}

/**
 * Get and set [Routing, __default_config] from storage or fetching from Brainly
 */
export default function SetBrainlyData() {
	return new Promise((resolve, reject) => {
		let localRouting = localStorage.getObject("_Routing");
		let __default_config = localStorage.getObject("__default_config");

		if (localRouting && __default_config) {
			System.data.Brainly.Routing = localRouting;
			window.defaultConfig = System.data.Brainly.defaultConfig = __default_config;

			resolve();

			if (document.head.innerHTML.match(/__default_config/gmi)) {
				processDefaultConfig()
			} else {
				fetchDefaultConfig();
			}
		} else if (document.head.innerHTML.match(/__default_config/gmi)) {
			processDefaultConfig(reject, resolve)
		} else {
			fetchDefaultConfig(reject, resolve);
		}
	});
}
