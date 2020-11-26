import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import { DateTime } from "luxon";
import type LogEntryClassType from "./LogEntry";
import LogEntryGroup from "./LogEntryGroup";
import type LogSectionClassType from "./LogSection";

export default class LogDateSection {
  private main: LogSectionClassType;
  private date: DateTime;

  private container: FlexElementType;
  private logsContainer: FlexElementType;
  private toggleButtonIcon: Icon;
  logEntries: LogEntryClassType[];
  private logEntriesChunked: (LogEntryClassType | LogEntryGroup)[];

  constructor(main: LogSectionClassType, dateStr: string) {
    this.main = main;
    this.date = DateTime.fromISO(dateStr);

    this.logEntries = [];
    this.logEntriesChunked = [];
  }

  ChunkRepeatingLogEntries() {
    const { logEntries } = this;

    logEntries.forEach(logEntry => {
      const lastEntry = this.logEntriesChunked[
        this.logEntriesChunked.length - 1
      ];

      if (lastEntry) {
        if (lastEntry instanceof LogEntryGroup) {
          const lastLogEntry =
            lastEntry.logEntries[lastEntry.logEntries.length - 1];

          if (
            lastLogEntry.data.text === logEntry.data.text &&
            lastLogEntry.data.user_id === logEntry.data.user_id
          ) {
            lastEntry.logEntries.push(logEntry);

            return;
          }
        } else if (
          lastEntry.data.text === logEntry.data.text &&
          lastEntry.data.user_id === logEntry.data.user_id
        ) {
          const logEntryGroup = new LogEntryGroup(this);

          this.logEntriesChunked.pop();
          logEntryGroup.logEntries.push(lastEntry, logEntry);
          this.logEntriesChunked.push(logEntryGroup);

          return;
        }
      }

      this.logEntriesChunked.push(logEntry);
    });
  }

  Render() {
    this.container = Build(
      Flex({
        marginTop: "s",
        marginBottom: "s",
        direction: "column",
      }),
      [
        [
          Flex({ alignItems: "center" }),
          [
            Text({
              size: "small",
              weight: "bold",
              children: [
                this.date.toLocaleString(DateTime.DATE_SHORT),
                " - ",
                Text({
                  tag: "i",
                  size: "xsmall",
                  color: "gray-secondary",
                  children: System.data.locale.moderationPanel.log.nActions.replace(
                    /%{number_of}/g,
                    String(this.logEntries.length),
                  ),
                }),
              ],
            }),
            [
              Flex({ marginLeft: "xs" }),
              new Button({
                size: "s",
                type: "solid-light",
                onClick: this.ToggleLogsContainer.bind(this),
                iconOnly: true,
                icon: this.toggleButtonIcon = new Icon({
                  type: "arrow_down",
                }),
              }),
            ],
          ],
        ],
      ],
    );

    this.logsContainer = Flex({
      direction: "column",
    });

    this.main.contentBox.element.append(this.container);

    this.RenderLogEntries();
  }

  RenderLogEntries() {
    this.logEntriesChunked.forEach(entry =>
      this.logsContainer.append(entry.container),
    );
  }

  ToggleLogsContainer() {
    if (IsVisible(this.logsContainer)) {
      this.HideLogsContainer();

      return;
    }

    this.ShowLogsContainer();
  }

  HideLogsContainer() {
    this.toggleButtonIcon.ChangeType("arrow_down");
    HideElement(this.logsContainer);
  }

  ShowLogsContainer() {
    this.toggleButtonIcon.ChangeType("arrow_up");
    this.container.append(this.logsContainer);
  }
}
