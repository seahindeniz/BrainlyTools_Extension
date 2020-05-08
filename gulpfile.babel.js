/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import { task, src, dest, series, watch } from "gulp";
import babelify from "babelify";
import log from "fancy-log";
import colors from "colors";
import syncReq from "sync-request";
import downloadFileSync from "download-file-sync";
import fs from "fs";
import yaml from "js-yaml";
import mergeDeep from "merge-deep";
import globImporter from "node-sass-glob-importer";

const $ = require("gulp-load-plugins")();

const STYLE_GUIDE_PATH = "src/styles/_/style-guide.css";

let _presets;
let _plugins;
const isProduction = process.env.NODE_ENV === "production";
const target = process.env.TARGET || "chrome";

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

  firefox: {
    applications: {
      gecko: {
        id: "",
      },
    },
  },
};

const styleGuidePJBody = syncReq(
  "GET",
  "https://raw.githubusercontent.com/brainly/style-guide/master/package.json",
  {
    headers: {
      "user-agent":
        "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    },
  },
);

const styleGuidePJ = JSON.parse(styleGuidePJBody.getBody("utf8"));
const versionNumber = styleGuidePJ.version;

if (!/\d{1,}\.\d{1,}\.\d{1,}/i.exec(versionNumber))
  throw Error(`Version number isn't correct: ${versionNumber}`);

const styleGuideLink = `https://styleguide.brainly.com/${versionNumber}/style-guide.css`;
let styleGuideContent = downloadFileSync(styleGuideLink);
const styleGuideMapContent = downloadFileSync(`${styleGuideLink}.map`);
styleGuideContent = styleGuideContent.replace(
  /\.\.\//g,
  "https://styleguide.brainly.com/",
);

fs.writeFileSync(`./${STYLE_GUIDE_PATH}`, styleGuideContent);
fs.writeFileSync(`./${STYLE_GUIDE_PATH}.map`, styleGuideMapContent);

// Clean previous build
task("clean", () => {
  return src(`./build/${target}`, { allowEmpty: true })
    .on("end", () => log("Waiting for 1 second before clean.."))
    .pipe($.wait(1000))
    .pipe($.clean());
});

/**
 * HELPERS
 */
function compileJSFiles(files, path) {
  let process = src(files).pipe(
    $.bro({
      transform: [
        babelify.configure({
          get presets() {
            return _presets;
          },
          get plugins() {
            return _plugins;
          },
          sourceMaps: false,
        }),
        // ['uglifyify', { global: true, sourceMap: false }]
      ],
    }),
  );

  if (isProduction) {
    process = process.pipe(
      $.minify({
        preserveComments: false,
        noSource: true,
        ext: {
          min: ".js",
        },
      }),
    );
  }

  return process.pipe(dest(path, { overwrite: true }));
}

function compileJSXFiles(files, path) {
  return src(files)
    .pipe(
      $.bro({
        transform: [
          babelify.configure({
            sourceMaps: false,
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              {
                plugins: [
                  "@babel/plugin-transform-runtime",
                  [
                    "babel-plugin-inline-import",
                    {
                      extensions: [".html"],
                    },
                  ],
                ],
              },
            ],
          }),
          ["uglifyify", { global: true, sourceMap: false }],
        ],
      }),
    )
    .pipe($.rename({ extname: ".js" }))
    .pipe(dest(path, { overwrite: true }));
}

function compileScssFiles(files, path) {
  return src(files)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass
        .sync({
          outputStyle: "compressed",
          precision: 10,
          includePaths: ["."],
          importer: globImporter(),
        })
        .on("error", $.sass.logError),
    )
    .pipe($.sourcemaps.write(`./`))
    .pipe(dest(path, { overwrite: true }));
}

function FetchStyleGuide() {
  return src([STYLE_GUIDE_PATH, `${STYLE_GUIDE_PATH}.map`]).pipe(
    dest(`build/${target}/styles`, { overwrite: true }),
  );
}

function PrintRebuilding(path) {
  log.info(colors.green(path), "has changed, rebuilding");
}

/**
 * COMMON
 */
task("assets", () => {
  let assets = [
    {
      src: "./src/icons/**/*",
      dest: `./build/${target}/icons`,
    },
    {
      src: "./src/_locales/**/*",
      dest: `./build/${target}/_locales`,
    },
    {
      src: `./src/images/${target}/**/*`,
      dest: `./build/${target}/images`,
    },
    {
      src: "./src/images/shared/**/*",
      dest: `./build/${target}/images`,
    },
    {
      src: "./src/**/*.html",
      dest: `./build/${target}`,
    },
    {
      src: "src/scripts/**/*.min.js",
      dest: `build/${target}/scripts`,
    },
    {
      src: "src/configs/*.json",
      dest: `build/${target}/configs`,
    },
  ];

  assets = assets.map(asset => {
    return src(asset.src).pipe(dest(asset.dest));
  });

  return assets[assets.length - 1];
});

task("extensionConfig", () => {
  // const extensionOptions = require("./src/configs/_/extension.js");
  const extensionOptionsRaw = fs.readFileSync(
    "./src/configs/_/main.yml",
    "utf8",
  );
  const extensionOptions = yaml.safeLoad(extensionOptionsRaw);
  let config = extensionOptions.dev;

  if (isProduction) config = extensionOptions.production;

  config = {
    ...config,
    ...extensionOptions.common,
  };

  return src("./src/configs/_/extension.json")
    .pipe(
      $.change(() => {
        return JSON.stringify(config, null, 2);
      }),
    )
    .pipe(dest(`./src/configs/_`));
});

task("scss", () => {
  return compileScssFiles(
    [
      "src/styles/**/*.scss",
      "src/styles/**/**/*.scss",
      "!src/styles/_/**/*.scss",
    ],
    `build/${target}/styles`,
  );
});

task("styleGuide", () => {
  return FetchStyleGuide();
});

task("locales", () => {
  return src("src/locales/*.json").pipe(dest(`build/${target}/locales`));
});

task("popup", () => {
  return compileJSFiles(["src/popup/*.js"], `build/${target}/popup`);
});

task("js", () => {
  return compileJSFiles(
    [
      "src/scripts/*.js",
      "src/scripts/**/**/*.js",

      "!src/scripts/**/**/_/*",
      "!src/scripts/**/**/_/**/*",
      "!src/scripts/components/**/*.js",
      "!src/scripts/controllers/**/*.js",
      "!src/scripts/helpers/**/*.js",
      "!src/scripts/utils/*.js",
      "!src/scripts/lib/*.min.js",
      "!src/scripts/jsx/*",
      "!src/scripts/jsx/**/*",
    ],
    `build/${target}/scripts`,
  );
});

task("jsx", () => {
  return compileJSXFiles(
    [
      "src/scripts/jsx/**/*.jsx",

      "!src/scripts/jsx/**/_/*",
      "!src/scripts/jsx/**/_/**/*",
    ],
    `build/${target}/scripts/views`,
  );
});

task("manifest", () => {
  let manifestData = manifest.dev;

  if (target === "firefox") {
    manifestData = manifest.firefox;
  } else if (isProduction) {
    manifestData = manifest.production;
  }

  return src("./manifest.json")
    .pipe(
      $.change(content => {
        let data = JSON.parse(content);
        data = mergeDeep(data, manifestData);

        return JSON.stringify(data);
      }),
    )
    .pipe(dest(`./build/${target}`));
});
task("generateLocaleIndex", () => {
  return src("src/locales/en_US.json")
    .pipe($.rename("index.js"))
    .pipe(
      $.change(content => {
        const start = "export default ";
        content = content.replace(/\s"(.*)": /g, " $1: ");
        const end = "\n";

        return `${start}${content}${end}`;
      }),
    )
    .pipe(dest(`src/locales`));
});
task("getBabelRC", next => {
  const configs = JSON.parse(fs.readFileSync("./.babelrc", "utf8"));
  _presets = configs.presets;
  _plugins = configs.plugins;

  next();
});
task(
  "build",
  series(
    "clean",
    "getBabelRC",
    "assets",
    "extensionConfig",
    "scss",
    "styleGuide",
    "locales",
    "generateLocaleIndex",
    "popup",
    "js",
    /* "jsx", */ "manifest",
  ),
);
task("reloadExtension", next => {
  $.livereload.reload();
  next();
});

task("watchFiles", () => {
  $.livereload.listen();

  /**
   * JS Files
   */
  const watchJSFilesNeedsOnlyReload = watch(
    [
      "./src/scripts/views/*/*.js",
      "./src/scripts/*.js",

      "!./src/scripts/views/**/_/*.js",
      "!./src/scripts/views/**/_/**/*.js",
    ],
    series("reloadExtension"),
  );
  const watchJSFilesNeedsToReBuild = watch(
    [
      "./src/**/*.js",
      "./src/scripts/views/**/_/*.js",
      "./src/scripts/views/**/_/**/*.js",

      "!./src/scripts/views/*/*.js",
      "!./src/scripts/*.js",
      "!src/locales/index.js",
    ],
    series("build", "reloadExtension"),
  );

  /**
   * JSX files
   */
  const watchJSXFilesNeedsOnlyReload = watch(
    [
      "./src/scripts/jsx/**/*.jsx",

      "!./src/scripts/jsx/**/_/*.jsx",
      "!./src/scripts/jsx/**/_/**/*.jsx",
    ],
    series("reloadExtension"),
  );
  const watchJSXFilesNeedsToReBuild = watch(
    ["./src/scripts/jsx/**/_/*.jsx", "./src/scripts/jsx/**/_/**/*.jsx"],
    series("build", "reloadExtension"),
  );

  /**
   * SCSS files
   */
  const watchSCSSFilesNeedsOnlyReload = watch(
    ["src/styles/**/*.scss", "src/scripts/views/**/*.scss"],
    series("reloadExtension"),
  );

  /**
   * All files
   */
  const watchAllFilesNeedsToReBuild = watch(
    [
      "./src/**/*",

      "!./src/**/*.js",
      "!./src/scripts/jsx/**/*.jsx",
      "!./src/configs/_/extension.json",
      "!src/styles/**/*.scss",
      "!src/scripts/views/**/*.scss",
      "!src/styles/_/style-guide.css",
      "!src/styles/_/style-guide.css.map",
    ],
    series("build", "reloadExtension"),
  );

  watchJSFilesNeedsToReBuild.on("change", PrintRebuilding);
  watchJSFilesNeedsOnlyReload.on("change", path => {
    const filePath = path.split("/");
    const destPath = filePath.slice(1, -1).join("/");
    const fileName = filePath.pop();
    const destFullPath = `build/${target}/${destPath}/${fileName}`;

    compileJSFiles(path, `build/${target}/${destPath}`);

    log.info(
      `${colors.yellow("JS")}: ${colors.green(
        path,
      )} has replaced with ${colors.magenta(destFullPath)}`,
    );
  });

  watchJSXFilesNeedsToReBuild.on("change", PrintRebuilding);
  watchJSXFilesNeedsOnlyReload.on("change", path => {
    const filePath = path.split("/");
    const destPath = filePath.slice(1, -1).join("/");
    const fileName = filePath.pop();
    const destFullPath = `build/${target}/${destPath}/${fileName}`;

    compileJSXFiles(path, `build/${target}/${destPath}`);

    log.info(
      `${colors.yellow("JSX")}: ${colors.green(
        path,
      )} has replaced with ${colors.magenta(destFullPath)}`,
    );
  });

  watchSCSSFilesNeedsOnlyReload.on("change", path => {
    const filePath = path.split("/");
    const destPath = filePath.slice(1, -1).join("/");
    let fileName = filePath.pop().split(".");
    fileName.pop();
    fileName = fileName.join(".");
    const destFullPath = `build/${target}/${destPath}/${fileName}.css`;

    compileScssFiles(path, `build/${target}/${destPath}`);

    log.info(
      `${colors.yellow("SCSS")}: ${colors.green(
        path,
      )} has replaced with ${colors.magenta(destFullPath)}`,
    );
  });

  watchAllFilesNeedsToReBuild.on("change", PrintRebuilding);

  return watchAllFilesNeedsToReBuild;
});

/**
 * DIST
 */
task("zip", () => {
  return src(`./build/${target}/**/*`)
    .pipe($.zip(`${target}-${process.env.npm_package_version}.zip`))
    .pipe(dest("./dists"));
});

task("default", series("build"));
task("dist", series("build", "zip"));
task("watch", series("build", "watchFiles"));
