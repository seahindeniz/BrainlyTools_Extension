"use strict";

import Modal from "../../components/ModalToplayer";
import DeleteReasonCategoryList from "../../components/DeleteReasonCategoryList";
import DeleteSection from "../DeleteSection";

const createPanel = res => {
	let questionOwner = res.users_data.find(user => user.id == res.data.task.user.id);
	let ownerProfileLink = System.createBrainlyLink("profile", { nick: questionOwner.nick, id: questionOwner.id });
	
	let avatar = `<div class="sg-avatar__image sg-avatar__image--icon"><svg class="sg-icon sg-icon--gray sg-icon--x32"><use xlink:href="#icon-profile"></use></svg></div>`;
	if (questionOwner.avatar) {
		avatar = `<img class="sg-avatar__image" src="${System.prepareAvatar(questionOwner)}">`;
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

	
	let toplayer = new Modal(
		`<div class="sg-actions-list sg-actions-list--space-between">
			<div class="sg-actions-list__hole">
				<div class="sg-label sg-label--small sg-label--secondary">
					<div class="sg-text sg-text--peach">${System.data.locale.common.moderating.editInPanel}</div>
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
										<span class="sg-link sg-link--small sg-link--gray sg-link--disabled">${res.data.task.points.ptsForResp}+${res.data.task.points.ptsForBest} ${System.data.locale.common.moderating.point}</span>
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
		</div>`,

		`<div class="sg-spinner-container">
			<button class="sg-button-primary sg-button-primary--peach js-submit">${System.data.locale.common.moderating.confirm}</button>
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

	let $toplayer = toplayer.$;
	let taskContent = $(".taskContent", $toplayer);
	let $taskContentH1 = $(".taskContent > h1", $toplayer);
	let $toplayerContentBox = $(".sg-toplayer__wrapper > .sg-content-box > div:nth-child(2)", $toplayer);
	let brMatch = res.data.task.content.match(/<br\s*\/?>/gmi);

	DeleteSection(res.data.delete_reasons.task, "task").appendTo($toplayerContentBox);

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