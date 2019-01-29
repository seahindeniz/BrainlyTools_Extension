class PointChanger {
	constructor() {
		this.Init();

		return this.pointChangerLi;
	}
	Init() {
		this.RenderLi();
	}
	RenderLi() {
		this.pointChangerLi = $(`
		<li class="sg-menu-list__element TaskDeleter" style="display: table; width: 100%;">
			<a class="sg-menu-list__link" href="#">${System.data.locale.core.TaskDeleter.text}</a>
		</li>`);
	}
}

export default PointChanger
