import _System from "../controllers/System";

declare global {
  interface Window {
    System: _System
    chrome: any
    performanceStartTiming: number
    ResizeObserver: any
    isPageProcessing: boolean
  }
}

//declare var System: _System;
