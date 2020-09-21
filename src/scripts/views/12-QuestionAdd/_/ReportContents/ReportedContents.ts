import type { UsersDataInReportedContentsType } from "@BrainlyAction";
import Build from "@root/helpers/Build";
import InsertAfter from "@root/helpers/InsertAfter";
import { Flex } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type AnswerClassType from "./Content/Answer";
import type CommentClassType from "./Content/Comment";
import type QuestionClassType from "./Content/Question";
import type { ContentClassTypes } from "./Fetcher/Fetcher";
import Fetcher from "./Fetcher/Fetcher";
import LiveStatus from "./LiveStatus/LiveStatus";
import Moderator from "./Moderator/Moderator";
import Queue from "./Queue/Queue";
import ReportedContentsStatusBar from "./StatusBar";

export default class ReportedContents {
  container: FlexElementType;
  fetcherActionsContainer: FlexElementType;
  filterLabelContainer: FlexElementType;
  popupMenuContainer: FlexElementType;
  queueContainer: FlexElementType;

  contents: {
    all: ContentClassTypes[];
    byGlobalId: {
      all: {
        [id: string]: QuestionClassType | AnswerClassType | CommentClassType; // ContentClassTypes;
      };
      fetchDetails: {
        [id: string]: QuestionClassType | AnswerClassType; // ContentClassTypes;
      };
    };
    filtered: ContentClassTypes[];
    waitingForExtraDetails: ContentClassTypes[];
  };

  questionsWaitingForSubscription: number[];

  userData: {
    [id: number]: UsersDataInReportedContentsType;
  };

  fetcher: Fetcher;
  liveStatus: LiveStatus;
  queue: Queue;
  actionsContainer: FlexElementType;
  moderator?: Moderator;
  actionsContainerLeftSide: FlexElementType;
  statusBar: ReportedContentsStatusBar;

  constructor() {
    this.Render();
    this.contents = {
      all: [],
      byGlobalId: {
        all: {},
        fetchDetails: {},
      },
      filtered: [],
      waitingForExtraDetails: [],
    };
    this.questionsWaitingForSubscription = [];
    this.userData = {};

    this.statusBar = new ReportedContentsStatusBar(this);
    this.queue = new Queue(this);
    this.liveStatus = new LiveStatus(this);
    this.fetcher = new Fetcher(this);

    if (System.checkUserP(18)) {
      this.moderator = new Moderator(this);
    }
  }

  Render() {
    const mainContainer = document.querySelector(".js-main-container");

    if (!mainContainer) return;

    mainContainer.innerHTML = "";

    this.container = Build(
      Flex({
        wrap: true,
        marginTop: "xs",
        direction: "column",
        className: "reported-contents-container", // TODO remove this className
      }),
      [
        [
          // Head section
          (this.actionsContainer = Flex({
            marginBottom: "xs",
            marginLeft: "s",
            marginRight: "s",
            wrap: true,
            justifyContent: "space-between",
            className: "actionsContainer", // TODO remove this className
          })),
          [
            [
              (this.actionsContainerLeftSide = Flex({
                grow: true,
                direction: "column",
                className: "actionsContainerLeftSide", // TODO remove this className
              })),
              [
                [
                  Flex({ grow: true, justifyContent: "space-between" }),
                  [
                    (this.filterLabelContainer = Flex({
                      grow: true,
                      wrap: true,
                      alignItems: "center",
                      justifyContent: "center",
                      className: "filterLabelContainer", // TODO remove this className
                    })),
                    [
                      (this.popupMenuContainer = Flex({
                        marginTop: "xs",
                        marginBottom: "xs",
                        direction: "row-reverse",
                        className: "popupMenuContainer", // TODO remove this className
                      })),
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
        [
          // Content section
          (this.queueContainer = Flex({
            wrap: true,
            borderTop: true,
            className: "queue",
          })),
        ],
      ],
    );

    InsertAfter(this.container, mainContainer);
    mainContainer.remove();
  }
}
