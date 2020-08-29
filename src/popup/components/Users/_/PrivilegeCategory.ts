import Privilege from "./Privilege";
import PrivilegeGroup from "./PrivilegeGroup";
import type * as UsersTypes from "..";

export default class PrivilegeCategory {
  main: UsersTypes.default;
  name: UsersTypes.PrivilegeKeysType;

  $privilegesContainer: JQuery<HTMLElement>;

  privileges: (Privilege | PrivilegeGroup)[];
  data: UsersTypes.PrivilegeType;

  constructor(main, name: UsersTypes.PrivilegeKeysType) {
    this.main = main;
    this.name = name;
    this.$privilegesContainer = this.main.$privilegesContainer;
    this.privileges = [];
    this.data = this.main.privilegeListOrder[name];

    if (!this.data)
      throw Error(`Can't find the details of the "${name}" category`);

    this.RenderDivider();
    this.RenderPrivileges();
  }

  RenderDivider() {
    this.main.RenderDivider(this.data.title);
  }

  RenderPrivileges() {
    this.data.privileges.forEach(this.RenderPrivilege.bind(this));
  }

  RenderPrivilege(key: number | number[]) {
    let privilege;

    if (key instanceof Array) privilege = new PrivilegeGroup(this, key);
    else privilege = new Privilege(this, key);

    this.privileges.push(privilege);
  }
}
