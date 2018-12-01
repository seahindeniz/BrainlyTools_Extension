import ext from "../utils/ext";
import marketKeyFn from "./marketKey";

const Storage = {
	set: (key, callback = () => {}) => {
		let marketKey = marketKeyFn();
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storage_set", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storage_set", marketKey, data: key }, callback);
	},
	get: (key, callback) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageGet", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storage_get", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storage_get", marketKey, data: key }, callback);
	},
	remove: (key, callback) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageRemove", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storage_remove", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storage_remove", marketKey, data: key }, callback);
	},
	setL: (key, callback = () => {}) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageSetL", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storage_setL", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storage_setL", marketKey, data: key }, callback);
	},
	getL: (key, callback) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageGetL", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storage_getL", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storage_getL", marketKey, data: key }, callback);
	},
	removeL: (key, callback) => {
		let marketKey = marketKeyFn();
		//ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storageRemoveL", marketKey, data: key }, callback);
		if (ext.storage)
			ext.runtime.sendMessage({ action: "storage_removeL", marketKey, data: key }, callback);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action: "storage_removeL", marketKey, data: key }, callback);
	}
}
export default Storage;
