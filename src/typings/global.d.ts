import Popup from "@root/popup/controllers/Popup";
import _System from "../controllers/System";
import ThemeColorChanger from "../helpers/ThemeColorChanger";

type Zadanium = {
  [x: string]: any;
};

declare global {
  let popup: Popup;
  let System: _System;
  let isPageProcessing: boolean;
  let coloring: ThemeColorChanger;
  let myData: { [x: string]: any };
  let performanceStartTiming: number;
  let Zadanium: Zadanium;
  let selectors: { [x: string]: string };
  let sitePassedParams: string | { [x: string]: any };
  let profileData: { id: number; nick: string };

  type ObjectAnyType = {
    [x: string]: any;
    [x: number]: any;
  };

  interface Window {
    popup: Popup;
    System: _System;
    isPageProcessing: boolean;
    coloring: ThemeColorChanger;
    myData: { [x: string]: any };
    performanceStartTiming: number;
    Zadanium: Zadanium;
    selectors: { [x: string]: string };
    sitePassedParams: string | { [x: string]: any };
    profileData: { id: number; nick: string };
    $Z: {
      moderation: {
        all: {
          data: {
            lastId: number;
            settings: {
              // eslint-disable-next-line camelcase
              last_id: number;
            };
          };
          getContent: () => void;
        };
      };
    };
    Jodit: any;
    isPageBusy: boolean;
    dataLayer: {
      user: {
        id;
      };
    }[];
    jsData: {
      question: {
        author: {
          id: number;
          nick: string;
          avatar: string;
        };
        subject: { databaseId: number; name: string };
        grade: { databaseId: number; name: string };
        isClosed: boolean;
        isAnswerButton: boolean;
        created: string;
        databaseId: number;
        attachments: {
          full: string;
          thumbnail: string;
          type: string;
          size: number;
          hash: string;
          id: number;
          extension: string;
        }[];
        points: number;
        pointsForBest: number;
        approvedAnswersCount: number;
        answers: [
          {
            databaseId: number;
            user: {
              nick: string;
              avatar: string;
            };
            userId: number;
            confirmed: boolean;
            thanks: number;
            rating: number;
            attachments: [];
          },
        ];
        comments: {
          items: [];
          lastId: number;
          count: number;
        };
      };
    };
  }
}

declare module "*.html" {
  const content: string;
  export default content;
}
