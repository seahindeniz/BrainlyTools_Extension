import {
  ActionList,
  ActionListHole,
  Avatar,
  BoxDeprecated,
  Checkbox,
  ContentBox,
  ContentBoxContent,
  Spinner,
  SpinnerContainer,
  Text,
} from "@style-guide";
import Build from "../../../../../helpers/Build";
import IsVisible from "../../../../../helpers/IsVisible";

export default class User {
  /**
   * @param {import("../../../../../controllers/Req/Brainly/Action/index").UserType} details
   * @param {import("./index").default} main
   */
  constructor(details, main) {
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
      children: Checkbox(),
    });
    this.checkbox = this.checkboxContainer.querySelector("input");
  }
  Render() {
    let separatedPoints = this.details.points.toLocaleString();
    let avatar = System.ExtractAvatarURL(this.details);
    let profileLink = System.createProfileLink(this.details);
    this.container = Build(ActionListHole(), [
      [
        this.spinnerContainer,
        (this.box = BoxDeprecated({
          padding: "xxsmall",
          noMinHeight: true,
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
    this.main.UserCheckboxChanged(this);
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
    //this.main.ToggleUserList();

    return this.container;
  }
  FullBoxView() {
    this.box.classList.add("sg-box--full");
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
