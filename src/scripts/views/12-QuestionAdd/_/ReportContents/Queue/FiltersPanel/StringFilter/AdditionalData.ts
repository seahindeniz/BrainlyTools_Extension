import type FiltersClassType from "../FiltersPanel";
import StringFilter from "./StringFilter";

export default class AdditionalData extends StringFilter {
  constructor(main: FiltersClassType) {
    super(main, "additionalData");
  }
}
