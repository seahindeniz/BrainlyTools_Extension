import ext from "./ext";

//module.exports = (ext.storage.sync ? ext.storage.sync : ext.storage.local);
const storageS = ext.storage.sync,
	storageL = ext.storage.local;

const storage = {
	get: ({ marketKey, data, callback, local }) => {
		let db = local ? storageL : storageS;

		db.get(marketKey, res => {
			let _res = {};

			if (Object.prototype.toString.call(data) === "[object Array]") {
				for (let i = 0, obj;
					(obj = data[i]); i++) {
					if (res[marketKey])
						_res[obj] = res[marketKey][obj];
				}
			} else if (typeof data === "string") {
				if (res[marketKey])
					_res = res[marketKey][data];
			}

			callback && callback(_res);
		});
	},
	set: ({ marketKey, data, callback, local }) => {
		let db = local ? storageL : storageS;

		db.get(marketKey, res => {
			let dataStorage = {
				[marketKey]:{ ...res[marketKey], ...data }
			};
			//dataStorage[marketKey] = { ...res[marketKey], ...data };

			db.set(dataStorage, res => {
				callback && callback(res);
			});
		});
	},
	remove: ({ marketKey, data, callback, local }) => {
		let db = local ? storageL : storageS;

		db.remove(marketKey, data, res => {
			callback && callback(res);
		});
	}
};

export default storage
