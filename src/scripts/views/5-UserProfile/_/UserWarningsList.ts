import GetWarnings, { WarningType } from "@BrainlyReq/GetWarnings";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Button, Flex, Spinner, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type UserProfileClassType from "..";

export default class UserWarningsList {
  main: UserProfileClassType;

  warningsLink: HTMLAnchorElement;
  numberOfWarnings: number;
  container: FlexElementType;
  warningList: FlexElementType;
  spinner: HTMLDivElement;
  warnings: WarningType[];
  showRestButtonContainer: FlexElementType;

  constructor(main: UserProfileClassType) {
    this.main = main;
    this.Init();
  }

  Init() {
    try {
      this.FindWarningsLink();

      if (this.numberOfWarnings === 0) return;

      this.Render();
      this.FetchWarnings();
    } catch (error) {
      console.error(error);
      this.HideSpinner();
    }
  }

  HideSpinner() {
    HideElement(this.spinner);
  }

  FindWarningsLink() {
    this.warningsLink = document.querySelector(
      `a[href^="/users/view_user_warns/"]`,
    );

    if (!this.warningsLink) {
      throw Error("Can't find warnings anchor element");
    }

    this.numberOfWarnings = Number(this.warningsLink.innerText);
  }

  Render() {
    this.container = Build(
      Flex({
        marginTop: "s",
        direction: "column",
      }),
      [
        Text({
          children: System.data.locale.userProfile.userWarningsList.name,
          weight: "bold",
          transform: "uppercase",
        }),
        (this.warningList = Flex({
          marginLeft: "xs",
          marginTop: "xs",
          direction: "column",
        })),
        (this.spinner = Spinner({
          size: "large",
        })),
      ],
    );

    this.main.mainRight.append(this.container);
  }

  async FetchWarnings() {
    this.warnings = await GetWarnings(this.main.profileData.id);

    if (this.warnings.length > 0) {
      this.RenderWarnings();
    }

    this.HideSpinner();
  }

  RenderWarnings(showRest?: boolean) {
    this.warnings.forEach((warning, index) => {
      if ((!showRest && index > 2) || (showRest && index < 3)) return false;

      const container = Build(
        Flex({
          borderBottom: index < this.warnings.length - 1,
          alignItems: "center",
          justifyContent: "space-between",
        }),
        [
          [
            Flex({
              direction: "column",
              marginRight: "xs",
            }),
            [
              Text({
                className: "ext-warnings-list__trimmed-text",
                size: "small",
                children: warning.content,
                title: warning.content,
                weight: "bold",
              }),
              Text({
                className: "ext-warnings-list__trimmed-text",
                size: "xsmall",
                children: warning.reason,
                title: warning.reason,
              }),
            ],
          ],
          Text({
            size: "xsmall",
            align: "RIGHT",
            children: [
              `${warning.relativeTime} - `,
              Text({
                size: "xsmall",
                color: "blue-dark",
                target: "_blank",
                href: System.createProfileLink(warning.giver),
                children: warning.giver.nick,
              }),
            ],
          }),
        ],
      );

      this.warningList.append(container);

      return true;
    });

    if (!showRest && this.warnings.length > 3) {
      this.RenderShowRestButton();
    }
  }

  RenderShowRestButton() {
    this.showRestButtonContainer = Flex({
      marginTop: "s",
      justifyContent: "center",
      children: new Button({
        size: "s",
        type: "outline",
        toggle: "blue",
        children: System.data.locale.userProfile.userWarningsList.showRest,
        onClick: this.ShowRest.bind(this),
      }),
    });

    this.container.append(this.showRestButtonContainer);
  }

  ShowRest() {
    this.RenderWarnings(true);
    this.HideShowRestButton();
  }

  HideShowRestButton() {
    HideElement(this.showRestButtonContainer);
  }
}
