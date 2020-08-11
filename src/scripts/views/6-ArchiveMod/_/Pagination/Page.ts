import { Flex, Button } from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import Build from "@root/scripts/helpers/Build";
import type Pagination from ".";

function DeleteModerationBoxes() {
  const moderationBoxes = document.querySelectorAll(
    "#moderation-all > div.content > .moderation-item",
  );

  if (!moderationBoxes || moderationBoxes.length === 0) return;

  moderationBoxes.forEach(moderationBox => moderationBox.remove());
}

export default class Page {
  main: Pagination;
  pageNumber: number;
  index: number;
  container: FlexElementType;
  button: Button;

  constructor(main: Pagination, pageNumber: number, index: number) {
    this.main = main;
    this.pageNumber = pageNumber;
    this.index = index;

    this.Render();
    this.BindListener();
  }

  Render() {
    this.container = Build(
      Flex({
        marginLeft: "xxs",
        marginRight: "xxs",
      }),
      [
        (this.button = new Button({
          text: this.index,
          type: "solid-inverted",
          title: this.pageNumber,
        })),
      ],
    );
  }

  BindListener() {
    this.button.element.addEventListener("click", this.Select.bind(this));
  }

  Select() {
    this.Highlight();

    if (Number.isNaN(this.pageNumber)) {
      delete window.$Z.moderation.all.data.lastId;
      delete window.$Z.moderation.all.data.settings.last_id;
    } else window.$Z.moderation.all.data.lastId = this.pageNumber;

    DeleteModerationBoxes();
    window.$Z.moderation.all.getContent();
  }

  Highlight() {
    if (this.main.selectedPageNumber) this.main.selectedPageNumber.Unselect();

    this.main.selectedPageNumber = this;

    this.button.ChangeType({ type: "solid-mint" }).Disable();
  }

  Unselect() {
    this.button.ChangeType({ type: "outline" }).Enable();
  }

  Show() {
    this.main.content.append(this.container);
  }
}
