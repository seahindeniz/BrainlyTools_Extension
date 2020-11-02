import User from "./User";
import type QueueClassType from "../../Queue";

export default class Reporter extends User {
  constructor(main: QueueClassType) {
    super(main, "reporter", "peach");
  }
}
