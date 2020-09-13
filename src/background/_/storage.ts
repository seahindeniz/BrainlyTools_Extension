import ext from "webextension-polyfill";

// module.exports = (ext.storage.sync ? ext.storage.sync : ext.storage.local);
const storageS = ext.storage.sync;
const storageL = ext.storage.local;

const storage = {
  get: async ({ marketKey, data, local }) => {
    const db = local ? storageL : storageS;

    const resDB = await db.get(marketKey);
    let result = {};

    if (Object.prototype.toString.call(data) === "[object Array]") {
      for (let i = 0, obj; (obj = data[i]); i++) {
        if (resDB[marketKey]) result[obj] = resDB[marketKey][obj];
      }
    } else if (typeof data === "string") {
      if (resDB[marketKey]) result = resDB[marketKey][data];
    }

    return result;
  },
  set: async ({ marketKey, data, local }) => {
    const db = local ? storageL : storageS;

    const resGet = await db.get(marketKey);
    const dataStorage = {
      [marketKey]: { ...resGet[marketKey], ...data },
    };
    // dataStorage[marketKey] = { ...res[marketKey], ...data };

    const res = await db.set(dataStorage);

    return res;
  },
  remove: async ({ marketKey, data, local }) => {
    const db = local ? storageL : storageS;

    // TODO Test this
    // @ts-expect-error
    const res = await db.remove(marketKey, data);

    return res;
  },
};

export default storage;
