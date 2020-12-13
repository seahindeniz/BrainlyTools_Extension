// @ts-expect-error
import IconsContent from "./_/icons.html";

export default function InjectIcons() {
  const svgWrapper = document.createElement("div");

  svgWrapper.style.display = "none";
  svgWrapper.innerHTML = IconsContent;

  document.body.insertBefore(svgWrapper, document.body.firstChild);
}
