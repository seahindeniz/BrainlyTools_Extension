import type {
  TicketDataType,
  UsersDataInReportedContentsType,
} from "@BrainlyAction";
import Action from "@BrainlyAction";
import { GQL } from "@BrainlyReq";
import { Modal } from "@components";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import {
  Button,
  Flex,
  Icon,
  LabelDeprecated,
  SeparatorHorizontal,
  Spinner,
  Text as TextComponent,
} from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import type { Duration, Moment } from "moment";
import { duration, utc } from "moment";
import notification from "../notification2";
import Answer from "./ContentSection/Answer";
import Question from "./ContentSection/Question";
import {
  ModeratePanelQuestionExtraDetailsQuery,
  ModeratePanelQuestionExtraDetailsType,
} from "./extraDetails.query";
import LogSection from "./LogSection/LogSection";
import Switcher from "./Switcher";

export type ModeratePanelActionType = "delete" | "confirm";

type ListenersType = {
  onModerate: (
    id: number,
    action: ModeratePanelActionType,
    contentType: ContentNameType,
  ) => void;
  onClose: () => void;
  switchNext: (event: MouseEvent) => void;
  switchPrevious: (event: MouseEvent) => void;
};

const PANEL_CLOSE_TIMEOUT_IN_SECONDS = 4;

export default class ModerationPanel {
  modal: Modal;

  data: TicketDataType;
  usersData: UsersDataInReportedContentsType[];
  listeners: ListenersType;

  duration: Duration;
  timeElements: {
    timeInstance: Moment;
    lastPrintedTime: string;
    node: Text;
  }[];

  questionSection: Question;

  counterText: Text;
  prolongTimeButton: Button;
  buttonSpinner: HTMLDivElement;

  countdownIntervalId: number;
  answerSections: Answer[];
  contentContainer: FlexElementType;
  questionSectionContainer: FlexElementType;
  answerSectionContainer: FlexElementType;
  logSection: LogSection;
  switcher: Switcher;
  smallSpinner: HTMLDivElement;
  isClosing: boolean;

  constructor(
    data: TicketDataType,
    usersData: UsersDataInReportedContentsType[],
    listeners: ListenersType,
  ) {
    this.data = data;
    this.usersData = usersData;
    this.listeners = listeners;

    this.answerSections = [];

    this.timeElements = [];

    this.SetTicketDuration();
    this.Init();
  }

  SetTicketDuration() {
    this.duration = duration(this.data.ticket.time_left, "s");
  }

  Init() {
    try {
      this.Render();
      this.Countdown();
      this.FetchExtraDetails();
    } catch (error) {
      console.error(error);

      if (this.modal)
        this.modal.Notification({
          type: "error",
          html:
            error.msg ||
            System.data.locale.common.notificationMessages.somethingWentWrong,
        });
    }
  }

  Render() {
    this.modal = new Modal({
      size: "large",
      overlay: true,
      jumpButton: true,
      closeOnOuterClick: true,
      title: System.data.locale.moderationPanel.text,
      content: this.contentContainer = Flex({
        fullWidth: true,
        direction: "column",
        children: Flex({
          marginBottom: "xs",
          marginLeft: "s",
          children: TextComponent({
            tag: "a",
            color: "peach-dark",
            weight: "bold",
            text: `#${this.data.task.id}`,
            target: "_blank",
            href: System.createBrainlyLink("question", this.data.task),
          }),
        }),
      }),
      onClose: this.FinishModeration.bind(this),
    });

    this.RenderButtonSpinner();
    this.RenderSmallSpinner();
    this.RenderCounter();
    this.RenderQuestionSection();
    this.RenderAnswerSections();
    this.RenderLogsSection();
    this.RenderSwitchButtons();

    this.modal.Open();
  }

  RenderButtonSpinner() {
    this.buttonSpinner = Spinner({
      overlay: true,
    });
  }

  RenderSmallSpinner() {
    this.smallSpinner = Spinner({
      blur: true,
      overlay: true,
      size: "xsmall",
    });
  }

  RenderCounter() {
    const counterContainer = Flex({
      marginRight: "s",
      alignItems: "center",
      children: [
        LabelDeprecated({
          color: "peach",
          type: "transparent-color",
          icon: {
            type: "counter",
          },
          children: this.counterText = document.createTextNode(""),
        }),
        Flex({
          children: this.prolongTimeButton = new Button({
            size: "s",
            type: "transparent",
            toggle: "blue",
            iconOnly: true,
            onClick: this.ProlongModerationTime.bind(this),
            icon: new Icon({ color: "adaptive", type: "add_more" }),
          }),
        }),
      ],
    });

    this.modal.titleContainer.append(counterContainer);
  }

  RenderQuestionSection() {
    this.questionSection = new Question(this);

    this.contentContainer.appendChild(this.questionSection.container);
  }

  RenderAnswerSections() {
    const { length } = this.data.responses;

    if (length === 0) return;

    this.answerSectionContainer = Build(
      Flex({
        marginBottom: "s",
        direction: "column",
      }),
      [
        [
          Flex({
            marginBottom: "xs",
            marginLeft: "s",
          }),
          TextComponent({
            weight: "extra-bold",
            text: System.data.locale.moderationPanel.answers.replace(
              "%{number_of_answers}",
              String(length),
            ),
          }),
        ],
      ],
    );

    this.RenderSeparator();
    this.contentContainer.append(this.answerSectionContainer);

    this.data.responses.forEach((answerData, index) => {
      const answerSection = new Answer(this, answerData);

      this.answerSections.push(answerSection);
      this.answerSectionContainer.appendChild(answerSection.container);

      if (index + 1 === length) return;

      answerSection.container.ChangeMargin({ marginBottom: "s" });
    });
  }

  private RenderSeparator() {
    this.contentContainer.append(
      SeparatorHorizontal({
        type: "spaced",
      }),
    );
  }

  RenderLogsSection() {
    this.logSection = new LogSection(this);

    this.RenderSeparator();
    this.contentContainer.append(this.logSection.container);
  }

  RenderSwitchButtons() {
    if (!this.listeners.switchNext && !this.listeners.switchPrevious) return;

    this.switcher = new Switcher(this);
  }

  async ProlongModerationTime() {
    try {
      this.prolongTimeButton.element.append(this.smallSpinner);

      const resProlong = await new Action().ProlongModerationTicket({
        model_id: this.data.task.id,
        model_type_id: "Question",
        ticket_id: this.data.ticket.id,
      });

      if (resProlong.success === false) {
        this.modal.Notification({
          type: "info",
          html:
            resProlong.message ||
            System.data.locale.common.notificationMessages.somethingWentWrong,
        });

        this.HideSmallSpinner();

        return;
      }

      this.data.ticket.time_left = resProlong.data.time_left;

      this.SetTicketDuration();
      this.Countdown();
    } catch (error) {
      console.error(error);
      this.modal.Notification({
        type: "error",
        html: System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.HideSmallSpinner();
  }

  Countdown() {
    this.duration.subtract(1, "s");

    const inMilliseconds = this.duration.asMilliseconds();

    this.counterText.nodeValue = utc(inMilliseconds).format("mm:ss");

    if (inMilliseconds === 0) this.TimesUp();

    if (!this.countdownIntervalId)
      this.countdownIntervalId = window.setInterval(
        this.Countdown.bind(this),
        1000,
      );

    this.UpdateTimeValues();
  }

  TimesUp() {
    clearInterval(this.countdownIntervalId);

    this.countdownIntervalId = null;

    this.CloseModeration();
  }

  CloseModeration() {
    if (!this.modal) return;

    this.modal.Close();
    this.listeners.onClose();

    (this.modal.overlay || this.modal.toplayer.element).remove();

    this.modal = null;

    this.questionSection.gallery?.destroy();
    this.answerSections.forEach(answerSection =>
      answerSection.gallery?.destroy(),
    );
  }

  async FinishModeration(ignoreTicketDelay?: boolean) {
    if (this.isClosing) return;

    this.isClosing = true;

    this.modal.toplayer.closeIconContainer.append(this.smallSpinner);

    if (ignoreTicketDelay === true) this.ExpireModerationTicket();
    else await this.ExpireModerationTicket();

    this.TimesUp();
  }

  async ExpireModerationTicket() {
    try {
      const resTicket = await new Action().CloseModerationTicket(
        this.data.task.id,
      );

      notification({
        timeOut: 3000,
        type: !resTicket?.success ? "info" : "success",
        html:
          resTicket.message ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    } catch (error) {
      this.isClosing = false;

      console.error(error);
      notification({
        type: "error",
        html: System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.HideSmallSpinner();
  }

  HideSmallSpinner() {
    HideElement(this.smallSpinner);
  }

  UpdateTimeValues() {
    if (this.timeElements.length === 0) return;

    this.timeElements.forEach(entry => {
      if (!entry.node || !entry.timeInstance) return;

      const currentTime = entry.timeInstance.fromNow();

      if (currentTime === entry.lastPrintedTime) return;

      entry.node.nodeValue = currentTime;
      entry.lastPrintedTime = currentTime;
    });
  }

  async FetchExtraDetails() {
    const questionGlobalId = btoa(`question:${this.data.task.id}`);

    const resExtraData = await GQL<ModeratePanelQuestionExtraDetailsType>(
      ModeratePanelQuestionExtraDetailsQuery,
      {
        id: questionGlobalId,
      },
    );

    if (!resExtraData?.data) {
      throw Error("Can't fetch extra details");
    }

    const answers = resExtraData.data.question.answers.nodes;

    delete resExtraData.data.question.answers.nodes;

    this.questionSection.extraData = resExtraData.data.question;

    this.questionSection.RenderExtraDetails();

    answers.forEach(answerData => {
      const answerId = System.DecryptId(answerData.id);
      const answerSection = this.answerSections.find(_answerSection => {
        return _answerSection.data.id === answerId;
      });

      if (!answerSection) {
        console.error(`Can't find answer section of ${answerId}`);

        return;
      }

      answerSection.extraData = answerData;

      answerSection.RenderExtraDetails();
    });
  }

  CloseModerationSomeTimeLater() {
    let remaining = PANEL_CLOSE_TIMEOUT_IN_SECONDS;

    const counterNode = document.createTextNode(String(remaining));
    const textPieces: (
      | string
      | Text
    )[] = System.data.locale.moderationPanel.panelWillClose.split(
      "%{remain_N}",
    );

    textPieces.splice(1, 0, counterNode);

    this.modal.Notification({
      type: "info",
      text: textPieces,
    });

    const loop = window.setInterval(() => {
      counterNode.nodeValue = String(--remaining);

      if (remaining > 0) return;

      clearInterval(loop);
      this.CloseModeration();
    }, 1000);
  }
}
