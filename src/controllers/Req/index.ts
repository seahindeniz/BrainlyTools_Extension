/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import Axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";

type ObjectAnyPropsType = {
  [x: string]: any;
};

const requestsOnHold = [];

function GenerateFormData(data: ObjectAnyPropsType, isWithFile?: boolean) {
  const TheMethod = isWithFile ? FormData : URLSearchParams;
  const formData = new TheMethod();

  Object.entries(data).forEach(props => {
    formData.append(...props);
  });

  return formData;
}

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

  data: ObjectAnyPropsType;
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

  XReqWith() {
    this.headers["x-requested-with"] = "XMLHttpRequest";

    return this;
  }

  P(path: string | number | boolean) {
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
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  QueryString(queryString: ObjectAnyPropsType | [string, any][]) {
    if (queryString) {
      if (!(queryString instanceof Array))
        queryString = Object.entries(queryString);

      queryString.forEach(this.AppendQueryString.bind(this));
    }

    return this;
  }

  private AppendQueryString([key, value]: [string, any]) {
    if (
      typeof key === "string" &&
      (key.includes("[]") || !this.url.searchParams.has(key))
    )
      this.url.searchParams.append(key, value);
  }

  OpenConnection() {
    try {
      let promise: Promise<ObjectAnyPropsType>;
      const connectionData = {
        method: this.method,
        headers: undefined,
        data: undefined,
        body: undefined,
        url: undefined,
      };

      if (this.data && this.method !== "GET") {
        if (this.axios) connectionData.data = this.data;
        else connectionData.body = this.data;
      }

      const url = this.url.href.replace(/%5B%5D/g, "[]");

      if (this.axios) {
        connectionData.url = url;
        connectionData.headers = this.headers;
        promise = this.axios(connectionData);
      } else {
        connectionData.headers = new Headers(this.headers);
        promise = fetch(url, connectionData);
      }

      promise.then(this.HandleResponse.bind(this));
      promise.catch(this.HandleError.bind(this));
    } catch (error) {
      //
    }
  }

  async HandleResponse(res: ObjectAnyPropsType) {
    if (
      res.ok ||
      (res.status >= 200 && (res.status < 300 || res.status === 304))
    ) {
      let body = null;

      if (this.axios) body = res.data;
      else if (this.returnType === "salt") body = res;
      else
        try {
          if (this.contentType === "json") body = await res.json();
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
          error.headers.get("cf-chl-bypass"))) === "1"
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

    if (isCaptchaOK === "true") {
      let request: Request;

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

  DELETE(data?: ObjectAnyPropsType, queryString?: ObjectAnyPropsType) {
    this.method = "DELETE";

    return this._Post(data, queryString);
  }

  _Post(data?: ObjectAnyPropsType, queryString?: ObjectAnyPropsType) {
    if (data) this.data = data;

    if (this.data) {
      // @ts-expect-error
      if (this.contentType === "json") this.data = JSON.stringify(this.data);
      else if (this.contentType === "form")
        this.data = GenerateFormData(this.data);
      else if (this.contentType === "file")
        this.data = GenerateFormData(this.data, true);
    }

    this.InitPromise();
    this.QueryString(queryString);
    this.OpenConnection();

    return this.promise;
  }

  Axios(options?: AxiosRequestConfig) {
    options = {
      headers: this.headers,
      ...options,
    };

    this.axios = Axios.create(options);

    return this;
  }

  static CalculateProgressPercent(event: ProgressEvent) {
    if (!event.lengthComputable) return undefined;

    let percent = 0;
    // @ts-ignore
    const position = event.loaded || event.position;
    const { total } = event;

    if (event.lengthComputable) percent = (position / total) * 100;

    return percent;
  }
}
