import _System from "../controllers/System";
import ThemeColorChanger from "../helpers/ThemeColorChanger";
import Popup from "@/popup/controllers/Popup";

declare global {
  var popup: Popup;
  var System: _System;
  var isPageProcessing: boolean;
  var coloring: ThemeColorChanger;
  var myData: { [x: string]: any };
  var performanceStartTiming: number;
  var Zadanium: { [x: string]: any };
  var selectors: { [x: string]: string };
  var sitePassedParams: string | { [x: string]: any };
}
