import Action, { UserType } from "@BrainlyAction";
import Modal from "@components/Modal2";
import Build from "@root/helpers/Build";
import InsertAfter from "@root/helpers/InsertAfter";
import {
  Button,
  Flex,
  Icon,
  Input,
  List,
  ListItem,
  Spinner,
  SpinnerContainer,
  Text,
  Textarea,
} from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import Components from "..";
import type ModerationPanel from "../..";
import User from "./User";

export default class MassManageUsers extends Components {
  users: {
    all: User[];
    id: { [id: number]: User };
  };

  usersWithPreFilledPoints: { [id: number]: number };
  usersWaitingInQueue: User[];

  lastTabIndex: number;
  numberOfActiveConnections: number;
  loopId: number;

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
  applyPointsToAllInputsInput: Input;
  listActionContainer: FlexElementType;

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
    this.RenderActionContainer();
    this.RenderClearUserListButton();
    this.RenderApplyPointsToAllInputsSection();
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

  RenderActionContainer() {
    this.listActionContainer = Flex({
      justifyContent: "space-between",
      marginBottom: "m",
    });
  }

  RenderClearUserListButton() {
    const clearUserListButtonContainer = Flex({
      alignItems: "center",
      children: new Button({
        children: System.data.locale.core.pointChanger.clearList,
        icon: new Icon({
          type: "close",
        }),
        onClick: this.ClearUserList.bind(this),
        size: "s",
        type: "solid-light",
      }),
    });

    this.listActionContainer.append(clearUserListButtonContainer);
  }

  ClearUserList() {
    this.users.all.forEach(user => {
      user.container.remove();

      delete this.users.id[user.data.id];
    });

    this.users.all.length = 0;

    this.ToggleUserList();
    this.ToggleAddPointsButton();
  }

  RenderApplyPointsToAllInputsSection() {
    const applyPointsToAllInputsContainer = Build(Flex(), [
      [
        Flex({ alignItems: "center", marginRight: "s" }),
        Text({
          weight: "bold",
          children: System.data.locale.core.pointChanger.applyPointsToAllInputs,
        }),
      ],
      [
        Flex(),
        (this.applyPointsToAllInputsInput = new Input({
          type: "number",
          onInput: this.ApplyPointsToAllInputs.bind(this),
          placeholder: `${System.data.locale.common.shortPoints}..`,
        })),
      ],
    ]);

    this.listActionContainer.append(applyPointsToAllInputsContainer);
  }

  ApplyPointsToAllInputs() {
    const { value } = this.applyPointsToAllInputsInput.input;
    const points = Number(value);

    this.ColorizeInput(points);

    if (Number.isNaN(points)) return;

    this.users.all.forEach(user => {
      user.pointsInput.value = value;

      user.ColorizeInput();
    });
  }

  ColorizeInput(points: number) {
    if (points < 0) this.applyPointsToAllInputsInput.Invalid();
    else if (points > 0) this.applyPointsToAllInputsInput.Valid();
    else this.applyPointsToAllInputsInput.Natural();
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

        this.usersWithPreFilledPoints[id] = Number(points);

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
    if (data.is_deleted) return;

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
    this.HideListActions();
    this.HideElement(this.addPointsButtonContainer);
  }

  HideListActions() {
    this.HideElement(this.listActionContainer);
  }

  ShowAddPointsButton() {
    this.ShowListActions();
    this.actionsContainer.append(this.addPointsButtonContainer);
  }

  ShowListActions() {
    InsertAfter(this.listActionContainer, this.userContainer);
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
    this.loopId = window.setInterval(this.TryToAddPoints.bind(this), 1000);
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
