import ext from "./ext";

//module.exports = (ext.storage.sync ? ext.storage.sync : ext.storage.local);
const storageS = ext.storage.sync,
	storageL = ext.storage.local
export {
	storageS,
	storageL
}