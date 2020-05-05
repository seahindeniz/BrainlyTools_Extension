import Privilege from "./Privilege";

export default class PrivilegeGroup {
  /**
   * @param {import("./PrivilegeCategory").default} main
   * @param {0[]} keys
   */
  constructor(main, keys = []) {
    this.main = main;
    this.keys = keys;
    this.subPrivileges = [];

    if (this.keys.length == 0)
      return;

    this.leadKey = this.keys.shift();
    this.locale = System.data.locale.popup.extensionManagement.users.privilegeList[this.leadKey];

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
    this.leadPrivilege.$input.change(this.LeadPrivilegeChanged.bind(this));
  }
  LeadPrivilegeChanged() {
    if (this.leadPrivilege.$input.is(":checked"))
      this.HideSubPrivileges();
    else
      this.ShowSubPrivileges();
  }
  HideSubPrivileges() {
    this.subPrivileges.forEach(this.HideSubPrivilege.bind(this));
  }
  /**
   * @param {Privilege} privilege
   */
  HideSubPrivilege(privilege) {
    this.HideElement(privilege.$);
  }
  /**
   * @param {JQuery<HTMLElement>} $element
   */
  HideElement($element) {
    if ($element)
      $element.detach();
  }
  ShowSubPrivileges() {
    this.subPrivileges.forEach(this.ShowSubPrivilege.bind(this));
  }
  /**
   * @param {Privilege} privilege
   */
  ShowSubPrivilege(privilege) {
    privilege.$.appendTo(this.$privilegesContainer);
  }
  RenderSubPrivileges() {
    this.keys.forEach(key => this.RenderSubPrivilege(key, { isGroupElement: true }));
  }
  /**
   * @param {number} key
   * @param {import("./Privilege").options} options
   */
  RenderSubPrivilege(key, options) {
    let privilege = new Privilege(this, key, options);

    this.subPrivileges.push(privilege);

    return privilege;
  }
}
