const Status = (type = "light", title = "", text = "") => {
	return `
	<section class="hero is-medium is-${type} is-bold">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">${title}</h1>
				<h2 class="subtitle">${text}</h2>
			</div>
		</div>
	</section>`
}

export default Status
