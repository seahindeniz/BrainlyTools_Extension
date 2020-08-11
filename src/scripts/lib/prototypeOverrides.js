Storage.prototype.setObject = function (key, value) {
	if (typeof value === 'string') {
		value = JSON.parse2(value);
	}
	this.setItem(key, JSON.stringify(value));
};
Storage.prototype.getObject = function (key) {
	let value = this.getItem(key);
	//console.log(value, typeof value, typeof value !== "undefined");
	if (value === "undefined") {
		value = null;
	}
	if (typeof value !== "undefined" && value) {
		try {
			return JSON.parse(value);
		}
		catch (err) {
			console.log("JSON parse failed for lookup of ", key, "\n error was: ", err);
			console.trace();
			return null;
		}
	}
	else
		return value;
};