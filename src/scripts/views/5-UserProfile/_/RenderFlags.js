import UserFlag from "../../../components/UserFlag";

function RenderFlags(probatus, gender) {
	if (probatus && gender) {
		let $tag = UserFlag("tag");
		let $img = UserFlag("img", gender);
		let $ranking = $("#main-left span.ranking");

		$img.prependTo("#main-left > div.personal_info");
		$ranking
			.css("width", "100%")
			.append($tag)
			.children("h2")
			.css("float", "left");

	}
}

export default RenderFlags
