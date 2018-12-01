import WaitForObject from "./WaitForObject";

async function injectIt(path, attachExtensionId, resolve, reject) {
	console.log(path, attachExtensionId);
	let fileName = path.split(".");

	if (fileName.length < 2) {
		console.error("Injected file name is incorrect: ", path);
		reject();
	} else {
		let extensionURL,
			fileExtension = [...fileName].pop();

		if (System && System.data.meta && System.data.meta.extension) {
			extensionURL = System.data.meta.extension.URL
		} else {
			console.warn("Be warned, no extension System class found");
			extensionURL = "chrome-extension://" + chrome.runtime.id
		}

		let pathFixed = extensionURL + path;

		if (path.indexOf("http") >= 0) {
			pathFixed = path;
		}

		if (fileExtension == "json") {
			fetch(pathFixed)
				.then(res => res.json())
				.then(resolve)
				.catch(resolve);
		}
		if (fileExtension == "yml") {
			fetch(pathFixed)
				.then(res => res.text())
				.then(resolve)
				.catch(resolve);
		}
		if (fileExtension == "js" || fileExtension == "ext_js") {
			let DOM = document.documentElement;
			let script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', pathFixed);

			if (attachExtensionId) {
				script.setAttribute('extension_URL', chrome.runtime.id || add_ext_id);
			}

			if (DOM) {
				DOM.appendChild(script)
			}

			resolve(script);
		}
		if (fileExtension == "css" || fileExtension == "ext_css") {
			let link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');
			link.setAttribute('href', pathFixed);

			let target;
			if (fileExtension == "css") {
				target = await WaitForObject("document.head");

				target && target.prepend(link);
			} else {
				target = document.documentElement;

				target && target.appendChild(link);
			}
		}
	}
}

/**
 * Injects a script into DOM
 * @param {(string|string[])} filePath - Path of inject file
 * @param {boolean} attachExtensionId - To adding an attribute contains the id key of the extension
 * @returns {Promise} - Check whether if file injected or not 
 **/
export default function Inject2Body(filePath, attachExtensionId) {
	return new Promise(function(resolve, reject) {
		if (!filePath || filePath.length == 0) {
			console.error("File path is required");
			reject();
		} else {
			if (typeof filePath == "string") {
				injectIt(filePath, attachExtensionId, resolve, reject);
			} else {
				for (let i = 0, path;
					(path = filePath[i]); i++) {
					injectIt(path, attachExtensionId, resolve, reject);
				}
			}
		}
	});
}
