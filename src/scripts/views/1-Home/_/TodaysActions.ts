function TodaysActions() {
  if (System.data.Brainly.userData.user.mod_actions_count >= 0) {
    const $userInfo = $("div.game-box__element > div.game-box__user-info");
    const $progressItems = $("> .game-box__progress-items", $userInfo);

    if (!$userInfo.is(".todaysActions")) {
      $userInfo.addClass("todaysActions");

      const todaysActions = `
      <div style="margin: -4px 0 3px;">
        <a href="/moderation_new/view_moderator/${System.data.Brainly.userData.user.id}" target="_blank">
          <span class="sg-text sg-text--xsmall sg-text--gray sg-text--capitalize">${System.data.locale.home.todaysActions}: </span>
          <span class="sg-text sg-text--xsmall sg-text--gray sg-text--emphasised">${System.data.Brainly.userData.user.mod_actions_count}</span>
        </a>
      </div>`;

      $progressItems.before(todaysActions);
    }
  }
}

export default TodaysActions;
