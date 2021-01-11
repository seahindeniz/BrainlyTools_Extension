/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-shadow */

// Delete this file after the following issue gets resolved
// https://github.com/fengyuanchen/viewerjs/issues/440

type ImageDataType = {
  aspectRatio: number;
  height: number;
  left: number;
  naturalHeight: number;
  naturalWidth: number;
  ratio: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  top: number;
  width: number;
  x: number;
  y: number;
};

declare module "viewerjs" {
  export interface ToolbarOptions extends Viewer.ToolbarButtonOptions {
    [x: string]:
      | boolean
      | Viewer.Visibility
      | Viewer.ToolbarButtonSize
      | Function
      | Viewer.ToolbarButtonOptions;
  }

  export default class Viewer {
    constructor(
      element: HTMLElement,
      options?: {
        toolbar?: boolean | Viewer.Visibility | ToolbarOptions;
      } & Viewer.Options,
    );

    image?: HTMLElement;
    imageData: Partial<Readonly<ImageDataType>>;
  }
}
