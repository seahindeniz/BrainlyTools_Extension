import User from "./User";
import type FiltersClassType from "../FiltersPanel";

export default class Reporter extends User {
  type: "reported";

  constructor(main: FiltersClassType) {
    super(main, "reported");
  }
}
