import ext from "../../scripts/utils/1.ext";

export default async (action, data) => {
	let tabs = await ext.tabs.query({});

	tabs.forEach(tab => {
		if (System.regexp_BrainlyMarkets.test(tab.url)) {
			let message = {
				action,
				url: tab.url,
				data
			};

			ext.tabs.sendMessage(tab.id, message);
		}
	});
}
