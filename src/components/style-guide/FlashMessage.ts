import { Flex, Icon, Text } from "@style-guide";
import AddChildren, {
  ChildrenParamType,
} from "@style-guide/helpers/AddChildren";
import classNames from "classnames";
import Build from "@root/helpers/Build";
import CreateElement from "@components/CreateElement";

const SG = "sg-flash__message";
const SGD = `${SG}--`;

export type FlashMessageTypeType = "success" | "error" | "info";

export type FlashMessageProps = {
  text?: ChildrenParamType;
  html?: string;
  type?: FlashMessageTypeType;
  className?: string;
  noIcon?: boolean;
  children?: ChildrenParamType;
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
  const messageClass = classNames(
    SG,
    {
      [SGD + String(type)]: type,
    },
    className,
  );

  const flash = CreateElement({
    tag: "div",
    className: "sg-flash",
    ...props,
  });

  if (typeof text === "string") {
    // eslint-disable-next-line no-param-reassign
    text = text.replace(/\n/g, "<br>");
  }

  const textElement = Text({
    html,
    text,
    size: "small",
    weight: "bold",
    align: "CENTER",
  });

  let message = CreateElement({
    tag: "div",
    className: messageClass,
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
              size: 24,
              type: "ext-icon",
            }),
          ],
          Flex({ direction: "column", children: [textElement, children] }),
        ],
      ],
    ]);

  flash.appendChild(message);

  return flash;
};
