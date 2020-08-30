import CreateElement from "@components/CreateElement";
import classnames from "classnames";
import generateRandomString from "@root/helpers/generateRandomString";
import type { LabelPropsType } from "./Label";
import Label from "./Label";

type RadioSizeType = "xxs" | "s";

type RadioPropsType = {
  checked?: boolean;
  name?: string;
  size?: RadioSizeType;
  className?: string;
  id?: string;
  label?: LabelPropsType;
};

const SG = "sg-radio";
const SGD = `${SG}--`;
const event = new Event("change");

export default class Radio {
  element: HTMLDivElement | HTMLLabelElement;
  ghost: HTMLLabelElement;
  input: HTMLInputElement;
  #checked: boolean;

  constructor({
    checked,
    name,
    size = "xxs",
    className,
    id = generateRandomString(),
    label,
    ...props
  }: RadioPropsType = {}) {
    const radioClass = classnames(
      SG,
      {
        [SGD + size]: size,
      },
      className,
    );

    this.input = CreateElement({
      id,
      name,
      checked,
      tag: "input",
      type: "radio",
      className: `${SG}__element`,
    });

    this.ghost = CreateElement({
      htmlFor: id,
      tag: "label",
      className: `${SG}__ghost`,
    });

    this.element = CreateElement({
      tag: "div",
      className: radioClass,
      children: [this.input, this.ghost],
      ...props,
    });

    if (label)
      this.element = Label({
        containerTag: "label",
        ...label,
        icon: this.element,
        htmlFor: id || undefined,
      });
  }

  get checked() {
    return this.#checked;
  }

  set checked(state) {
    this.#checked = state;
    this.input.checked = state;

    this.input.dispatchEvent(event);
  }
}
