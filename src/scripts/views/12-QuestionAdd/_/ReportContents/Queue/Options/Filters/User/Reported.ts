import User from "./User";
import type FiltersClassType from "../Filters";

export default class Reporter extends User {
  type: "reported";

  constructor(main: FiltersClassType) {
    super(main, "reported");
  }
}
