import ext from "../../utils/ext";

export default callback => {
	ext.tabs.query({}, function(tabs) {
		for (var i = 0; i < tabs.length; ++i) {
			if (System.regexp_BrainlyMarkets.test(tabs[i].url)) {
				callback(tabs[i]);
			}
		}
	});
}
