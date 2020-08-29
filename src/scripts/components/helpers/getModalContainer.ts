export default function getModalContainer() {
  let modalContainer = document.querySelector(".js-modal-container");

  if (!modalContainer) {
    modalContainer = document.createElement("div");
    modalContainer.className = "js-modal-container";

    if (document.body) document.body.appendChild(modalContainer);
  }

  return modalContainer as HTMLDivElement;
}
