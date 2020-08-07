import Action, { UserType } from "@BrainlyAction";
import Build from "@/scripts/helpers/Build";
import {
  Flex,
  Avatar,
  Text,
  Button,
  Icon,
  InputDeprecated,
  SpinnerContainer,
  Spinner,
} from "@style-guide";
import { InputElementType } from "@style-guide/InputDeprecated";
import { TextElement } from "@style-guide/Text";
import IsVisible from "@/scripts/helpers/IsVisible";
import type PointChanger from ".";

export default class User {
  main: PointChanger;
  data: UserType;
  profileLink: string;
  container: HTMLElement;
  removeButton: Button;
  addPointsButton: Button;
  pointsInput: InputElementType;
  spinnerContainer: HTMLElement;
  spinner: HTMLElement;
  currentPoints: TextElement<"div">;

  constructor(main: PointChanger, data: UserType) {
    this.main = main;
    this.data = data;

    this.Render();
    this.PrintPreDefinedPoint();
    this.RenderSpinner();
    this.BindListeners();
  }

  Render() {
    this.profileLink = System.createProfileLink(this.data);
    this.container = Build(
      Flex({ fullWidth: true, marginTop: "xs", marginBottom: "s" }),
      [
        [
          Flex({ fullWidth: true }),
          [
            [
              Flex(),
              [
                [
                  Flex({ alignItems: "center" }),
                  (this.removeButton = new Button({
                    type: "transparent",
                    size: "xs",
                    iconOnly: true,
                    icon: new Icon({
                      type: "close",
                      color: "gray-secondary",
                    }),
                  })),
                ],
                [
                  Flex({
                    alignItems: "center",
                    marginLeft: "s",
                    marginRight: "xs",
                  }),
                  Avatar({
                    target: "_blank",
                    link: this.profileLink,
                    imgSrc: System.ExtractAvatarURL(this.data),
                  }),
                ],
                [
                  Flex({ direction: "column" }),
                  [
                    [
                      Flex({ wrap: false, alignItems: "center" }),
                      [
                        Text({
                          size: "small",
                          weight: "bold",
                          breakWords: true,
                          html: this.data.nick,
                          href: this.profileLink,
                          target: "_blank",
                        }),
                        Text({
                          tag: "i",
                          size: "xsmall",
                          color: "gray-secondary",
                          html: `&nbsp;&nbsp;${this.data.id}`,
                        }),
                      ],
                    ],
                    [
                      Flex({ alignItems: "center" }),
                      [
                        new Icon({
                          size: 18,
                          type: "points",
                          color: "dark",
                        }),
                        Text({
                          size: "xsmall",
                          html: `&nbsp;${this.data.points}`,
                        }),
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
        [
          Flex({
            fullWidth: true,
            justifyContent: "flex-end",
          }),
          [
            [
              Flex(),
              [
                [
                  Flex(),
                  [
                    [
                      Flex({ alignItems: "center", marginRight: "xs" }),
                      [
                        new Icon({
                          size: 20,
                          type: "points",
                          color: "dark",
                        }),
                        [
                          Flex({ marginLeft: "xxs", marginRight: "xxs" }),
                          (this.currentPoints = Text({
                            tag: "div",
                            size: "small",
                            weight: "bold",
                            children: this.data.points,
                            noWrap: true,
                          })),
                        ],
                        new Icon({
                          size: 16,
                          type: "plus",
                          color: "dark",
                        }),
                      ],
                    ],
                    [
                      Flex({ alignItems: "center" }),
                      (this.pointsInput = InputDeprecated({
                        type: "number",
                        tabIndex: String(++this.main.lastTabIndex),
                        placeholder: `${System.data.locale.common.shortPoints}..`,
                      })),
                    ],
                  ],
                ],
                [
                  Flex({ alignItems: "center", marginLeft: "s" }),
                  [
                    [
                      (this.spinnerContainer = SpinnerContainer()),
                      (this.addPointsButton = new Button({
                        type: "solid-mint",
                        iconOnly: true,
                        tabIndex: String(++this.main.lastTabIndex),
                        title: System.data.locale.core.pointChanger.addPoints,
                        icon: new Icon({
                          type: "pencil",
                        }),
                      })),
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    );

    this.main.userContainer.append(this.container);
  }

  PrintPreDefinedPoint() {
    const points = this.main.usersWithPreFilledPoints[this.data.id];

    delete this.main.usersWithPreFilledPoints[this.data.id];

    if (!points || isNaN(points)) return;

    this.pointsInput.value = String(points);

    this.ColorizeInput();
  }

  RenderSpinner() {
    this.spinner = Spinner({ overlay: true, size: "small" });
  }

  get points() {
    return Number(this.pointsInput.value);
  }

  BindListeners() {
    this.removeButton.element.addEventListener("click", this.Remove.bind(this));
    this.pointsInput.addEventListener("input", this.ColorizeInput.bind(this));
    this.addPointsButton.element.addEventListener(
      "click",
      this.AddToQueue.bind(this),
    );
  }

  Remove() {
    const index = this.main.users.all.findIndex(
      user => user.data.id === this.data.id,
    );

    this.main.users.all.splice(index, 1);

    delete this.main.users.id[this.data.id];

    this.container.remove();
    this.main.ToggleUserList();
    this.main.ToggleAddPointsButton();
  }

  ColorizeInput() {
    if (this.points < 0) this.pointsInput.Invalid();
    else if (this.points > 0) this.pointsInput.Valid();
    else this.pointsInput.Natural();
  }

  AddToQueue() {
    if (!this.points || this.IsInQueue() || IsVisible(this.spinner)) return;

    this.main.usersWaitingInQueue.push(this);
    this.main.StartAddingPoints();
  }

  IsInQueue() {
    return !!this.main.usersWaitingInQueue.find(
      user => user.data.id === this.data.id,
    );
  }

  async AddPoints() {
    this.main.numberOfActiveConnections++;

    this.ShowSpinner();
    this.currentPoints.ChangeColor("default");
    await new Action().AddPoint(this.data.id, this.points);

    this.main.numberOfActiveConnections--;
    this.currentPoints.innerText = String(this.points + this.data.points);
    this.currentPoints.ChangeColor("mint-dark");
    this.HideSpinner();
    this.main.HideSpinner();
  }

  ShowSpinner() {
    this.addPointsButton.Disable();
    this.spinnerContainer.append(this.spinner);
  }

  HideSpinner() {
    this.addPointsButton.Enable();
    this.main.HideElement(this.spinner);
  }
}
