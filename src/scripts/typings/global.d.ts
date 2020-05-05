import _System from "../controllers/System";
import ThemeColorChanger from "../helpers/ThemeColorChanger";
import Popup from "@/popup/controllers/Popup";

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
}
