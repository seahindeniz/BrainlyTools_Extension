import type UsersClassType from "..";
import type PrivilegeCategoryClassType from "./PrivilegeCategory";

export type PrivilegePropsType = {
  isLead?: boolean;
  isGroupElement?: boolean;
};

export default class Privilege {
  main: PrivilegeCategoryClassType | UsersClassType;
  key: number;
  locale: {
    title: string;
    description: string;
  };

  isLead: boolean;
  isGroupElement: boolean;

  $: JQuery<HTMLElement>;
  $input: JQuery<HTMLElement>;
  $label: JQuery<HTMLElement>;
  $option: JQuery<HTMLElement>;

  constructor(
    main,
    key,
    { isLead = false, isGroupElement = false }: PrivilegePropsType = {},
  ) {
    this.main = main;
    this.key = key;
    this.locale =
      System.data.locale.popup.extensionManagement.users.privilegeList[key];

    if (isLead) this.isLead = isLead;

    if (isGroupElement) this.isGroupElement = isGroupElement;

    if (key === 0 && !System.checkUserP(0)) return;

    if (!this.locale) {
      console.warn(`The "${key}" cannot be found in privilegeList`);

      return;
    }

    this.Render();
    this.RenderSelectOption();

    if (this.isLead) this.MakeThisLeadElement();

    if (this.isGroupElement) this.MakeThisGroupElement();
  }

  Render() {
    this.$ = $(`
    <div class="field"${
      this.locale.description ? ` title="${this.locale.description}"` : ""
    }>
      <input class="is-checkradio is-block is-info" id="p-${
        this.key
      }" type="checkbox">
      <label for="p-${this.key}">${this.locale.title}</label>
    </div>`);
    this.$input = $("input", this.$);
    this.$label = $("label", this.$);

    this.$input.prop("key", this.key);
    this.$.appendTo(this.main.$privilegesContainer);
  }

  RenderSelectOption() {
    if (this.key !== 0 && "$privilegesSelect" in this.main) {
      this.$option = $(
        `<option value="${this.key}" title="${this.locale.description}">${this.locale.title}</option>`,
      );

      this.$option.appendTo(this.main.$privilegesSelect);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  MakeThisLeadElement() {
    return undefined;
  }

  MakeThisGroupElement() {
    this.$label.html(
      `<span class="content is-small">&gt;</span> ${this.locale.title}`,
    );

    if (this.$option) this.$option.html(`> ${this.locale.title}`);
  }
}
