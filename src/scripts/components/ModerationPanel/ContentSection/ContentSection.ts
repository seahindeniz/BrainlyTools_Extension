import Build from "@/scripts/helpers/Build";
import type {
  AnswerDataInTicketType,
  QuestionDataInTicketType,
  UsersDataInReportedContentsType,
} from "@BrainlyAction";
import { Avatar, Box, Breadcrumb, Flex, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import { TextElement } from "@style-guide/Text";
import type ModerationPanelClassType from "../ModerationPanel";

export type ContentTypeType = "Question" | "Answer";

export default class ContentSection {
  main: ModerationPanelClassType;
  contentType: ContentTypeType;

  data: QuestionDataInTicketType | AnswerDataInTicketType;
  owner: {
    data: UsersDataInReportedContentsType;
    profileLink: string;
    avatarLink: string;
  };

  container: Box;
  userDetailsContainer: Breadcrumb;
  contentDetailsContainer: FlexElementType;
  creationDateText: TextElement<"span">;

  constructor(main: ModerationPanelClassType, contentType: ContentTypeType) {
    this.main = main;
    this.contentType = contentType;

    // @ts-expect-error
    this.data = {};
  }

  SetOwner() {
    const owner = this.main.usersData.find(
      user => user.id === this.main.data.task.user_id,
    );

    if (!owner) {
      console.error("Can't find owner details of the question");
      this.main.FinishModeration();

      return;
    }

    this.owner = {
      data: owner,
      profileLink: System.createProfileLink(owner),
      avatarLink: System.ExtractAvatarURL(owner),
    };
  }

  Render() {
    this.container = Build(
      new Box({
        padding: "m",
        border: true,
        borderColor: "gray-secondary-lightest",
      }),
      [
        [
          // Head
          Flex(),
          [
            [
              // Left
              Flex({
                grow: true,
              }),
              [
                [
                  // Avatar container
                  Flex(),
                  Avatar({
                    imgSrc: this.owner.avatarLink,
                    link: this.owner.profileLink,
                  }),
                ],
                [
                  // nick and details container
                  Flex({ marginLeft: "s", direction: "column" }),
                  [
                    [
                      // Nick container
                      Flex(),
                      Text({
                        size: "small",
                        weight: "bold",
                        text: this.owner.data.nick,
                      }),
                    ],
                    [
                      // user details container
                      Flex(),
                      (this.userDetailsContainer = new Breadcrumb({
                        elements: [
                          (this.creationDateText = Text({
                            tag: "span",
                            size: "xsmall",
                            color: "gray-secondary",
                            text: this.data.created,
                          })),
                        ],
                      })),
                    ],
                  ],
                ],
              ],
            ],
            [
              // Right
              (this.contentDetailsContainer = Flex({
                grow: true,
                alignItems: "center",
                justifyContent: "flex-end",
              })),
            ],
          ],
        ],
        [
          // Content
          Flex(),
        ],
        [
          // Head
          Flex(),
        ],
      ],
    );

    this.main.modal.contentContainer.append(this.container.element);
  }
}
