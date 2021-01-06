import Action from "@BrainlyAction";
import Build from "@root/helpers/Build";
import { Flex, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { TextElement } from "@style-guide/Text";
import notification from "./notification2";

function PasteHandler(event: ClipboardEvent) {
  event.preventDefault();

  // @ts-expect-error
  const text = (event.originalEvent || event).clipboardData.getData(
    "text/plain",
  );

  document.execCommand("insertText", false, text);
}

class UserBio {
  container: FlexElementType;
  private bioContent: TextElement<"p">;

  constructor(private bio = "", private editable = false) {
    this.Render();
  }

  Render() {
    this.container = Build(
      Flex({
        title: System.data.locale.userProfile.userBio.description,
      }),
      [
        [
          Flex({
            marginRight: "xs",
          }),
          Text({
            size: "small",
            weight: "bold",
            children: `${System.data.locale.userProfile.userBio.title}:`,
          }),
        ],
        (this.bioContent = Text({
          tag: "p",
          full: true,
          size: "xsmall",
          breakWords: true,
          children: this.bio || " -",
          contentEditable: this.editable,
          onMouseDown: this.RemovePlaceholder.bind(this),
          onPaste: PasteHandler,
          onBlur: this.UpdateIfChanged.bind(this),
          style: {
            minHeight: "20px",
          },
        })),
      ],
    );
  }

  RemovePlaceholder() {
    if (this.bio) return;

    this.bioContent.innerHTML = "";
  }

  AddPlaceholder() {
    if (this.bioContent.innerText.trim() !== "") return;

    this.bioContent.innerText = " -";
  }

  async UpdateIfChanged() {
    if (
      this.bioContent.innerText !==
      this.bio.replace(/\s{0,}<br\s*[/]?>/gi, "\n")
    ) {
      this.Update();
    }

    this.AddPlaceholder();
  }

  async Update() {
    const oldBio = this.bio;
    const newBio = this.bioContent.innerText.trim();

    const resBio = await new Action().ChangeBio(newBio);

    if (resBio.errors) {
      this.bioContent.innerText = oldBio;

      notification({
        type: "error",
        html:
          System.data.locale.userProfile.notificationMessages.cannotChangeBio,
      });
    } else {
      this.bio = newBio;

      notification({
        type: "success",
        html: System.data.locale.popup.notificationMessages.updatedMessage,
      });
    }

    this.AddPlaceholder();
  }
}

export default UserBio;
