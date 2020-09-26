import ReportedContents from "./_/ReportContents/ReportedContents";

(() => {
  if (System.checkUserP(99) && location.search.includes("reported-contents")) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const reportedContents = new ReportedContents();
    const header = document.querySelector(".js-main-header");
    const subNav = document.querySelector(".header-subnav");

    if (subNav) subNav.remove();

    if (header) {
      header.classList.add("sg-header--to-front");
      header.classList.remove("sg-header--fixed");
    }
  }
})();
