import { QuickActionButtonsForQuestion } from "@components";
import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import InsertBefore from "@root/helpers/InsertBefore";
import { Avatar, Checkbox, Flex, Icon, Label, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import mime from "mime-types";
import tippy from "tippy.js";
import Viewer from "viewerjs";
import type { ExtraDetailsQuestionType } from "../extraDetails.fragment";
import type FeedModerationClassType from "../SearchResultsModeration";

export default class Question {
  #container: HTMLDivElement;

  private actionButtonsContainer: FlexElementType;
  deleted: boolean;
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
  quickActionButtons?: QuickActionButtonsForQuestion;

  constructor(
    private main: FeedModerationClassType,
    container: HTMLDivElement,
    public questionLinkAnchor: HTMLAnchorElement,
    public questionId: number,
  ) {
    if (System.checkUserP([14, 26]) && System.checkBrainlyP(102)) {
      this.RenderCheckbox();
    }

    // Trigger setter fn
    this.container = container;
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

    this.quickActionButtonContainer.classList.add("sg-flex--column");
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
    if (this.quickActionButtons?.moderating) return;

    this.main.focusedQuestion = null;

    HideElement(this.actionButtonsContainer);
  }

  private ShowActionButtons() {
    if (!System.checkBrainlyP(102) || !this.extraDetails) return;

    if (this.main.focusedQuestion && this.main.focusedQuestion !== this) {
      this.main.focusedQuestion.HideActionButtons();
    }

    this.main.focusedQuestion = this;

    if (this.deleted) return;

    this.quickActionButtonContainer.append(this.actionButtonsContainer);
  }

  private InitQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForQuestion({
      content: {
        databaseId: this.questionId,
        hasVerifiedAnswers: this.extraDetails.answers.hasVerified,
        author: this.extraDetails.author && {
          databaseId: System.DecryptId(this.extraDetails.author.id),
          nick: this.extraDetails.author.nick,
        },
      },
      containerProps: {
        className: "ext-action-buttons__container",
      },
      onDelete: this.Deleted.bind(this),
      onModerate: this.Moderate.bind(this),
      moreButton: true,
    });

    this.actionButtonsContainer = Flex({
      grow: true,
      relative: true,
      children: this.quickActionButtons.container,
    });
  }

  private async Moderate() {
    await this.main.moderatePanelController.Moderate(this);
    this.quickActionButtons.NotModerating();
  }

  Deleted() {
    this.deleted = true;

    this.actionButtonsContainer.remove();
    this.container.classList.add("deleted");

    if (this.checkbox) {
      this.checkbox.input.disabled = true;
    }
  }

  RenderExtraDetails() {
    if (!this.extraDetails) return;

    this.RenderAuthor();
    this.RenderAttachments();
    this.AttachVerificationDetails();

    if (!this.quickActionButtons) {
      this.InitQuickActionButtons();
    }

    this.main.moderator?.TryToShow();
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
