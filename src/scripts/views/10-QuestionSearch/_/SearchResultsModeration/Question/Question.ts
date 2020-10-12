import Action, { RemoveQuestionReqDataType } from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
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
  main: FeedModerationClassType;
  author: {
    id: number;
    nick: string;
  };

  #container: HTMLDivElement;

  questionId: number;
  actionButtonsContainer: FlexElementType;
  leftActionButtonContainer: FlexElementType;
  rightActionButtonContainer: FlexElementType;
  moderateButton: Button;
  actionButtons: Button[];
  deleted: boolean;
  deleting: boolean;
  #actionButtonSpinner: HTMLDivElement;
  checkbox: Checkbox;
  checkboxContainer: FlexElementType;
  contentContainer: FlexElementType;

  extraDetails: ExtraDetailsQuestionType;
  iconContainer: FlexElementType;
  contentWrapper: FlexElementType;
  gallery: Viewer;
  #verifiedIcon: HTMLDivElement;

  constructor(
    main: FeedModerationClassType,
    questionId: number,
    container: HTMLDivElement,
  ) {
    this.main = main;
    this.questionId = questionId;

    if (System.checkUserP([14, 26]) && System.checkBrainlyP(102)) {
      this.RenderCheckbox();
    }

    this.container = container;
    this.actionButtons = [];
  }

  get container() {
    return this.#container;
  }

  set container(container: HTMLDivElement) {
    this.#container = container;

    this.FindActionContentTextWrapper();
    this.RelocateContentContainer();
    this.RelocateVerifiedBadge();
    this.ShowCheckbox();
    this.BindListeners();
  }

  FindActionContentTextWrapper() {
    const contentTextWrapper = this.#container.firstElementChild.querySelector(
      ":scope > a div.sg-content-box__content--spaced-top-small",
    );

    if (!contentTextWrapper) {
      console.log(this.contentContainer);
      throw Error("Can't find text wrapper");
    }

    // sg-content-box__content--spaced-top-small causes spacing issues
    contentTextWrapper.classList.remove(
      "sg-content-box__content--spaced-top-small",
    );
  }

  RelocateContentContainer() {
    this.contentContainer = Build(Flex({}), [
      (this.iconContainer = Flex({
        marginRight: "s",
        direction: "column",
      })),
      [
        (this.contentWrapper = Flex({
          direction: "column",
        })),
        this.#container.firstElementChild,
      ],
    ]);

    this.#container.prepend(this.contentContainer);
  }

  RelocateVerifiedBadge() {
    const verifiedBadgeContainer = this.contentContainer.querySelector(
      ".sg-actions-list > .sg-actions-list__hole:nth-child(1)",
    );

    if (!verifiedBadgeContainer) return;

    this.#verifiedIcon = verifiedBadgeContainer.firstElementChild as HTMLDivElement;

    const newContainer = Flex({
      marginTop: "xs",
      children: this.#verifiedIcon,
    });

    this.iconContainer.append(newContainer);

    verifiedBadgeContainer.remove();
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
    if (!this.checkboxContainer) return;

    const seeAnswerLinkContainer = this.container.querySelector(
      ".sg-content-box__actions > .sg-actions-list",
    );

    seeAnswerLinkContainer.prepend(this.checkboxContainer);
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

    this.#container.prepend(this.actionButtonsContainer);

    this.leftActionButtonContainer.style.maxWidth = `${this.moderateButton.element.offsetWidth}px`;
    this.rightActionButtonContainer.style.maxWidth = `${this.moderateButton.element.offsetWidth}px`;
  }

  private RenderActionButtonContainer() {
    this.actionButtonsContainer = Build(
      Flex({
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
      children: this.moderateButton = new Button({
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
      }),
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
      // console.log({
      //   ...data,
      //   model_id: this.questionId,
      // });
      // await System.TestDelay();
      // const res = { success: true, message: "Failed" };

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

  DisableActionButtons() {
    this.actionButtons.forEach(actionButton => actionButton.Disable());
  }

  EnableActionButtons() {
    this.actionButtons.forEach(actionButton => actionButton.Enable());
  }

  RenderExtraDetails() {
    if (!this.extraDetails) return;

    this.RenderAuthor();
    this.RenderAttachments();
    this.AttachVerificationDetails();
  }

  RenderAuthor() {
    const avatarContainer = Flex({
      children: Avatar({
        link: System.createProfileLink(this.extraDetails.author),
        imgSrc: this.extraDetails.author?.avatar?.thumbnailUrl,
      }),
    });

    this.iconContainer.prepend(avatarContainer);
  }

  RenderAttachments() {
    if (this.extraDetails.attachments.length === 0) return;

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
          ? CreateElement({
              dataset: {
                src: attachmentData.url,
              },
              src: attachmentData.thumbnailUrl,
              tag: "img",
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

    const attachmentsContainer = Flex({
      children: galleryContainer,
    });

    this.contentWrapper.append(attachmentsContainer);

    this.gallery = new Viewer(galleryContainer, {
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

  RenderAttachmentLabel() {
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

  AttachVerificationDetails() {
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
