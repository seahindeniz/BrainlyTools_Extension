import type { ContentTypeType } from "@components/ModerationPanel/ContentSection/ContentSection";
import type { NotificationPropsType } from "@components/notification2";
import { Flex } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import Viewer from "viewerjs";
import Attachment, { AttachmentDataType } from "./Attachment";

type OptionalPropsType = {
  noDeletion?: boolean;
  notificationHandler?: (props: NotificationPropsType) => void;
  onDelete?: () => void;
};

type ContentType = {
  databaseId: number;
  type: ContentTypeType;
  questionId: number;
};

type PropsType = {
  attachments: AttachmentDataType[];
  content: ContentType;
} & OptionalPropsType;

export default class AttachmentSection {
  private attachmentsData: AttachmentDataType[];
  content: ContentType;
  props: OptionalPropsType;

  container: FlexElementType;
  gallery: Viewer;
  attachments: Attachment[];

  constructor({ attachments, content, ...props }: PropsType) {
    this.attachmentsData = attachments;
    this.content = content;
    this.props = props;

    this.Render();
    this.RenderAttachments();
    this.InitGallery();
    this.BindListener();
  }

  private Render() {
    this.container = Flex({
      wrap: true,
      marginTop: "xs",
      className: "ext-image-gallery",
    });
  }

  RenderAttachments() {
    this.attachments = this.attachmentsData.map(attachmentData => {
      const attachment = new Attachment(this, attachmentData);

      this.container.append(attachment.container);

      return attachment;
    });
  }

  private InitGallery() {
    this.gallery = new Viewer(this.container, {
      fullscreen: false,
      loop: false,
      title: false,
      url(image: HTMLImageElement) {
        return image.dataset.src;
      },
      filter(image: HTMLImageElement) {
        return !image.dataset.src.endsWith("svg");
      },
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: this.attachmentsData.length > 1 ? 1 : false,
        play: false,
        next: this.attachmentsData.length > 1 ? 1 : false,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });
  }

  private BindListener() {
    if (this.attachmentsData.length < 2) return;

    this.container.addEventListener(
      "view",
      this.TryToHideNavigationButtons.bind(this),
    );
  }

  private TryToHideNavigationButtons(
    event: CustomEvent<{
      image: HTMLImageElement;
      index: number;
      originalImage: HTMLImageElement;
    }>,
  ) {
    const prevTooltip = (this.gallery[
      // eslint-disable-next-line dot-notation
      "toolbar"
    ] as HTMLDivElement).querySelector(".viewer-prev") as HTMLLIElement;
    const nextTooltip = (this.gallery[
      // eslint-disable-next-line dot-notation
      "toolbar"
    ] as HTMLDivElement).querySelector(".viewer-next") as HTMLLIElement;

    if (event.detail.index === 0) {
      nextTooltip.removeAttribute("style");

      prevTooltip.style.display = "none";

      return;
    }

    if (event.detail.index === this.attachmentsData.length - 1) {
      prevTooltip.removeAttribute("style");

      nextTooltip.style.display = "none";

      return;
    }

    nextTooltip.removeAttribute("style");
    prevTooltip.removeAttribute("style");
  }

  AttachmentDeleted() {
    this.props.onDelete?.();

    if (length > 0) return;

    this.RemoveAttachmentContainer();
  }

  RemoveAttachmentContainer() {
    this.container.remove();
    this.gallery?.destroy();

    this.container = null;
    this.gallery = null;
  }

  RemoveDeleteButtons() {
    this.attachments.forEach(attachment =>
      attachment.deleteButton.element.remove(),
    );
  }
}
