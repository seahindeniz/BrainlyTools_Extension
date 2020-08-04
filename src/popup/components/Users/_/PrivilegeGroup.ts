import HideElement from "@/scripts/helpers/HideElement";
import Privilege from "./Privilege";
import type { PrivilegePropsType } from "./Privilege";
import type PrivilegeCategoryClassType from "./PrivilegeCategory";

export default class PrivilegeGroup {
  main: PrivilegeCategoryClassType;
  keys: number[];
  subPrivileges: Privilege[];
  leadKey: number;
  locale: {
    title: string;
    description: string;
  };

  $privilegesContainer: JQuery<HTMLElement>;

  leadPrivilege: Privilege;

  constructor(main: PrivilegeCategoryClassType, keys: number[] = []) {
    if (keys.length === 0) return;

    this.main = main;
    this.keys = keys;
    this.subPrivileges = [];

    this.leadKey = this.keys.shift();
    this.locale =
      System.data.locale.popup.extensionManagement.users.privilegeList[
        this.leadKey
      ];

    this.RenderLeadPrivilege();
    this.RenderPrivilegeContainer();
    this.BindHandler();
    this.RenderSubPrivileges();
  }

  RenderLeadPrivilege() {
    this.$privilegesContainer = this.main.$privilegesContainer;
    this.leadPrivilege = new Privilege(this, this.leadKey, { isLead: true });
  }

  RenderPrivilegeContainer() {
    this.$privilegesContainer = $(`<div class="field marginLeft20"></div>`);

    this.$privilegesContainer.appendTo(this.main.$privilegesContainer);
  }

  BindHandler() {
    this.leadPrivilege.$input.on(
      "change",
      this.LeadPrivilegeChanged.bind(this),
    );
  }

  LeadPrivilegeChanged() {
    if (this.leadPrivilege.$input.is(":checked")) this.HideSubPrivileges();
    else this.ShowSubPrivileges();
  }

  HideSubPrivileges() {
    this.subPrivileges.forEach(privilege => HideElement(privilege.$));
  }

  ShowSubPrivileges() {
    this.subPrivileges.forEach(this.ShowSubPrivilege.bind(this));
  }

  ShowSubPrivilege(privilege: Privilege) {
    privilege.$.appendTo(this.$privilegesContainer);
  }

  RenderSubPrivileges() {
    this.keys.forEach(key =>
      this.RenderSubPrivilege(key, { isGroupElement: true }),
    );
  }

  RenderSubPrivilege(key: number, options: PrivilegePropsType) {
    const privilege = new Privilege(this, key, options);

    this.subPrivileges.push(privilege);

    return privilege;
  }
}
