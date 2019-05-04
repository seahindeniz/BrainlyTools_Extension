import prettysize from "prettysize";
import { debounce } from 'throttle-debounce';
import ServerReq from "../../scripts/controllers/Req/Server";
import FileIcon from "../../scripts/helpers/FileIcon";
import Modal from "./Modal";

class AccountDeleteReports {
  constructor() {
    this.reports = [];
    this.storedReports = [];

    this.Render();
    this.FetchReports();
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
							</table>
						</div>
					</div>
				</div>
			</article>
		</div>`);

    this.$searchInput = $("input", this.$layout);
    this.$filterSelect = $("select", this.$layout);
    this.$reportsTBody = $("table.reports > tbody", this.$layout);
  }
  async FetchReports() {
    let resReports = await new ServerReq().GetAccountDeleteReports();

    this.RenderReports(resReports);
  }
  RenderReports(reports) {
    if (
      reports &&
      (
        (
          reports.data && reports.data.length > 0
        ) ||
        (
          reports instanceof Array && reports.length > 0
        )
      )
    ) {
      this.reports = reports.data;

      this.$reportsTBody.html("");
      this.reports.forEach(this.RenderReport.bind(this));
    }
  }
  RenderReport(report) {
    let targetUserProfileLink = System.createProfileLink(report.target.user.brainlyID, report.target.user.nick);
    let $report = $(`
		<tr id="${report._id}">
			<td><a href="${targetUserProfileLink}" target="_blank">${report.target.user.brainlyID}</a></td>
			<td>${report.target.user.nick}</td>
			<td>${report.user.nick}</td>
			<td data-time="${report.time}"></td>
		</tr>`);

    $report.appendTo(this.$reportsTBody);
  }
  BindHandlers() {
    let that = this;

    this.$searchInput.on("input", debounce(500, function(e) {
      that.FindUser(this.value);
    }))

    this.$reportsTBody.on("click", "figure img, figure video", function(e) {
      e.preventDefault();
      new Modal(this);
    });

    this.$reportsTBody.on("click", ">tr[id]", function() {
      if (this.classList.contains("is-selected")) {
        that.RemoveDetailBox(this);
      } else {
        that.ShowReportDetails(this);
      }
    });
  }
  async FindUser(value) {
    let filter = this.$filterSelect.val();
    let resReports = this.storedReports;

    if (value && value != "") {
      resReports = await new ServerReq().FindDeleteReport(filter, value);

      if (this.storedReports.length == 0) {
        this.storedReports = this.reports;
      }
    }

    this.RenderReports(resReports);
  }
  RemoveDetailBox(reportElement) {
    let $reportDetailRow = $(`tr[data-id="${reportElement.id}"]`);

    reportElement.classList.remove("is-selected");
    $reportDetailRow.remove();
  }
  ShowReportDetails(reportElement) {
    reportElement.classList.add("is-selected");
    this.RenderReportDetails($(reportElement));
  }
  RenderReportDetails($reportRow) {
    let _id = $reportRow.attr("id");
    let report = this.reports.find(_report => _report._id == _id);
    console.log(report);

    let $detailRow = $(`
		<tr class="is-selected" data-id="${report._id}">
			<td colspan="4">
				<table class="table table is-fullwidth">
					<tbody class="evidences"></tbody>
				</table>
			</td>
		</tr>`);

    let $evidenceContainer = $("tbody", $detailRow);

    if (!report.target.evidences) {
      $evidenceContainer.attr("data-empty", System.data.locale.popup.notificationMessages.noEvidenceFound);
    } else {
      let file = report.target.evidences.file;
      let comment = report.target.evidences.comment;

      if (comment) {
        let $commentRow = $(`
				<tr class="is-selected">
					<td colspan="2">${comment}</td>
				</tr>`);

        $commentRow.appendTo($evidenceContainer);
      }

      if (file) {
        let $fileRow = $(`
				<tr class="is-selected">
					<td rowspan="2">
						<figure class="image is-64x64">
							<a href="${System.data.config.extension.uploadedFilesURL + file.name + file.extension}" download="${file.name}${file.extension}">
									<img src="" title="${System.data.locale.popup.extensionManagement.accountDeleteReports.download}">
							</a>
						</figure>
					</td>
					<td class="filename">
						<div class="middleEllipsis" title="${file.name}${file.extension}" data-filetype="${file.extension}">
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

        let $iconImg = $("figure img", $fileRow);
        new FileIcon(file, $iconImg);

        $fileRow.appendTo($evidenceContainer);
      }
    }

    $detailRow.insertAfter($reportRow);
  }
}

export default AccountDeleteReports
