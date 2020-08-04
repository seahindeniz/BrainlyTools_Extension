import Popup from "@/popup/controllers/Popup";
import _System from "../controllers/System";
import ThemeColorChanger from "../helpers/ThemeColorChanger";

declare global {
  let popup: Popup;
  let System: _System;
  let isPageProcessing: boolean;
  let coloring: ThemeColorChanger;
  let myData: { [x: string]: any };
  let performanceStartTiming: number;
  let Zadanium: { [x: string]: any };
  let selectors: { [x: string]: string };
  let sitePassedParams: string | { [x: string]: any };
  let profileData: { id: number; nick: string };

  interface Window {
    popup: Popup;
    System: _System;
    isPageProcessing: boolean;
    coloring: ThemeColorChanger;
    myData: { [x: string]: any };
    performanceStartTiming: number;
    Zadanium: { [x: string]: any };
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
    dataLayer: { user: { id } }[];
  }
}

declare module "*.html" {
  const content: string;
  export default content;
}
