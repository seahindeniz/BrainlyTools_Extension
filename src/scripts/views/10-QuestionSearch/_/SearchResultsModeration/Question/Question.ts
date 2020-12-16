import Action, { RemoveQuestionReqDataType } from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import InsertBefore from "@root/helpers/InsertBefore";
import {
  Avatar,
  Button,
  Checkbox,
  Flex,
  Icon,
  Label,
  Spinner,
  Text,
} from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import mime from "mime-types";
import tippy from "tippy.js";
import Viewer from "viewerjs";
import { ExtraDetailsQuestionType } from "../extraDetails.fragment";
import type FeedModerationClassType from "../SearchResultsModeration";
import QuickDeleteButton from "./QuickDeleteButton";

export default class Question {
  private main: FeedModerationClassType;
  questionLinkAnchor: HTMLAnchorElement;
  questionId: number;
  private author: {
    id: number;
    nick: string;
  };

  #container: HTMLDivElement;

  private actionButtonsContainer: FlexElementType;
  private leftActionButtonContainer: FlexElementType;
  private rightActionButtonContainer: FlexElementType;
  private moderateButton: Button;
  private actionButtons: Button[];
  deleted: boolean;
  private deleting: boolean;
  #actionButtonSpinner: HTMLDivElement;
  checkbox: Checkbox;
  private checkboxContainer: FlexElementType;
  private questionContainer: HTMLDivElement;

  extraDetails: ExtraDetailsQuestionType;
  private iconContainer: FlexElementType;
  #verifiedIcon: HTMLDivElement;
  private footerContainer: HTMLDivElement;
  private attachmentContainer: FlexElementType;
  private contentContainer: HTMLDivElement;
  private quickActionButtonContainer: HTMLDivElement;

  constructor(
    main: FeedModerationClassType,
    container: HTMLDivElement,
    questionLinkAnchor: HTMLAnchorElement,
    questionId: number,
  ) {
    this.main = main;
    this.questionLinkAnchor = questionLinkAnchor;
    this.questionId = questionId;

    if (System.checkUserP([14, 26]) && System.checkBrainlyP(102)) {
      this.RenderCheckbox();
    }

    // Trigger setter fn
    this.container = container;
    this.actionButtons = [];
  }

  get container() {
    return this.#container;
  }

  set container(container: HTMLDivElement) {
    this.#container = container;

    this.FindQuestionContainer();
    this.FindContentContainer();
    this.FindFooterContainer();
    this.FindQuickActionButtonContainer();
    this.AddIconContainer();
    this.RelocateVerifiedBadge();
    this.ShowCheckbox();
    this.RenderExtraDetails();
    this.BindListeners();
  }

  private FindQuestionContainer() {
    this.questionContainer = this.questionLinkAnchor
      .firstElementChild as HTMLDivElement;

    if (this.questionContainer) return;

    console.info(this.questionLinkAnchor);
    throw Error("Can't find question container");
  }

  private FindContentContainer() {
    this.contentContainer = this.questionContainer.lastElementChild
      .firstElementChild as HTMLDivElement;

    if (this.contentContainer) return;

    console.info(this.#container);
    throw Error("Can't find content container");
  }

  private FindFooterContainer() {
    this.footerContainer = this.questionLinkAnchor
      .nextElementSibling as HTMLDivElement;

    if (this.footerContainer) return;

    console.info(this.questionLinkAnchor);
    throw Error("Can't find question footer");
  }

  private FindQuickActionButtonContainer() {
    this.quickActionButtonContainer = this.questionLinkAnchor
      .parentElement as HTMLDivElement;
  }

  private AddIconContainer() {
    this.iconContainer = Flex({
      marginRight: "xs",
      direction: "column",
    });

    this.questionContainer.prepend(this.iconContainer);
  }

  private RelocateVerifiedBadge() {
    this.#verifiedIcon = this.questionContainer.querySelector(
      `:scope > div[class*="SearchItem-module__verifiedIcon"]`,
    );

    if (!this.#verifiedIcon) return;

    const newContainer = Flex({
      marginTop: "xs",
      children: this.#verifiedIcon,
    });

    this.iconContainer.append(newContainer);
  }

  private RenderCheckbox() {
    this.checkbox = new Checkbox({
      id: null,
      onChange: this.main.moderator.UpdateButtonNumbers.bind(
        this.main.moderator,
      ),
    });
    this.checkboxContainer = Flex({
      children: new Label({
        children: System.data.locale.common.select,
        icon: this.checkbox.element,
        tag: "label",
      }),
    });
  }

  private ShowCheckbox() {
    if (!this.checkboxContainer || !this.footerContainer) return;

    this.footerContainer.prepend(this.checkboxContainer);
  }

  private BindListeners() {
    this.#container.addEventListener(
      "mouseleave",
      this.HideActionButtons.bind(this),
    );
    this.#container.addEventListener(
      "mouseenter",
      this.ShowActionButtons.bind(this),
    );
    this.#container.addEventListener(
      "touchstart",
      this.ShowActionButtons.bind(this),
    );
  }

  private HideActionButtons() {
    if (this.deleting) return;

    this.main.focusedQuestion = null;

    HideElement(this.actionButtonsContainer);
  }

  private ShowActionButtons() {
    if (!System.checkBrainlyP(102)) return;

    if (this.main.focusedQuestion && this.main.focusedQuestion !== this) {
      this.main.focusedQuestion.HideActionButtons();
    }

    this.main.focusedQuestion = this;

    if (this.deleted) return;

    if (!this.actionButtonsContainer) {
      this.RenderActionButtonContainer();
      this.RenderModerateButton();
      this.RenderQuickDeleteButtons();
    }

    this.quickActionButtonContainer.prepend(this.actionButtonsContainer);

    this.leftActionButtonContainer.style.maxWidth = `${this.moderateButton.element.offsetWidth}px`;
    this.rightActionButtonContainer.style.maxWidth = `${this.moderateButton.element.offsetWidth}px`;
  }

  private RenderActionButtonContainer() {
    this.actionButtonsContainer = Build(
      Flex({
        fullWidth: true,
        relative: true,
      }),
      [
        [
          Flex({
            className: "ext-action-buttons__container",
          }),
          [
            (this.leftActionButtonContainer = Flex({
              alignItems: "flex-end",
              direction: "column",
              marginRight: "xs",
            })),
            (this.rightActionButtonContainer = Flex({ direction: "column" })),
          ],
        ],
      ],
    );
  }

  private RenderModerateButton() {
    const moderateButtonContainer = Flex({
      children: (this.moderateButton = new Button({
        iconOnly: true,
        children: System.data.locale.common.moderating.moderate,
        icon: new Icon({
          type: "pencil",
        }),
        reversedOrder: true,
        type: "solid-blue",
        onClick: this.Moderate.bind(this),
        onMouseEnter: this.ShowText.bind(this),
        onMouseLeave: this.HideText.bind(this),
      })),
      marginBottom: "xs",
    });

    this.actionButtons.push(this.moderateButton);
    this.leftActionButtonContainer.append(moderateButtonContainer);
  }

  private async Moderate() {
    this.ShowModerateButtonSpinner();
    await System.Delay(50);
    await this.main.moderatePanelController.Moderate(this);
    this.HideActionButtonSpinner();
  }

  private ShowModerateButtonSpinner() {
    this.moderateButton.element.append(this.actionButtonSpinner);
  }

  HideActionButtonSpinner() {
    HideElement(this.#actionButtonSpinner);
  }

  get actionButtonSpinner() {
    if (!this.#actionButtonSpinner) {
      this.RenderActionButtonSpinner();
    }

    return this.#actionButtonSpinner;
  }

  private RenderActionButtonSpinner() {
    this.#actionButtonSpinner = Spinner({ overlay: true });
  }

  async Delete(data: RemoveQuestionReqDataType) {
    try {
      this.DisableActionButtons();

      this.deleting = true;

      const res = await new Action().RemoveQuestion({
        ...data,
        model_id: this.questionId,
      });
      /* console.log({
        ...data,
        model_id: this.questionId,
      });
      await System.TestDelay();

      const res = { success: true, message: "Failed" }; */

      new Action().CloseModerationTicket(this.questionId);

      if (!res) {
        throw Error("No response");
      }

      if (res.success === false) {
        throw res?.message ? { msg: res?.message } : res;
      }

      this.Deleted();

      if (this.author)
        System.log(5, {
          user: {
            id: this.author.id,
            nick: this.author.nick,
          },
          data: [this.questionId],
        });
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.deleting = false;

    this.HideActionButtonSpinner();
    this.EnableActionButtons();
  }

  Deleted() {
    this.deleted = true;

    this.actionButtonsContainer.remove();
    this.container.classList.add("deleted");

    if (this.checkbox) {
      this.checkbox.input.disabled = true;
    }
  }

  private ShowText() {
    this.moderateButton.IconOnly(false);
  }

  private HideText() {
    this.moderateButton.IconOnly(true);
  }

  private RenderQuickDeleteButtons() {
    if (
      !this.extraDetails ||
      this.extraDetails.answers.hasVerified ||
      !System.checkUserP(1) ||
      !System.checkBrainlyP(102)
    )
      return;

    System.data.config.quickDeleteButtonsReasons.question.forEach(
      (reasonId, index) => {
        const reason = System.DeleteReason({
          id: reasonId,
          type: "question",
        });

        const qdb = new QuickDeleteButton(this, reason, index);

        this.actionButtons.push(qdb.button);
      },
    );
  }

  private DisableActionButtons() {
    this.actionButtons.forEach(actionButton => actionButton.Disable());
  }

  private EnableActionButtons() {
    this.actionButtons.forEach(actionButton => actionButton.Enable());
  }

  RenderExtraDetails() {
    if (!this.extraDetails) return;

    this.RenderAuthor();
    this.RenderAttachments();
    this.AttachVerificationDetails();
  }

  private RenderAuthor() {
    const avatarContainer = Flex({
      children: new Avatar({
        link: System.createProfileLink(this.extraDetails.author),
        imgSrc: this.extraDetails.author?.avatar?.thumbnailUrl,
      }),
    });

    this.iconContainer.prepend(avatarContainer);
  }

  private RenderAttachments() {
    if (this.extraDetails.attachments.length === 0) return;

    // console.log(this.#container, this.extraDetails.attachments.length);

    this.RelocateContentContainer();
    this.RenderAttachmentLabel();

    const galleryContainer = Flex({
      wrap: true,
      className: "ext-image-gallery",
    });

    this.extraDetails.attachments.forEach(attachmentData => {
      const extension = attachmentData.url.split(".").pop();
      const mimeType = mime.lookup(extension) || null;
      const attachmentContainer = Flex({
        children: mimeType?.includes("image")
          ? Flex({
              border: true,
              alignItems: "center",
              justifyContent: "center",
              children: CreateElement({
                dataset: {
                  src: attachmentData.url,
                },
                src: attachmentData.thumbnailUrl,
                tag: "img",
              }),
            })
          : Flex({
              alignItems: "center",
              children: Text({
                href: "",
                text: extension,
                transform: "uppercase",
              }),
              href: attachmentData.url,
              justifyContent: "center",
              tag: "a",
              target: "_blank",
            }),
        marginRight: "xs",
        marginTop: "xs",
      });

      galleryContainer.append(attachmentContainer);
    });
    // console.log(this);

    /* const attachmentsContainer = Flex({
      children: galleryContainer,
    });

    this.contentWrapper.append(attachmentsContainer); */
    this.attachmentContainer.append(galleryContainer);

    // eslint-disable-next-line no-new
    new Viewer(galleryContainer, {
      fullscreen: false,
      loop: false,
      title: false,
      url(image: HTMLImageElement) {
        return image.dataset.src;
      },
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: this.extraDetails.attachments.length > 1 ? 1 : false,
        play: false,
        next: this.extraDetails.attachments.length > 1 ? 1 : false,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });
  }

  private RelocateContentContainer() {
    const container = Build(Flex(), [
      this.questionLinkAnchor,
      Flex({
        direction: "column",
        children: [this.contentContainer, (this.attachmentContainer = Flex())],
      }),
    ]);

    InsertBefore(container, this.footerContainer);
  }

  private RenderAttachmentLabel() {
    const attachmentIconContainer = Flex({
      marginTop: "xs",
      children: new Label({
        color: "gray",
        icon: new Icon({ type: "attachment" }),
        children: this.extraDetails.attachments.length,
      }),
    });

    this.iconContainer.append(attachmentIconContainer);
    // console.log(this);
  }

  private AttachVerificationDetails() {
    if (!this.extraDetails.answers.hasVerified) return;

    tippy(this.#verifiedIcon, {
      allowHTML: true,
      content: Flex({
        direction: "column",
        children: this.extraDetails.answers.nodes.map(answer => {
          if (!answer.verification) return undefined;

          const users = {
            "%{author}": answer.author,
            "%{verifier}": answer.verification.approval.approver,
          };
          const textPieces = System.data.locale.reportedContents.queue.moderatorVerifiedSomeonesAnswer.split(
            /(%\{.*?})/gi,
          );

          return Text({
            size: "small",
            weight: "bold",
            children: textPieces.map((string: keyof typeof users) => {
              const user = users[string];

              if (!user) {
                if (string in users) {
                  return System.data.locale.common.deletedUser;
                }

                return string;
              }

              const profileLink = System.createProfileLink(user);

              return Text({
                children: user.nick,
                color: "blue-dark",
                href: profileLink,
                size: "small",
                tag: "a",
                target: "_blank",
                weight: "bold",
              });
            }),
          });
        }),
      }),
      interactive: true,
      placement: "bottom",
      theme: "light",
    });
  }
}
