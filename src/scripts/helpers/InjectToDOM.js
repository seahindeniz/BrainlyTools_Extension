import WaitForObject from "./WaitForObject";
import TimedLoop from "./TimedLoop";

/**
 * @typedef {{ attachExtensionId?: string, makeItLastElement?: boolean }} Properties
 * @param {string} path
 * @param {Properties} param1
 */
function injectIt(path, { attachExtensionId, makeItLastElement } = {}) {
  return new Promise(async (resolve, reject) => {
    let fileName = path.split(".");

    if (fileName.length < 2) {
      reject(["Injected file name is incorrect: ", path]);
    } else {
      let extensionURL;
      let fileExtension = [...fileName].pop();

      if (window.System && window.System.data.meta && window.System.data.meta.extension) {
        extensionURL = window.System.data.meta.extension.URL
      } else {
        //console.warn("Be warned, no extension System class found");
        extensionURL = "chrome-extension://" + window.chrome.runtime.id
      }

      if (path.indexOf("http") < 0) {
        path = extensionURL + path;
      }

      if (fileExtension == "json") {
        fetch(path)
          .then(res => res.json())
          .then(resolve)
          .catch(reject);
      } else if (fileExtension == "yml") {
        fetch(path)
          .then(res => res.text())
          .then(resolve)
          .catch(reject);
      } else if (fileExtension == "js" || fileExtension == "ext_js") {
        try {
          let html = document.documentElement;
          let script = document.createElement('script');

          script.setAttribute('type', 'text/javascript');
          script.setAttribute('src', path);
          script.dataset.addedByExtension = "true";

          if (attachExtensionId) {
            script.setAttribute('extension_URL', window.chrome.runtime.id);
          }

          if (html) {
            html.appendChild(script)
          }

          resolve(script);
        } catch (error) {
          reject(error);
        }
      } else if (fileExtension == "css" || fileExtension == "ext_css") {
        try {
          let link = document.createElement('link');

          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('type', 'text/css');
          link.setAttribute('href', path);
          link.setAttribute('href', path);
          link.dataset.addedByExtension = "true";

          if (fileExtension == "css") {
            let head = await WaitForObject("document.head");

            head && head.append(link);

            if (makeItLastElement && head)
              TimedLoop(() => {
                /**
                 * @type {HTMLElement}
                 */
                let nextElementSibling = (link.nextElementSibling);

                if (nextElementSibling && !nextElementSibling.dataset.addedByExtension)
                  head && head.append(link);
              }, { expireTime: 5 });
          } else {
            let html = document.documentElement;

            html && html.appendChild(link);

            if (makeItLastElement && html)
              TimedLoop(() => {
                /**
                 * @type {HTMLElement}
                 */
                let nextElementSibling = (link.nextElementSibling);

                if (nextElementSibling && !nextElementSibling.dataset.addedByExtension)
                  html && html.appendChild(link);
              });
          }

          resolve(link);
        } catch (error) {
          reject(error);
        }
      } else {
        reject("This file cannot be inject");
      }
    }
  });
}

/**
 * Injects a script into DOM
 * @param {string | string[]} filePath - Path of inject file
 * @param {Properties} options - To adding an attribute contains the id key of the extension
 * returns {Promise<>} - Check whether if file injected or not
 **/
export default function InjectToDOM(filePath, options = {}) {
  /**
   * @type {Promise | Promise[]}
   */
  let result;

  if (filePath && filePath.length > 0) {
    if (typeof filePath == "string")
      result = injectIt(filePath, options);
    else if (filePath instanceof Array) {
      result = [];

      filePath.forEach(path => {
        // @ts-ignore
        result.push(injectIt(path, options));
      });
    }
  }

  if (!result)
    result = Promise.reject("File path is required");

  return result;
}
