/* eslint-disable no-underscore-dangle */
import ServerReq from "@ServerReq";
import prettysize from "prettysize";
import { debounce } from "throttle-debounce";
import FileIcon from "../../scripts/helpers/FileIcon";
import Modal from "./Modal";

function RemoveDetailBox(reportElement: HTMLElement) {
  const $reportDetailRow = $(`tr[data-id="${reportElement.id}"]`);

  reportElement.classList.remove("is-selected");
  $reportDetailRow.remove();
}

class AccountDeleteReports {
  reports = [];
  storedReports = [];

  $layout: JQuery<HTMLElement>;
  $searchInput: JQuery<HTMLElement>;
  $filterSelect: JQuery<HTMLElement>;
  $reportsTBody: JQuery<HTMLElement>;
  $header: JQuery<HTMLElement>;
  $body: JQuery<HTMLElement>;
  $spinner: JQuery<HTMLElement>;
  $userList: JQuery<HTMLElement>;
  $report: JQuery<HTMLElement>;

  constructor() {
    this.reports = [];
    this.storedReports = [];

    this.Render();
    this.RenderUserList();
    this.BindHandlers();
  }

  Render() {
    this.$layout = $(`
		<div id="accountDeleteReports" class="column is-narrow">
			<article class="message is-black">
				<div class="message-header">
					<p>${System.data.locale.popup.extensionManagement.accountDeleteReports.text}</p>
        </div>
        <div class="message-body">
          <div class="field has-addons">
            <p class="control">
              <span class="select">
                <select>
                  <option value="0">${System.data.locale.popup.extensionManagement.accountDeleteReports.listAllUsers}</option>
                  <option value="1">${System.data.locale.popup.extensionManagement.accountDeleteReports.onModerators}</option>
                  <option value="2">${System.data.locale.popup.extensionManagement.accountDeleteReports.onDeletedAccounts}</option>
                </select>
              </span>
            </p>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="${System.data.locale.messages.groups.userCategories.findUsers.nickOrID}">
            </p>
          </div>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="loader-wrapper">
                <div class="loader is-loading"></div>
              </div>
            </div>
          </div>
        </div>
			</article>
		</div>`);

    this.$searchInput = $("input", this.$layout);
    this.$filterSelect = $("select", this.$layout);
    this.$reportsTBody = $("table.reports > tbody", this.$layout);
    this.$header = $(".message-header", this.$layout);
    this.$body = $(".field-body", this.$layout);
    this.$spinner = $(".loader-wrapper", this.$layout);
  }

  RenderUserList() {
    this.$userList = $(`
    <table class="table table is-fullwidth reports">
      <thead>
        <tr>
          <th>${System.data.locale.common.profileID}</th>
          <th>${System.data.locale.common.nick}</th>
          <th>${System.data.locale.common.moderator}</th>
          <th>${System.data.locale.common.date}</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>`);
  }

  async FetchReports() {
    this.HideUserList();
    this.ShowSpinner();
    await System.Delay(50);

    const resReports = await new ServerReq().GetAccountDeleteReports();

    this.HideSpinner();
    this.ShowUserList();
    this.RenderReports(resReports);
  }

  ShowSpinner() {
    this.$body.append(this.$spinner);
  }

  HideSpinner() {
    this.$spinner.detach();
  }

  ShowUserList() {
    this.$body.append(this.$userList);
  }

  HideUserList() {
    this.$userList.detach();
  }

  RenderReports(reports) {
    if (reports) {
      this.reports = reports.data;

      this.$reportsTBody.html("");
      this.reports.forEach(this.RenderReport.bind(this));
    }
  }

  RenderReport(report) {
    const targetUserProfileLink = System.createProfileLink(
      report.target.user.brainlyID,
      report.target.user.nick,
    );
    const $report = $(`
		<tr id="${report._id}">
			<td><a href="${targetUserProfileLink}" target="_blank">${report.target.user.brainlyID}</a></td>
			<td>${report.target.user.nick}</td>
			<td>${report.user.nick}</td>
			<td data-time="${report.time}"></td>
		</tr>`);

    $report.appendTo(this.$reportsTBody);
  }

  BindHandlers() {
    this.$header.on("click", this.FetchReports.bind(this));

    this.$searchInput.on(
      "input",
      debounce(700, (event: JQuery.TriggeredEvent) => {
        this.FindUser(event.target.value);
      }),
    );

    this.$reportsTBody.on("click", "figure img, figure video", event => {
      event.preventDefault();

      return new Modal(event.target);
    });

    this.$reportsTBody.on("click", ">tr[id]", event => {
      const { target }: { target: HTMLElement } = event;

      if (target.classList.contains("is-selected")) {
        RemoveDetailBox(target);
      } else {
        this.ShowReportDetails(target);
      }
    });
  }

  async FindUser(value) {
    this.HideUserList();
    this.ShowSpinner();
    await System.Delay(50);

    const filter = this.$filterSelect.val();
    let resReports = this.storedReports;

    if (value) {
      resReports = await new ServerReq().FindDeleteReport(filter, value);

      if (this.storedReports.length === 0) {
        this.storedReports = this.reports;
      }
    }

    this.HideSpinner();
    this.ShowUserList();
    this.RenderReports(resReports);
  }

  ShowReportDetails(reportElement) {
    reportElement.classList.add("is-selected");
    this.RenderReportDetails($(reportElement));
  }

  RenderReportDetails($reportRow) {
    const _id = $reportRow.attr("id");
    const report = this.reports.find(_report => _report._id === _id);
    console.log(report);

    const $detailRow = $(`
		<tr class="is-selected" data-id="${report._id}">
			<td colspan="4">
				<table class="table table is-fullwidth">
					<tbody class="evidences"></tbody>
				</table>
			</td>
		</tr>`);

    const $evidenceContainer = $("tbody", $detailRow);

    if (!report.target.evidences) {
      $evidenceContainer.attr(
        "data-empty",
        System.data.locale.popup.notificationMessages.noEvidenceFound,
      );
    } else {
      const { file } = report.target.evidences;
      const { comment } = report.target.evidences;

      if (comment) {
        const $commentRow = $(`
				<tr class="is-selected">
					<td colspan="2">${comment}</td>
				</tr>`);

        $commentRow.appendTo($evidenceContainer);
      }

      if (file) {
        const $fileRow = $(`
				<tr class="is-selected">
					<td rowspan="2">
						<figure class="image is-64x64">
							<a href="${
                System.data.config.extension.uploadedFilesURL +
                file.name +
                file.extension
              }" download="${file.name}${file.extension}">
									<img src="" title="${
                    System.data.locale.popup.extensionManagement
                      .accountDeleteReports.download
                  }">
							</a>
						</figure>
					</td>
					<td class="filename">
						<div class="middleEllipsis" title="${file.name}${
          file.extension
        }" data-filetype="${file.extension}">
							<p>${file.name}</p>
						</div>
					</td>
				</tr>
				<tr class="is-selected">
					<td>
						<span>${prettysize(file.size, true)}</span>
						<span>${file.type}</span>
					</td>
				</tr>`);

        const $iconImg = $("figure img", $fileRow);
        // eslint-disable-next-line no-new
        new FileIcon(file, $iconImg);

        $fileRow.appendTo($evidenceContainer);
      }
    }

    $detailRow.insertAfter($reportRow);
  }
}

export default AccountDeleteReports;
