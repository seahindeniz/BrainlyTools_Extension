function ScrollToDown(element) {
  if (element) {
    const loopScroll = setInterval(() => {
      element.scrollTop = 1e9;

      if (element.scrollTop > 0) clearInterval(loopScroll);
    });
  }
}

export default ScrollToDown;
