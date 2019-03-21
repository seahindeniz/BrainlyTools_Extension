import Modal from "../../../../components/Modal";
import { AddPoint, GetUserByID } from "../../../../controllers/ActionsOfBrainly";

const spinner = `<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`;

class PointChanger {
	constructor() {
		this.users = [];

		this.Init();
	}
	Init() {
		this.RenderLi();
		this.RenderModal();
		this.BindEvent();
	}
	RenderLi() {
		this.$li = $(`
		<li class="sg-menu-list__element" style="display: table; width: 100%;">
			<span class="sg-text sg-text--link sg-text--blue sg-text--small">${System.data.locale.core.pointChanger.text}</span>
		</li>`);

	}
	RenderModal() {
		let nUsers = System.data.locale.core.pointChanger.nUsers.replace("%{n}", ` <span>0</span> `);
		this.modal = new Modal({
			header: `<div class="sg-actions-list sg-actions-list--space-between">
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
								<div class="sg-actions-list__hole">
									<button class="sg-button-secondary js-hidden">
										<div class="sg-icon sg-icon--adaptive sg-icon--x22">
											<svg class="sg-icon__svg">
												<use xlink:href="#icon-check"></use>
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
		this.$idInput = $(".id input", this.modal.$modal);
		this.$userList = $(".js-user-list", this.modal.$modal);
		this.$close = $(".sg-toplayer__close", this.modal.$modal);
		this.$idInputContainer = $(".sg-content-box.id", this.modal.$modal);
		this.$addButton = $(".id .sg-actions-list__hole:eq(1) button", this.modal.$modal);
		this.$addPointToAllButton = $(".id .sg-actions-list__hole:eq(2) button", this.modal.$modal);
		this.$amountOfUsers = $(".sg-content-box__actions .sg-actions-list > .sg-actions-list__hole > .sg-text > span", this.modal.$modal);
	}
	BindEvent() {
		let that = this;

		this.$close.click(this.modal.Close.bind(this.modal));
		this.$li.on("click", "span", this.modal.Open.bind(this.modal));
		this.$addPointToAllButton.click(this.AddPointToAll.bind(this));

		this.$addButton.click(() => {
			let id = this.GetID()

			if (this.IsNotFetched(id)) {
				this.FindID(id);
			}
		});

		this.$userList.on("click", `button.js-add-point`, async function() {
			let $userNode = $(this).parents(".js-node");
			let $pointInput = $(`input[type="number"]`, $userNode);
			let diffPoint = Number($pointInput.val());

			if (diffPoint) {
				let user = $userNode.prop("userData");
				let $spinner = $(spinner).insertAfter(this);
				let $pointsLabel = $(".js-points", $userNode);

				this.classList.add("sg-button-secondary--disabled");
				await AddPoint(user.id, diffPoint);
				that.modal.notification(System.data.locale.core.notificationMessages.pointsAdded, "success");
				this.classList.remove("sg-button-secondary--disabled");

				user.points += diffPoint;

				$spinner.remove();
				$pointsLabel.text(user.points + " + ");
			}

			$pointInput.val("").trigger("input");
		});

		this.$userList.on("input", `input[type="number"]`, function() {
			let value = this.value;

			this.classList.remove("sg-input--valid", "sg-input--invalid");

			if (value < 0) {
				this.classList.add("sg-input--invalid");
			} else if (value > 0) {
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
	AddPointToAll() {
		let $buttons = $(`button.js-add-point`, this.$userList);

		$buttons.click();
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
		let res = await GetUserByID(id);

		if (res) {
			if (!res.success) {
				this.modal.notification(res.message || System.data.locale.common.notificationMessages.somethingWentWrong, "error");
			} else {
				if (res.data instanceof Array) {
					res.data.forEach(this.AddUser.bind(this));
				} else {
					this.AddUser(res.data);
					this.ClearIdInput();
				}
			}
		}
	}
	ClearIdInput() {
		this.$idInput.val("");
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
						<input type="number" class="sg-input sg-input--small" placeholder="${System.data.locale.common.shortPoints}..">
						<div class="sg-spinner-container">
							<button class="sg-button-secondary sg-button-secondary--small js-add-point" title="${System.data.locale.core.pointChanger.addPoint}">
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
		this.ChangeAmountOfUser(1);
		$node.prop("userData", user);
		$node.insertBefore(this.$idInputContainer);
		this.$addPointToAllButton.removeClass("js-hidden");
	}
	ChangeAmountOfUser(amount) {
		let currentAmount = this.$amountOfUsers.text();

		this.$amountOfUsers.text(Number(currentAmount) + amount);
	}
}

export default PointChanger
