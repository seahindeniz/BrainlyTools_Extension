import CreateElement from "@/scripts/components/CreateElement";
import notification from "@/scripts/components/notification2";
import {
  Flex,
  Icon,
  Text,
  ToplayerDeprecated,
  Button,
} from "@/scripts/components/style-guide";
import Build from "@/scripts/helpers/Build";
import IsVisible from "@/scripts/helpers/IsVisible";
import ContentType from "./Filter/ContentType";
import DateRange from "./Filter/DateRange";
import Reported from "./Filter/Reported";
import Reporter from "./Filter/Reporter";
import SubjectFilter from "./Filter/Subject";
import ModerateSection from "./ModerateSection";
import PreviewSection from "./PreviewSection";
import StatusBar from "./StatusBar";

export default class Moderator {
  /**
   * @param {import("..").default} main
   * @param {number} index
   */
  constructor(main, index) {
    this.main = main;
    this.index = index;
    /**
     * @type {import("../Report").default[]}
     */
    this.filteredReports = [];

    this.statusBar = new StatusBar(this);
    this.preview = new PreviewSection(this);
    this.moderate = new ModerateSection(this);

    this.RenderContainer();
    this.InitFilters();
    this.BindListeners();
  }

  RenderContainer() {
    this.toplayer = Flex({
      marginTop: "s",
      marginBottom: "s",
      children: ToplayerDeprecated({
        noPadding: true,
        onClose: this.Close.bind(this),
        children: [
          Build(
            (this.container = Flex({
              marginLeft: "l",
              marginRight: "l",
              direction: "column",
            })),
            [
              [
                Flex({
                  marginTop: "s",
                  marginBottom: "s",
                }),
                [
                  [
                    Flex({
                      grow: true,
                      alignItems: "center",
                      justifyContent: "center",
                    }),
                    Text({
                      weight: "bold",
                      size: "large",
                      html: System.data.locale.core.massModerateReportedContents.moderatorN
                        .replace("%{n}", `${this.index + 1}`)
                        .toUpperCase(),
                    }),
                  ],
                  [
                    (this.collapseToggleButtonContainer = Flex({
                      marginLeft: "s",
                      marginRight: "s",
                    })),
                    [
                      [
                        (this.collapseToggleButton = Flex({
                          alignItems: "center",
                        })),
                        new Button({
                          type: "transparent",
                          iconOnly: true,
                          icon: Flex({
                            direction: "column",
                            children: [
                              (this.firstArrow = new Icon({
                                type: "arrow_down",
                                size: 24,
                                color: "gray-secondary",
                              })),
                              (this.secondArrow = new Icon({
                                type: "arrow_up",
                                size: 24,
                                color: "gray-secondary",
                                style: {
                                  marginTop: "-11px",
                                },
                              })),
                            ],
                          }),
                        }),
                      ],
                    ],
                  ],
                ],
              ],
              [
                (this.builderContainer = Flex({
                  fullWidth: true,
                  marginTop: "s",
                  marginBottom: "l",
                  justifyContent: "center",
                })),
                [
                  [
                    (this.actionsContainer = Flex({
                      noShrink: true,
                      direction: "column",
                    })),
                    [
                      [
                        Flex({
                          fullWidth: true,
                          direction: "column",
                        }),
                        [
                          [
                            Flex({ fullWidth: true }),
                            Text({
                              size: "large",
                              html:
                                System.data.locale.core
                                  .massModerateReportedContents.findReports,
                            }),
                          ],
                          (this.filtersContainer = Flex({
                            noShrink: true,
                            marginLeft: "xs",
                            direction: "column",
                          })),
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ),
          (this.flashContainer = CreateElement({
            tag: "div",
            style: { top: "17px" },
            className: "js-flash-container js-flash-container--sticked",
          })),
        ],
      }),
    });
  }

  Close() {
    if (this.filteredReports.length > 0) {
      this.main.reports = [...this.main.reports, ...this.filteredReports];
      this.filteredReports = undefined;
    }

    this.toplayer.remove();
    this.main.moderators.all.splice(this.index, 1);
  }

  InitFilters() {
    this.filtersByName = {
      ContentType: new ContentType(this),
      Reporter: new Reporter(this),
      Reported: new Reported(this),
      DateRange: new DateRange(this),
      Subject: new SubjectFilter(this),
    };
    this.filters = Object.values(this.filtersByName);
  }

  BindListeners() {
    this.collapseToggleButton.addEventListener(
      "click",
      this.ToggleCollapse.bind(this),
    );
  }

  ToggleCollapse() {
    /**
     * @type {import("@style-guide/Icon").IconTypeType}
     */
    let firstArrowType = "arrow_up";
    /**
     * @type {import("@style-guide/Icon").IconTypeType}
     */
    let secondArrowType = "arrow_down";

    if (!IsVisible(this.builderContainer)) {
      firstArrowType = "arrow_down";
      secondArrowType = "arrow_up";

      this.container.append(this.builderContainer);
    } else {
      this.main.HideElement(this.builderContainer);
    }

    this.statusBar.Show();

    this.firstArrow.ChangeType(firstArrowType);
    this.secondArrow.ChangeType(secondArrowType);
  }

  FilterReports() {
    if (this.filteredReports.length > 0) {
      this.main.reports = [...this.filteredReports, ...this.main.reports];
      this.filteredReports = [];
    }

    let { reports } = this.main;
    this.main.reports = [];
    let filtersInUse = this.FiltersInUse();

    reports.forEach(report => {
      if (
        !report.deleted &&
        filtersInUse &&
        filtersInUse.length > 0 &&
        filtersInUse.every(filter => filter.CheckReport(report))
      )
        this.filteredReports.push(report);
      else {
        report.HideContainer();
        this.main.reports.push(report);
      }

      // eslint-disable-next-line no-param-reassign
      report = null;
    });

    reports = null;

    this.main.reports = this.main.reports.sort((a, b) =>
      a.reportDate.moment < b.reportDate.moment ? 1 : -1,
    );

    this.statusBar.numberOfFilteredReports.data = `${this.filteredReports.length}`;

    this.statusBar.HideExportButton();

    if (!filtersInUse || filtersInUse.length === 0) {
      this.preview.HideMoreButton();
      this.preview.HideReportsContainer();
      this.moderate.Hide();

      return;
    }

    filtersInUse = null;

    this.preview.ShowContainer();
    this.statusBar.Show();

    if (this.filteredReports.length === 0) {
      this.moderate.Hide();
      this.preview.HideReportsContainer();

      return;
    }

    this.moderate.Show();
    this.preview.ShowReports();
    this.statusBar.ShowExportButton();
  }

  FiltersInUse() {
    return this.filters.filter(filter => filter.IsUsed());
  }

  /**
   * @param {import("@/scripts/components/notification2").NotificationPropertiesType} props
   */
  Notification(props) {
    const element = notification(props);

    this.flashContainer.prepend(element);
  }

  ExportReports() {
    this.main.ExportReports(this.filteredReports);
  }

  StopModeration() {
    this.moderate.selectedModerateAction.PauseModerating();
  }
}
