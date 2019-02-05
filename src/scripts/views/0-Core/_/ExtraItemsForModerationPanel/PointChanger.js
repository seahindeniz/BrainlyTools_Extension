import ModalToplayer from "../../../../components/ModalToplayer";
import { getUserByID, AddPoint } from "../../../../controllers/ActionsOfBrainly";

const spinner = `<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`;

class PointChanger {
	constructor() {
		this.users = []
		this.Init();

		return this.$pointChangerLi;
	}
	Init() {
		this.RenderLi();
		this.RenderModal();
		this.RenderToplayerContainer();
		this.BindEvent();
	}
	RenderLi() {
		this.$pointChangerLi = $(`
		<li class="sg-menu-list__element" style="display: table; width: 100%;">
			<span class="sg-text sg-text--link sg-text--blue sg-text--small">${System.data.locale.core.pointChanger.text}</span>
		</li>`);

	}
	RenderModal() {
		let nUsers = System.data.locale.core.pointChanger.nUsers.replace("%{n}", `<span>0</span>`);
		this.modal = new ModalToplayer({
			heading: `<div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-text sg-text--peach">${System.data.locale.core.pointChanger.text}</div>
					</div>
				</div>
			</div>`,
			content: `<div class="sg-content-box">
				<div class="sg-content-box__content sg-content-box__content--spaced-top js-user-list">

					<div class="sg-content-box id">
						<div class="sg-content-box__content sg-content-box__content--with-centered-text sg-content-box__content--spaced-top">
							<div class="sg-actions-list sg-actions-list--no-wrap">
								<div class="sg-actions-list__hole sg-actions-list__hole--grow">
									<input type="text" class="sg-input sg-input--full-width" placeholder="${System.data.locale.common.profileID}">
								</div>
								<div class="sg-actions-list__hole">
									<button class="sg-button-secondary sg-button-secondary--alt">
										<div class="sg-icon sg-icon--adaptive sg-icon--x22">
											<svg class="sg-icon__svg">
												<use xlink:href="#icon-profile_view"></use>
											</svg>
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="sg-content-box__actions sg-content-box__content--spaced-bottom-large">
					<div class="sg-actions-list sg-actions-list--no-wrap">
						<div class="sg-actions-list__hole">
							<p class="sg-text">${nUsers}</p>
						</div>
					</div>
				</div>
				<div class="sg-content-box__content">
					<blockquote class="sg-text sg-text--small">${System.data.locale.core.pointChanger.youNeedToEnterOrPaste}</blockquote>
				</div>
			</div>`,
			size: "medium"
		});
		this.$modal = this.modal.$;
		this.$close = $(".sg-toplayer__close", this.$modal);
		this.$addButton = $(".id button", this.$modal);
		this.$idInput = $(".id .sg-input", this.$modal);
		this.$userList = $(".js-user-list", this.$modal);
		this.$idInputContainer = $(".sg-content-box.id", this.$modal);
		this.$amountOfUsers = $(".sg-content-box__actions .sg-actions-list > .sg-actions-list__hole > .sg-text > span", this.$modal);
	}
	RenderToplayerContainer() {
		this.$toplayerContainer = $("body > div.page-wrapper.js-page-wrapper > section > div.js-toplayers-container");

		if (this.$toplayerContainer.length == 0) {
			this.$toplayerContainer = $(`<div class="js-toplayers-container"></div>`).appendTo("body");
		}
	}
	BindEvent() {
		this.$close.click(this.CloseModal.bind(this));
		this.$pointChangerLi.on("click", "span", this.OpenModal.bind(this));
		this.$addButton.click(() => {
			let id = this.GetID()

			if (this.IsNotFetched(id)) {
				this.FindID(id);
			}
		});
		this.$userList.on("click", `button.js-add-point`, async function() {
			let $userNode = $(this).parents(".js-node");
			let $pointInput = $(`input[type="number"]`, $userNode);
			let $pointsLabel = $(".js-points", $userNode);
			let diffPoint = $pointInput.val();
			let user = $userNode.prop("userData");

			let $spinner = $(spinner).insertAfter(this);

			await AddPoint(user.id, diffPoint);

			$pointsLabel.text((user.points + Number(diffPoint)) + " + ");
			$pointInput.val("");
			$spinner.remove();
		});
		this.$userList.on("input", `input[type="number"]`, function() {
			let value = this.value;

			if (value == "") {
				this.classList.remove("sg-input--valid", "sg-input--invalid");
			} else if (value < 0) {
				this.classList.add("sg-input--invalid");
			} else {
				this.classList.add("sg-input--valid");
			}
		})

		this.$idInput.on("paste", e => {
			e.preventDefault();

			let text = (e.originalEvent || e).clipboardData.getData("text/plain");
			let idList = System.ExtractIds(text);

			if (!idList || idList.length == 0) {
				document.execCommand("insertText", false, text);
			} else {
				idList = Array.from(new Set(idList));
				idList = this.FilterFetchedUsers(idList);

				if (idList.length == 1) {
					this.FindID(idList[0]);
				} else if (idList.length > 1) {
					this.FindID(idList);
				}
			}
		});
	}
	CloseModal() {
		this.$modal.appendTo("</ div>");
	}
	OpenModal() {
		this.$modal.appendTo(this.$toplayerContainer);
	}
	GetID() {
		let value = this.$idInput.val();

		if (value) {
			let id = System.ExtractId(value);

			if (id) {
				return id;
			}
		}
	}
	IsNotFetched(id) {
		return !this.users.includes(id)
	}
	FilterFetchedUsers(idList) {
		return idList.reduce((acc, id) => {
			if (this.IsNotFetched(id))
				acc.push(id);

			return acc;
		}, []);
	}
	async FindID(id) {
		let res = await getUserByID(id);

		if (res && res.success) {
			if (res.data instanceof Array) {
				res.data.forEach(this.AddUser.bind(this));
			} else {
				this.AddUser(res.data);
			}
		}
	}
	AddUser(user) {
		let avatar = System.prepareAvatar(user);
		let profileLink = System.createProfileLink(user.nick, user.id);
		let $node = $(`
		<div class="sg-content-box sg-content-box--full js-node">
			<div class="sg-content-box__content sg-content-box__content--spaced-top-small">
				<div class="sg-actions-list">
					<div class="sg-actions-list__hole">
						<div data-test="ranking-item-avatar" class="sg-avatar sg-avatar--normal sg-avatar--spaced">
							<a href="${profileLink}">
								<img class="sg-avatar__image" src="${avatar}">
							</a>
						</div>
					</div>
					<div class="sg-actions-list__hole sg-actions-list__hole--grow">
						<a href="${profileLink}" class="sg-text sg-text--link-unstyled sg-text--bold">
							<span class="sg-text sg-text--small sg-text--gray sg-text--bold">${user.nick}</span>
							<div class="sg-text sg-text--xsmall sg-text--gray">${user.id}</div>
						</a>
					</div>
					<div class="sg-actions-list__hole">
						<span class="sg-text sg-text--small sg-text--gray sg-text--bold js-points">${user.points} + </span>
						<input type="number" class="sg-input sg-input--small" placeholder="Pts..">
						<div class="sg-spinner-container">
							<button class="sg-button-secondary sg-button-secondary--small js-add-point">
								<div class="sg-icon sg-icon--adaptive sg-icon--x14">
									<svg class="sg-icon__svg">
										<use xlink:href="#icon-check"></use>
									</svg></div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>`);

		this.users.push(user.id);
		this.ChangeAmountOfUser(+1);
		$node.prop("userData", user);
		$node.insertBefore(this.$idInputContainer);
	}
	ChangeAmountOfUser(amount) {
		let currentAmount = this.$amountOfUsers.text();

		this.$amountOfUsers.text(Number(currentAmount) + amount);
	}
}

export default PointChanger
