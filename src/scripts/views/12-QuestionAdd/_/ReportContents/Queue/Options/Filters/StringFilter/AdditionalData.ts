import type FiltersClassType from "../Filters";
import StringFilter from "./StringFilter";

export default class AdditionalData extends StringFilter {
  constructor(main: FiltersClassType) {
    super(main, "additionalData");
  }
}
