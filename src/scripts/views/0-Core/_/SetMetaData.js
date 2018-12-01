import PrepareDeleteReasons from "../../../controllers/PrepareDeleteReasons";

const MetaGet = function() {
	return new Promise(function(resolve, reject) {
		var evtMetaGet = new Event("metaGet", { "bubbles": true, "cancelable": false });

		document.dispatchEvent(evtMetaGet);
		window.addEventListener('message', async e => {
			if (!e) {
				reject(null);
			} else if (e.data.action == "metaSet") {
				resolve(e.data.data)
			} else if (e.data.action == "shareGatheredData2Background") {
				await PrepareDeleteReasons();
				System.shareGatheredData2Background(() => {
					var evtSharingDone = new Event("shareGatheredData2BackgroundDone", { "bubbles": true, "cancelable": false });
					document.dispatchEvent(evtSharingDone);
				});
			}
		});
	})
};

export default async function setMetaData() {
	const scriptSrc = document.currentScript.src;
	System.data.meta = await MetaGet();

	return new Promise(function(resolve) {
		let extension_URL = new URL(scriptSrc);
		System.data.meta = {
			marketTitle: document.title,
			extension: {
				id: extension_URL.host,
				URL: extension_URL.origin
			},
			...System.data.meta
		}

		resolve();
	});
}
