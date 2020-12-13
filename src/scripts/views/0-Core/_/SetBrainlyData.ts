import { DefaultConfigDataType } from "@root/controllers/System";
/* eslint-disable no-param-reassign */
import Action from "@BrainlyAction";
import WaitForObject from "../../../../helpers/WaitForObject";

let RoutesFetchURL: string;

function PrepareSecondaryObjects(defaultConfig?: DefaultConfigDataType) {
  if (!defaultConfig && System.data.Brainly.defaultConfig)
    defaultConfig = System.data.Brainly.defaultConfig;

  if (
    !System.data.Brainly.defaultConfig ||
    !System.data.Brainly.defaultConfig.user ||
    typeof System.data.Brainly.defaultConfig.user.ME === "string"
  ) {
    defaultConfig.user.ME = JSON.parse(
      String(defaultConfig.user.ME as unknown),
    );
  }

  defaultConfig.config.data.ranksWithId = {};
  defaultConfig.config.data.ranksWithName = {};

  defaultConfig.config.data.ranks.forEach(rank => {
    defaultConfig.config.data.ranksWithId[rank.id] = rank;
    defaultConfig.config.data.ranksWithName[rank.name] = rank;
  });
}

function ProcessDefaultConfigData(first, second) {
  // eslint-disable-next-line no-new-func
  System.data.Brainly.defaultConfig = new Function(`return ${first}`)();
  System.data.Brainly.defaultConfig.config = JSON.parse(second);

  PrepareSecondaryObjects();

  return System.data.Brainly.defaultConfig;
}

async function FetchDefaultConfig() {
  const sourcePageHTML = await new Action().GetQuestionAddPage();

  // console.log("res:", res);
  if (!sourcePageHTML) return undefined;

  const matchConfig = /__default_config = (.*[\S\s]*?};)/gim.exec(
    sourcePageHTML,
  );
  const matchSecondConfig = /\.config = (.*);/gim.exec(sourcePageHTML);

  const matchAuthJSFile = sourcePageHTML.match(
    /(\/sf\/js\/bundle\/include_auth_[a-z_-]{1,}-[a-z0-9]{1,}\.min\.js)/gim,
  );

  if (!matchAuthJSFile) {
    throw Error("Can't find auth js file link");
  }

  RoutesFetchURL = matchAuthJSFile[matchAuthJSFile.length - 1];
  // RoutesFetchURL = ExtractRoutesFetchURL(res);

  if (!matchConfig || matchConfig.length < 2) {
    throw Error("Config object not found");
  }

  if (!matchSecondConfig || matchSecondConfig.length < 2) {
    throw Error("Second config object not found");
  }

  if (!RoutesFetchURL) {
    throw Error("Routes URL not found");
  }

  return ProcessDefaultConfigData(
    matchConfig[matchConfig.length - 1],
    matchSecondConfig[matchSecondConfig.length - 1],
  );
}

async function GetDefaultConfig() {
  let defaultConfig;

  if (document.head.innerHTML.match(/__default_config/gim)) {
    defaultConfig = await WaitForObject("__default_config");

    PrepareSecondaryObjects(defaultConfig);
  } else {
    defaultConfig = await FetchDefaultConfig();
  }

  localStorage.setObject("__default_config", defaultConfig);

  return defaultConfig;
}

async function FetchRouting() {
  const action = new Action();

  if (!RoutesFetchURL.includes("http"))
    RoutesFetchURL = location.origin + RoutesFetchURL;

  action.url = new URL(RoutesFetchURL);

  const resJS = await action.GET();

  if (resJS) {
    const matchRoutes = resJS.match(/(routes:.*scheme:"http")/gim);

    if (!matchRoutes || matchRoutes.length < 1) {
      // eslint-disable-next-line no-throw-literal
      throw { msg: "Routes not found", resJS };
    } else {
      // eslint-disable-next-line no-new-func
      const routing = new Function(
        `return {${matchRoutes[matchRoutes.length - 1]}}`,
      )();

      return routing;
    }
  }
}

async function GetRoutingData() {
  let routing;

  // let RoutingContainerMatch = Array.from(document.scripts).find(script => script.src.match(/__vendors|include_main_/gmi));
  // console.log("document.body.innerHTML.match(/__vendors|include_main_/gmi):", document.body.innerHTML.match(/__vendors|include_main_/gmi));
  if (!RoutesFetchURL) {
    routing = await WaitForObject("Routing");
  } else {
    routing = await FetchRouting();
  }

  localStorage.setObject("Routing", routing);

  return routing;
}

export default async function SetBrainlyData() {
  let routing = localStorage.getObject("Routing");
  let defaultConfig = localStorage.getObject("__default_config");

  if (!routing || !defaultConfig) {
    defaultConfig = await GetDefaultConfig();
    routing = await GetRoutingData();
  } else {
    (async () => {
      await GetDefaultConfig();
      GetRoutingData();
    })();
  }

  if (!routing.prefix) {
    routing.prefix = routing.b.prefix;
    routing.routes = routing.d.c;
  }

  System.data.Brainly.Routing = routing;
  System.data.Brainly.defaultConfig = defaultConfig;

  System.Log("SetBrainlyData OK!");

  return true;
}
