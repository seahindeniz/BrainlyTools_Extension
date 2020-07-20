import { Flex, Icon, Text } from "@style-guide";
import AddChildren from "@style-guide/helpers/AddChildren";
import classnames from "classnames";
import Build from "../../helpers/Build";
import SetProps from "./helpers/SetProps";

/**
 * @typedef {"success" | "error" | "info"} Type - Default is blue
 * @typedef {{
 * text?: string,
 * html?: string,
 * type?: Type,
 * className?: string,
 * noIcon?: boolean,
 * }} Properties
 */
const SG = "sg-flash__message";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default ({
  text,
  html,
  type,
  className,
  noIcon,
  children,
  ...props
} = {}) => {
  const messageClass = classnames(
    SG,
    {
      [SGD + type]: type,
    },
    className,
  );

  const flash = document.createElement("div");
  flash.className = "sg-flash";

  SetProps(flash, props);

  let message = document.createElement("div");
  message.className = messageClass;

  const textElement = Text({
    html,
    text,
    size: "small",
    weight: "bold",
    align: "CENTER",
  });

  if (noIcon) AddChildren(message, [textElement, children]);
  else
    message = Build(message, [
      [
        Flex({
          fullWidth: true,
          direction: "row",
          alignItems: "center",
          justifyContent: "center",
        }),
        [
          [
            Flex({
              marginRight: "s",
              marginBottom: "xxs",
            }),
            new Icon({
              size: 22,
              type: "ext-icon",
            }),
          ],
          [Flex({ direction: "column" }), [textElement, children]],
        ],
      ],
    ]);

  flash.appendChild(message);

  return flash;
};
