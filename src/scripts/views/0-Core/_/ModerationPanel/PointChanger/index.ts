import {
  Button,
  Flex,
  Icon,
  List,
  ListItem,
  Spinner,
  SpinnerContainer,
  Text,
  Textarea,
} from "@style-guide";
import Action, { UserType } from "@BrainlyAction";
import Modal from "../../../../../components/Modal2";
import Build from "../../../../../helpers/Build";
import Components from "../Components";
import User from "./User";
import type ModerationPanel from "..";
import { FlexElementType } from "@style-guide/Flex";

export default class MassManageUsers extends Components {
  users: {
    all: User[];
    id: { [id: number]: User };
  };

  usersWithPreFilledPoints: { [id: number]: number };
  usersWaitingInQueue: User[];

  lastTabIndex: number;
  numberOfActiveConnections: number;
  loopId: NodeJS.Timeout;

  numberOfTypedUsers: Text;
  modal: Modal;
  container: FlexElementType;
  spinnerContainer: HTMLDivElement;
  actionsContainer: FlexElementType;
  idInput: HTMLTextAreaElement;
  addUserButton: Button;
  userContainer: FlexElementType;
  addPointsButtonContainer: FlexElementType;
  addPointsButton: Button;
  numberOfUsers: Text;
  spinner: HTMLDivElement;

  constructor(main: ModerationPanel) {
    super(main);

    this.users = {
      all: [],
      id: {},
    };
    this.usersWithPreFilledPoints = {};
    this.usersWaitingInQueue = [];
    this.lastTabIndex = 0;
    this.liLinkContent = System.data.locale.core.pointChanger.text;
    this.numberOfActiveConnections = 0;
    this.loopId = null;

    this.RenderListItem();
    this.RenderModal();
    this.RenderUserList();
    this.RenderAddPointsButton();
    this.RenderSpinner();
    this.BindListeners();
  }

  RenderModal() {
    const splittedText = System.data.locale.common.nUsers.split("%{n}");

    const nUsersText = Text({
      size: "small",
      children: [
        splittedText[0],
        (this.numberOfTypedUsers = document.createTextNode("0")),
        splittedText[1],
      ],
    });

    this.modal = new Modal({
      overlay: true,
      size: "large",
      title: System.data.locale.core.pointChanger.text,
      content: {
        children: Build(
          (this.container = Flex({ fullWidth: true, direction: "column" })),
          [
            [
              Flex({
                fullWidth: true,
                direction: "column",
              }),
              [
                [
                  (this.spinnerContainer = SpinnerContainer({
                    fullWidth: true,
                  })),
                  [
                    [
                      (this.actionsContainer = Flex({ fullWidth: true })),
                      [
                        [
                          Flex({ fullWidth: true }),
                          (this.idInput = Textarea({
                            tag: "textarea",
                            fullWidth: true,
                            spellcheck: false,
                            autocomplete: "off",
                            autocorrect: "off",
                            autocapitalize: "off",
                            placeholder:
                              System.data.locale.common.profileLinksOrIds,
                          })),
                        ],
                        [
                          Flex({ alignItems: "center", marginLeft: "s" }),
                          (this.addUserButton = new Button({
                            type: "solid-blue",
                            iconOnly: true,
                            icon: new Icon({
                              type: "profile_view",
                            }),
                          })),
                        ],
                      ],
                    ],
                  ],
                ],
                [
                  Flex({
                    marginLeft: "s",
                    marginRight: "s",
                  }),
                  nUsersText,
                ],
              ],
            ],
            Flex({
              tag: "blockquote",
              marginTop: "m",
              direction: "column",
              children: [
                System.data.locale.core.pointChanger.youNeedToEnterOrPaste,
                `${System.data.locale.core.pointChanger.pastingExample}:`,
                List({
                  children: [
                    System.createProfileLink(System.data.Brainly.userData.user),
                    System.createProfileLink(48173, "Sakura"),
                    `1234567`,
                    `2345678`,
                  ].map(html => {
                    return ListItem({
                      iconSmall: true,
                      icon: true,
                      children: Text({
                        size: "small",
                        html,
                      }),
                    });
                  }),
                }),
                `&nbsp;`,
                System.data.locale.core.pointChanger.pastingExample2,
                List({
                  children: [
                    `${System.createProfileLink(
                      System.data.Brainly.userData.user,
                    )} +1000`,
                    `${System.createProfileLink(48173, "Sakura")} -200`,
                    `1234567 -95`,
                    `2345678 +645`,
                  ].map(html => {
                    return ListItem({
                      iconSmall: true,
                      icon: true,
                      children: Text({
                        size: "small",
                        html,
                      }),
                    });
                  }),
                }),
              ].map((children, index, arr) => {
                return Flex({
                  marginBottom: index + 1 < arr.length ? "xxs" : "",
                  children:
                    typeof children === "string"
                      ? Text({
                          size: "small",
                          children,
                        })
                      : children,
                });
              }),
            }),
          ],
        ),
      },
    });
  }

  RenderUserList() {
    this.userContainer = Flex({
      fullWidth: true,
      direction: "column",
      className: "js-user-list",
      marginBottom: "s",
    });
  }

  RenderAddPointsButton() {
    this.addPointsButtonContainer = Flex({
      alignItems: "center",
      marginLeft: "xs",
      children: this.addPointsButton = new Button({
        type: "solid-mint",
        title: System.data.locale.core.pointChanger.addPointsToAll,
        children: this.numberOfUsers = document.createTextNode("0"),
        icon: new Icon({
          type: "pencil",
        }),
      }),
    });
  }

  RenderSpinner() {
    this.spinner = Spinner({ overlay: true });
  }

  BindListeners() {
    this.li.addEventListener("click", this.modal.Open.bind(this.modal));
    this.idInput.addEventListener("input", this.UpdateCounter.bind(this));
    this.addUserButton.element.addEventListener(
      "click",
      this.GetUsers.bind(this),
    );
    this.addPointsButton.element.addEventListener(
      "click",
      this.StartAddingPointsToAll.bind(this),
    );
  }

  UpdateCounter() {
    this.numberOfTypedUsers.nodeValue = String(this.IdsEntered(true).length);
  }

  IdsEntered(onlyCount?: boolean) {
    const lines = this.idInput.value
      .trim()
      .split(/\r\n|\n/)
      .filter(Boolean);

    if (lines.length === 0) return lines;

    if (!onlyCount) this.idInput.value = "";

    const ignoredLines = [];

    if (lines.length === 0) return lines;

    let idList = lines
      .map(line => {
        if (!line) return undefined;

        const [idStr, points] = line.trim().split(/\s+/);
        const id = System.ExtractId(idStr);

        if (!id || isNaN(id)) {
          ignoredLines.push(line);

          return undefined;
        }

        if (this.users.id[id]) return undefined;

        if (!points || (points[0] !== "+" && points[0] !== "-")) return id;

        // this.usersWithPreFilledPoints[id] = Number(points);

        return id;
      })
      .filter(Boolean);

    idList = [...new Set(idList)];

    if (!onlyCount) this.idInput.value = ignoredLines.join("\n");

    return idList;
  }

  async GetUsers() {
    this.ShowSpinner();

    const idList = this.IdsEntered();

    this.UpdateCounter();

    if (idList.length === 0) {
      this.HideSpinner();

      return;
    }

    const resUsers = await new Action().GetUsers(idList);

    if (!resUsers || !resUsers.success) {
      this.HideSpinner();
      this.modal.Notification({
        type: "error",
        html:
          resUsers.message ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });

      return;
    }

    this.InitUsers(resUsers.data);
    this.HideSpinner();
  }

  ShowSpinner() {
    this.spinnerContainer.append(this.spinner);
  }

  HideSpinner() {
    if (this.numberOfActiveConnections > 0) return;

    this.HideElement(this.spinner);
  }

  InitUsers(users: UserType[]) {
    if (users.length === 0) return;

    users.forEach(this.InitUser.bind(this));
    this.ToggleUserList();
    this.ToggleAddPointsButton();
  }

  InitUser(data: UserType) {
    const user = new User(this, data);

    this.users.all.push(user);
    this.users.id[data.id] = user;
  }

  ToggleUserList() {
    if (this.users.all.length === 0) this.HideUserList();
    else this.ShowUserList();
  }

  ShowUserList() {
    this.container.prepend(this.userContainer);
  }

  HideUserList() {
    this.HideElement(this.userContainer);
  }

  ToggleAddPointsButton() {
    this.numberOfUsers.nodeValue = String(this.users.all.length);

    if (this.users.all.length < 2) this.HideAddPointsButton();
    else this.ShowAddPointsButton();
  }

  HideAddPointsButton() {
    this.HideElement(this.addPointsButtonContainer);
  }

  ShowAddPointsButton() {
    this.actionsContainer.append(this.addPointsButtonContainer);
  }

  StartAddingPointsToAll() {
    if (
      !confirm(System.data.locale.core.notificationMessages.doYouWantToContinue)
    )
      return;

    this.users.all.forEach(user => user.AddToQueue());

    if (this.usersWaitingInQueue.length === 0) {
      this.modal.Notification({
        type: "info",
        html: System.data.locale.core.pointChanger.pointsNotSpecified,
        permanent: true,
      });

      return;
    }

    this.ShowSpinner();
    this.StartAddingPoints();
  }

  StartAddingPoints() {
    if (this.loopId) return;

    this.TryToAddPoints();
    this.loopId = setInterval(this.TryToAddPoints.bind(this), 1000);
  }

  async TryToAddPoints() {
    if (this.numberOfActiveConnections >= 3) return;

    for (let i = 0; i < 3; i++) {
      const user = this.usersWaitingInQueue.shift();

      if (!user) {
        this.StopAddingPoints();

        return;
      }

      user.AddPoints();
    }
  }

  StopAddingPoints() {
    clearInterval(this.loopId);

    this.loopId = null;
  }
}
