import { BanUser } from "@BrainlyReq";
import type { BanTypeType } from "@BrainlyReq/BanUser";
import type { PHPTokens } from "@BrainlyReq/Brainly";
import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Flex, Select, Text } from "@style-guide";
import type MoreSectionClassType from "../MoreSection";

const banTypes: { value: BanTypeType; locale: string; localeVal?: number }[] = [
  { value: 1, locale: "tutorial" },
  { value: 2, locale: "nMinutes", localeVal: 15 },
  { value: 3, locale: "nMinutes", localeVal: 60 },
  { value: 4, locale: "nHours", localeVal: 12 },
  { value: 5, locale: "nHours", localeVal: 24 },
  { value: 6, locale: "nHours", localeVal: 48 },
];

export default class BanUserSection {
  private container: import("@style-guide/Flex").FlexElementType;
  private banTypeSelect: Select;
  private tokens: PHPTokens;
  private options: {
    text: string;
    banType: BanTypeType;
    element: HTMLOptionElement;
  }[];

  constructor(private main: MoreSectionClassType) {
    this.SetBanTokens();

    if (!this.tokens) return;

    this.Init();
  }

  Init() {
    this.options = [];

    this.Render();
  }

  SetBanTokens() {
    // https://regex101.com/r/g7uhZD/1
    const matches = this.main.main.profilePageHTML?.match(
      /UserBanAddForm.*?\[key]" value="(?<key>.*?)".*?UserBanType.*?ds]" value="(?<fields>.*?)".*?value="(?<lock>.*?)"/s,
    );

    if (!matches?.length) return;

    this.tokens = matches.groups as any;
  }

  private Render() {
    this.container = Build(Flex({ alignItems: "center", relative: true }), [
      [
        Flex({ marginRight: "xs" }),
        Text({
          children: "Ban",
        }),
      ],
      (this.banTypeSelect = new Select({
        fullWidth: true,
        onChange: this.BanUser.bind(this),
        options: [
          {
            selected: true,
            text: System.data.locale.common.chooseAnOption,
          },
          ...banTypes.map(banType => {
            if (banType.localeVal && !System.checkBrainlyP(137))
              return undefined;

            const text = System.data.locale.common.banUser[
              banType.locale
            ].replace("%{n}", banType.localeVal);

            const optionElement = CreateElement({
              tag: "option",
              children: text,
            });

            this.options.push({
              banType: banType.value,
              text,
              element: optionElement,
            });

            return optionElement;
          }),
        ],
      })),
    ]);

    this.main.container.append(this.container);
  }

  async BanUser() {
    const selectedOption = Array.from(
      this.banTypeSelect.select.selectedOptions,
    )?.[0];

    if (!selectedOption) return;

    const banTypeEntry = this.options.find(
      entry => entry.element === selectedOption,
    );

    if (!banTypeEntry) return;

    if (!confirm(System.data.locale.common.notificationMessages.areYouSure))
      return;

    this.ShowSpinner();

    // await System.Delay(2000);
    await BanUser(this.main.main.data.id, banTypeEntry.banType, this.tokens);
    await this.main.main.Init();

    if (!this.main.main.banDetails) {
      notification({
        type: "error",
        text: System.data.locale.common.notificationMessages.somethingWentWrong,
      });

      return;
    }

    this.Banned();
  }

  Banned() {
    this.main.HideSpinner();
    HideElement(this.container);
    // this.main.main.HideMoreSection();

    delete this.main.sections.banUser;
  }

  ShowSpinner() {
    this.container.append(this.main.overlayedSpinner);
  }
}
