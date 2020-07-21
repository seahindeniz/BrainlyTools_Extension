// @flow

import { Flex, Icon, Text } from "@style-guide";
import AddChildren, {
  type ChildrenParamType,
} from "@style-guide/helpers/AddChildren";
import classnames from "classnames";
import Build from "../../helpers/Build";
import SetProps from "./helpers/SetProps";

const SG = "sg-flash__message";
const SGD = `${SG}--`;

type FlashMessageTypeType = "success" | "error" | "info";

export type FlashMessageProps = {
  text?: string,
  html?: string,
  type?: FlashMessageTypeType,
  className?: string,
  noIcon?: boolean,
  children?: ChildrenParamType,
};
export default ({
  text,
  html,
  type,
  className,
  noIcon,
  children,
  ...props
}: FlashMessageProps = {}) => {
  const messageClass = classnames(
    SG,
    {
      [SGD + String(type)]: type,
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

  if (noIcon) {
    AddChildren(message, textElement);

    if (children) AddChildren(message, children);
  } else
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
