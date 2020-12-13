import classnames from "classnames";
import CreateElement from "@components/CreateElement";
import generateRandomString from "@root/helpers/generateRandomString";
import Icon from "./Icon";
import { CommonComponentPropsType } from "./helpers/SetProps";

export type CheckboxPropsType = {
  checked?: boolean;
  id?: string;
  className?: string;
} & CommonComponentPropsType;

const SG = "sg-checkbox";
const SGL = `${SG}__`;

export default class Checkbox {
  input: HTMLInputElement;
  icon: Icon;
  label: HTMLLabelElement;
  element: HTMLDivElement;
  inputId: string;

  constructor({
    checked,
    id = generateRandomString(),
    className,
    ...props
  }: CheckboxPropsType = {}) {
    const checkboxClass = classnames(SG, className);

    this.inputId = id;

    this.input = CreateElement({
      tag: "input",
      type: "checkbox",
      checked,
      className: `${SGL}element`,
      id: id || undefined,
      ...props,
    });

    this.icon = new Icon({
      type: "check",
      color: "adaptive",
      size: 16,
    });

    this.label = CreateElement({
      tag: "label",
      className: `${SGL}ghost`,
      htmlFor: id || undefined,
      children: this.icon.element,
    });

    this.element = CreateElement({
      tag: "div",
      className: checkboxClass,
      children: [this.input, this.label],
    });
  }

  ChangeId(id: string) {
    this.input.id = id;
    this.inputId = id;
    this.label.htmlFor = id;

    return this;
  }
}
