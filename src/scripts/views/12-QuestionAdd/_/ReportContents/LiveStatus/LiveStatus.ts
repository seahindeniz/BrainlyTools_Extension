/* eslint-disable camelcase */
import Request from "@root/controllers/Req";
import type ReportedContentsType from "../ReportedContents";

export type ModeratorDataType = {
  avatar: string;
  id: string;
  nick: string;
  ranks: {
    color: string;
    names: string[];
  };
};

export default class LiveStatus {
  main: ReportedContentsType;

  authenticated: boolean;
  config: {
    cometSslServerAddress: string;
    cometSslServerPort: number;
  };

  ws: WebSocket;

  token: string;

  constructor(main: ReportedContentsType) {
    this.main = main;

    this.authenticated = false;
    this.config = System.data.Brainly.defaultConfig.config.data.config;

    this.Init();
  }

  async Init() {
    await this.GetToken();
    this.ConnectToSocketServer();
  }

  async GetToken() {
    const request = new Request();

    request.url = new URL(
      `https://${this.config.cometSslServerAddress}:${this.config.cometSslServerPort}`,
    );

    request.P("socket.io/1/");

    const resToken = await request.GET({
      t: Date.now(),
    });

    if (!resToken || typeof resToken !== "string")
      throw Error("Can't retrieve token");

    this.token = resToken.replace(/:.*/, "");
  }

  ConnectToSocketServer() {
    this.ws = new WebSocket(
      `wss://${this.config.cometSslServerAddress}:${this.config.cometSslServerPort}/socket.io/1/websocket/${this.token}`,
    );

    this.ws.onmessage = this.IdentifyMessage.bind(this);
    // TODO fix this
    /* this.ws.onclose = async () => {
      await new Request().URL("https://httpstat.us/200").GET();
      console.warn("Connection is closed, restarting..");
      this.ConnectToSocketServer();
    }; */
  }

  IdentifyMessage(event: MessageEvent & { data: string }) {
    if (
      !event?.data ||
      typeof event.data !== "string" ||
      !event.data.includes(":::")
    )
      return;

    const [caseId, caseData] = event.data.split(":::");

    if (caseId === "1") {
      this.Authenticate();
    } else if (caseId === "5") {
      this.IdentifyData(JSON.parse(caseData));
    }
  }

  SendData(caseName: string, ...data: { [x: string]: any }[]) {
    this.ws.send(
      `5:::${JSON.stringify({
        name: caseName,
        args: data,
      })}`,
    );
  }

  Authenticate() {
    const authHash =
      System.data.Brainly.defaultConfig.comet.AUTH_HASH ||
      System.data.Brainly.defaultConfig.user.ME.auth.comet.authHash;
    const { user } = System.data.Brainly.userData;

    this.SendData("auth", {
      auth_hash: authHash,
      avatar: System.prepareAvatar(user),
      client:
        document.documentElement &&
        document.documentElement.classList.contains("mobile")
          ? "mobile"
          : "desktop",
      gender: user.gender,
      nick: user.nick,
      uid: user.id,
      version: "2.1",
    });
  }

  IdentifyData(data: { name: string; args: { [x: string]: any }[] }) {
    const [firstData] = data.args;

    if (!firstData) return;

    switch (data.name) {
      case "auth":
        this.Authenticated(firstData);
        break;

      case "pubsub.news":
        this.ContentModerated(firstData);
        break;

      default:
        break;
    }
  }

  Authenticated(data: { result?: string; version?: string }) {
    if (data?.result !== "authorized") return;

    this.authenticated = true;

    this.SubscribeModeration();
  }

  SubscribeModeration(idList?: number[]) {
    if (!this.authenticated || this.main.contents.all.length === 0) return;

    const { questionsWaitingForSubscription } = this.main;

    this.main.questionsWaitingForSubscription = [];

    this.SendData("pubsub.subscribe", {
      "moderation.task": idList || questionsWaitingForSubscription,
    });
  }

  ContentModerated(data: {
    channel?: string;
    event?: string;
    payload?: {
      ticket_id: number;
      user_data: ModeratorDataType;
    };
  }) {
    if (data.event !== "moderation.begin" || !data.channel) return;

    const questionId = Number(data.channel.replace(/.*\./, ""));

    if (!questionId) return;

    const content = this.main.contents.all.find(
      _content => _content.data.task_id === questionId,
    );

    if (!content || (content.has && content.has !== "default")) return;

    content.has = "reserved";

    content.ChangeBoxColor();
    content.UserModerating(data.payload.user_data);
  }
}
