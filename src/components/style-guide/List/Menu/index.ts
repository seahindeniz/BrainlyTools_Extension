import CreateElement from "@components/CreateElement";
import clsx from "clsx";
import MenuListItem, { MenuItemPropsType } from "./Item";

type MenuSizeType = "small" | "normal" | "large";

type MenuPropsType = {
  items?: MenuItemPropsType[];
  size?: MenuSizeType;
  className?: string;
};

const SG = "sg-menu-list";
const SGD = `${SG}--`;

export default ({
  items,
  size = "normal",
  className,
  ...props
}: MenuPropsType = {}) => {
  const listClass = clsx(
    SG,
    {
      [SGD + size]: size !== "normal",
    },
    className,
  );

  return CreateElement({
    tag: "ul",
    className: listClass,
    children: items?.map(item => MenuListItem(item)),
    ...props,
  });
};
