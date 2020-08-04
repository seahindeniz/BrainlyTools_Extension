import Build from "@/scripts/helpers/Build";
import InsertAfter from "@/scripts/helpers/InsertAfter";
import type { UsersDataInReportedContentsType } from "@BrainlyAction";
import { Flex } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import Horizontal from "@style-guide/Separator/Horizontal";
import type { ContentClassTypes } from "./Fetcher/Fetcher";
import Fetcher from "./Fetcher/Fetcher";
import LiveStatus from "./LiveStatus/LiveStatus";
import Queue from "./Queue/Queue";
import type AnswerClassType from "./Content/Answer";
import type QuestionClassType from "./Content/Question";

export default class ReportedContents {
  container: FlexElementType;
  actionContainerOnLeft: FlexElementType;
  filterLabelContainer: FlexElementType;
  actionContainerOnRight: FlexElementType;
  queueContainer: FlexElementType;

  contents: {
    all: ContentClassTypes[];
    byGlobalId: {
      [id: string]: QuestionClassType | AnswerClassType; // ContentClassTypes;
    };
    filtered: ContentClassTypes[];
  };

  questionsWaitingForSubscription: number[];

  userData: {
    [id: number]: UsersDataInReportedContentsType;
  };

  fetcher: Fetcher;
  liveStatus: LiveStatus;
  queue: Queue;

  constructor() {
    this.Render();
    this.contents = {
      all: [],
      byGlobalId: {},
      filtered: [],
    };
    this.questionsWaitingForSubscription = [];
    this.userData = {};

    this.queue = new Queue(this);
    this.liveStatus = new LiveStatus(this);
    this.fetcher = new Fetcher(this);
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
        className: "reported-contents-container", // TODO remove this
      }),
      [
        [
          // Head section
          Flex({
            marginBottom: "xs",
            marginLeft: "s",
            marginRight: "s",
            wrap: true,
            justifyContent: "space-around",
          }),
          [
            (this.actionContainerOnLeft = Flex({
              justifyContent: "flex-start",
            })),
            (this.filterLabelContainer = Flex({
              wrap: true,
              marginLeft: "s",
              alignItems: "center",
              justifyContent: "center",
            })),
            [
              (this.actionContainerOnRight = Flex({
                marginTop: "xs",
                marginBottom: "xs",
                grow: true,
                justifyContent: "flex-end",
                style: {
                  minWidth: "40px",
                  minHeight: "40px",
                },
              })),
            ],
          ],
        ],
        Horizontal(),
        [
          // Content section
          (this.queueContainer = Flex({
            wrap: true,
            className: "queue",
          })),
        ],
      ],
    );

    InsertAfter(this.container, mainContainer);
    mainContainer.remove();
  }
}
