import { Button, Flex } from "@/scripts/components/style-guide";
import InsertAfter from "@/scripts/helpers/InsertAfter";
import WaitForElements from "@/scripts/helpers/WaitForElements";

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

  let mainHeaders = await WaitForElements(".js-main-header");
  let mainHeader = mainHeaders[0];

  let button = Button({
    type: "solid-blue",
    html: main.data.groupData.button_content,
    icon: main.data.groupData.button_icon
  });

  button.addEventListener("click", () => ButtonClicked(main));

  let buttonContainer = Flex({
    children: button,
    className: "freelancerButton",
  });

  InsertAfter(buttonContainer, mainHeader);
}

/**
 * @param {import("./").default} main
 */
function ButtonClicked(main) {
  System.toBackground("switch or open tab", main.data.groupData.button_link);
}
