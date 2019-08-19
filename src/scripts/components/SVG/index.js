import template from "backtick-template";
import IconsContent from "./_/icons.html";

export default function InjectIcons() {
  var svgWrapper = document.createElement('div');
  svgWrapper.style.display = 'none';
  svgWrapper.innerHTML = template(IconsContent);


  document.body.insertBefore(svgWrapper, document.body.firstChild);
}
