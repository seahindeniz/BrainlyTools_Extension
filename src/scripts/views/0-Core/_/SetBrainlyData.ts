/* eslint-disable no-param-reassign */
import Action from "@BrainlyAction";
import { GetMarketConfig } from "@BrainlyReq";
import type { MarketConfigDataType } from "@BrainlyReq/GetMarketConfig";
import type { DefaultConfigDataType } from "@root/controllers/System";
import WaitForObject from "../../../../helpers/WaitForObject";

let RoutesFetchURL: string;

function PopulateRanks(config: MarketConfigDataType) {
  if (!System.data.Brainly.defaultConfig)
    System.data.Brainly.defaultConfig = {};

  System.data.Brainly.defaultConfig.config = { data: config };
  System.data.Brainly.defaultConfig.config.data.ranksWithId = {};
  System.data.Brainly.defaultConfig.config.data.ranksWithName = {};

  config.ranks.forEach(rank => {
    System.data.Brainly.defaultConfig.config.data.ranksWithId[rank.id] = rank;
    System.data.Brainly.defaultConfig.config.data.ranksWithName[
      rank.name
    ] = rank;
  });
}

function PrepareSecondaryObjects(defaultConfig?: DefaultConfigDataType) {
  if (!defaultConfig && System.data.Brainly.defaultConfig)
    defaultConfig = System.data.Brainly.defaultConfig;

  if (typeof System.data.Brainly.defaultConfig?.user?.ME === "string") {
    defaultConfig.user.ME = JSON.parse(
      String(defaultConfig.user.ME as unknown),
    );
  }
}

function ProcessDefaultConfigData(first: string) {
  const mainConfig = System.data.Brainly.defaultConfig?.config;

  // eslint-disable-next-line no-new-func
  System.data.Brainly.defaultConfig = new Function(`return ${first}`)();

  if (mainConfig) {
    System.data.Brainly.defaultConfig.config = mainConfig;
  }
  // System.data.Brainly.defaultConfig.config = JSON.parse(second);

  // console.log(System.data.Brainly.defaultConfig.config.data.ranks);
  // console.log(second);

  PrepareSecondaryObjects();
}

async function FetchMainConfig() {
  const res = await GetMarketConfig();

  if (res.success === false) {
    throw Error("Can't fetch market configurations");
  }

  PopulateRanks(res.data);
  PrepareSecondaryObjects();
}

async function FetchDefaultConfig() {
  const sourcePageHTML: string = await new Action().GetQuestionAddPage();

  // console.log("res:", res);
  if (!sourcePageHTML) return undefined;

  // https://regex101.com/r/8kxff1/1
  const matchConfig = sourcePageHTML.match(
    /(?<=__default_config = ).*[\S\s]*?};/gim,
  )?.[0];

  if (!matchConfig) {
    throw Error("Config object not found");
  }

  // const matchSecondConfig = /\.config = (.*);/gim.exec(sourcePageHTML);
  // https://regex101.com/r/Ucp9oZ/2
  /* const matchSecondConfig = sourcePageHTML.match(
    /(?<=\.config = ).*(?=;)/gim,
  )?.[0];

  if (!matchSecondConfig) {
    throw Error("Second config object not found");
  } */

  RoutesFetchURL = sourcePageHTML.match(
    /(\/sf\/js\/bundle\/include_auth_[a-z_-]{1,}-[a-z0-9]{1,}\.min\.js)/gim,
  )?.[0];

  if (!RoutesFetchURL) {
    throw Error("Can't find auth js file link");
  }

  // RoutesFetchURL = ExtractRoutesFetchURL(res);

  ProcessDefaultConfigData(matchConfig);
  // await FetchMainConfig();

  return System.data.Brainly.defaultConfig;
}

async function GetDefaultConfig() {
  let defaultConfig;

  if (document.head.innerHTML.match(/__default_config/gim)) {
    defaultConfig = await WaitForObject("__default_config");

    PrepareSecondaryObjects(defaultConfig);
    PopulateRanks(defaultConfig.config.data);
  } else {
    await Promise.all([FetchDefaultConfig(), FetchMainConfig()]);
    defaultConfig = System.data.Brainly.defaultConfig;
  }

  localStorage.setObject("__default_config", defaultConfig);

  return defaultConfig;
}

async function FetchRoutingPath() {
  const sourcePageHTML: string = await new Action().GetQuestionAddPage();

  if (!sourcePageHTML) return undefined;

  RoutesFetchURL = sourcePageHTML.match(
    /(\/sf\/js\/bundle\/include_auth_[a-z_-]{1,}-[a-z0-9]{1,}\.min\.js)/gim,
  )?.[0];

  if (!RoutesFetchURL) {
    throw Error("Can't find auth js file link");
  }
}

async function FetchRouting() {
  await FetchRoutingPath();

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
    // (async () => {
    //   await GetDefaultConfig();
    //   GetRoutingData();
    // })();
    GetDefaultConfig().then(() => GetRoutingData());
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
