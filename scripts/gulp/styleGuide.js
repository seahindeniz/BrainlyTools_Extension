import { src, dest } from "gulp";
import syncReq from "sync-request";
import downloadFileSync from "download-file-sync";
import fs from "fs";

const STYLE_GUIDE_PATH = "src/styles/_/style-guide.css";

const styleGuidePJBody = syncReq(
  "GET",
  "https://raw.githubusercontent.com/brainly/style-guide/master/package.json",
  {
    headers: {
      "user-agent":
        "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    },
  },
);

const styleGuidePJ = JSON.parse(styleGuidePJBody.getBody("utf8"));
const versionNumber = styleGuidePJ.version;

if (!/\d{1,}\.\d{1,}\.\d{1,}/i.exec(versionNumber))
  throw Error(`Version number isn't correct: ${versionNumber}`);

const styleGuideLink = `https://styleguide.brainly.com/${versionNumber}/style-guide.css`;
let styleGuideContent = downloadFileSync(styleGuideLink);
const styleGuideMapContent = downloadFileSync(`${styleGuideLink}.map`);
styleGuideContent = styleGuideContent.replace(
  /\.\.\//g,
  "https://styleguide.brainly.com/",
);

fs.writeFileSync(`./${STYLE_GUIDE_PATH}`, styleGuideContent);
fs.writeFileSync(`./${STYLE_GUIDE_PATH}.map`, styleGuideMapContent);

export default () => {
  return src([STYLE_GUIDE_PATH, `${STYLE_GUIDE_PATH}.map`]).pipe(
    dest(`build/styles`, { overwrite: true }),
  );
};
