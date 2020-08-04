import { Flex, InputDeprecated } from "@/scripts/components/style-guide";
import debounce from "debounce";
import Filter from ".";

export default class Reporter extends Filter {
  /**
   * @param {import("..").default} main
   */
  constructor(main) {
    super(main, "Reporter");

    this.Render();
    this.BindListener();
  }

  Render() {
    this.container = Flex({
      children: (this.input = InputDeprecated({
        placeholder: `${System.data.locale.messages.groups.userCategories.findUsers.nickOrID}..`,
      })),
    });

    this.optionsContainer.append(this.container);
  }

  BindListener() {
    this.input.addEventListener(
      "input",
      debounce(this.main.FilterReports.bind(this.main), 700),
    );
  }

  /**
   * @param {import("../../Report").default} report
   */
  CheckReport(report) {
    return (
      !this.IsUsed() ||
      report.user.reported.nick.toLowerCase() ===
        this.input.value.toLowerCase() ||
      report.user.reporter.id === Number(this.input.value)
    );
  }

  IsUsed() {
    return !!this.input.value;
  }
}
