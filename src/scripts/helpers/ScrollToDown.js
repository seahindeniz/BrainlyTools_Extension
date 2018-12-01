function ScrollToDown(element) {
	if (element) {
		let __loop_scroll = setInterval(() => {
			element.scrollTop = 1E9;

			if (element.scrollTop > 0)
				clearInterval(__loop_scroll);
		});
	}
}

export default ScrollToDown;
