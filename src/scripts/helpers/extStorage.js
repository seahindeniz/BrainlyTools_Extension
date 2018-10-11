import ext from "../utils/ext";
let marketKeyFn = () => {
	let result = false;

	if (System.data.meta.marketName == "")
		console.error("Cannot get marketName");
	else if (!((window.dataLayer && window.dataLayer.length > 0 && window.dataLayer[0].user.id) || System.data.Brainly.userData.user.id))
		console.error("Cannot get user id");
	else
		result = System.data.meta.marketName + "_" + ((window.dataLayer && window.dataLayer.length > 0 && window.dataLayer[0].user.id) || System.data.Brainly.userData.user.id);

	return result;
};
const Storage = {
	set: (key, callback = () => {}) => {
		let marketKey = marketKeyFn();
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storageSet", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageSet", marketKey, data: key }, callback);
	},
	get: (key, callback) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageGet", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storageGet", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageGet", marketKey, data: key }, callback);
	},
	remove: (key, callback) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageRemove", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storageRemove", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageRemove", marketKey, data: key }, callback);
	},
	setL: (key, callback = () => {}) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageSetL", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storageSetL", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageSetL", marketKey, data: key }, callback);
	},
	getL: (key, callback) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageGetL", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storageGetL", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageGetL", marketKey, data: key }, callback);
	},
	removeL: (key, callback) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageRemoveL", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storageRemoveL", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageRemoveL", marketKey, data: key }, callback);
	}
}
export default Storage;
