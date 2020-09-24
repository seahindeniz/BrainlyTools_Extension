import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import storage from "@root/helpers/extStorage";
import FillRange from "@root/helpers/FillRange";
import { Flex, Text } from "@style-guide";
import type { TextElement } from "@style-guide/Text";
import type OptionsClassType from "./Options";

const MAX_DENSITY = 8;
const STORAGE_NAME = "reported_contents_queue_density";

export default class Density {
  main: OptionsClassType;

  density: number;

  container: import("@style-guide/Flex").FlexElementType;
  input: HTMLInputElement;
  label: TextElement<"div">;

  constructor(main: OptionsClassType) {
    this.main = main;

    this.density = 0;

    this.Render();
    this.SetValue();
  }

  Render() {
    this.container = Build(Flex(), [
      [
        Flex({ alignItems: "center", marginRight: "s" }),
        Text({
          size: "small",
          text: `${System.data.locale.reportedContents.options.density.optionName}: `,
          weight: "bold",
        }),
      ],
      [
        Flex({
          grow: true,
          alignItems: "center",
        }),
        [
          [
            Flex({ marginRight: "s" }),
            [
              (this.input = CreateElement({
                max: MAX_DENSITY,
                min: 0,
                tag: "input",
                type: "range",
                list: "densityMark",
                onInput: this.Changed.bind(this),
              })),
              CreateElement({
                tag: "datalist",
                id: "densityMark",
                children: FillRange(0, MAX_DENSITY).map(numb => {
                  return CreateElement({
                    tag: "option",
                    value: String(numb),
                  });
                }),
              }),
            ],
          ],
          [
            Flex(),
            (this.label = Text({
              tag: "div",
              weight: "bold",
            })),
          ],
        ],
      ],
    ]);

    this.main.optionContainer.append(this.container);
  }

  async SetValue() {
    const storedDensityValue = (await storage("get", STORAGE_NAME)) || "0";
    this.input.value = storedDensityValue;

    this.Changed();
  }

  Changed() {
    const { value } = this.input;

    this.density = Number(value);

    if (
      Number.isNaN(this.density) ||
      this.density < 0 ||
      this.density > MAX_DENSITY
    )
      this.density = 0;

    this.label.innerText =
      this.density === 0
        ? System.data.locale.reportedContents.options.density.defaultDensity
        : String(this.density);

    storage("set", { [STORAGE_NAME]: this.density });

    if (this.density === 0) {
      delete this.main.main.main.queueContainer.dataset.density;
    } else {
      this.main.main.main.queueContainer.dataset.density = String(this.density);
    }
  }
}
