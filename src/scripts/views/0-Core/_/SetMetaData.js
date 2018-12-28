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
			} else if (e.data.action == "DOM>Share System.data to background.js") {
				await PrepareDeleteReasons(true);
				await System.ShareSystemDataToBackground();

				var evtSharingDone = new Event("contentscript>Share System.data to background.js:DONE", { "bubbles": true, "cancelable": false });
				document.dispatchEvent(evtSharingDone);
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
