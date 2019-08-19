import { LokaliseApi } from "@lokalise/node-api";
import download from "download";
import fs from "fs";

/**
 * @typedef {{data: Buffer, mode: number, mtime: Date, path: string, type: string}} LokaliseResFileEntry
 * @typedef {LokaliseResFileEntry[]} ResDownload
 */

const LANGUAGE_FOLDER = "src/locales";
//const LANGUAGE_FOLDER = "z";

if (process && process.argv) {
  if (process.argv.length > 1) {
    let filter_langs = process.argv.slice(2);

    if (filter_langs.length == 0)
      filter_langs = ["en_US", "tr", "id", "fr"];

    //UpdateLangFilesFromCrowdin();
    UpdateLangFilesFromLokalise({ filter_langs, format: "json" }).then(a => a).catch(a => a);
    //setInterval(() => {}, 1000);
  }
}
/*
function GET_Crowdin(method, options) {
  return axios({
    url: `https://api.crowdin.com/api/project/brainly-tools/${method}?key=${process.env.CROWDIN_TOKEN}&json`,
    method: 'get',
    validateStatus: false,
    ...options
  });
}
function DownloadLangFileFromCrowdin(lang) {
  download(`https://api.crowdin.com/api/project/brainly-tools/export-file?file=Extension/en_US.json&language=${lang}&key=${process.env.CROWDIN_TOKEN}`, LANGUAGE_FOLDER, {
    //let files = await download(`https://api.crowdin.com/api/project/brainly-tools/download/all.zip?key=${process.env.CROWDIN_TOKEN}`, LANGUAGE_FOLDER, {
    //extract: true
    filename: `${lang}.json`
  });
} */
async function UpdateLangFilesFromCrowdin() {
  try {
    /* let resExport = await GET_Crowdin("export");

    console.log(resExport);
    if (!resExport.data.success)
      throw resExport.data.error; */

    ["en-US", "tr", "fr", "id"].forEach(DownloadLangFileFromCrowdin);
    /*if (!files || files.length == 0)
      throw "I can't find language file in the Lokalise zip";

    files.forEach(fileEntry => {
      if (fileEntry.type == "file" && fileEntry.path.includes("Extension") && fileEntry.data instanceof Buffer) {
        let fileName = fileEntry.path.replace(/\/.*\./, ".");
        let content = fileEntry.data.toString('utf8')
          .replace(/\\\\/g, "\\");

        fs.writeFileSync(`${LANGUAGE_FOLDER}/${fileName}`, content);
      }
    }); */
  } catch (error) {
    if (error)
      console.error(error)
  }
}

/**
 * @param {{apiKey?: string, project_id?: string} & import("@lokalise/node-api").DownloadFileParams} lokaliseOptions
 */
async function UpdateLangFilesFromLokalise(lokaliseOptions = {}) {
  let { apiKey, project_id } = lokaliseOptions;
  delete lokaliseOptions.apiKey;
  delete lokaliseOptions.project_id;

  try {
    if (!apiKey && process && process.env && process.env.LOKALISE_TOKEN)
      apiKey = process.env.LOKALISE_TOKEN;

    if (!apiKey)
      throw "Lokalise token isn't specified";

    if (!project_id && process && process.env && process.env.LOKALISE_PROJECT_ID)
      project_id = process.env.LOKALISE_PROJECT_ID;

    if (!project_id)
      throw "Project id isn't specified";

    lokaliseOptions = {
      format: "json",
      indentation: "2sp",
      original_filenames: false,
      include_description: true,
      export_sort: "first_added",
      export_empty_as: "base",
      bundle_structure: "%LANG_ISO%.%FORMAT%",
      json_unescaped_slashes: true,
      ...lokaliseOptions
    };
    const lokaliseApi = new LokaliseApi({ apiKey });
    let details = await lokaliseApi.files.download(project_id, lokaliseOptions);

    if (!details || !details.bundle_url)
      throw { msg: "Can't fetch language files", details };

    /**
     * @type {ResDownload}
     */
    let files = await download(details.bundle_url, LANGUAGE_FOLDER, {
      extract: true
    });

    if (!files || files.length == 0)
      throw "I can't find language file in the Lokalise zip";

    //SaveSchemaFile(files);

    files.forEach(fileEntry => {
      if (fileEntry.type == "file" && fileEntry.data instanceof Buffer) {
        let content = fileEntry.data.toString('utf8')
          .replace(/\\\\/g, "\\");

        if (lokaliseOptions.format == "js") {
          content = content.replace("var translations", "let translations")
            .replace(/\s"(.*)": /g, " $1: ")

          content += `\n
if (!window)
  module.exports = translations;
else
  window.System.data.locale = translations;
`;
        }
        fs.writeFileSync(`${LANGUAGE_FOLDER}/${fileEntry.path}`, content);
      }
    });

    console.log("Download complete");

    return Promise.resolve();
  } catch (error) {
    if (error)
      console.log(error);

    return Promise.reject(error);
  }
}

/**
 * @param {ResDownload} files
 */
function SaveSchemaFile(files) {
  let fileEntry = files.find(_fileEntry => _fileEntry.path.includes("en_US"));

  if (fileEntry && fileEntry.data instanceof Buffer) {
    let content = fileEntry.data.toString('utf8');
    content = `module.exports = ${content}\n`
      .replace(/\s"(.*)": /g, " $1: ")

    //console.log(content);

    fs.writeFileSync(`${LANGUAGE_FOLDER}/index.js`, content);
  }
}

export default UpdateLangFilesFromLokalise
