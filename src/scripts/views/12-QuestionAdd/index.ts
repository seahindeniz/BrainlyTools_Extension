// @flow
import ReportedContents from "./_/ReportContents/ReportedContents";

(() => {
  if (location.hash === "#reported-contents") {
    // eslint-disable-next-line no-unused-vars
    const reportedContents = new ReportedContents();
    const fixedBanner = document.querySelector(".js-web-to-app-banner");
    const header = document.querySelector(".js-main-header");

    if (fixedBanner) fixedBanner.remove();

    if (header) {
      header.classList.add("sg-header--to-front");
      header.classList.remove("sg-header--fixed");
    }
  }
})();
