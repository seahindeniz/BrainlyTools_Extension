import CreateElement from "@components/CreateElement";
import type CategoriesType from "./Categories";

export type CategoryDataType = {
  id: number;
  text: string;
  visible?: boolean;
};

export default class Category {
  main: CategoriesType;
  data: CategoryDataType;

  option: HTMLOptionElement;

  constructor(main: CategoriesType, data: CategoryDataType) {
    this.main = main;
    this.data = data;

    this.Render();
  }

  Render() {
    this.option = CreateElement({
      tag: "option",
      children: this.data.text,
    });
  }

  Selected() {
    console.log(this);
    // this.main;
  }
}
