/* eslint-disable no-underscore-dangle */
import Axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";

const requestsOnHold = [];

type ObjectAnyPropsType = {
  [x: string]: any;
};

export default class Request {
  url: URL;
  headers: {
    [name: string]: string;
  };
  errorCount: number;
  method: Method;

  contentType: string;
  returnType: string;

  promise: Promise<any>;
  resolve: (value?: any) => void;
  reject: (value?: any) => void;

  data: {};
  axios: AxiosInstance;

  constructor() {
    this.headers = {};
    this.errorCount = 0;
  }

  URL(url: string) {
    this.url = new URL(url);

    return this;
  }

  JSON() {
    this.contentType = "json";
    this.headers["Content-Type"] = "application/json";

    return this;
  }

  Form() {
    this.contentType = "form";

    return this;
  }

  File() {
    this.contentType = "file";

    return this;
  }

  Salt() {
    this.returnType = "salt";

    return this;
  }

  X_Req_With() {
    this.headers["x-requested-with"] = "XMLHttpRequest";

    return this;
  }

  /**
   * @param {string | number | boolean} path
   */
  P(path) {
    if (this.url.pathname.endsWith("/") && String(path).startsWith("/"))
      path = String(path).substr(1);
    else if (!this.url.pathname.endsWith("/") && !String(path).startsWith("/"))
      path = `/${path}`;

    this.url.pathname += path;

    return this;
  }

  GET(queryString?: ObjectAnyPropsType) {
    this.method = "GET";

    this.InitPromise();
    this.QueryString(queryString);
    this.OpenConnection();

    return this.promise;
  }

  InitPromise() {
    this.promise = new Promise(
      (resolve, reject) => ((this.resolve = resolve), (this.reject = reject)),
    );
  }

  QueryString(queryString: ObjectAnyPropsType) {
    if (queryString) {
      const qStrings = Object.entries(queryString);

      if (qStrings.length > 0)
        qStrings.forEach(qString => {
          if (!this.url.searchParams.has(qString[0]))
            this.url.searchParams.append(...qString);
        });
    }

    return this;
  }

  OpenConnection() {
    try {
      let promise: Promise<ObjectAnyPropsType>;
      const connectionData = {
        method: this.method,
        headers: new Headers(this.headers),
        data: undefined,
        body: undefined,
        url: undefined,
      };

      if (this.data && this.method !== "GET") {
        if (this.axios) connectionData.data = this.data;
        else connectionData.body = this.data;
      }

      if (this.axios) {
        connectionData.url = this.url.href;
        promise = this.axios(connectionData);
      } else promise = fetch(this.url.href, connectionData);

      promise.then(this.HandleResponse.bind(this));
      promise.catch(this.HandleError.bind(this));
    } catch (error) {}
  }

  async HandleResponse(res: ObjectAnyPropsType) {
    if (
      res.ok ||
      (res.status >= 200 && (res.status < 300 || res.status == 304))
    ) {
      let body = null;

      if (this.axios) body = res.data;
      else if (this.returnType == "salt") body = res;
      else
        try {
          if (this.contentType == "json") body = await res.json();
          else body = await res.text();
        } catch (error) {
          console.error(error);
        }

      this.resolve(body);
    } else {
      this.HandleError(res);
    }
  }

  async HandleError(error: ObjectAnyPropsType) {
    if (
      ((error.response && error.response.headers["cf-chl-bypass"]) ||
        (error.headers &&
          error.headers.get &&
          error.headers.get("cf-chl-bypass"))) == "1"
    ) {
      this.HandleCaptcha();
    } else if (++this.errorCount < 3) {
      await System.Delay(1000);
      this.OpenConnection();
    } else {
      this.errorCount = 0;

      this.reject(error);
    }
  }

  async HandleCaptcha() {
    requestsOnHold.push(this);
    const isCaptchaOK = await System.toBackground(
      "openCaptchaPopup",
      System.data.meta.location.origin,
    );

    if (isCaptchaOK == "true") {
      /**
       * @type {Request}
       */
      let request;

      while ((request = requestsOnHold.shift())) request.OpenConnection();
    }
  }

  POST(data?: ObjectAnyPropsType, queryString?: ObjectAnyPropsType) {
    this.method = "POST";

    return this._Post(data, queryString);
  }

  PUT(data?: ObjectAnyPropsType, queryString?: ObjectAnyPropsType) {
    this.method = "PUT";

    return this._Post(data, queryString);
  }

  _Post(data?: ObjectAnyPropsType, queryString?: ObjectAnyPropsType) {
    if (data) this.data = data;

    if (this.data) {
      if (this.contentType == "json") this.data = JSON.stringify(this.data);
      else if (this.contentType == "form")
        this.data = this.GenerateFormData(this.data);
      else if (this.contentType == "file")
        this.data = this.GenerateFormData(this.data, true);
    }

    this.InitPromise();
    this.QueryString(queryString);
    this.OpenConnection();

    return this.promise;
  }

  GenerateFormData(data: ObjectAnyPropsType, isWithFile?: boolean) {
    const Method = isWithFile ? FormData : URLSearchParams;
    const formData = new Method();

    for (const props of Object.entries(data)) formData.append(...props);

    return formData;
  }

  Axios(options: AxiosRequestConfig) {
    options = {
      headers: this.headers,
      ...options,
    };

    this.axios = Axios.create(options);

    return this;
  }

  static CalculateProgressPercent(event: ProgressEvent) {
    if (event.lengthComputable) {
      let percent = 0;
      // @ts-ignore
      const position = event.loaded || event.position;
      const { total } = event;

      if (event.lengthComputable) percent = (position / total) * 100;

      return percent;
    }
  }
}
