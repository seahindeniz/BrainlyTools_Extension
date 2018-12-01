import renderLayout from "./Layout";

const Layout = (contentType, content) => {
	let $body = $("body");

	if (contentType == "status") {
		let { type = "light", title = "", text = "" } = content;

		$body.html(`
		<section class="hero is-medium is-${type} is-bold">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">${title}</h1>
					<h2 class="subtitle">${text}</h2>
				</div>
			</div>
		</section>`)
	} else if (contentType = "layout") {
		let layout = renderLayout(content);
		
		$body.html(layout);

		setInterval(() => {
			$("[data-time]").each((i, elm) => {
				elm = $(elm);
				let time = $(elm).data("time");
				let timeLong = moment(time).fromNow(),
					timeShort = moment(time).fromNow(true);
				elm.attr("title", timeLong);
				elm.text(timeShort);
			});
		}, 1000);

		$(".box > .title").on("click", function() {
			$(this).parent().toggleClass("is-active");
		});

		$("body").on("click", ".message-header > p", function() {
			$(this).parents("article").toggleClass("is-active");
		});
	}
}

export default Layout
