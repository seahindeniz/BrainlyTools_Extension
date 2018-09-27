"use strict"

import renderThemeColor from "./ThemeColor";
import renderDeleteButtonOptions from "./DeleteButtonOptions";
import renderOtherOptions from "./OtherOptions";
import renderAnnouncements from "./Announcements";

const Layout = res => {
	System.data.Brainly.userData.user.fixedAvatar = System.data.Brainly.userData.user.avatars[100] || `https://${System.data.meta.marketName}/img/avatars/100-ON.png`;
	let $layout = $(`
	<div class="notification-list"></div>
	<section class="hero is-success is-halfheight">
		<div class="hero-body">
			<div class="container">
				<div class="column">
					<h3 class="title has-text-grey has-text-centered">${System.data.meta.manifest.short_name} for</h3>
					<h3 class="title has-text-grey has-text-centered marketName">${System.data.meta.marketName}</h3>
					<div class="box">
						<figure class="avatar has-text-centered">
							<img src="${System.data.Brainly.userData.user.fixedAvatar}" title="${System.data.Brainly.userData.user.nick} - ${System.data.Brainly.userData.user.id}">
						</figure>
						<h4 class="title is-4 has-text-centered">${System.data.locale.texts.extension_options.title}</h4>

						<div id="themeColor" class="column is-narrow">
							<article class="message is-info">
								<div class="message-header">
									<p>${System.data.locale.texts.extension_options.themeColor.title}</p>
								</div>
								<div class="message-body"></div>
							</article>
						</div>
						<div id="quickDeleteButtons" class="column is-narrow">
							<article class="message is-danger">
								<div class="message-header">
									<p>${System.data.locale.texts.extension_options.quick_delete_buttons.title}</p>
								</div>
								<div class="message-body"></div>
							</article>
						</div>
						<div id="otherOptions" class="column is-narrow">
							<article class="message is-dark">
								<div class="message-header">
									<p>${System.data.locale.texts.extension_options.otherOptions.title}</p>
								</div>
								<div class="message-body"></div>
							</article>
						</div>
						
						<h4 class="title is-4 has-text-centered">${System.data.locale.texts.extension_options.extensionManagement}</h4>

						<div id="announcements" class="column is-narrow">
							<article class="message is-info">
								<div class="message-header">
									<p>${System.data.locale.texts.extension_options.announcements.title}</p>
								</div>
								<div class="message-body"></div>
							</article>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<footer class="footer">
		<p class="title is-7 has-text-centered">
			<a href="https://chrome.google.com/webstore/detail/${System.data.meta.extension.id}" class="has-text-grey" target="_blank">Brainly Tools v${System.data.meta.manifest.version}</a>
		</p>
	</footer>`);

	renderThemeColor(res.themeColor, announcements => {
		$("#themeColor .message-body", $layout).append(announcements);
	});
	renderDeleteButtonOptions(res.quickDeleteButtonsReasons, announcements => {
		$("#quickDeleteButtons .message-body", $layout).append(announcements);
	});
	renderOtherOptions(res, announcements => {
		$("#otherOptions .message-body", $layout).append(announcements);
	});

	renderAnnouncements(announcements => {
		$("#announcements .message-body", $layout).append(announcements);
	});
	return $layout;
}

export default Layout
