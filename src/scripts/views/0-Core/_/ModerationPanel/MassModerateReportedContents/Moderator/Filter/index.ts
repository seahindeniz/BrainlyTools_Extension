import { Flex, Text } from "@/scripts/components/style-guide";
import Build from "@/scripts/helpers/Build";

export default class Filter {
  /**
   * @param {import("..").default} main
   * @param {"ContentType"
   * | "Reporter"
   * | "Reported"
   * | "DateRange"
   * | "Subject"
   * } name
   */
  constructor(main, name) {
    this.main = main;
    this.name = name;

    this.filter = {};

    this.RenderFilterContainer();
  }

  RenderFilterContainer() {
    const locale =
      System.data.locale.core.massModerateReportedContents.filter[this.name];
    this.container = Build(
      Flex({
        fullWidth: true,
        marginTop: "s",
        marginBottom: "s",
      }),
      [
        [
          Flex({ alignItems: "center", noShrink: true, grow: true }),
          Text({
            weight: "bold",
            text: `${locale.text}:`,
            title: locale.title,
          }),
        ],
        (this.optionsContainer = Flex({
          grow: true,
          marginLeft: "m",
          fullWidth: true,
          justifyContent: "center",
        })),
      ],
    );

    this.ShowFilterContainer();
  }

  ShowFilterContainer() {
    this.main.filtersContainer.append(this.container);
  }

  HideFilterContainer() {
    this.main.main.HideElement(this.container);
  }

  /**
   * @param {import("../../Report").default} _
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  CheckReport(_) {
    return false;
  }
}
