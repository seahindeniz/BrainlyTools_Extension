import Axios from "axios";

let requestsOnHold = [];

export default class Request {
  constructor() {
    this.path = "";
    this.headers = {};
    this.errorCount = 0;
  }
  JSON() {
    this.contentType = "json";
    this.headers['Content-Type'] = "application/json";

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
   * Add a path
   * @param {string} path
   */
  P(path) {
    if (path)
      this.path += `/${path}`;

    return this;
  }
  /**
   * @param {{}} queryString
   */
  GET(queryString) {
    this.method = "GET";

    this.InitPromise();
    this.QueryString(queryString);
    this.OpenConnection();

    return this.promise;
  }
  InitPromise() {
    this.promise = new Promise((resolve, reject) => (this.resolve = resolve, this.reject = reject));
  }
  /**
   * @param {{}} queryString
   */
  QueryString(queryString) {
    if (queryString) {
      if (this.axios) {
        this.axios.defaults.params = queryString;
      } else {
        let items = [];
        let keys = Object.keys(queryString);

        if (keys.length > 0) {
          keys.forEach(key => {
            let value = queryString[key];

            items.push(`${key}=${value}`);
          });

          this.path += `?${items.join("&")}`;
        }
      }
    }
  }
  OpenConnection() {
    let connectionData = {
      method: this.method,
      headers: this.headers
    };

    if (this.data) {
      if (this.axios)
        connectionData.data = this.data;
      else
        connectionData.body = this.data;
    }

    if (this.axios) {
      connectionData.url = this.path;

      let promise = this.axios(connectionData);
      promise.then(this.HandleResponse.bind(this));
      promise.catch(this.HandleError.bind(this));
    } else {
      let promise = fetch(this.path, connectionData);
      promise.then(this.HandleResponse.bind(this));
      promise.catch(this.HandleError.bind(this));
    }
  }
  async HandleResponse(res) {
    if (res.ok || res.status >= 200 && (res.status < 300 || res.status == 304)) {
      let body = null;

      if (this.axios)
        body = res.data;
      else {
        if (this.returnType == "salt")
          body = res;
        else
          try {
            if (this.contentType == "json")
              body = await res.json();
            else
              body = await res.text();
          } catch (error) {
            console.error(error);
          }
      }

      this.resolve(body);
    } else {
      this.HandleError(res);
    }
  }
  async HandleError(error) {
    if (
      (
        (
          error.response &&
          error.response.headers["cf-chl-bypass"]
        ) ||
        (
          error.headers &&
          error.headers.get &&
          error.headers.get("cf-chl-bypass")
        )
      ) == "1"
    ) {
      this.HandleCaptcha();
    } else if (++this.errorCount < 3) {
      this.OpenConnection();
    } else {
      this.errorCount = 0;

      this.reject(error);
    }
  }
  async HandleCaptcha() {
    requestsOnHold.push(this);
    let isCaptchaOK = await System.toBackground("openCaptchaPopup", System.data.meta.location.origin);

    if (isCaptchaOK == "true") {
      /**
       * @type {Request}
       */
      let request;

      while (request = requestsOnHold.shift())
        request.OpenConnection();
    }
  }
  /**
   * @param {{}} data
   * @param {{}} queryString
   */
  POST(data, queryString) {
    this.method = "POST";

    return this._Post(data, queryString)
  }
  /**
   * @param {{}} data
   * @param {{}} queryString
   */
  PUT(data, queryString) {
    this.method = "PUT";

    return this._Post(data, queryString)
  }
  /**
   * @param {{}} data
   * @param {{}} queryString
   */
  _Post(data, queryString) {
    if (data)
      this.data = data;

    if (this.data) {
      if (this.contentType == "json")
        this.data = JSON.stringify(this.data);
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
  /**
   * @param {{}} data
   * @param {boolean} isWithFile
   */
  GenerateFormData(data, isWithFile) {
    let Method = isWithFile ? FormData : URLSearchParams;
    let formData = new Method();

    for (const props of Object.entries(data))
      formData.append(...props);

    return formData;
  }
  /**
   * @param {import("axios").AxiosRequestConfig} options
   */
  Axios(options) {
    this.axios = Axios.create(options);

    return this;
  }
  /**
   * @param {ProgressEvent} event
   */
  static CalculateProgressPercent(event) {
    if (event.lengthComputable) {
      let percent = 0;
      let position = event.loaded || event.position;
      let total = event.total;

      if (event.lengthComputable)
        percent = position / total * 100;

      return percent;
    }
  }
  SKey() {
    this.headers.SecretKey = System.data.Brainly.userData.extension.secretKey;

    return this;
  }
}
