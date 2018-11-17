const buttons = {
	RemoveQuestion: `
		<button class="sg-button-secondary sg-label--unstyled{type}"{title}>
			<label class="sg-label__text">{text}</label>
			<span class="sg-button-primary__icon">
				<svg class="sg-icon sg-icon--adaptive sg-icon--x14">
				<use xlink:href="#icon-{icon}"></use>
				</svg>
			</span>
		</button>`,
	RemoveQuestionNoIcon: `
		<button class="sg-button-secondary sg-label--unstyled{type}{class}"{title}>
			<label class="sg-label__text">{text}</label>
		</button>`,
	RemoveQuestionMore: `<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--alt"{title}>{text}</button>`,
	ActionButtonNoIcon: `<button class="sg-button-secondary sg-label--unstyled{type}"{title}><label class="sg-label__text">{text}</label></button>`,
	//contentDetails: 
}
/*
Usage example
Buttons('RemoveQuestion', [
	{
		icon: "stream",
		text: "Default",
		type: "peach"
	}
]);
*/
export default (item_name, text, template) => {
	let button_list = "";

	const processData = btn => {
		let button = buttons[item_name]
			.replace(/\{icon\}/igm, btn.icon)
			.replace(/\{text\}/igm, btn.text)
			.replace(/\{title\}/igm, (btn.title && `title="${btn.title}"` || ""))
			.replace(/\{type\}/igm, btn.type && btn.type != "" ? " sg-button-secondary--" + btn.type : "")
			.replace(/\{class\}/igm, btn.class && btn.class != "" ? " " + btn.class : "")

		if (template) {
			button = template
				.replace(/\{button\}/igm, button)
				.replace(/\{class\}/igm, btn.templateClass ? " " + btn.templateClass : "")
		}
		
		return button + "\n";
	}

	if (Object.prototype.toString.call(text) === "[object Array]") {
		if (text.length > 0) {
			for (let i = 0, btn;
				(btn = text[i]); i++) {
				button_list += processData(btn);
			}
		}
	} else if (Object.prototype.toString.call(text) === "[object Object]") {
		button_list = processData(text);
	} else if (text.constructor.text === "String") {
		button_list = buttons[item_name].replace(/\{text\}/igm, text)
	}

	return button_list;
};
