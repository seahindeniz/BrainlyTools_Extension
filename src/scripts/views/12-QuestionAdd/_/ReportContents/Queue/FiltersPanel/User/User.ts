import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Button, Flex, Icon, Input, Select, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type FiltersClassType from "../FiltersPanel";

export type UserTypeType = "reporter" | "reported";

export default class User {
  main: FiltersClassType;
  type: UserTypeType;

  container: FlexElementType;
  queryTypeSelect: Select;
  textInput: Input;
  inputContainer: FlexElementType;
  rankSelect: Select;
  selectedInput: Input | Select;
  excludeButtonContainer: FlexElementType;
  excludeButton: Button;
  excludeState: boolean;

  constructor(main: FiltersClassType, type: UserTypeType) {
    this.main = main;
    this.type = type;

    this.Render();
  }

  Render() {
    this.container = Build(
      Flex({
        tag: "label",
        marginTop: "s",
      }),
      [
        [
          Flex({ marginRight: "xs", alignItems: "center" }),
          Text({
            weight: "bold",
            noWrap: true,
            size: "small",
            text: `${
              System.data.locale.reportedContents.filtersPanel.filters[
                this.type
              ].name
            }: `,
          }),
        ],
        [
          Flex({
            wrap: true,
            grow: true,
          }),
          [
            [
              Flex({
                grow: true,
                marginTop: "xxs",
                marginBottom: "xxs",
                alignItems: "center",
              }),
              (this.queryTypeSelect = new Select({
                fullWidth: true,
                onChange: this.InputChanged.bind(this),
                options: [
                  {
                    value: "",
                    selected: true,
                    disabled: true,
                    text:
                      System.data.locale.reportedContents.filtersPanel.filters
                        .userFilter.lookFor,
                  },
                  {
                    value: 0,
                    text: System.data.locale.common.nick,
                  },
                  {
                    value: 1,
                    text: System.data.locale.common.profileLinkOrId,
                  },
                  {
                    value: 2,
                    text:
                      System.data.locale.reportedContents.filtersPanel.filters
                        .userFilter.specialRank,
                  },
                ],
              })),
            ],
            [
              (this.inputContainer = Flex({
                grow: true,
                alignItems: "center",
              })),
              (this.textInput = new Input({
                fullWidth: true,
                onChange: this.InputChanged.bind(this),
                onInput: this.CheckValue.bind(this),
                placeholder: "...",
              })),
            ],
          ],
        ],
      ],
    );

    this.selectedInput = this.textInput;

    this.main.container.append(this.container);
  }

  get target() {
    return this.queryTypeSelect.select.value === "0"
      ? "nick"
      : this.queryTypeSelect.select.value === "1"
      ? "id"
      : this.queryTypeSelect.select.value === "2"
      ? "specialRank"
      : undefined;
  }

  get input() {
    return (
      ("input" in this.selectedInput && this.selectedInput.input) ||
      ("select" in this.selectedInput && this.selectedInput.select)
    );
  }

  CheckValue() {
    if (this.textInput.input.value !== "" && !this.target) {
      this.queryTypeSelect.Invalid();

      return;
    }

    this.queryTypeSelect.Natural();
  }

  InputChanged() {
    this.ShowProperInput();

    let { value }: { value: string | number[] } = this.input;

    if (this.target === "specialRank") {
      value = Array.from(this.rankSelect.select.selectedOptions)
        .map(option => Number(option.value))
        .filter(id => id !== null && id !== undefined && !Number.isNaN(id));
    }

    this.main.main.filter.byName[this.type].SetQuery(
      this.target,
      value,
      this.excludeState,
    );
  }

  ShowProperInput() {
    let selectedInput: Input | Select;

    if (this.target === "specialRank") {
      if (!this.rankSelect) {
        this.RenderRankSelect();
      }

      selectedInput = this.rankSelect;

      this.inputContainer.prepend(this.excludeButtonContainer);
    } else {
      HideElement(this.excludeButtonContainer);

      selectedInput = this.textInput;
    }

    if (selectedInput === this.selectedInput) return;

    if (this.selectedInput) {
      HideElement(this.selectedInput.element);
    }

    this.selectedInput = selectedInput;

    this.inputContainer.append(this.selectedInput.element);
    this.main.containerTippy.popperInstance.update();
  }

  RenderRankSelect() {
    const specialRanks = System.data.Brainly.defaultConfig.config.data.ranks.filter(
      rank => rank.type > 3,
    );

    this.rankSelect = new Select({
      multiple: true,
      fullWidth: true,
      onChange: this.InputChanged.bind(this),
      options: [
        {
          text: System.data.locale.common.chooseAnOption,
          selected: true,
        },
        CreateElement({
          tag: "optgroup",
          label: "⸻⸻⸻",
        }),
        {
          value: 0,
          text:
            System.data.locale.reportedContents.filtersPanel.filters.userFilter
              .anyRank,
        },
        CreateElement({
          tag: "optgroup",
          label: "⸻⸻⸻",
        }),
        ...specialRanks.map(rank => {
          return {
            value: rank.id,
            text: rank.name,
          };
        }),
      ],
    });

    this.excludeButtonContainer = Flex({
      marginLeft: "xxs",
      marginRight: "xxs",
      children: this.excludeButton = new Button({
        size: "s",
        type: "outline",
        toggle: "blue",
        iconOnly: true,
        icon: new Icon({
          type: "friend_remove",
        }),
        onClick: this.ToggleExcludeState.bind(this),
      }),
    });

    tippy(this.excludeButton.element, {
      theme: "light",
      content: Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children:
          System.data.locale.reportedContents.filtersPanel.filters.userFilter
            .excludeSelectedRanks,
      }),
    });
  }

  ToggleExcludeState() {
    this.excludeState = !this.excludeState;

    if (this.excludeState) {
      this.excludeButton.ChangeType({ type: "solid-blue" });
    } else {
      this.excludeButton.ChangeType({
        type: "outline",
        toggle: "blue",
      });
    }

    this.InputChanged();
  }

  Reset() {
    this.textInput.input.value = "";
    (this.queryTypeSelect.select
      .firstElementChild as HTMLOptionElement).selected = true;

    this.ShowProperInput();
  }
}
