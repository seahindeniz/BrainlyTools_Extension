const CSS = `
#main-content {
  max-width: unset;
}

.js-aside-content {
  display: none;
}

.js-react-great-job-modal {
  display: none !important;
}
`;

export default async function ElementCleanerForFreelancer() {
  const cssNode = document.createTextNode(CSS);
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";

  styleElement.append(cssNode);
  document.head.append(styleElement);
}
