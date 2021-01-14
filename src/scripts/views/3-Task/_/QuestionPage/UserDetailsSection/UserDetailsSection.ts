import Build from "@root/helpers/Build";
import InsertAfter from "@root/helpers/InsertAfter";
import WaitForElement from "@root/helpers/WaitForElement";
import { Box, Flex, Headline } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import User, { UserDataType } from "./User";

export default class UserDetailsSection {
  private containerWrapper: FlexElementType;
  private infoBox: HTMLDivElement;
  private users: {
    [id: number]: User;
  };

  lastInteractedUser?: User;
  usersContainer: FlexElementType;

  constructor() {
    this.users = {};

    this.Init();
  }

  private async Init() {
    this.Render();
    this.RenderQuestionOwner();
    await this.FindExtensionUserInfoBox();
    this.Show();
  }

  private Render() {
    this.containerWrapper = Build(Flex({ marginBottom: "m" }), [
      [
        new Box({
          border: true,
          padding: "xs",
          borderColor: "gray-secondary-lightest",
        }),
        [
          [
            Flex({
              marginTop: "m",
              marginBottom: "s",
              justifyContent: "center",
            }),
            Headline({
              children: System.data.locale.common.users,
              transform: "uppercase",
            }),
          ],
          (this.usersContainer = Flex({
            className: "usersContainer",
            direction: "column",
            marginBottom: "xs",
            spaceBetween: {
              axis: "y",
              size: "xs",
            },
          })),
        ],
      ],
    ]);
  }

  private async FindExtensionUserInfoBox() {
    this.infoBox = await WaitForElement<"div">(
      ".js-aside-content > .js-react-aside-content > .sg-content-box",
      { expireIn: 5 },
    );
  }

  private Show() {
    InsertAfter(this.containerWrapper, this.infoBox);
  }

  private RenderQuestionOwner() {
    this.RenderUser(window.jsData.question.author);
  }

  RenderUser(userData: UserDataType) {
    if (!userData || this.users[userData.id]) return;

    this.users[userData.id] = new User(this, userData);
  }
}
