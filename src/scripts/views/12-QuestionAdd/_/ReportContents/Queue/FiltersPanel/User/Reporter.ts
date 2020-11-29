import User from "./User";
import type FiltersClassType from "../FiltersPanel";

export default class Reporter extends User {
  type: "reporter";

  constructor(main: FiltersClassType) {
    super(main, "reporter");
  }
}
