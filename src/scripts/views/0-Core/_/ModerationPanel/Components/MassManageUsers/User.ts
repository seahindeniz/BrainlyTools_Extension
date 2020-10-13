import type { UserType } from "@BrainlyAction";
import Build from "@root/helpers/Build";
import {
  ActionList,
  ActionListHole,
  Avatar,
  Box,
  Checkbox,
  ContentBox,
  ContentBoxContent,
  Spinner,
  SpinnerContainer,
  Text,
} from "@style-guide";
import type MassManageUsersClassType from ".";
import IsVisible from "../../../../../../../helpers/IsVisible";
import type InfoBarClassType from "./ActionSection/ApproveAnswers/InfoBar";

export default class User {
  details: UserType;
  main: MassManageUsersClassType;

  spinnerContainer: HTMLDivElement;
  checkboxContainer: HTMLDivElement;
  checkbox: HTMLInputElement;
  container: HTMLDivElement;
  box: Box;
  nickContainer: HTMLDivElement;
  smallSpinnerContainer: HTMLDivElement;
  infoBarContainer: HTMLDivElement;
  spinner: HTMLDivElement;
  smallSpinner: HTMLDivElement;

  infoBar: InfoBarClassType;

  constructor(details: UserType, main: MassManageUsersClassType) {
    this.details = details;
    this.main = main;

    this.RenderSpinnerContainer();
    this.RenderCheckbox();
    this.Render();
    this.RenderInfoBar();
    this.RenderSpinner();
    this.RenderSmallSpinner();
    this.BindHandlers();
  }

  RenderSpinnerContainer() {
    this.spinnerContainer = SpinnerContainer({
      className: "sg-spinner-container--spaced",
    });
  }

  RenderCheckbox() {
    this.checkboxContainer = ActionListHole({
      children: new Checkbox(),
    });
    this.checkbox = this.checkboxContainer.querySelector("input");
  }

  Render() {
    const separatedPoints = this.details.points.toLocaleString();
    const avatar = System.ExtractAvatarURL(this.details);
    const profileLink = System.createProfileLink(this.details);
    this.container = Build(ActionListHole(), [
      [
        this.spinnerContainer,
        (this.box = new Box({
          padding: "xs",
          color: "gray-secondary-lightest",
          border: false,
          className: "sg-flex--margin-top-xxs sg-flex--margin-bottom-xxs",
          children: Build(ActionList(), [
            this.checkboxContainer,
            [
              ActionListHole(),
              Avatar({
                spaced: true,
                imgSrc: avatar,
                link: profileLink,
              }),
            ],
            [
              ActionListHole({ grow: true }),
              [
                [
                  (this.nickContainer = ContentBox()),
                  [
                    [
                      ContentBoxContent({ full: true }),
                      [
                        [
                          (this.smallSpinnerContainer = ActionList()),
                          [
                            [
                              ActionListHole(),
                              Text({
                                color: "gray",
                                weight: "bold",
                                size: "small",
                                href: profileLink,
                                text: this.details.nick,
                              }),
                            ],
                          ],
                        ],
                      ],
                    ],
                    [
                      ContentBoxContent({ full: true }),
                      [
                        [
                          ActionList(),
                          [
                            [
                              ActionListHole(),
                              Text({
                                color: "gray",
                                size: "xsmall",
                                title: System.data.locale.common.userHasNPoints.replace(
                                  " %{n}",
                                  separatedPoints,
                                ),
                                html: `${System.data.locale.common.shortPoints}: ${separatedPoints}`,
                              }),
                            ],
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ]),
        })),
      ],
    ]);
  }

  RenderInfoBar() {
    this.infoBarContainer = ContentBoxContent({
      full: true,
    });
  }

  RenderSpinner() {
    this.spinner = Spinner({
      overlay: true,
    });
  }

  RenderSmallSpinner() {
    this.smallSpinner = ActionListHole({
      children: Spinner({
        size: "xsmall",
      }),
    });
  }

  ShowSpinner() {
    this.spinnerContainer.append(this.spinner);
  }

  HideSpinner() {
    this.main.HideElement(this.spinner);
  }

  BindHandlers() {
    this.checkbox.addEventListener("change", this.CheckboxChanged.bind(this));
  }

  CheckboxChanged() {
    this.main.UserCheckboxChanged();
  }

  ShowCheckbox() {
    this.container.prepend(this.checkboxContainer);
  }

  HideCheckbox() {
    this.main.HideElement(this.checkboxContainer);
  }

  get isProcessing() {
    return IsVisible(this.spinner);
  }

  BeBusy() {
    this.ShowSpinner();
    this.HideCheckbox();
  }

  UnBusy() {
    this.HideSpinner();
    this.ShowCheckbox();
  }

  ChangeBoxColor(replacement) {
    this.box.ChangeColor(replacement);
  }

  /**
   * @param {JQuery<HTMLElement>} $targetElement
   */
  Move$To$($targetElement) {
    delete this.main.users[this.details.id];

    this.HideSpinner();
    $targetElement.append(this.container);
    this.main.UpdateNumbers();
    // this.main.ToggleUserList();

    return this.container;
  }

  FullBoxView() {
    // this.box.classList.add("sg-box--full");
    // TODO test this height
    this.box.ChangeProps({ fullHeight: true });
    this.container.classList.add(
      "sg-box--full",
      "sg-spinner-container--spaced",
    );
  }

  ShowSmallSpinner() {
    this.smallSpinnerContainer.append(this.smallSpinner);
  }

  HideSmallSpinner() {
    this.main.HideElement(this.smallSpinner);
  }

  ShowInfoBar() {
    this.nickContainer.append(this.infoBarContainer);
  }

  HideInfoBar() {
    this.main.HideElement(this.infoBarContainer);
  }
}
