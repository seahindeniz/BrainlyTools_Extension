export default (start, end) => {
	start = ~~start;
	end = ~~end;
	
	if (start < end) {
		return (new Array(end - start + 1)).fill().map((_, i) => i + start)
	} else {
		return (new Array(start - end + 1)).fill().map((_, i) => start - i)
	}
}
