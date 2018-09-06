/**
 * Injects a script into DOM
 * @param {(string|Object[])} file_paths - Path of inject file
 * @param {boolean} add_ext_id - If its needed, add the extension id into element props
 * @returns {boolean} - Check whether if file injected or not 
**/
let inject_it = function (file_paths, add_ext_id) {
	let elm;
	let injected;
	let _return = true;

	if (!file_paths || file_paths.length === 0) {
		console.error("File path is required");
		_return= false;
	} else {
		if (typeof file_paths == "string") {
			file_paths = [file_paths];
		}
		for (let i = 0, file_path; (file_path = file_paths[i]); i++) {
			let file_name = file_path.split(".");
			if (file_name.length < 2) {
				console.error("Injected file name is incorrect: ", file_path);
				_return= false;
			}
			else {
				let extension_URL;
				if (typeof System != "undefined" && System.data.meta && System.data.meta.extension) {
					extension_URL = System.data.meta.extension.URL
				} else {
					console.warn("manuelly create extension url");
					extension_URL = "chrome-extension://" + chrome.runtime.id
				}
				let file_ext = file_name.pop(),
					file_path_fixed = extension_URL + file_path;
				switch (file_ext) {
					case "js":
						elm = document.documentElement;
						injected = document.createElement('script');
						injected.setAttribute('type', 'text/javascript');
						injected.setAttribute('src', file_path_fixed);
						if (typeof add_ext_id === "function") {
							injected.onload = function () {
								add_ext_id();
							};
						}
						break;
					case "css":
						elm = document.head;
						injected = document.createElement('link');
						injected.setAttribute('rel', 'stylesheet');
						injected.setAttribute('type', 'text/css');
						injected.setAttribute('href', file_path_fixed);
						break;
				}
				if (add_ext_id && typeof add_ext_id !== "function") {
					//noinspection JSUnresolvedVariable
					injected.setAttribute('extension_URL', chrome.runtime.id || add_ext_id);
				}
				elm && elm.appendChild(injected);
			}
		}
	}
	
	return _return;
};

export default inject_it;