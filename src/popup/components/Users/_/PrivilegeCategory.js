import Privilege from "./Privilege";
import PrivilegeGroup from "./PrivilegeGroup";

export default class PrivilegeCategory {
  /**
   * @param {import("../index").default} main
   * @param {"veryImportant" | "important" | "lessImportant" | "harmless"} name
   */
  constructor(main, name) {
    this.main = main;
    this.name = name;
    this.$privilegesContainer = this.main.$privilegesContainer;
    /**
     * @type {(Privilege | PrivilegeGroup)[]}
     */
    this.privileges = [];
    this.data = this.main.privilegeListOrder[name];

    if (!this.data)
      throw `Can't find the details of the "${name}" category`;

    this.RenderDivider();
    this.RenderPrivileges();
  }
  RenderDivider() {
    this.main.RenderDivider(this.data.title);
  }
  RenderPrivileges() {
    this.data.privileges.forEach(this.RenderPrivilege.bind(this));
  }
  /**
   * @param {number|number[]} key
   */
  RenderPrivilege(key) {
    let privilege;

    if (key instanceof Array)
      privilege = new PrivilegeGroup(this, key);
    else
      privilege = new Privilege(this, key);

    this.privileges.push(privilege);
  }
}
