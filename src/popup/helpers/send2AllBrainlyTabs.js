import ext from "../../scripts/utils/ext";

export default (action, data, callback) => {
	console.log((action, data, callback));
	ext.tabs.query({}, function(tabs) {
		for (var i = 0; i < tabs.length; ++i) {
			if (System.regexp_BrainlyMarkets.test(tabs[i].url)) {
				let tab = tabs[i];
				var message = {
					action,
					url: tab.url,
					data
				};
				
				ext.tabs.sendMessage(tab.id, message, callback);
			}
		}
	});
}
