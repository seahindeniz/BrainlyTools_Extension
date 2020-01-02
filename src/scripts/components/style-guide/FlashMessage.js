import classnames from 'classnames';
import Build from '../../helpers/Build';
import Flex from './Flex';
import Icon from './Icon';
import Text from './Text';

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
export default function({
  text,
  html,
  type,
  className,
  noIcon,
  ...props
} = {}) {
  const messageClass = classnames(SG, {
    [SGD + type]: type
  }, className);

  let flash = document.createElement("div");
  flash.className = "sg-flash";

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      flash[propName] = propVal;

  let message = document.createElement("div");
  message.className = messageClass;

  let textElement = Text({
    html,
    text,
    size: "small",
    weight: "bold",
    align: "CENTER",
  });

  if (noIcon)
    message.appendChild(textElement);
  else
    message = Build(message, [
      [
        Flex({
          fullWidth: true,
          alignItems: "center",
          direction: "row",
          justifyContent: "center",
        }),
        [
          [
            Flex({
              marginRight: "xs",
            }),
            Icon({
              type: "ext-icon"
            })
          ],
          textElement
        ]
      ]
    ]);

  flash.appendChild(message);

  return flash;
}
