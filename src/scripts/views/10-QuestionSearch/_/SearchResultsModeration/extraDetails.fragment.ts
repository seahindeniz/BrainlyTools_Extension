import gql from "graphql-tag";

export const ExtraDetailsQuestionFragment = gql`
  fragment QuestionFragment on Question {
    answers {
      hasVerified
      nodes {
        author {
          id
          nick
        }
        id
        verification {
          approval {
            approvedTime
            approver {
              id
              nick
            }
          }
        }
      }
    }
    author {
      avatar {
        thumbnailUrl
      }
      id
      nick
    }
    attachments {
      id
      url
      thumbnailUrl
    }
    id
  }
`;

export type ExtraDetailsQuestionType = {
  answers: {
    hasVerified: boolean;
    nodes: {
      author: {
        id: string;
        nick: string;
      };
      id: string;
      verification: {
        approval: {
          approvedTime: string;
          approver: {
            id: string;
            nick: string;
          };
        };
      };
    }[];
  };
  author: {
    avatar: {
      thumbnailUrl: string;
    };
    id: string;
    nick: string;
  };
  attachments: {
    id: string;
    url: string;
    thumbnailUrl: string;
  }[];
  id: string;
};
