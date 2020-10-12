import CreateElement from "@components/CreateElement";
import generateRandomString from "@root/helpers/generateRandomString";
import { Label } from "@style-guide";
import classnames from "classnames";
import type { CommonComponentPropsType } from "./helpers/SetProps";
import type { LabelPropsType } from "./Label";

type RadioSizeType = "xxs" | "s";

type RadioPropsType = {
  checked?: boolean;
  name?: string;
  size?: RadioSizeType;
  className?: string;
  id?: string;
  label?: LabelPropsType;
} & CommonComponentPropsType;

const SG = "sg-radio";
const SGD = `${SG}--`;
// const event = new Event("change");

export default class Radio {
  element: HTMLDivElement | HTMLLabelElement;
  ghost: HTMLLabelElement;
  input: HTMLInputElement;
  label: Label;

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
      onChange: props.onChange,
    });

    delete props.onChange;

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

    if (label) {
      this.label = new Label({
        tag: "label",
        ...label,
        icon: this.element,
        htmlFor: id || undefined,
        type: "transparent",
      });
      this.element = this.label.element;
    }
  }

  get checked() {
    return this.input.checked;
  }

  set checked(state) {
    this.input.checked = state;

    // this.input.dispatchEvent(event);
  }
}
