import { GetModerateAllPages } from "../../../controllers/ActionsOfServer";
import WaitForElement from "../../../helpers/WaitForElement";

/**
 * Prepare for pagination
 */
async function pagination() {
  let res = await GetModerateAllPages();

  if (res && res.success && res.data) {
    let $loadMoreButton = await WaitForElement("#moderation-all > div.content > div.loader.calm");
    let $pagination = $('#moderation-all > div.content > .pagination');

    if ($pagination.length == 0) {
      $pagination = $(`
				<div class="loader pagination pagination-centered" style="display: none; height: auto; padding: 15px 5px;">
					<ul>
						<li class="active"><a href="#"> 1 </a></li>
					</ul>
				</div>`);
      $pagination.insertAfter($loadMoreButton);

      let $paginationList = $(">ul", $pagination);

      $pagination.show();
      res.data.forEach((last_id, i) => {
        if (last_id != 0)
          $(`<li><a href="#" data-last-id="${last_id}"> ${i + 2} </a></li>`).appendTo($paginationList);
      });

      let pageClickHandler = function(e) {
        e.preventDefault();

        let $parentLi = $(this).parent();

        if (!$parentLi.is(".active")) {
          let page = $(this).data('last-id');

          $("li.active", $pagination).removeClass("active");
          $parentLi.addClass("active");

          if (page) {
            $Z.moderation.all.data.lastId = ~~page;
          } else {
            delete $Z.moderation.all.data.lastId;
            delete $Z.moderation.all.data.settings.last_id;
          }

          $Z.moderation.all.getContent();
          $('#moderation-all > div.content > .moderation-item').remove();
        }
      };
      $pagination.on("click", "a", pageClickHandler);

      $("#moderation-all > div.top > div.sub-header.row > div.span5 > select.filters").change(function() {
        if (this.value != 0) {
          $pagination.hide();
          return false
        }

        $pagination.show();
      });
    }
  }
}

export default pagination();
