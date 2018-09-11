"use strict";

import makeToplayer from "../../components/Toplayer";

const createPanel = res => {
	let questionOwner = res.users_data.find(user => user.id == res.data.task.user.id);
	let ownerProfileLink = System.createBrainlyLink("profile", { nick: questionOwner.nick, id: questionOwner.id });
	
	let avatar = `<div class="sg-avatar__image sg-avatar__image--icon"><svg class="sg-icon sg-icon--gray sg-icon--x32"><use xlink:href="#icon-profile"></use></svg></div>`;
	if (questionOwner.avatar) {
		avatar = `<img class="sg-avatar__image" src="${questionOwner.avatar[64] || questionOwner.avatar[100]}">`;
	}

	let attachments = "";
	res.data.task.attachments && res.data.task.attachments.length > 0 && res.data.task.attachments.forEach((attachment, i) => {
		let content = "";
		if (attachment.thumbnail) {
			content = `
			<div class="sg-box sg-box--image-wrapper">
				<a class="sg-link sg-link--gray sg-link--emphasised" href="${attachment.full}" target="_blank">
					<img class="sg-box__image" src="${attachment.thumbnail}">
				</a>
			</div>`;
		} else {
			content = `
			<div class="sg-box sg-box--dark sg-box--no-border sg-box--image-wrapper">
				<div class="sg-box__hole">
					<a class="sg-link sg-link--gray sg-link--emphasised" href="${attachment.full}" target="_blank">${attachment.type}</a>
				</div>
			</div>`
		}
		attachments += `
		<div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
			<div class="brn-attachments__attachment">${content}</div>
		</div>`
	});

	let categories = "";
	res.data.delete_reasons.task.forEach((category, i) => {
		categories += `
		<div class="sg-actions-list__hole sg-actions-list__hole--spaced-xsmall">
			<div class="sg-label sg-label--secondary">
				<div class="sg-label__icon">
					<div class="sg-radio sg-radio--undefined">
						<input type="radio" class="sg-radio__element" name="categories" id="category${category.id}">
						<label class="sg-radio__ghost" for="category${category.id}"></label>
					</div>
				</div>
				<label class="sg-label__text" for="category${category.id}">${category.text}</label>
			</div>
		</div>`
	});

	let $toplayer = makeToplayer(
		`<div class="sg-actions-list sg-actions-list--space-between">
			<div class="sg-actions-list__hole">
				<div class="sg-label sg-label--small sg-label--secondary">
					<div class="sg-text sg-text--peach">${System.data.locale.texts.moderate.description}</div>
				</div>
			</div>
			<div class="sg-actions-list__hole">
				<div class="sg-label sg-label--small sg-label--secondary">
					<div class="sg-label__icon">
						<svg class="sg-icon sg-icon--gray-secondary sg-icon--x14">
							<use xlink:href="#icon-counter"></use>
						</svg>
					</div>
					<div class="sg-text sg-text--obscure sg-text--gray-secondary sg-text--emphasised js-counter">---</div>
				</div>
			</div>
		</div>`,

		`<div class="sg-content-box">
			<div class="question-header sg-content-box__title sg-content-box__title--spaced-bottom">
				<div class="sg-actions-list sg-actions-list--space-between sg-actions-list--no-wrap">
					<div class="sg-actions-list__hole">
						<div class="sg-actions-list">
							<div class="sg-actions-list__hole">
								<div class="js-asker-avatar question-header__avatar-wrapper sg-hide-for-small-only">
									<div class="user-fiche-wrapper">
										<div class="sg-avatar">
											<a href="${ownerProfileLink}" title="${questionOwner.nick}">${avatar}</a>
										</div>
									</div>
								</div>
							</div>
							<div class="sg-actions-list__hole">
								<ul class="sg-breadcrumb-list">
									<li class="sg-breadcrumb-list__element">
										<a href="${ownerProfileLink}" class="sg-link sg-link--small sg-link--gray" title="${questionOwner.nick}">
											<span>${questionOwner.nick}</span>
										</a>
									</li>
									<li class="sg-breadcrumb-list__element">
										<span class="sg-link sg-link--small sg-link--gray sg-link--disabled">${res.data.task.points.ptsForResp}+${res.data.task.points.ptsForBest} ${System.data.locale.texts.globals.point}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="sg-actions-list__hole">
						<div class="sg-actions-list sg-actions-list--to-right sg-actions-list--no-wrap">
							<div class="sg-actions-list__hole"><a class="sg-link sg-link--gray" href="${System.createBrainlyLink("task", { id: res.data.task.id })}">${res.data.task.id}</a></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="sg-content-box js-question-wrapper">
			<div class="sg-content-box__content taskContent js-shrink">
				<h1 class="sg-text sg-text--regular sg-text--headline">${res.data.task.content}</h1>
				<span class="sg-link sg-link--small sg-link--underlined">Show more..</span>
			</div>
		</div>
		<div class="sg-content-box sg-content-box--spaced-top-large sg-content-box--spaced-bottom">
			<div class="sg-actions-list">${attachments}</div>
		</div>
	
		<div class="sg-actions-list sg-content-box__actions--spaced-top sg-content-box__actions--spaced-bottom categories">${categories}</div>
		<div class="sg-horizontal-separator js-hidden"></div>
		<div class="sg-actions-list sg-content-box__actions--spaced-top sg-content-box__actions--spaced-bottom reasons"></div>
		
		<textarea class="sg-textarea sg-textarea--invalid sg-textarea--full-width"></textarea>

		<div class="sg-content-box__actions">
			<div class="sg-label sg-label--secondary" >
				<div class="sg-label__icon" title="${System.data.locale.texts.moderate.take_points.description}">
					<div class="sg-checkbox">
						<input type="checkbox" class="sg-checkbox__element" id="take_points">
						<label class="sg-checkbox__ghost" for="take_points">
						<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
							<use xlink:href="#icon-check"></use>
						</svg>
						</label>
					</div>
				</div>
				<label class="sg-label__text" for="take_points">${System.data.locale.texts.moderate.take_points.title}</label>
			</div>
			<div class="sg-vertical-separator sg-vertical-separator--small"></div>
			<div class="sg-label sg-label--secondary" >
				<div class="sg-label__icon" title="${System.data.locale.texts.moderate.return_points.description}">
					<div class="sg-checkbox">
						<input type="checkbox" class="sg-checkbox__element" id="return_points">
						<label class="sg-checkbox__ghost" for="return_points">
						<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
							<use xlink:href="#icon-check"></use>
						</svg>
						</label>
					</div>
				</div>
				<label class="sg-label__text" for="return_points">${System.data.locale.texts.moderate.return_points.title}</label>
			</div>
			<div class="sg-vertical-separator sg-vertical-separator--small"></div>
			<div class="sg-label sg-label--secondary" >
				<div class="sg-label__icon" title="${System.data.locale.texts.moderate.give_warning.description}">
					<div class="sg-checkbox">
						<input type="checkbox" class="sg-checkbox__element" id="give_warning">
						<label class="sg-checkbox__ghost" for="give_warning">
						<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
							<use xlink:href="#icon-check"></use>
						</svg>
						</label>
					</div>
				</div>
				<label class="sg-label__text" for="give_warning">${System.data.locale.texts.moderate.give_warning.title}</label>
			</div>
		</div>`,

		`<div class="sg-spinner-container">
			<button class="sg-button-primary sg-button-primary--peach js-submit">${System.data.locale.texts.moderate.confirm}</button>
		</div>`/*,

		`<section class="js-react-taskline">
			<div class="sg-layout__box">
				<div class="sg-content-box">
					<div class="sg-content-box">
						<div class="sg-content-box sg-content-box--spaced-bottom">
							<div class="sg-content-box__content">
								<div class="sg-text sg-text--emphasised">10.09.2018</div>
							</div>
							<div class="sg-content-box sg-content-box--spaced">
								<div class="sg-content-box__content">
									<div><span class="sg-text sg-text--emphasised">23:52</span> <span class="sg-text"><a class="sg-link" href="/profil/traBolic-3546725">traBolic</a> sudah melaporkan tanggapan pengguna <a class="sg-link" href="/profil/Ghinatera-6362519">Ghinatera</a></span> <span class="sg-link sg-link--small">tampilkan</span> </div>
									<div><span class="sg-text sg-text--emphasised">23:49</span> <span class="sg-text"><a class="sg-link" href="/profil/Ghinatera-6362519">Ghinatera</a> sudah menjawab pertanyaanmu</span> </div>
									<div><span class="sg-text sg-text--emphasised">23:49</span> <span class="sg-text"><a class="sg-link" href="/profil/traBolic-3546725">traBolic</a> sudah menambah pertanyaan</span> </div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>`*/
	);

	let taskContent = $(".taskContent", $toplayer);
	let $taskContentH1 = $(".taskContent > h1", $toplayer);
	let brMatch = res.data.task.content.match(/<br\s*\/?>/gmi);

	if(!((brMatch && brMatch.length > 6) || $taskContentH1.text().length > 255)){
		taskContent.removeClass("js-shrink")
	}

	let taskContentShowMore = $(".taskContent > span", $toplayer);
	taskContentShowMore.click(function(){
		taskContent.removeClass("js-shrink")
	});

	return $toplayer;
}

export default createPanel;