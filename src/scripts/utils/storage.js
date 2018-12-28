import ext from "./ext";

//module.exports = (ext.storage.sync ? ext.storage.sync : ext.storage.local);
const storageS = ext.storage.sync,
	storageL = ext.storage.local;

const storage = {
	get: ({ marketKey, data, local }) => {
		return new Promise(async (resolve, reject) => {
			try {
				let db = local ? storageL : storageS;

				let res = await db.get(marketKey);
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

				resolve(_res)
			} catch (error) {
				reject(error);
			}
		});
	},
	set: ({ marketKey, data, local }) => {
		return new Promise(async (resolve, reject) => {
			try {
				let db = local ? storageL : storageS;

				let resGet = await db.get(marketKey);
				let dataStorage = {
					[marketKey]: { ...resGet[marketKey], ...data }
				};
				//dataStorage[marketKey] = { ...res[marketKey], ...data };

				let res = await db.set(dataStorage);

				resolve(res);
			} catch (error) {
				reject(error);
			}
		});
	},
	remove: ({ marketKey, data, local }) => {
		return new Promise(async (resolve, reject) => {
			try {
				let db = local ? storageL : storageS;

				let res = await db.remove(marketKey, data);

				resolve(res);
			} catch (error) {
				reject(error);
			}
		});
	}
};

export default storage
