import { CommentDataInTicketType } from "@BrainlyAction";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Button, Flex, Icon, Text } from "@style-guide";
import { ButtonColorType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import { IconTypeType } from "@style-guide/Icon";
import { TextElement } from "@style-guide/Text";
import tippy from "tippy.js";
import type ContentSectionClassType from "../ContentSection";
import Comment from "./Comment";
import DeleteCommentsSection from "./DeleteCommentsSection";

export default class CommentSection {
  main: ContentSectionClassType;

  container: FlexElementType;
  commentList: FlexElementType;
  comments: Comment[];
  showAllCommentsButtonContainer: FlexElementType;
  showAllCommentsButton: Button;
  deleteCommentsSection?: DeleteCommentsSection;
  commentsData: CommentDataInTicketType[];
  visibilityStates: {
    deleted: boolean;
    reversed: boolean;
    showAll: boolean;
    onlyReported: boolean;
  };

  actionsContainer: FlexElementType;
  toggleDeletedCommentsButton: Button;
  switchOrderButton: Button;
  switchOrderButtonIconText: TextElement<"div">;
  switchOrderButtonTippyText: TextElement<"div">;
  toggleDeletedCommentsButtonTippyText: TextElement<"div">;
  toggleDeletedCommentsButtonIcon: Icon;
  switchOrderButtonText: TextElement<"div">;
  toggleReportedCommentsButton: Button;
  toggleReportedCommentsButtonIcon: Icon;

  constructor(main: ContentSectionClassType) {
    this.main = main;

    this.comments = [];
    this.visibilityStates = {
      deleted: true,
      reversed: false,
      showAll: false,
      onlyReported: false,
    };

    this.Render();
    this.InitComments();
    this.ShowComments();

    if (System.checkUserP(37))
      this.deleteCommentsSection = new DeleteCommentsSection(this);
  }

  Render() {
    this.container = Build(Flex({ direction: "column" }), [
      [
        (this.actionsContainer = Flex({
          justifyContent: "space-between",
        })),
        [
          [
            Flex(), // toggle buttons container
            [
              [
                Flex(),
                (this.switchOrderButton = new Button({
                  size: "s",
                  type: "outline",
                  onClick: this.ToggleCommentsOrder.bind(this),
                  icon: this.switchOrderButtonIconText = Text({
                    tag: "div",
                    size: "large",
                    children: "↓",
                  }),
                  children: this.switchOrderButtonText = Text({
                    tag: "div",
                    size: "xxsmall",
                    children: System.data.locale.moderationPanel.janToDec,
                    whiteSpace: "pre-wrap",
                    weight: "bold",
                  }),
                })),
              ],
              [
                Flex({
                  marginLeft: "xs",
                }),
                (this.toggleDeletedCommentsButton = new Button({
                  size: "s",
                  type: "outline",
                  iconOnly: true,
                  onClick: this.ToggleDeletedComments.bind(this),
                  icon: this.toggleDeletedCommentsButtonIcon = new Icon({
                    type: "unseen",
                  }),
                })),
              ],
              [
                Flex({
                  marginLeft: "xs",
                }),
                (this.toggleReportedCommentsButton = new Button({
                  size: "s",
                  type: "outline",
                  iconOnly: true,
                  onClick: this.ToggleReportedComments.bind(this),
                  icon: this.toggleReportedCommentsButtonIcon = new Icon({
                    type: "report_flag_outlined",
                  }),
                })),
              ],
            ],
          ],
        ],
      ],
      [
        (this.commentList = Flex({
          fullWidth: true,
          direction: "column",
        })),
      ],
    ]);

    tippy(this.switchOrderButton.element, {
      theme: "light",
      content: this.switchOrderButtonTippyText = Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.moderationPanel.sortDESC,
      }),
    });
    tippy(this.toggleDeletedCommentsButton.element, {
      theme: "light",
      content: this.toggleDeletedCommentsButtonTippyText = Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.moderationPanel.hideDeletedComments,
      }),
    });
    tippy(this.toggleReportedCommentsButton.element, {
      theme: "light",
      content: this.toggleDeletedCommentsButtonTippyText = Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.moderationPanel.showReportedComments,
      }),
    });
  }

  ToggleCommentsOrder() {
    this.visibilityStates.reversed = !this.visibilityStates.reversed;

    let newIcon = "↓";
    let newButtonText = System.data.locale.moderationPanel.janToDec;
    let newTitleText = System.data.locale.moderationPanel.sortDESC;

    if (this.visibilityStates.reversed) {
      newIcon = "↑";
      newButtonText = System.data.locale.moderationPanel.decToJan;
      newTitleText = System.data.locale.moderationPanel.sortASC;
    }

    this.switchOrderButtonIconText.innerHTML = newIcon;
    this.switchOrderButtonText.innerHTML = newButtonText;
    this.switchOrderButtonTippyText.innerHTML = newTitleText;

    this.ShowComments();
  }

  ToggleDeletedComments() {
    this.visibilityStates.deleted = !this.visibilityStates.deleted;

    let iconType: IconTypeType = "unseen";
    let newTitleText = System.data.locale.moderationPanel.hideDeletedComments;

    if (!this.visibilityStates.deleted) {
      iconType = "seen";
      newTitleText = System.data.locale.moderationPanel.showDeletedComments;
    }

    this.toggleDeletedCommentsButtonTippyText.innerHTML = newTitleText;

    this.toggleDeletedCommentsButtonIcon.ChangeType(iconType);
    this.ShowComments();
  }

  ToggleReportedComments() {
    this.visibilityStates.onlyReported = !this.visibilityStates.onlyReported;

    let buttonType: ButtonColorType = { type: "outline" };
    let iconType: IconTypeType = "report_flag_outlined";

    if (this.visibilityStates.onlyReported) {
      buttonType = { type: "solid-peach" };
      iconType = "report_flag";
    }

    this.toggleReportedCommentsButton.ChangeType(buttonType);
    this.toggleReportedCommentsButtonIcon.ChangeType(iconType);

    this.ShowComments();
  }

  ToggleCommentsVisibility() {
    this.visibilityStates.showAll = !this.visibilityStates.showAll;

    this.ToggleCommentsVisibilityButtonType();
    this.ShowComments();
  }

  ToggleCommentsVisibilityButtonType() {
    let buttonText = System.data.locale.moderationPanel.showAllComments;
    const buttonType: ButtonColorType = {
      type: "outline",
      toggle: "blue",
    };

    if (this.visibilityStates.showAll) {
      buttonType.toggle = "peach";
      buttonText = System.data.locale.moderationPanel.showLess;
    }

    this.showAllCommentsButton.ChangeType(buttonType);
    this.showAllCommentsButton.ChangeChildren(buttonText);
  }

  InitComments() {
    if (this.main.data.comments.length === 0) return;

    this.commentsData = this.main.data.comments.slice();

    let commentData: CommentDataInTicketType;

    while ((commentData = this.commentsData.shift())) {
      const comment = new Comment(this, commentData);

      this.comments.push(comment);
    }
  }

  ShowComments() {
    let { comments } = this;

    comments = comments.filter(comment => {
      comment.Hide();

      return (
        (this.visibilityStates.deleted || comment.data.deleted === false) &&
        (!this.visibilityStates.onlyReported || comment.data.report)
      );
    });

    if (comments.length <= 5) {
      this.HideShowAllCommentsButton();
    } else {
      this.ShowShowAllCommentsButton();
    }

    if (!this.visibilityStates.showAll) {
      comments = comments.slice(-5);
    }

    if (this.visibilityStates.reversed) {
      comments = comments.reverse();
    }

    comments.forEach(comment => {
      this.commentList.append(comment.container);
    });
  }

  HideShowAllCommentsButton() {
    this.visibilityStates.showAll = false;

    this.ToggleCommentsVisibilityButtonType();
    HideElement(this.showAllCommentsButtonContainer);
  }

  ShowShowAllCommentsButton() {
    if (!this.showAllCommentsButtonContainer)
      this.RenderShowAllCommentsButton();

    this.container.append(this.showAllCommentsButtonContainer);
  }

  RenderShowAllCommentsButton() {
    this.showAllCommentsButtonContainer = Flex({
      marginTop: "xs",
      justifyContent: "center",
      children: this.showAllCommentsButton = new Button({
        size: "s",
        type: "outline",
        toggle: "blue",
        onClick: this.ToggleCommentsVisibility.bind(this),
        text: System.data.locale.moderationPanel.showAllComments,
        icon: new Icon({
          color: "adaptive",
          type: "comment",
        }),
      }),
    });
  }
}
