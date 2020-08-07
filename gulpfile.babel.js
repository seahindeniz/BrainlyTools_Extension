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
import packageImporter from "node-sass-package-importer";
import ts from "gulp-typescript";
import merge from "merge2";
import babelrc from "./.babelrc";
import pathmodify from "pathmodify";
import path from "path";

const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const rename = require("gulp-rename");
const es = require("event-stream");
const debug = require("gulp-debug");

/* console.log(path.join(__dirname, "./src/scripts/components/style-guide", ""));
process.exit(0); */
const $ = require("gulp-load-plugins")();

const STYLE_GUIDE_PATH = "src/styles/_/style-guide.css";

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
function compileJSFiles(files, destPath) {
  let process = src(files).pipe(
    $.bro({
      transform: [
        babelify.configure({
          /* get presets() {
            return _presets;
          },
          get plugins() {
            return _plugins;
          }, */
          overrides: babelrc.overrides,
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

  return process.pipe(dest(destPath, { overwrite: true }));
}

function compileTSFiles(files, destPath) {
  let process = src(files).pipe(
    $.bro({
      transform: [
        babelify.configure({
          presets: ["@babel/preset-typescript"],
          plugins: [
           /*  "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties", */
            [
              "inline-import",
              {
                extensions: [".html"],
              },
            ],
            [
              "import-graphql",
              {
                runtime: true,
              },
            ],
            [
              "module-resolver",
              {
                alias: {
                  "@BrainlyAction":
                    "./src/scripts/controllers/Req/Brainly/Action",
                  "@ServerReq": "./src/scripts/controllers/Req/Server",
                  "@style-guide": "./src/scripts/components/style-guide",
                  "@": "./src",
                },
              },
            ],
          ],
          sourceMaps: false,
        }),
        // ['uglifyify', { global: true, sourceMap: false }]
      ],
    }),
  );

  /* if (isProduction) {
    process = process.pipe(
      $.minify({
        preserveComments: false,
        noSource: true,
        ext: {
          min: ".js",
        },
      }),
    );
  } */

  return process.pipe(dest(destPath, { overwrite: true }));
}

const tsPaths = {
  "@BrainlyAction": "./src/scripts/controllers/Req/Brainly/Action",
  "@ServerReq": "./src/scripts/controllers/Req/Server",
  "@style-guide": "./src/scripts/components/style-guide",
  // "@style-guide/*": ["./src/scripts/components/style-guide"],
  "@/": "src/",
};
const tsPathKeys = Object.keys(tsPaths);

function compileTSFiles3(files, destPath) {
  return src(files)
    .pipe(debug({ title: "unicorn:" }))
    .pipe(
      $.bro({
        plugin: [
          [
            "pathmodify",
            {
              mods: [
                /**
                 * @param {{
                 *  id: string,
                 * }} rec
                 */
                function (rec) {
                  const alias = {};

                  tsPathKeys.some(pathKey => {
                    if (rec.id.indexOf(pathKey) !== 0) return;

                    alias.id = path.join(
                      __dirname,
                      tsPaths[pathKey],
                      rec.id.replace(pathKey, ""),
                    );

                    return true;
                  });

                  return alias;
                },
              ],
            },
          ],
          [
            "stringify",
            {
              appliesTo: { includeExtensions: [".html"] },
              minify: true,
            },
          ],
          [
            "tsify",
            {
              resolveJsonModule: true,
              allowSyntheticDefaultImports: true,
              noImplicitAny: false,
              target: "es6",
              module: "CommonJS",
              lib: ["es5", "es6", "dom"],
              allowJs: true,
              baseUrl: ".",
              typeRoots: ["node_modules/@types", "./src/scripts/typings"],
            },
          ],
        ],
      }),
    )
    .pipe($.rename({ extname: ".js" }))
    .pipe(dest(destPath, { overwrite: true }));
}

// const tsProject = ts.createProject("tsconfig.json");
function compileTSFiles2(files, destPath) {
  let process = src(files).pipe(
    ts({
      declaration: false,

      target: "es5",
      module: "none",
      lib: ["es5", "es6", "dom"],
      moduleResolution: "Node",
      // allowJs: true,
      downlevelIteration: true,
      /* target: "ES2017",
      module: "commonjs",
      declaration: true,
      noImplicitAny: false,
      removeComments: true,
      esModuleInterop: true,
      experimentalDecorators: true,
      newLine: "LF",
      lib: [
        "DOM",
        "DOM.Iterable",
        "ScriptHost",
        "es2016",
        "es2017.sharedmemory",
      ], */
      baseUrl: ".",
      paths: {
        "@BrainlyAction": ["./src/scripts/controllers/Req/Brainly/Action"],
        "@ServerReq": ["./src/scripts/controllers/Req/Server"],
        "@style-guide": ["./src/scripts/components/style-guide"],
        "@style-guide/*": ["./src/scripts/components/style-guide/*"],
        "@/*": ["src/*"],
      },
    }),
  );

  /* if (isProduction) {
    process = process.pipe(
      $.minify({
        preserveComments: false,
        noSource: true,
        ext: {
          min: ".js",
        },
      }),
    );
  } */

  // return merge([process.dts.pipe(dest(destPath)), process.js.pipe(dest(destPath))]);
  return process.pipe(dest(destPath, { overwrite: true }));
}

function compileJSXFiles(files, destPath) {
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
    .pipe(dest(destPath, { overwrite: true }));
}

function compileScssFiles(files, destPath) {
  return src(files)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass
        .sync({
          outputStyle: "compressed",
          precision: 10,
          includePaths: ["./node_modules", "."],
          importer: [globImporter(), packageImporter()],
        })
        .on("error", $.sass.logError),
    )
    .pipe($.sourcemaps.write(`./`))
    .pipe(dest(destPath, { overwrite: true }));
}

function FetchStyleGuide() {
  return src([STYLE_GUIDE_PATH, `${STYLE_GUIDE_PATH}.map`]).pipe(
    dest(`build/${target}/styles`, { overwrite: true }),
  );
}

function PrintRebuilding(filePath) {
  log.info(colors.green(filePath), "has changed, rebuilding");
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

task("extensionConfig", cb => {
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

  fs.writeFile(
    "./src/configs/_/extension.json",
    JSON.stringify(config, null, 2),
    cb,
  );
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
  return compileJSFiles(
    [/* "src/popup/*.js",  */ "src/popup/*.ts"],
    `build/${target}/popup`,
  );
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

task("ts", () => {
  return compileTSFiles(
    [
      "!src/scripts/**/**/*.ts",
      // "src/scripts/*.ts",
      // "src/scripts/**/**/*.ts",
      "src/scripts/views/0-Core/*.ts",
      "src/scripts/views/1-Home/*.ts",

      // "!src/scripts/**/**/_/*",
      // "!src/scripts/**/**/_/**/*",
      // "!src/scripts/components/**/*.ts",
      // "!src/scripts/controllers/**/*.ts",
      // "!src/scripts/helpers/**/*.ts",
      // "!src/scripts/utils/*.ts",
      // "!src/scripts/lib/*.min.ts",
      // "!src/scripts/jsx/*",
      // "!src/scripts/jsx/**/*",
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
/* task("getBabelRC", next => {
  const configs = JSON.parse(fs.readFileSync("./.babelrc", "utf8"));
  _presets = configs.presets;
  _plugins = configs.plugins;

  next();
}); */
task(
  "build",
  series(
    "clean",
    // "getBabelRC",
    "assets",
    // "extensionConfig", // TODO activate this
    "scss",
    "styleGuide",
    "locales",
    "generateLocaleIndex",
    // "popup", // TODO activate this
    "ts",
    // "js",
    // "jsx",
    "manifest",
  ),
);
task("reloadExtension", next => {
  $.livereload.reload();
  next();
});

task("watchFiles", () => {
  $.livereload.listen();

  /**
   * JS/TS Files
   */
  const watchJSFilesNeedsOnlyReload = watch(
    [
      "!src/scripts/**/**/*.ts",
      "src/scripts/views/0-Core/*.ts",
      "src/scripts/views/1-Home/*.ts",
      // "./src/scripts/views/*/*.js",
      // "./src/scripts/*.js",
      // "./src/scripts/views/*/*.ts",
      // "./src/scripts/*.ts",

      // "!src/scripts/views/10-QuestionSearch/",
      // "!src/scripts/views/11-ModeratorActionsHistory/",
      // "!src/scripts/views/12-QuestionAdd/",
      // "!src/scripts/views/2-Messages/",
      // "!src/scripts/views/3-Task/",
      // "!src/scripts/views/4-UserContent/",
      // "!src/scripts/views/5-UserProfile/",
      // "!src/scripts/views/6-ArchiveMod/",
      // "!src/scripts/views/7-UserWarnings/",
      // "!src/scripts/views/8-Supervisors/",
      // "!src/scripts/views/9-Uploader/",
      // "!./src/scripts/views/**/_/*.js",
      // "!./src/scripts/views/**/_/**/*.js",
      // "!./src/scripts/views/**/_/*.ts",
      // "!./src/scripts/views/**/_/**/*.ts",
    ],
    series("reloadExtension"),
  );
  const watchJSFilesNeedsToReBuild = watch(
    [
      "!src/scripts/**/**/*.ts",
      "src/scripts/views/0-Core/**/*.ts",
      "src/scripts/views/1-Home/**/*.ts",
      // "./src/**/*.js",
      // "./src/scripts/views/**/_/*.js",
      // "./src/scripts/views/**/_/**/*.js",
      // "./src/**/*.ts",
      // "./src/scripts/views/**/_/*.ts",
      // "./src/scripts/views/**/_/**/*.ts",

      // "!./src/scripts/views/*/*.js",
      // "!./src/scripts/*.js",
      // "!src/locales/index.js",
      // "!./src/scripts/views/*/*.ts",
      // "!./src/scripts/*.ts",
      // "!src/locales/index.ts",
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
      "!./src/configs/_/*",
      "!src/styles/**/*.scss",
      "!src/scripts/views/**/*.scss",
      "!src/styles/_/style-guide.css",
      "!src/styles/_/style-guide.css.map",
    ],
    series("build", "reloadExtension"),
  );

  watchJSFilesNeedsToReBuild.on("change", PrintRebuilding);
  watchJSFilesNeedsOnlyReload.on("change", _path => {
    const filePath = _path.split("/");
    const destPath = filePath.slice(1, -1).join("/");
    const fileName = filePath.pop();
    const destFullPath = `build/${target}/${destPath}/${fileName}`;

    compileJSFiles(_path, `build/${target}/${destPath}`);

    log.info(
      `${colors.yellow("JS")}: ${colors.green(
        _path,
      )} has replaced with ${colors.magenta(destFullPath)}`,
    );
  });

  watchJSXFilesNeedsToReBuild.on("change", PrintRebuilding);
  watchJSXFilesNeedsOnlyReload.on("change", _path => {
    const filePath = _path.split("/");
    const destPath = filePath.slice(1, -1).join("/");
    const fileName = filePath.pop();
    const destFullPath = `build/${target}/${destPath}/${fileName}`;

    compileJSXFiles(_path, `build/${target}/${destPath}`);

    log.info(
      `${colors.yellow("JSX")}: ${colors.green(
        _path,
      )} has replaced with ${colors.magenta(destFullPath)}`,
    );
  });

  watchSCSSFilesNeedsOnlyReload.on("change", _path => {
    const filePath = _path.split("/");
    const destPath = filePath.slice(1, -1).join("/");
    let fileName = filePath.pop().split(".");
    fileName.pop();
    fileName = fileName.join(".");
    const destFullPath = `build/${target}/${destPath}/${fileName}.css`;

    compileScssFiles(_path, `build/${target}/${destPath}`);

    log.info(
      `${colors.yellow("SCSS")}: ${colors.green(
        _path,
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
    .pipe(dest("./dist"));
});

task("default", series("build"));
task("dist", series("build", "zip"));
task("watch", series("build", "watchFiles"));
