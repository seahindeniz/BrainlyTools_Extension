class TextEditor {
	constructor(target, value = "") {
		if (target instanceof $) {
			this.targetElement = target.get(0);
		} else {
			this.targetElement = target;
		}

		this.CreateEditor();
		this.SetValue(value);
		this.BindEvents();

		return this;
	}
	CreateEditor() {
		let options = {
			showPlaceholder: true,
			useInputsPlaceholder: true,
			addNewLineOnDBLClick: false,
			"toolbarButtonSize": "small",
			"toolbarSticky": false,
			"buttons": ",,source,|,undo,redo,|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,align,outdent,indent,,font,fontsize,brush,paragraph,|,image,file,video,table,link,\n,cut,hr,eraser,copyformat,|,symbol,fullsize,selectall,print"
		};

		if (this.targetElement.tagName.toLowerCase() == "input") {
			options = {
				placeholder: System.data.locale.popup.extensionManagement.announcements.editorTitle,
				"allowResizeY": false,
				"preset": "inline",
				"height": 20,
				events: {
					beforeEnter: () => false
				},
				"showCharsCounter": false,
				"showWordsCounter": false,
				"showXPathInStatusbar": false,
				...options
			};
		}

		if (this.targetElement.tagName.toLowerCase() == "textarea") {
			options = {
				placeholder: System.data.locale.popup.extensionManagement.announcements.editorContent,
				"enter": "BR",
				"height": 300,
				"uploader": {
					"insertImageAsBase64URI": true
				},
				...options
			};
		}

		this.editor = new window.Jodit(this.targetElement, options);
	}
	SetValue(value) {
		this.editor.setElementValue(value);
	}
	BindEvents() {
		this.editor.events.on('change', this.OnChangeHandler.bind(this));
	}
	OnChangeHandler() {
		let value = this.editor.getEditorValue();

		window.isPageBusy = value != "";

		if (this.onChange) {
			this.onChange(value);
		}
	}
}

export default TextEditor
