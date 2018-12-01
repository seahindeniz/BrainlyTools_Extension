import ext from "../utils/ext";

/**
 * 
 * @param {string} target - Target of storage name. The get is sync memory, getL is local memory [get, getL, set, setL, remove, removeL]
 * @param {string|string[]|Object} key 
 * @return {promise}
 */
export default function storage(action, key) {
	const marketKey = window.System.data.meta.storageKey;

	return new Promise(function(resolve, reject) {
		action = "storage_" + action;

		if (ext.storage)
			ext.runtime.sendMessage({ action, marketKey, data }, resolve);
		else
			ext.runtime.sendMessage(System.data.meta.extension.id, { action, marketKey, data: key }, resolve);
	});
}
