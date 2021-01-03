import Action from "@BrainlyAction";
import Progress from "@components/Progress";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import isShortcut from "@root/helpers/isShortcut";
import NewAccountDeleteReports from "@ServerReq/AccountDeleteReports/New";
import AccountDeleteReportUploadAttachment from "@ServerReq/AccountDeleteReports/UploadAttachment";
import { Button, Flex, Icon, Input, Text, Textarea } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { TextElement } from "@style-guide/Text";
import JSZip from "jszip";
import ActionSection, { RenderDetailsType } from ".";
import type UserClassType from "../User";
import Evidence from "./DeleteUsers/Evidence";

const PREVENT_FN = event => {
  event.preventDefault();
  event.stopPropagation();
};

export default class DeleteUsers extends ActionSection {
  started: boolean;
  openedConnection: number;
  loopTryToDelete: number;
  usersToLog: UserClassType[];
  reasonMessage: HTMLTextAreaElement;
  fileContainer: FlexElementType;
  addFileButton: Button;
  startButton: Button;
  container: FlexElementType;
  stopButton: Button;
  startButtonContainer: FlexElementType;
  evidences: Evidence[];
  fileInput: Input;
  attachmentGrabberContainer: FlexElementType;
  attachmentGrabberTextContainer: FlexElementType;
  attachmentGrabberText: TextElement<"div">;
  progressContainer: FlexElementType;
  progress: Progress;
  evidenceName: string;
  evidenceContainer: FlexElementType;

  constructor(main) {
    const renderDetails: RenderDetailsType = {
      content: {
        text:
          System.data.locale.core.massManageUsers.sections.deleteUsers
            .actionButton.title,
        style: " sg-text--peach-dark",
      },
      actionButton: {
        ...System.data.locale.core.massManageUsers.sections.deleteUsers
          .actionButton,
        type: "transparent-peach",
      },
    };

    super(main, renderDetails);

    this.started = false;
    this.openedConnection = 0;
    this.usersToLog = [];
    this.evidences = [];

    this.RenderAddFileInput();
    this.RenderContent();
    this.RenderAttachmentGrabber();
    this.RenderProgress();
    this.RenderStopButton();
  }

  RenderContent() {
    this.container = Build(Flex(), [
      [
        (this.evidenceContainer = Flex({
          direction: "column",
          grow: true,
          marginBottom: "s",
          margin: "xs",
        })),
        [
          [
            Flex({ justifyContent: "center" }),
            (this.reasonMessage = Textarea({
              tag: "textarea",
              fullWidth: true,
              placeholder: `${System.data.locale.userProfile.accountDelete.reasonForDeletion}..`,
            })),
          ],
          [
            Flex({ direction: "column", marginTop: "m" }),
            [
              (this.fileContainer = Flex({ direction: "column" })),
              [
                Flex(),
                (this.addFileButton = new Button({
                  type: "outline",
                  size: "s",
                  fullWidth: true,
                  html: System.data.locale.userProfile.accountDelete.addFiles,
                  onClick: this.fileInput.input.click.bind(
                    this.fileInput.input,
                  ),
                  icon: new Icon({
                    color: "dark",
                    type: "attachment",
                  }),
                })),
              ],
            ],
          ],
          [
            (this.startButtonContainer = Flex({
              marginTop: "m",
              justifyContent: "center",
            })),
            (this.startButton = new Button({
              size: "s",
              type: "solid-peach",
              html: `${System.data.locale.common.start}!`,
              onClick: this.StartDeleting.bind(this),
            })),
          ],
        ],
      ],
    ]);

    this.$contentContainer.append(this.container);
  }

  RenderAddFileInput() {
    this.fileInput = new Input({
      type: "file",
      multiple: true,
      onChange: this.ProcessFiles.bind(this),
    });
  }

  RenderAttachmentGrabber() {
    this.attachmentGrabberContainer = Build(
      Flex({
        alignItems: "center",
        justifyContent: "center",
        className: "attachmentGrabberContainer",
      }),
      [
        [
          (this.attachmentGrabberTextContainer = Flex()),
          (this.attachmentGrabberText = Text({
            tag: "div",
            weight: "bold",
            size: "large",
            html: "Drop files here",
          })),
        ],
      ],
    );

    ["dragenter", "dragover", "dragleave", "dragend", "drop"].forEach(
      eventName => {
        this.container.addEventListener(eventName, PREVENT_FN);
        document.body.addEventListener(eventName, PREVENT_FN);
        this.attachmentGrabberContainer.addEventListener(eventName, PREVENT_FN);
      },
    );
  }

  RenderProgress() {
    this.progressContainer = Flex({
      marginTop: "s",
      direction: "column",
    });
    this.progress = new Progress({
      type: "loading",
      label: "",
      max: 100,
    });
  }

  ProcessFiles(event: DragEvent) {
    let { files } = this.fileInput.input;

    if (event && event.dataTransfer && event.dataTransfer.files) {
      files = event.dataTransfer.files;

      this.HideAttachmentGrabber();
    }

    if (!files || files.length === 0) return;

    Array.from(files).forEach(this.ProcessFile.bind(this));

    this.fileInput.input.value = "";
  }

  HideAttachmentGrabber() {
    this.container.classList.remove("file-dragging");
    HideElement(this.attachmentGrabberContainer);
  }

  ProcessFile(file: File) {
    if (file.size > System.constants.config.MAX_FILE_SIZE_OF_EVIDENCE) {
      this.main.modal.Notification({
        html: System.data.locale.userProfile.notificationMessages.fileSizeExceeded
          .replace("%{file_name}", file.name)
          .replace(
            "%{file_size}",
            `${System.constants.config.MAX_FILE_SIZE_OF_EVIDENCE_IN_MB} MB`,
          ),
      });

      return;
    }

    if (
      isShortcut(file.name) &&
      !confirm(
        System.data.locale.userProfile.notificationMessages.aShortcutFile,
      )
    )
      return;

    if (
      this.evidences.find(
        evidence =>
          evidence.file.name === file.name &&
          evidence.file.size === file.size &&
          evidence.file.lastModified === file.lastModified,
      )
    )
      return;

    this.evidenceName = null;

    const evidence = new Evidence(this, file);

    this.fileContainer.append(evidence.container);
    this.evidences.push(evidence);
  }

  RenderStopButton() {
    this.stopButton = new Button({
      size: "s",
      type: "solid-mustard",
      children: System.data.locale.common.stop,
      onClick: this.StopDeleting.bind(this),
    });
  }

  async StartDeleting() {
    this.SetUsers();

    if (
      !this.userIdList ||
      !confirm(
        System.data.locale.core.massManageUsers.notificationMessages
          .areYouSureAboutDeletingAllListedUsers,
      )
    )
      return;

    this.started = true;

    await this.UploadFiles();

    this.ShowUserList();
    this.ShowStopButton();
    this.MoveDeletedAccountsFirst();
    this.TryToDelete();
    this.loopTryToDelete = window.setInterval(
      this.TryToDelete.bind(this),
      1000,
    );
  }

  async UploadFiles() {
    this.HideProgress();

    if (this.evidences.length === 0 || this.evidenceName) return;

    const file = await this.PrepareFile();

    const resUpload = await AccountDeleteReportUploadAttachment(file, {
      onUploadProgress: this.UpdateUploadProgress.bind(this),
    });

    if (resUpload.success === false) {
      throw new Error("Evidence upload failed");
    }

    this.progress.UpdateLabel(`${System.data.locale.common.deleting}..`);

    this.evidenceName = resUpload.data.name;
  }

  HideProgress() {
    HideElement(this.progressContainer);
  }

  async PrepareFile() {
    if (this.evidences.length === 0) return undefined;

    if (this.evidences.length === 1) {
      const { file } = this.evidences[0];

      return file;
    }

    this.ShowProgress();

    const blob = await this.CompressStoredFiles();
    const file = new File([blob], `${this.userIdList.length}.zip`);

    return file;
  }

  ShowProgress() {
    this.progressContainer.append(this.progress.$container.get(0));
    this.evidenceContainer.append(this.progressContainer);
  }

  CompressStoredFiles() {
    const zip = new JSZip();

    this.evidences.forEach(evidence => {
      zip.file(evidence.file.name, evidence.file, { binary: true });
    });

    this.progress.UpdateLabel(
      System.data.locale.userProfile.accountDelete.compressingTheFiles,
    );

    return zip.generateAsync(
      {
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9,
        },
        streamFiles: true,
      },
      this.UpdateCompressingProgress.bind(this),
    );
  }

  UpdateCompressingProgress(metadata: {
    percent: number;
    currentFile: string;
  }) {
    this.progress.update(metadata.percent);

    if (metadata.currentFile) {
      this.progress.UpdateLabel(
        System.data.locale.userProfile.accountDelete.compressingTheFile
          .replace("%{file_name}", ` ${metadata.currentFile} `)
          .trim(),
      );
    }
  }

  UpdateUploadProgress(event) {
    let percent = 0;
    const position = event.loaded || event.position;
    const { total } = event;

    if (event.lengthComputable) {
      percent = (position / total) * 100;
    }

    this.progress.update(percent);
    this.progress.UpdateLabel(
      System.data.locale.userProfile.accountDelete.uploading.replace(
        "%{percentage_value}",
        ` ${Math.ceil(percent)} `,
      ),
    );
  }

  ShowUserList() {
    this.$userListContainer.appendTo(this.container);
  }

  ShowStopButton() {
    this.HideStartButton();
    this.startButtonContainer.append(this.stopButton.element);
  }

  HideStartButton() {
    this.main.HideElement(this.startButton.element);
  }

  HideStopButton() {
    this.main.HideElement(this.stopButton.element);
    this.ShowStartButton();
  }

  ShowStartButton() {
    this.startButtonContainer.append(this.startButton.element);
  }

  MoveDeletedAccountsFirst() {
    /**
     * @type {number[]}
     */
    this.userIdList = this.userIdList.filter(id => {
      const user = this.main.users[id];

      if (!user || typeof user === "boolean") return false;

      if (user.details.is_deleted) {
        user.Deleted();

        return false;
      }

      return true;
    });
  }

  TryToDelete() {
    if (!this.started) return;

    for (let i = 0; i < 7; i++)
      if (this.openedConnection < 5) {
        const user = this.PickUser();

        if (!user) {
          this.StopDeleting();

          break;
        }

        this.openedConnection++;

        if (typeof user !== "boolean") {
          this.DeleteUser(user);
        }
      }
  }

  StopDeleting() {
    this.started = false;

    this.HideStopButton();
    clearInterval(this.loopTryToDelete);

    this.loopTryToDelete = null;

    this.main.modal.Notification({
      type: "success",
      html: System.data.locale.common.allDone,
    });
  }

  async LogUserDeletions() {
    const deletedUsers = this.usersToLog.splice(0, this.usersToLog.length);

    if (!deletedUsers.length) return;

    const userEntries = deletedUsers.map(user => ({
      id: user.details.id,
      nick: user.details.nick,
      url: System.createProfileLink(user.details),
    }));

    await NewAccountDeleteReports({
      userEntries,
      filename: this.evidenceName,
      comment: this.reasonMessage.value,
    });
  }

  async DeleteUser(user: UserClassType) {
    try {
      if (user.details.is_deleted) {
        this.openedConnection--;

        user.Deleted();

        return;
      }

      await new Action().DeleteAccount(user.details.id);
      // await System.TestDelay();

      this.openedConnection--;

      user.Deleted();

      this.usersToLog.push(user);

      if (this.openedConnection === 0 && this.userIdList.length === 0) {
        this.LogUserDeletions();
      }
    } catch (error) {
      console.error(error);

      this.openedConnection--;
    }
  }
}
