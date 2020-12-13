import gql from "graphql-tag";

export const AnswerAttachmentFragment = gql`
  fragment AnswerAttachmentFragment on Answer {
    attachments {
      id
      url
      thumbnailUrl
    }
    id
  }
`;

export type AnswerAttachmentType = {
  id: string;
  url: string;
  thumbnailUrl: string;
};

export type AnswerAttachmentsType = {
  attachments: AnswerAttachmentType[];
  id: string;
};
