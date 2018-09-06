import ext from "./ext";
console.log(ext);
ext.runtime.sendMessage({ action: "manifest" }, function(res) {
	console.log(res);
})