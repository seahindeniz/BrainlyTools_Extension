import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Button, Flex, Icon } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type ContentSectionClassType from "../ContentSection";
import Comment from "./Comment";

export default class CommentSection {
  main: ContentSectionClassType;
  container: FlexElementType;
  commentList: FlexElementType;
  comments: any[];
  showAllCommentsButtonContainer: FlexElementType;
  showAllCommentsButton: Button;

  constructor(main: ContentSectionClassType) {
    this.main = main;

    this.comments = [];

    this.Render();
    this.RenderShowAllCommentsButton();
    this.InitComments();
  }

  Render() {
    this.container = Build(Flex({ direction: "column" }), [
      [
        (this.commentList = Flex({
          fullWidth: true,
          direction: "column",
        })),
      ],
    ]);
  }

  RenderShowAllCommentsButton() {
    if (this.main.data.comments.length < 6) return;

    this.showAllCommentsButtonContainer = Flex({
      marginTop: "xs",
      justifyContent: "center",
      children: this.showAllCommentsButton = new Button({
        size: "s",
        type: "outline",
        toggle: "blue",
        onClick: this.ShowAllComments.bind(this),
        text: System.data.locale.moderationPanel.showAllComments,
        icon: new Icon({
          color: "adaptive",
          type: "comment",
        }),
      }),
    });

    this.container.append(this.showAllCommentsButtonContainer);
  }

  ShowAllComments() {
    this.HideShowAllCommentsButton();
    this.InitComment(true);
  }

  InitComments() {
    if (this.main.data.comments.length === 0) return;

    if (this.main.data.comments.length > 1)
      this.main.data.comments = this.main.data.comments.reverse();

    this.InitComment();
  }

  InitComment(showAll?: boolean) {
    const commentData = this.main.data.comments.shift();

    if (!commentData) return;

    const comment = new Comment(this, commentData);

    this.comments.push(comment);
    this.commentList.append(comment.container);

    if (showAll || this.comments.length < 6) {
      this.InitComment(showAll);
    }
  }

  HideShowAllCommentsButton() {
    HideElement(this.showAllCommentsButtonContainer);
  }
}
