const Error = text => {
	return `
	<section class="hero is-medium is-danger is-bold">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					Error
				</h1>
				<h2 class="subtitle">${text}</h2>
			</div>
		</div>
	</section>`
}

export default Error
