import _System from "../controllers/System";
import ThemeColorChanger from "../helpers/ThemeColorChanger";
import Popup from "@/popup/controllers/Popup";

declare global {
  var popup: Popup;
  var selectors: {};
  var System: _System;
  var ResizeObserver: any;
  var isPageProcessing: boolean;
  var coloring: ThemeColorChanger;
  var sitePassedParams: string | {};
  var performanceStartTiming: number;
}
