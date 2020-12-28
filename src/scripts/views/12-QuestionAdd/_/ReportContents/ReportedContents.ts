import type { UsersDataInReportedContentsType } from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import storage from "@root/helpers/extStorage";
import InsertAfter from "@root/helpers/InsertAfter";
import ServerReq from "@ServerReq";
import { Flex } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type AnswerClassType from "./Content/Answer/Answer";
import type CommentClassType from "./Content/Comment";
import type QuestionClassType from "./Content/Question";
import type { ContentClassTypes } from "./Fetcher/Fetcher";
import Fetcher from "./Fetcher/Fetcher";
import LiveStatus from "./LiveStatus/LiveStatus";
import Moderator from "./Moderator/Moderator";
import { REPORTED_CONTENTS_LAZY_QUEUE_KEY } from "./Queue/Options/LazyQueue";
import {
  MIN_REPORT_BOXES_PER_SCROLL_LIMIT,
  REPORTED_CONTENTS_LOAD_LIMITER_KEY,
} from "./Queue/Options/LoadLimiter";
import { REPORTED_CONTENTS_AUTO_QUEUE_LOADER_KEY } from "./Queue/Options/ToggleAutoQueueLoader";
import Queue from "./Queue/Queue";
import ReportedContentsStatusBar from "./StatusBar";

export default class ReportedContents {
  container: FlexElementType;
  fetcherActionsContainer: FlexElementType;
  filterLabelContainer: FlexElementType;
  popupMenuContainer: FlexElementType;
  queueContainer: HTMLDivElement;

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
  defaults: {
    lazyQueue: boolean;
    autoQueueLoader: boolean;
    loadLimit: number;
  };

  constructor() {
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
    this.defaults = {
      lazyQueue: false,
      autoQueueLoader: true,
      loadLimit: null,
    };

    this.Init();
  }

  async Init() {
    await this.SetLazyQueueDefaultValue();
    await this.SetAutoQueueLoaderDefaultValue();
    await this.SetLoadLimiterDefaultValue();

    this.Render();

    this.statusBar = new ReportedContentsStatusBar(this);
    this.queue = new Queue(this);
    this.liveStatus = new LiveStatus(this);
    this.fetcher = new Fetcher(this);

    if (System.checkUserP(18)) {
      this.moderator = new Moderator(this);
    }

    new ServerReq().GetAllModerators();
  }

  async SetLazyQueueDefaultValue() {
    const value = await storage("get", REPORTED_CONTENTS_LAZY_QUEUE_KEY);

    this.defaults.lazyQueue = Boolean(value);
  }

  async SetAutoQueueLoaderDefaultValue() {
    const value = await storage("get", REPORTED_CONTENTS_AUTO_QUEUE_LOADER_KEY);

    this.defaults.autoQueueLoader = value === null ? true : Boolean(value);
  }

  async SetLoadLimiterDefaultValue() {
    const value = await storage("get", REPORTED_CONTENTS_LOAD_LIMITER_KEY);

    this.defaults.loadLimit =
      value === null ? MIN_REPORT_BOXES_PER_SCROLL_LIMIT : Number(value);
  }

  Render() {
    const mainContainer = document.querySelector(".js-main-container");

    if (!mainContainer) throw Error("Can't find main container element");

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
          (this.queueContainer = CreateElement({
            tag: "div",
            className: "queue",
          })),
        ],
      ],
    );

    InsertAfter(this.container, mainContainer);
    mainContainer.remove();
  }
}
