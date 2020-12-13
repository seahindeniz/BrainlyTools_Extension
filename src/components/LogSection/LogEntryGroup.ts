import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Box, Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type LogDateSectionClassType from "./DateSection";
import type LogEntryClassType from "./LogEntry";

export default class LogEntryGroup {
  main: LogDateSectionClassType;
  logEntries: LogEntryClassType[];

  #container: FlexElementType;
  contentBox: Box;
  toggleButton: Button;
  toggleButtonIcon: Icon;
  logsContainer: FlexElementType;

  constructor(main: LogDateSectionClassType) {
    this.main = main;

    this.logEntries = [];
  }

  get container() {
    if (!this.#container) {
      this.Render();
    }

    return this.#container;
  }

  Render() {
    const firstLogEntry = this.logEntries[0];

    this.#container = Build(
      Flex({
        marginTop: "xxs",
        marginLeft: "xs",
        direction: "column",
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
                Text({
                  size: "xsmall",
                  weight: "bold",
                  children: firstLogEntry.data.time,
                }),
                [
                  Flex({ grow: true, marginLeft: "xs", marginRight: "xs" }),
                  firstLogEntry.textElement.cloneNode(true),
                ],
                (this.toggleButton = new Button({
                  size: "s",
                  type: "transparent",
                  reversedOrder: true,
                  onClick: this.ToggleOccurrences.bind(this),
                  icon: (this.toggleButtonIcon = new Icon({
                    type: "arrow_down",
                  })),
                  children: System.data.locale.moderationPanel.log.nMore.replace(
                    "%{number_of_occurrences}",
                    String(this.logEntries.length),
                  ),
                })),
              ],
            ],
          ],
        ],
      ],
    );

    this.logsContainer = Flex({
      marginTop: "xs",
      direction: "column",
      borderTop: true,
    });

    this.RenderLogEntries();
  }

  RenderLogEntries() {
    this.logEntries.forEach(entry =>
      this.logsContainer.append(entry.container),
    );
  }

  ToggleOccurrences() {
    if (IsVisible(this.logsContainer)) {
      this.HideLogsContainer();

      return;
    }

    this.ShowLogsContainer();
  }

  HideLogsContainer() {
    this.contentBox.ChangeBorderColor("light");
    this.toggleButtonIcon.ChangeType("arrow_down");
    HideElement(this.logsContainer);
  }

  ShowLogsContainer() {
    this.contentBox.ChangeBorderColor("gray-secondary-lightest");
    this.toggleButtonIcon.ChangeType("arrow_up");
    this.contentBox.element.append(this.logsContainer);
  }
}
