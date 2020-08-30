import classnames from "classnames";
import generateRandomString from "@root/helpers/generateRandomString";
import CreateElement from "@components/CreateElement";
import Icon from "./Icon";

export type CheckboxPropsType = {
  checked?: boolean;
  id?: string;
  className?: string;
};

export type CheckboxElementType = HTMLDivElement & {
  inputId: string;
  ChangeId: (id: string) => CheckboxElementType;
};

const SG = "sg-checkbox";
const SGL = `${SG}__`;

function ChangeId(this: CheckboxElementType, id: string) {
  const input = this.querySelector("input");
  const label = this.querySelector("label");
  input.id = id;
  this.inputId = id;
  label.htmlFor = id;

  return this;
}

export default ({
  checked,
  id = generateRandomString(),
  className,
  ...props
}: CheckboxPropsType = {}): CheckboxElementType => {
  const checkboxClass = classnames(SG, className);

  const inputElement = CreateElement({
    tag: "input",
    type: "checkbox",
    checked,
    className: `${SGL}element`,
    id: id || undefined,
    ...props,
  });

  const icon = new Icon({
    type: "check",
    color: "adaptive",
    size: 16,
  });

  const labelElement = CreateElement({
    tag: "label",
    className: `${SGL}ghost`,
    htmlFor: id || undefined,
    children: icon.element,
  });

  // @ts-expect-error
  const container: CheckboxElementType = CreateElement({
    tag: "div",
    className: checkboxClass,
    children: [inputElement, labelElement],
    inputId: id || undefined,
    ChangeId,
  });

  return container;
};
