import Brainly from "@BrainlyReq/Brainly";

export type WarningType = {
  relativeTime: string;
  reason: string;
  content: string;
  questionLink: string;
  giver: {
    nick: string;
    id: number;
  };
};

export default async function GetWarnings(id: number): Promise<WarningType[]> {
  const page: string = await new Brainly()
    .users()
    .view_user_warns()
    .P(id)
    .GET();

  const parser = new DOMParser();
  const doc = parser.parseFromString(page, "text/html");
  const rows = Array.from(doc.querySelectorAll("tr"));

  // Remove table header
  rows.shift();

  if (rows.length === 0) return [];

  return rows.map(row => {
    const cells: HTMLTableCellElement[] = row.children as any;
    const relativeTime = cells[0].innerText;
    const reason = cells[1].innerText;
    const content = cells[2].innerText;
    const questionLink =
      (cells[3].firstElementChild as HTMLAnchorElement)?.href || "";
    const giverProfileLink = cells[4].firstElementChild as HTMLAnchorElement;

    const giver = {
      nick: giverProfileLink.innerText,
      id: System.ExtractId(giverProfileLink.href),
    };

    return {
      relativeTime,
      reason,
      content,
      questionLink,
      giver,
    };
  });
}
