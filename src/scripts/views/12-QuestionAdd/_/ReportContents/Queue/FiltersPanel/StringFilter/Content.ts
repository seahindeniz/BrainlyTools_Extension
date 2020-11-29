import type FiltersClassType from "../FiltersPanel";
import StringFilter from "./StringFilter";

export default class Content extends StringFilter {
  constructor(main: FiltersClassType) {
    super(main, "content");

    this.Show();
  }
}
