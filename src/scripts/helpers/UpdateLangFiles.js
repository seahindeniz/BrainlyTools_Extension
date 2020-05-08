/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { LokaliseApi } from "@lokalise/node-api";
import download from "download";
import fs from "fs";
import yaml from "js-yaml";

/**
 * @typedef {{data: Buffer, mode: number, mtime: Date, path: string, type: string}} LokaliseResFileEntry
 * @typedef {LokaliseResFileEntry[]} ResDownload
 */

const LANGUAGE_FOLDER = "src/locales";
// const LANGUAGE_FOLDER = "z";

const LANGUAGE_DETAILS = {
  en_US: {
    name: "English",
  },
  id: {
    name: "Bahasa Indonesia",
    author: "Zuhh",
  },
  fr: {
    name: "Français",
    author: "MichaelS, Its1tom",
  },
  tr: {
    name: "Türkçe",
  },
  es_ES: {
    name: "Español",
    author: "aleksa1",
  },
};

let apiKey;
let projectId;

if (process && process.env && process.env.LOKALISE_TOKEN)
  apiKey = process.env.LOKALISE_TOKEN;
else throw Error("Lokalise token isn't specified");

if (!projectId && process && process.env && process.env.LOKALISE_PROJECT_ID)
  projectId = process.env.LOKALISE_PROJECT_ID;
else throw Error("Project id isn't specified");

const lokaliseApi = new LokaliseApi({ apiKey });

/**
 * @param {import("@lokalise/node-api").DownloadFileParams} lokaliseOptions
 */
async function UpdateLangFilesFromLokalise(lokaliseOptions) {
  // eslint-disable-next-line no-param-reassign
  lokaliseOptions = {
    format: "json",
    indentation: "2sp",
    original_filenames: false,
    include_description: true,
    export_sort: "first_added",
    export_empty_as: "base",
    bundle_structure: "%LANG_ISO%.%FORMAT%",
    json_unescaped_slashes: true,
    ...lokaliseOptions,
  };
  const details = await lokaliseApi.files.download(projectId, lokaliseOptions);

  if (!details || !details.bundle_url)
    // eslint-disable-next-line no-throw-literal
    throw { msg: "Can't fetch language files", details };

  /**
   * @type {ResDownload}
   */
  const files = await download(details.bundle_url, LANGUAGE_FOLDER, {
    extract: true,
    filter: file => {
      if (file.type === "directory") return true;

      if (file.path === "en.json") return false;

      let content = file.data.toString("utf8").replace(/\\\\/g, "\\");

      if (lokaliseOptions.format === "js") {
        content = content
          .replace("var translations", "let translations")
          .replace(/\s"(.*)": /g, " $1: ");

        content += `\n
if (!window)
  export default translations;
else
  window.System.data.locale = translations;
`;
      }

      file.data = Buffer.from(content, "utf8");

      return true;
    },
  });

  if (!files || files.length === 0)
    throw Error("I can't find language file in the Lokalise zip");

  console.log("Download complete");
}

async function UpdateStatuses() {
  const resDetails = await lokaliseApi.projects.get(projectId);
  const extensionOptionsRaw = fs.readFileSync(
    "./src/configs/_/main.yml",
    "utf8",
  );
  const extensionOptions = yaml.load(extensionOptionsRaw);

  extensionOptions.common.languages = resDetails.statistics.languages
    .map(
      /**
       * @param {{
       *  language_id: number,
       *  language_iso: string,
       *  progress: number,
       *  words_to_do: number
       * }} language
       */
      language => {
        if (language.language_iso === "en") return false;

        return {
          key: language.language_iso,
          progress: language.progress,
          ...LANGUAGE_DETAILS[language.language_iso],
        };
      },
    )
    .filter(Boolean);

  return yaml.dump(extensionOptions, { indent: 2 });
}

(async () => {
  try {
    if (process && process.argv) {
      if (process.argv.length > 1) {
        const filterLangs = process.argv.slice(2);

        const statusData = await UpdateStatuses();

        await UpdateLangFilesFromLokalise({
          filter_langs: filterLangs,
        });

        fs.writeFileSync("./src/configs/_/main.yml", statusData);
      }
    }
  } catch (error) {
    if (error) console.error(error);
  }
})();
