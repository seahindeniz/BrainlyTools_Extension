import { src, dest } from "gulp";
import gulpChange from "gulp-change";
import mergeDeep from "merge-deep";

const manifest = {
  dev: {
    version: process.env.npm_package_version,
    background: {
      scripts: [
        "scripts/livereload.js",
        "scripts/lib/jquery-3.3.1.min.js",
        "scripts/background.js",
      ],
    },
    permissions: [
      "webRequest",
      "webRequestBlocking",
      "*://browser.sentry-cdn.com/*",
      "*://*.yandex.ru/*",
      "*://*.google-analytics.com/*",
      "*://*.datadome.co/*",
      "*://*.googletagmanager.com/*",
    ],
  },

  production: {
    version: process.env.npm_package_version,
  },
};

export default () => {
  const manifestData =
    process.env.NODE_ENV === "production" //
      ? manifest.production
      : manifest.dev;

  return src("./manifest.json")
    .pipe(
      gulpChange(content => {
        let data = JSON.parse(content);
        data = mergeDeep(data, manifestData);

        return JSON.stringify(data);
      }),
    )
    .pipe(dest(process.env.BUILD_FOLDER));
};
