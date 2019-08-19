import classnames from 'classnames';
import Icon from './Icon';
import Text from './Text';
import ActionList from './ActionList';
import Build from '../../helpers/Build';
import { ActionListHole } from '.';

/**
 * @typedef {"success" | "error" | "info"} Type - Default is blue
 * @typedef {{text?: string, html?: string, type?: Type, className?: string, noIcon?: boolean}} Properties
 */
const SG = "sg-flash__message";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default function({ text, html, type, className, noIcon, ...props } = {}) {
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
    weight: "bold"
  });

  if (noIcon)
    message.appendChild(textElement);
  else
    message = Build(message, [
      [
        ActionList({
          direction: "centered",
          noWrap: true
        }), [
          [
            ActionListHole(),
            Icon({
              type: "ext-icon"
            })
          ],
          [
            ActionListHole({
              toEnd: true
            }),
            textElement
          ]
        ]
      ]
    ]);

  flash.appendChild(message);

  /* let textElement = Label({
    html,
    text,
    icon: {
      type: "ext-icon"
    }
  });
  let extensionIcon = Icon({
    type: "ext-icon"
  });

  message.appendChild(extensionIcon);

  let textElement = Text({
    html,
    text
  });

  message.appendChild(textElement); */

  return flash;
}
