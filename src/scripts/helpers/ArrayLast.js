function ArrayLast() {
	Array.prototype.last = function() { return this[this.length - 1]; }
}

export default ArrayLast()
