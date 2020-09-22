import Action, {
  ModerationTicketDataType,
  RemoveAnswerReqDataType,
  RemoveCommentReqDataType,
  RemoveQuestionReqDataType,
  ReportedContentDataType,
  UsersDataInReportedContentsType,
} from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Avatar, Box, Button, Flex, Icon, Spinner, Text } from "@style-guide";
import type { BoxColorType } from "@style-guide/Box";
import type { ButtonColorType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import { IconColorType } from "@style-guide/Icon";
import type { TextElement } from "@style-guide/Text";
import moment from "moment-timezone";
import tippy from "tippy.js";
import type { ModeratorDataType } from "../LiveStatus/LiveStatus";
import type ReportedContentsType from "../ReportedContents";
import QuickDeleteButton from "./QuickDeleteButton";

type StatusNamesType =
  | "default"
  | "deleted"
  | "confirmed"
  | "failed"
  | "reserved"
  | "moderating";

const STATUS_COLOR: {
  default?: BoxColorType;
  deleted: BoxColorType;
  confirmed: BoxColorType;
  failed: BoxColorType;
  reserved: BoxColorType;
  moderating: BoxColorType;
} = {
  deleted: "peach-secondary-light",
  confirmed: "mint-secondary-light",
  failed: "dark",
  reserved: "gray-secondary-lightest",
  moderating: "blue-secondary-light",
};

const CONTENT_TYPE_ICON_COLOR: {
  Question: ButtonColorType;
  Answer: ButtonColorType;
  Comment: ButtonColorType;
} = {
  Question: { type: "solid-blue" },
  Answer: { type: "solid-mint" },
  Comment: { type: "solid" },
};

export default class Content {
  main: ReportedContentsType;
  data: ReportedContentDataType;
  globalId: string;
  contentType: ContentNameType;

  users: {
    reporter?: {
      nick: string;
      profileLink: string;
      data: UsersDataInReportedContentsType;
    };
    reported: {
      nick: string;
      profileLink: string;
      data: UsersDataInReportedContentsType;
    };
  };

  dates: {
    create: {
      moment: moment.Moment;
      tzFormatted: string;
      localFormatted: string;
      lastPrintedRelativeTime: string;
    };
    report?: {
      moment: moment.Moment;
      tzFormatted: string;
      localFormatted: string;
      lastPrintedRelativeTime: string;
    };
  };

  has: StatusNamesType;

  container: HTMLDivElement;
  box: Box;
  moderateActionContainer: FlexElementType;
  moderateButton: Button;
  createDateText: TextElement<"i">;
  reportDateText: TextElement<"span">;
  reportDetailContainer: FlexElementType;
  quickDeleteButtonContainer: FlexElementType;
  confirmButtonContainer: FlexElementType;
  confirmButton: Button;
  buttonSpinner: HTMLDivElement;
  moderatorContainer: FlexElementType;
  extraDetailsContainer: FlexElementType;
  quickDeleteButtons: QuickDeleteButton[];

  constructor({
    main,
    data,
    contentType,
  }: {
    main: ReportedContentsType;
    data: ReportedContentDataType;
    contentType: ContentNameType;
  }) {
    this.main = main;
    this.data = data;
    this.contentType = contentType;

    this.quickDeleteButtons = [];
    this.globalId = btoa(`${contentType.toLowerCase()}:${data.model_id}`);

    this.users = {
      reporter: undefined,
      reported: {
        nick: (this.main.userData[data.user?.id || 0].nick || "").toLowerCase(),
        profileLink: System.createProfileLink(
          this.main.userData[data.user?.id || 0],
        ),
        data: this.main.userData[data.user?.id || 0],
      },
    };

    if (this.data.report)
      this.users.reporter = {
        nick: (
          this.main.userData[data.report?.user?.id || 0].nick || ""
        ).toLowerCase(),
        profileLink: System.createProfileLink(
          this.main.userData[data.report?.user?.id || 0],
        ),
        data: this.main.userData[data.report?.user?.id || 0],
      };

    this.SetDates();
  }

  SetDates() {
    moment.locale(navigator.language);

    const createDate = moment(this.data?.created);
    const createDateTz = moment(this.data?.created).tz(
      System.data.Brainly.defaultConfig.config.data.config.timezone,
    );

    this.dates = {
      create: {
        moment: createDate,
        tzFormatted: createDateTz.format("L LT Z"),
        localFormatted: createDate.format("L LT"),
        lastPrintedRelativeTime: "",
      },
    };

    if (this.data.report) {
      const reportDate = moment(this.data.report?.created);
      const reportDateTz = moment(this.data.report?.created).tz(
        System.data.Brainly.defaultConfig.config.data.config.timezone,
      );
      this.dates.report = {
        moment: reportDate,
        tzFormatted: reportDateTz.format("L LT Z"),
        localFormatted: reportDate.format("L LT"),
        lastPrintedRelativeTime: "",
      };
    }
  }

  Render() {
    const subjectData = System.data.Brainly.defaultConfig.config.data.subjects.find(
      data => data.id === this.data.subject_id,
    );

    let reportFlagColor: IconColorType = "blue";

    if (this.data.report) reportFlagColor = "peach";
    else if (this.data.corrected) reportFlagColor = "blue";

    this.container = Build(
      CreateElement({
        tag: "div",
        className: "report-item-wrapper",
        onMouseenter: this.RenderButtons.bind(this),
      }),
      [
        [
          Flex({
            direction: "column",
            className: "r-c-b-c",
            fullHeight: true,
          }),
          [
            [
              (this.box = new Box({
                border: false,
                fullHeight: true,
                padding: "s",
              })),
              [
                [
                  Flex({
                    direction: "column",
                    fullHeight: true,
                    justifyContent: "space-between",
                  }),
                  [
                    [
                      Flex({
                        noShrink: true,
                        fullWidth: true,
                        alignItems: "center",
                        justifyContent: "space-between",
                      }),
                      [
                        [
                          Flex({ marginRight: "s" }),
                          [
                            [
                              Flex({
                                marginRight: "s",
                                tag: "a",
                                target: "_blank",
                                href: System.createBrainlyLink("question", {
                                  id: this.data.task_id,
                                }),
                              }),
                              [
                                [
                                  Flex({ alignItems: "center" }),
                                  new Button({
                                    ...CONTENT_TYPE_ICON_COLOR[
                                      this.contentType
                                    ],
                                    size: "s",
                                    iconOnly: true,
                                    icon: Text({
                                      breakWords: true,
                                      color: "white",
                                      text: this.contentType[0],
                                    }),
                                  }),
                                ],
                                [
                                  Flex({
                                    marginLeft: "xs",
                                    alignItems: "center",
                                    direction: "column",
                                  }),
                                  [
                                    Text({
                                      href: "",
                                      size: "small",
                                      weight: "bold",
                                      text: subjectData.name,
                                    }),
                                    Text({
                                      href: "",
                                      size: "small",
                                      weight: "bold",
                                      text: this.data.task_id,
                                    }),
                                  ],
                                ],
                              ],
                            ],
                            [
                              Flex({ direction: "column" }),
                              [
                                [
                                  Flex({ alignItems: "center" }),
                                  Text({
                                    breakWords: true,
                                    tag: "a",
                                    size: "small",
                                    weight: "bold",
                                    target: "_blank",
                                    text: this.users.reported.data.nick,
                                    href: this.users.reported.profileLink,
                                  }),
                                ],
                                [
                                  Flex({
                                    alignItems: "center",
                                  }),
                                  (this.createDateText = Text({
                                    tag: "span",
                                    size: "xsmall",
                                    weight: "bold",
                                    breakWords: true,
                                    color: "gray-secondary",
                                    title: `${this.dates.create.localFormatted}\n${this.dates.create.tzFormatted}`,
                                  })),
                                ],
                              ],
                            ],
                          ],
                        ],
                        [
                          (this.moderateActionContainer = Flex()),
                          [
                            [
                              Flex(),
                              (this.moderateButton = new Button({
                                type: "outline",
                                toggle: "blue",
                                iconOnly: true,
                                onClick: this.Moderate.bind(this),
                                icon: new Icon({
                                  type: "pencil",
                                  color: "adaptive",
                                }),
                              })),
                            ],
                          ],
                        ],
                      ],
                    ],
                    [
                      Flex({
                        marginTop: "s",
                        marginBottom: "m",
                        grow: true,
                      }),
                      [
                        [
                          Flex({ grow: true }),
                          Text({
                            breakWords: true,
                            size: "small",
                            html: this.data.content_short,
                          }),
                        ],
                      ],
                    ],
                    (this.extraDetailsContainer = Flex({
                      alignItems: "center",
                      marginBottom: "s",
                      marginTop: "xs",
                    })),
                    [
                      Flex({
                        wrap: true,
                        relative: true,
                        className: "footer",
                        justifyContent: "space-between",
                      }),
                      [
                        [
                          (this.reportDetailContainer = Flex({
                            className: "footer-left-side", // TODO remove this className
                          })),
                          [
                            [
                              Flex({
                                marginLeft: "xxs",
                                marginRight: "xxs",
                                alignItems: "center",
                              }),
                              new Icon({
                                type: "report_flag",
                                color: reportFlagColor,
                              }),
                            ],
                          ],
                        ],
                        [
                          (this.quickDeleteButtonContainer = Flex({
                            grow: true,
                            alignItems: "center",
                            justifyContent: "flex-end",
                            className: "footer-right-side", // TODO remove this className
                          })),
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    );

    if (this.has) {
      this.ChangeBoxColor();
    }

    this.RenderExtraDetails();
    this.RenderButtonSpinner();

    if (this.data.report) {
      this.RenderReportDetails();
    }

    this.TryToRenderButtons();

    tippy(this.moderateButton.element, {
      theme: "light",
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.common.moderating.moderate,
      }),
    });
  }

  ChangeBoxColor() {
    if (!this.box) return;

    const status = STATUS_COLOR[this.has] || STATUS_COLOR.default;

    if (status) this.box.ChangeColor(status);
  }

  // eslint-disable-next-line class-methods-use-this
  RenderExtraDetails() {
    //
  }

  async TryToRenderButtons() {
    if (
      this.main.queueContainer.classList.contains(
        "buttons-visibility-always",
      ) ||
      (document.documentElement.classList.contains("mobile") &&
        !this.main.queueContainer.classList.contains(
          "buttons-visibility-on-hover",
        ))
    )
      this.RenderButtons();
  }

  RenderButtons() {
    if (this.confirmButtonContainer || this.quickDeleteButtons.length > 0)
      return;

    this.RenderQuickDeleteButtons();
    this.RenderConfirmButton();
  }

  RenderQuickDeleteButtons() {
    if (
      !System.checkUserP(
        this.contentType === "Question"
          ? 1
          : this.contentType === "Answer"
          ? 2
          : 45,
      ) ||
      !System.checkBrainlyP(102)
    )
      return;

    const thisIs = this.contentType.toLocaleLowerCase() as
      | "answer"
      | "comment"
      | "question";
    const reasonIds = System.data.config.quickDeleteButtonsReasons[thisIs];
    // eslint-disable-next-line no-underscore-dangle
    const reasons = System.data.Brainly.deleteReasons.__withIds[thisIs];

    if (
      !reasonIds ||
      reasonIds.length === 0 ||
      !reasons ||
      Object.keys(reasons).length === 0
    ) {
      console.error("Cannot find reasons", reasonIds, reasons);

      return;
    }

    reasonIds.forEach((reasonId, i) => {
      const reason = reasons[reasonId];

      if (!reason) {
        console.error("Cannot find reason", reasonId);

        return;
      }

      const quickDeleteButton = new QuickDeleteButton(this, reason, i + 1);

      this.quickDeleteButtonContainer.append(quickDeleteButton.container);
      this.quickDeleteButtons.push(quickDeleteButton);
    });
  }

  RenderConfirmButton() {
    if (
      this.contentType === "Answer" &&
      System.checkBrainlyP(146) &&
      !System.checkUserP(38)
    )
      return;

    this.confirmButtonContainer = Flex({
      marginTop: "xxs",
      marginBottom: "xxs",
      marginLeft: "xs",
      title: System.data.locale.common.confirm,
      children: this.confirmButton = new Button({
        type: "solid-mint",
        iconOnly: true,
        icon: new Icon({ type: "check" }),
        onClick: this.Confirm.bind(this),
      }),
    });

    tippy(this.confirmButton.element, {
      theme: "light",
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.common.confirm,
      }),
    });

    this.quickDeleteButtonContainer.append(this.confirmButtonContainer);
  }

  RenderButtonSpinner() {
    this.buttonSpinner = Spinner({ overlay: true });
  }

  RenderReportDetails() {
    const container = Build(document.createDocumentFragment(), [
      [
        Flex({
          marginRight: "s",
          direction: "column",
          justifyContent: "center",
        }),
        [
          [
            Flex(),
            Text({
              tag: "a",
              size: "small",
              weight: "bold",
              target: "_blank",
              breakWords: true,
              text: this.users.reporter && this.users.reporter.data.nick,
              href:
                (this.users.reporter && this.users.reporter.profileLink) || "",
            }),
          ],
          [
            Flex({
              alignItems: "center",
            }),
            (this.reportDateText = Text({
              tag: "span",
              size: "xsmall",
              color: "gray-secondary",
              weight: "bold",
              breakWords: true,
              title:
                this.dates.report &&
                `${this.dates.report.localFormatted}\n${this.dates.report.tzFormatted}`,
            })),
          ],
        ],
      ],
      [
        Flex({
          marginRight: "s",
          alignItems: "center",
        }),
        Text({
          size: "small",
          color: "gray",
          weight: "bold",
          breakWords: true,
          text: this.data.report?.abuse?.name || "",
        }),
      ],
    ]);

    this.reportDetailContainer.append(container);
  }

  RenderTimes() {
    if (!this.container || !IsVisible(this.container)) return;

    const currentCreationTime = this.dates.create.moment.fromNow();

    if (this.dates.create.lastPrintedRelativeTime !== currentCreationTime) {
      this.createDateText.innerText = currentCreationTime;
      this.dates.create.lastPrintedRelativeTime = currentCreationTime;
    }

    if (this.reportDateText && this.dates.report) {
      const currentReportingTime = this.dates.report.moment.fromNow();

      if (
        this.dates.report &&
        this.dates.report.lastPrintedRelativeTime !== currentReportingTime
      ) {
        this.dates.report.lastPrintedRelativeTime = currentReportingTime;
        this.reportDateText.innerText = currentReportingTime;
      }
    }
  }

  Moderate(): Promise<ModerationTicketDataType> {
    if (this.has !== "deleted") {
      this.has = "moderating";

      this.ChangeBoxColor();
    }

    this.DisableActions();
    this.moderateButton?.Disable();
    this.moderateButton?.element.append(this.buttonSpinner);

    return this.main.queue.moderationPanelController.ModerateContent(this);
  }

  async Confirm() {
    try {
      await this.Confirming();

      if (
        !confirm(
          System.data.locale.userContent.notificationMessages
            .doYouWantToConfirmThisContent,
        )
      ) {
        this.NotConfirming();

        return;
      }

      const resConfirm = await this.ExpressConfirm();

      if (!resConfirm)
        notification({
          html: System.data.locale.common.notificationMessages.operationError,
          type: "error",
        });
      else if (!resConfirm.success) {
        notification({
          html:
            resConfirm.message ||
            System.data.locale.common.notificationMessages.somethingWentWrong,
          type: "error",
        });
      } else {
        System.log(
          this.data.model_type_id === 1
            ? 19
            : this.data.model_type_id === 2
            ? 20
            : 21,
          {
            user: {
              id: this.users.reported.data.id,
              nick: this.users.reported.data.nick,
            },
            data: [this.data.model_id],
          },
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async ExpressConfirm() {
    try {
      await this.Confirming();

      const resConfirm = await new Action().ConfirmContent(
        this.data.model_id,
        this.data.model_type_id,
      );
      // const resConfirm = {
      //   success: !!Math.floor(Math.random() * 2),
      //   message: "Failed",
      // };
      // await System.TestDelay(1, 50);

      // console.log(resConfirm);

      this.has = "failed";

      if (resConfirm?.success) {
        this.Confirmed();
      }

      this.ChangeBoxColor();
      this.NotConfirming();

      return resConfirm;
    } catch (error) {
      console.error(error);
      this.ChangeBoxColor();
      this.NotConfirming();

      return Promise.reject(error);
    }
  }

  Confirming() {
    this.confirmButton?.Disable();
    this.confirmButton?.element.append(this.buttonSpinner);

    return this.DisableActions();
  }

  Confirmed() {
    this.has = "confirmed";

    this.confirmButtonContainer?.remove();
  }

  NotConfirming() {
    this.confirmButton?.Enable();
    this.NotOperating();
  }

  NotOperating() {
    this.HideSpinner();
    this.EnableActions();
  }

  HideSpinner() {
    HideElement(this.buttonSpinner);
    this.EnableActions();
  }

  DisableActions() {
    this.container?.classList.add("operating");
    this.quickDeleteButtonContainer?.classList.add("js-disabled");

    return System.Delay(50);
  }

  EnableActions() {
    this.container?.classList.remove("operating");
    this.quickDeleteButtonContainer?.classList.remove("js-disabled");
  }

  // eslint-disable-next-line class-methods-use-this
  UserModerating(data: ModeratorDataType) {
    if (!this.moderateActionContainer) return;

    if (this.moderatorContainer) {
      this.moderatorContainer.remove();
    }

    const profileLink = System.createProfileLink(data);

    this.moderatorContainer = Build(
      Flex({
        marginRight: "s",
      }),
      [
        [
          Flex({
            marginRight: "xs",
            alignItems: "center",
          }),
          Text({
            size: "small",
            weight: "bold",
            text: data.nick,
            target: "_blank",
            href: profileLink,
          }),
        ],
        [
          Flex({
            alignItems: "center",
          }),
          Avatar({
            size: "m",
            title: data.nick,
            target: "_blank",
            link: profileLink,
            imgSrc: data.avatar,
          }),
        ],
      ],
    );

    this.moderateActionContainer.prepend(this.moderatorContainer);
  }

  async ExpressDelete(
    data:
      | RemoveQuestionReqDataType
      | RemoveAnswerReqDataType
      | RemoveCommentReqDataType,
    methodName?: "RemoveQuestion" | "RemoveAnswer" | "RemoveComment",
  ) {
    try {
      await this.DisableActions();

      const resDelete = await new Action()[methodName]({
        ...data,
        model_id: this.data.model_id,
      });
      /* console.log(methodName, {
        ...data,
        model_id: this.data.model_id,
      });
      const resDelete = { success: false, message: "Failed" };
      await System.TestDelay(1, 50); */

      this.has = "failed";

      if (resDelete?.success) {
        this.Deleted();
      }

      this.ChangeBoxColor();
      this.NotOperating();

      return resDelete;
    } catch (error) {
      console.error(error);

      this.ChangeBoxColor();
      this.NotOperating();

      return Promise.reject(error);
    }
  }

  Deleted() {
    this.has = "deleted";

    this.ChangeBoxColor();
    this.quickDeleteButtonContainer?.remove();
  }
}
