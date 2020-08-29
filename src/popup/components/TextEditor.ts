class TextEditor {
  targetElement: HTMLElement;
  editor: any;

  constructor(target: HTMLElement | JQuery<HTMLElement>, value = "") {
    if (target instanceof HTMLElement) {
      this.targetElement = target;
    } else {
      [this.targetElement] = target;
    }

    this.CreateEditor();
    this.SetValue(value);
    this.BindHandlers();

    return this;
  }

  CreateEditor() {
    let options = {
      showPlaceholder: true,
      useInputsPlaceholder: true,
      addNewLineOnDBLClick: false,
      toolbarButtonSize: "small",
      toolbarSticky: false,
      buttons:
        ",,source,|,undo,redo,|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,align,outdent,indent,,font,fontsize,brush,paragraph,|,image,file,video,table,link,\n,cut,hr,eraser,copyformat,|,symbol,fullsize,selectall,print",
      placeholder: undefined,
      allowResizeY: undefined,
      preset: undefined,
      height: undefined,
      events: undefined,
      showCharsCounter: undefined,
      showWordsCounter: undefined,
      showXPathInStatusbar: undefined,
      enter: undefined,
      uploader: undefined,
    };

    if (this.targetElement.tagName.toLowerCase() === "input") {
      options = {
        placeholder:
          System.data.locale.popup.extensionManagement.announcements
            .editorTitle,
        allowResizeY: false,
        preset: "inline",
        height: 20,
        events: {
          beforeEnter: () => false,
        },
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        ...options,
      };
    }

    if (this.targetElement.tagName.toLowerCase() === "textarea") {
      options = {
        placeholder:
          System.data.locale.popup.extensionManagement.announcements
            .editorContent,
        enter: "BR",
        height: 300,
        uploader: {
          insertImageAsBase64URI: true,
        },
        ...options,
      };
    }

    this.editor = new window.Jodit(this.targetElement, options);
  }

  SetValue(value) {
    this.editor.setElementValue(value);
  }

  BindHandlers() {
    this.editor.events.on("change", this.OnChangeHandler.bind(this));
  }

  OnChangeHandler() {
    const value = this.editor.getEditorValue();

    window.isPageBusy = value !== "";

    /* if (this.onChange) {
      this.onChange(value);
    } */
  }
}

export default TextEditor;
