import type {
  QuestionLogEntryClassType,
  QuestionLogEntryType,
} from "@BrainlyAction";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Box, Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { IconColorType } from "@style-guide/Icon";
import type { TextElement } from "@style-guide/Text";
import tippy from "tippy.js";
import type LogSectionClassType from "./LogSection";

const ENTRY_ICON_COLOR: {
  [x in QuestionLogEntryClassType]: IconColorType;
} = {
  accepted: "mint",
  added: "adaptive",
  best: "mustard",
  deleted: "peach",
  edited: "blue",
  info: "lavender",
  reported: "gray",
};

export default class LogEntry {
  main: LogSectionClassType;
  data: QuestionLogEntryType;

  container: FlexElementType;
  toggleButtonIcon: Icon;
  toggleButton: Button;
  textElement: TextElement<"span">;
  contentBox: Box;
  detailsContainer: FlexElementType;

  constructor(main: LogSectionClassType, data: QuestionLogEntryType) {
    this.main = main;
    this.data = data;

    this.Render();
    this.RenderText();
  }

  private Render() {
    let warningIconContainer: FlexElementType;

    if (this.data.warn) {
      warningIconContainer = Flex({
        marginRight: "xxs",
        children: new Icon({
          type: "warning",
          color: "peach",
          size: 16,
        }),
      });

      tippy(warningIconContainer, {
        theme: "light",
        content: Text({
          size: "small",
          weight: "bold",
          children: System.data.locale.moderationPanel.log.deletedWithWarning,
        }),
      });
    }

    this.container = Build(
      Flex({
        marginTop: "xxs",
        marginLeft: "xs",
      }),
      [
        [
          (this.contentBox = new Box({
            border: true,
            borderColor: "light",
            padding: null,
          })),
          [
            [
              Flex({
                marginLeft: "xs",
                marginRight: "xs",
                alignItems: "center",
              }),
              [
                [
                  Flex({ marginRight: "xs" }),
                  Text({
                    size: "xsmall",
                    weight: "bold",
                    children: this.data.time,
                  }),
                ],
                [
                  Flex({ grow: true, marginRight: "xs" }),
                  (this.textElement = Text({
                    tag: "span",
                    size: "small",
                  })),
                ],
                [
                  Flex({ alignItems: "center" }),
                  [
                    warningIconContainer,
                    (this.toggleButton = new Button({
                      size: "s",
                      type: "transparent",
                      iconOnly: true,
                      disabled: !this.data.descriptions,
                      onClick:
                        this.data.descriptions && this.ToggleDetails.bind(this),
                      icon: (this.toggleButtonIcon = new Icon({
                        type: "more",
                        size: 32,
                        color: this.data.descriptions
                          ? ENTRY_ICON_COLOR[this.data.class || "added"]
                          : "light",
                      })),
                    })),
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    );
  }

  RenderText() {
    const textPieces = this.data.text //
      .split(/(%\d\$s)/)
      .map(textPiece => {
        if (textPiece !== "%1$s" && textPiece !== "%3$s") return textPiece;

        const user = this.main.usersData.find(
          userData =>
            userData.id ===
            this.data[textPiece === "%1$s" ? "user_id" : "owner_id"],
        );
        const profileLink = System.createProfileLink(user);

        return Text({
          size: "small",
          weight: "bold",
          href: profileLink,
          color: "blue-dark",
          children: user.nick,
        });
      });

    this.textElement.append(...textPieces);
  }

  ToggleDetails() {
    if (IsVisible(this.detailsContainer)) {
      this.HideDetails();
    } else {
      this.ShowDetails();
    }
  }

  HideDetails() {
    HideElement(this.detailsContainer);
    this.contentBox.ChangeBorderColor("light");
    this.toggleButtonIcon.ChangeType("more").ChangeSize(32);
  }

  ShowDetails() {
    if (!this.detailsContainer) {
      this.RenderDetails();
    }

    this.contentBox.element.append(this.detailsContainer);
    this.toggleButtonIcon.ChangeType("arrow_up").ChangeSize(24);
    this.contentBox.ChangeBorderColor("gray-secondary-lightest");
  }

  RenderDetails() {
    this.detailsContainer = Flex({
      marginTop: "xs",
      marginLeft: "s",
      marginRight: "xs",
      direction: "column",
      children: this.data.descriptions.map((entry, index) =>
        Build(
          Flex({
            direction: "column",
            marginBottom:
              this.data.descriptions.length !== index + 1 ? "xs" : null,
          }),
          [
            Text({
              size: "small",
              weight: "bold",
              children: entry.subject,
            }),
            [
              Flex({
                marginLeft: "xs",
              }),
              Text({
                size: "small",
                children: entry.text,
              }),
            ],
          ],
        ),
      ),
    });
  }
}
