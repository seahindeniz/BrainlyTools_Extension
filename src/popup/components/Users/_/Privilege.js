/**
 * @typedef {{isLead: boolean, isGroupElement: boolean}} options
 */
let System = require("../../../../scripts/helpers/System");

export default class Privilege {
  /**
   * @param {import("./PrivilegeCategory").default|import("../index").default} main
   * @param {0} key
   * @param {options} options
   */
  constructor(main, key, { isLead, isGroupElement } = {}) {
    if (typeof System == "function")
      System = System();

    this.main = main;
    this.key = key;
    this.locale = System.data.locale.popup.extensionManagement.users.privilegeList[key];

    if (isLead)
      this.isLead = isLead;

    if (isGroupElement)
      this.isGroupElement = isGroupElement;

    if (key == 0 && !System.checkUserP(0))
      return;

    if (!this.locale)
      return console.warn(`The "${key}" cannot be found in privilegeList`);

    this.Render();
    this.RenderSelectOption();

    if (this.isLead)
      this.MakeThisLeadElement();

    if (this.isGroupElement)
      this.MakeThisGroupElement();
  }
  Render() {
    this.$ = $(`
    <div class="field" title="${this.locale.description}">
      <input class="is-checkradio is-block is-info" id="p-${this.key}" type="checkbox">
      <label for="p-${this.key}">${this.locale.title}</label>
    </div>`);
    this.$input = $("input", this.$);
    this.$label = $("label", this.$);

    this.$input.prop("key", this.key);
    this.$.appendTo(this.main.$privilegesContainer);
  }
  RenderSelectOption() {
    if (this.key != 0 && this.main.main.$privilegesSelect) {
      this.$option = $(`<option value="${this.key}" title="${this.locale.description}">${this.locale.title}</option>`);

      this.$option.appendTo(this.main.main.$privilegesSelect);
    }
  }
  MakeThisLeadElement() {}
  MakeThisGroupElement() {
    this.$label.html(`<span class="content is-small">&gt;</span> ${this.locale.title}`);

    if (this.$option)
      this.$option.html(`> ${this.locale.title}`);
  }
}
