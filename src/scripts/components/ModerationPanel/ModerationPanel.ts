import type {
  TicketDataType,
  UsersDataInReportedContentsType,
} from "@BrainlyAction";
import Action from "@BrainlyAction";
import { Button, Flex, Icon, Label, Spinner } from "@style-guide";
import type { Duration } from "moment";
import { duration, utc } from "moment";
import Modal from "../Modal3";
import notification from "../notification2";
import Question from "./ContentSection/Question";

type ListenersType = {
  onDelete: () => void;
  onClose: () => void;
};

export default class ModerationPanel {
  modal: Modal;

  data: TicketDataType;
  usersData: UsersDataInReportedContentsType[];
  listeners: ListenersType;

  duration: Duration;

  questionSection: Question;

  counterText: Text;
  prolongTimeButton: Button;
  buttonSpinner: HTMLDivElement;

  countdownIntervalId: NodeJS.Timeout;

  constructor(
    data: TicketDataType,
    usersData: UsersDataInReportedContentsType[],
    listeners: ListenersType,
  ) {
    this.data = data;
    this.usersData = usersData;
    this.listeners = listeners;

    this.duration = duration(data.ticket.time_left, "s");

    this.Render();
    this.Countdown();
  }

  Render() {
    this.modal = new Modal({
      size: "large",
      overlay: true,
      title: System.data.locale.moderationPanel.text,
      content: "",
      onClose: this.FinishModeration.bind(this),
    });

    this.RenderButtonSpinner();
    this.RenderCounter();
    this.RenderQuestionSection();

    this.modal.Open();
    console.log(this);
  }

  RenderButtonSpinner() {
    this.buttonSpinner = Spinner({
      overlay: true,
    });
  }

  RenderCounter() {
    const counterContainer = Flex({
      marginRight: "s",
      alignItems: "center",
      children: [
        Label({
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
            icon: new Icon({ color: "adaptive", type: "add_more" }),
          }),
        }),
      ],
    });

    this.modal.titleContainer.append(counterContainer);
  }

  RenderQuestionSection() {
    this.questionSection = new Question(this);
  }

  Countdown() {
    this.duration.subtract(1, "s");

    const inMilliseconds = this.duration.asMilliseconds();

    this.counterText.nodeValue = utc(inMilliseconds).format("mm:ss");

    if (inMilliseconds === 0) this.TimesUp();

    if (!this.countdownIntervalId)
      this.countdownIntervalId = setInterval(this.Countdown.bind(this), 1000);
  }

  TimesUp() {
    clearInterval(this.countdownIntervalId);

    this.countdownIntervalId = null;

    // TODO activate this
    // this.CloseModeration();
  }

  CloseModeration() {
    console.log(this);

    this.modal.Close();
    this.listeners.onClose();
  }

  async FinishModeration() {
    try {
      const resTicket = await new Action().CloseModerationTicket(
        this.data.task.id,
      );

      notification({
        type: !resTicket?.success ? "info" : "success",
        html:
          resTicket.message ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        html: System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.CloseModeration();
  }
}
