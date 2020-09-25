import gql from "graphql-tag";

export const ModeratePanelQuestionExtraDetailsQuery = gql`
  query getQuestion($id: ID!) {
    question(id: $id) {
      answers {
        hasVerified
        nodes {
          id
          verification {
            approval {
              approver {
                id
                nick
              }
            }
          }
        }
      }
      id
      isPopular
    }
  }
`;

export type ModeratePanelQuestionExtraDetailsType = {
  question: {
    answers: {
      hasVerified: boolean;
      nodes: {
        id: string;
        verification: {
          approval: {
            approver: {
              id: string;
              nick: string;
            };
          };
        };
      }[];
    };
    id: string;
    isPopular: boolean;
  };
};
