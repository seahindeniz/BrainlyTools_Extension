import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import InsertAfter from "@root/helpers/InsertAfter";
import WaitForElement from "@root/helpers/WaitForElement";
import { Box, Flex, Headline } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type QuestionPageClassType from "../QuestionPage";
import User, { UserDataType } from "./User";

export default class UserDetailsSection {
  private containerWrapper: FlexElementType;
  private infoBox: HTMLDivElement;
  private users: {
    [id: number]: User;
  };

  lastInteractedUser?: User;
  usersContainer: HTMLDivElement;
  titleContainer: FlexElementType;

  constructor(private main: QuestionPageClassType) {
    this.users = {};

    this.Init();
  }

  private async Init() {
    this.Render();
    this.RenderQuestionOwner();
    this.Show();
    this.ObserveResize();
  }

  private Render() {
    this.containerWrapper = Build(Flex(), [
      [
        new Box({
          color: "light",
          border: true,
          padding: "xs",
          borderColor: "gray-secondary-lightest",
        }),
        [
          [
            (this.titleContainer = Flex({
              marginTop: "m",
              marginBottom: "s",
              justifyContent: "center",
            })),
            Headline({
              children: System.data.locale.common.users,
              transform: "uppercase",
            }),
          ],
          (this.usersContainer = CreateElement({
            tag: "div",
            className: "ext-users-container",
          })),
        ],
      ],
    ]);
  }

  private async FindExtensionUserInfoBox() {
    this.infoBox = await WaitForElement<"div">(
      ".js-aside-content > .js-react-aside-content > .sg-content-box",
      { expireIn: 5, noError: window.innerWidth < 1024 },
    );
  }

  private async Show() {
    if (window.innerWidth >= 1024) {
      await this.FindExtensionUserInfoBox();

      if (this.infoBox?.previousElementSibling === this.containerWrapper)
        return;

      InsertAfter(this.containerWrapper, this.infoBox);
      this.titleContainer.ChangeMargin({ marginTop: "m" });
      this.containerWrapper.ChangeMargin({ marginBottom: "m" });

      return;
    }

    if (this.containerWrapper.parentElement === this.main.questionContainer)
      return;

    this.titleContainer.ChangeMargin({ marginTop: "xs" });
    this.containerWrapper.ChangeMargin({ marginBottom: "xs" });
    this.main.questionContainer.prepend(this.containerWrapper);
  }

  private RenderQuestionOwner() {
    this.RenderUser(window.jsData.question.author);
  }

  RenderUser(userData: UserDataType) {
    if (!userData || this.users[userData.id]) return;

    this.users[userData.id] = new User(this, userData);
  }

  private ObserveResize() {
    window.addEventListener("resize", this.Show.bind(this));
  }
}
