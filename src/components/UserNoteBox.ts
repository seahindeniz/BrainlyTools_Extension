import ServerReq from "@ServerReq";
import { ActionListHole, Textarea } from "./style-guide";

/**
 * @param {import("@ServerReq").UserDetailsType} user
 */
export default user => {
  const input = Textarea({
    tag: "textarea",
    fullWidth: true,
    className: "sg-text-small",
    placeholder: System.data.locale.common.personalNote.clickToAddANote,
    title: System.data.locale.common.personalNote.title,
    maxlength: 1000,
    value: user.note || "",
  });
  const container = ActionListHole({
    children: input,
    className: "userNoteBox",
  });

  input.addEventListener("change", async () => {
    const data = {
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id,
      note: input.value,
    };
    const resUpdate = await new ServerReq().UpdateNote(data);

    if (resUpdate && resUpdate.success) {
      input.classList.add("changed");
      await System.Delay(3000);
      input.classList.remove("changed");
    }
  });

  return container;
};
