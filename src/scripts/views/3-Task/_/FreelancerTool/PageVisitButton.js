import { Button, Flex, Icon } from "@/scripts/components/style-guide";
import InsertAfter from "@/scripts/helpers/InsertAfter";
import WaitForElements from "@/scripts/helpers/WaitForElements";

/**
 * @param {import("./").default} main
 */
function ButtonClicked(main) {
  System.toBackground("switch or open tab", main.data.groupData.button_link);
}

/**
 * @param {import("./").default} main
 */
export default async function PageVisitButton(main) {
  if (
    !main.data.groupData ||
    !main.data.groupData.button_content ||
    !main.data.groupData.button_link
  )
    return;

  const mainHeaders = await WaitForElements(".js-main-header");
  const mainHeader = mainHeaders[0];

  const button = new Button({
    type: "solid-blue",
    html: main.data.groupData.button_content,
    icon: new Icon({
      type: main.data.groupData.button_icon,
    }),
  });

  button.element.addEventListener("click", () => ButtonClicked(main));

  const buttonContainer = Flex({
    children: button,
    className: "freelancerButton",
  });

  InsertAfter(buttonContainer, mainHeader);
}
