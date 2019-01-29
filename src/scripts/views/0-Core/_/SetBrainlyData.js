import Request from "../../../controllers/Request";
import WaitForObject from "../../../helpers/WaitForObject";

let RoutesFetchURL;

/**
 * Get and set [Routing, __default_config] from storage or fetching from Brainly
 */
export default async function SetBrainlyData() {
	let routing = localStorage.getObject("Routing");
	let defaultConfig = localStorage.getObject("__default_config");

	if (!routing || !defaultConfig) {
		defaultConfig = await GetDefaultConfig();
		routing = await GetRoutingData();
	} else {
		(async () => {
			await GetDefaultConfig();
			GetRoutingData();
		})();
	}

	if (!routing.prefix) {
		routing.prefix = routing.b.prefix;
		routing.routes = routing.d.c;
	}
	System.data.Brainly.Routing = routing;
	System.data.Brainly.defaultConfig = defaultConfig;

	Console.info("SetBrainlyData OK!");
	return true;
}

async function GetDefaultConfig() {
	let defaultConfig;

	if (document.head.innerHTML.match(/__default_config/gmi)) {
		defaultConfig = await WaitForObject("__default_config");
	} else {
		defaultConfig = await FetchDefaultConfig();
	}

	localStorage.setObject("__default_config", defaultConfig);

	return defaultConfig;
}

function FetchDefaultConfig() {
	return new Promise(async (resolve, reject) => {
		let sourcePageHTML = await Request.get("/question/add");

		//console.log("res:", res);
		if (sourcePageHTML && sourcePageHTML != "") {
			let matchConfig = (/(\{\s{1,}.*[\S\s]*\}\s{1,}\}\;)\s{1,}\<\/script/gmi).exec(sourcePageHTML);
			let matchSecondConfig = (/\.config \= (.*)\;/gmi).exec(sourcePageHTML);
			let matchAuthJSFile = sourcePageHTML.match(/(\/sf\/js\/bundle\/include_auth\_[a-z\_\-]{1,}\-[a-z0-9]{1,}\.min\.js)/gmi);
			RoutesFetchURL = matchAuthJSFile[matchAuthJSFile.length - 1];
			//RoutesFetchURL = ExtractRoutesFetchURL(res);

			if (!matchConfig || matchConfig.length < 2) {
				reject("Config object not found");
			} else if (!matchSecondConfig || matchSecondConfig.length < 2) {
				reject("Second config object not found");
			} else if (!RoutesFetchURL) {
				reject("Routes URL not found");
			} else {
				resolve(ProcessDefaultConfigData(matchConfig[matchConfig.length - 1], matchSecondConfig[matchSecondConfig.length - 1]));
			}
		}
	});
}

function ExtractRoutesFetchURL(source) {
	let url;

	if (source) {
		let matchAuthJSFile = source.match(/(\/sf\/js\/bundle\/include_auth\_[a-z\_\-]{1,}\-[a-z0-9]{1,}\.min\.js)/gmi);
		url = matchAuthJSFile[matchAuthJSFile.length - 1];
	} else {
		let RoutingContainerMatch = Array.from(document.scripts).find(script => script.src.match(/__vendors|include_main_/gmi));
		console.log("RoutingContainerMatch:", RoutingContainerMatch);

		if (RoutingContainerMatch) {
			url = RoutingContainerMatch.src;
		}
	}

	return url;
}

function ProcessDefaultConfigData(first, second) {
	System.data.Brainly.defaultConfig = new Function(`return ${first}`)();
	System.data.Brainly.defaultConfig.user.ME = JSON.parse(System.data.Brainly.defaultConfig.user.ME);
	System.data.Brainly.defaultConfig.config = JSON.parse(second);
	System.data.Brainly.defaultConfig.config.data.ranksWithId = {};
	System.data.Brainly.defaultConfig.config.data.ranksWithName = {};

	System.data.Brainly.defaultConfig.config.data.ranks.forEach(rank => {
		System.data.Brainly.defaultConfig.config.data.ranksWithId[rank.id] = {
			name: rank.name,
			color: rank.color,
			type: rank.type,
			description: rank.description
		};
		System.data.Brainly.defaultConfig.config.data.ranksWithName[rank.name] = {
			name: rank.name,
			color: rank.color,
			type: rank.type,
			description: rank.description
		};
	});

	return System.data.Brainly.defaultConfig;
}

async function GetRoutingData() {
	let routing;
	//let RoutingContainerMatch = Array.from(document.scripts).find(script => script.src.match(/__vendors|include_main_/gmi));
	//console.log("document.body.innerHTML.match(/__vendors|include_main_/gmi):", document.body.innerHTML.match(/__vendors|include_main_/gmi));
	if (!RoutesFetchURL) {
		routing = await WaitForObject("Routing");
	} else {
		routing = await FetchRouting();
	}

	localStorage.setObject("Routing", routing);

	return routing;
}

async function FetchRouting() {
	let resJS = await Request.get(RoutesFetchURL);

	if (resJS) {
		let matchRoutes = resJS.match(/(routes:.*scheme\:\"http\")/gmi);

		if (!matchRoutes || matchRoutes.length < 1) {
			throw new Error("Routes not found", resJS);
		} else {
			let routing = new Function(`return {${matchRoutes[matchRoutes.length - 1]}}`)();

			return routing;
		}
	}
}
