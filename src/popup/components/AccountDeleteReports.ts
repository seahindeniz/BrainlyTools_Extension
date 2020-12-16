/* eslint-disable no-underscore-dangle */
import ServerReq from "@ServerReq";
import prettysize from "prettysize";
import { debounce } from "throttle-debounce";
import FileIcon from "../../helpers/FileIcon";
import Modal from "./Modal";

type AccountDeletionReportUserType = {
  approved: boolean;
  brainlyID: number;
  id: string;
  nick: string;
};

export type AccountDeletionReportType = {
  evidence: {
    comment?: string;
    file?: {
      type: string;
      name: string;
      size: number;
    };
  };
  moderator: AccountDeletionReportUserType;
  time: string;
  user: AccountDeletionReportUserType;
};

function RemoveDetailBox(reportElement: HTMLElement) {
  const $reportDetailRow = $(`tr[data-detail-id="${reportElement.id}"]`);

  reportElement.classList.remove("is-selected");
  $reportDetailRow.remove();
}

class AccountDeleteReports {
  reports: AccountDeletionReportType[];
  storedReports: AccountDeletionReportType[];

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
                  <option value="2">${System.data.locale.popup.extensionManagement.accountDeleteReports.byDeletedAccount}</option>
                  <option value="1">${System.data.locale.popup.extensionManagement.accountDeleteReports.byModerator}</option>
                </select>
              </span>
            </p>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="${System.data.locale.common.profileID}">
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

    this.$reportsTBody = $("tbody", this.$userList);
  }

  async FetchReports() {
    this.HideUserList();
    this.ShowSpinner();
    await System.Delay(50);

    if (this.storedReports.length === 0) {
      const resReports = await new ServerReq().GetAccountDeleteReports();

      if (resReports.success === true) {
        this.storedReports = resReports.data;
      }
    }

    this.HideSpinner();
    this.ShowUserList();

    this.RenderReports(this.storedReports);
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

  RenderReports(reports: AccountDeletionReportType[]) {
    if (reports) {
      this.reports = reports;

      this.$reportsTBody.html("");
      this.reports.forEach(this.RenderReport.bind(this));
    }
  }

  RenderReport(report: AccountDeletionReportType) {
    const targetUserProfileLink = System.createProfileLink(
      report.user.brainlyID,
      report.user.nick,
    );
    const $report = $(`
		<tr id="${report.user.id}">
			<td><a href="${targetUserProfileLink}" target="_blank">${report.user.brainlyID}</a></td>
			<td>${report.user.nick}</td>
			<td>${report.moderator.nick}</td>
			<td data-time="${report.time}"></td>
		</tr>`);

    $report.appendTo(this.$reportsTBody);
  }

  BindHandlers() {
    this.$header.on("click", this.HeaderClicked.bind(this));

    this.$searchInput.on("input", debounce(600, this.FindUser.bind(this)));

    this.$filterSelect.on("change", this.FindUser.bind(this));

    this.$reportsTBody.on("click", "figure img, figure video", event => {
      event.preventDefault();

      return new Modal(event.target);
    });

    this.$reportsTBody.on("click", "> tr:not(.report-detail)", event => {
      const { currentTarget }: { currentTarget: HTMLElement } = event;

      if (currentTarget.classList.contains("is-selected")) {
        RemoveDetailBox(currentTarget);
      } else {
        this.ShowReportDetails(currentTarget);
      }
    });
  }

  async HeaderClicked() {
    await System.Delay(50);

    if (!this.$header.parent().hasClass("is-active")) return;

    this.FetchReports();
  }

  async FindUser() {
    this.HideUserList();
    this.ShowSpinner();
    await System.Delay(50);

    const value = String(this.$searchInput.val());
    const filter = Number(this.$filterSelect.val());
    let reports = this.storedReports;

    if (value) {
      const resReports = await new ServerReq().FindDeleteReport(filter, value);

      reports = resReports.success === true ? resReports.data : [];
    }

    this.HideSpinner();
    this.ShowUserList();
    this.RenderReports(reports);
  }

  ShowReportDetails(reportElement) {
    reportElement.classList.add("is-selected");
    this.RenderReportDetails($(reportElement));
  }

  RenderReportDetails($reportRow) {
    const _id = $reportRow.attr("id");
    const report: AccountDeletionReportType = this.reports.find(
      _report => _report.user.id === _id,
    );

    const $detailRow = $(`
		<tr class="report-detail is-selected" data-detail-id="${_id}">
			<td colspan="4">
				<table class="table table is-fullwidth">
					<tbody class="evidences"></tbody>
				</table>
			</td>
		</tr>`);

    const $evidenceContainer = $("tbody", $detailRow);

    if (!report.evidence) {
      $evidenceContainer.attr(
        "data-empty",
        System.data.locale.popup.notificationMessages.noEvidenceFound,
      );
    } else {
      const { file } = report.evidence;
      const { comment } = report.evidence;

      if (comment) {
        const $commentRow = $(`
				<tr class="is-selected">
					<td colspan="2">${comment}</td>
				</tr>`);

        $commentRow.appendTo($evidenceContainer);
      }

      if (file?.name) {
        const pieces = file.name.split(".");
        const fileExtension = pieces.pop();
        const fileNameWithoutExtension = pieces.join(".");

        const $fileRow = $(`
				<tr class="is-selected">
					<td rowspan="2">
						<figure class="image is-64x64">
							<a href="${
                System.data.config.extension.uploadedFilesURL + file.name
              }" download="${file.name}">
									<img src="" title="${
                    System.data.locale.popup.extensionManagement
                      .accountDeleteReports.download
                  }">
							</a>
						</figure>
					</td>
					<td class="filename">
						<div class="middleEllipsis" title="${
              file.name
            }" data-filetype=".${fileExtension}">
							<p>${fileNameWithoutExtension}</p>
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

        // @ts-expect-error
        // eslint-disable-next-line no-new
        new FileIcon(file, $iconImg);

        $fileRow.appendTo($evidenceContainer);
      }
    }

    $detailRow.insertAfter($reportRow);
  }
}

export default AccountDeleteReports;
