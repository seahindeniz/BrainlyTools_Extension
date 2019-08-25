// @ts-nocheck
import { task, src, dest, series, watch } from 'gulp';
import babelify from 'babelify';
import log from "fancy-log";
import colors from "colors";
import syncReq from "sync-request";
import downloadFileSync from "download-file-sync";
import fs from "fs";
import yaml from "js-yaml";

const $ = require('gulp-load-plugins')();
const STYLE_GUIDE_PATH = "src/styles/_/style-guide.css";

var isProduction = process.env.NODE_ENV === "production";
var target = process.env.TARGET || "chrome";

var manifest = {
  dev: {
    "version": process.env.npm_package_version,
    "background": {
      "scripts": [
        "scripts/livereload.js",
        "scripts/lib/jquery-3.3.1.min.js",
        "scripts/background.js"
      ]
    }
  },

  production: {
    "version": process.env.npm_package_version
  },

  firefox: {
    "applications": {
      "gecko": {
        "id": ""
      }
    }
  }
}

/* const styleGuidePJBody = syncReq("GET", "https://api.github.com/repos/brainly/style-guide/releases/latest", {
  headers: {
    "user-agent": "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
  }
});
const styleGuidePJ = JSON.parse(styleGuidePJBody.getBody('utf8'));
let versionNumber = styleGuidePJ.tag_name.replace(/^[a-z]/i, ""); */
const styleGuidePJBody = syncReq("GET", "https://raw.githubusercontent.com/brainly/style-guide/master/package.json", {
  headers: {
    "user-agent": "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
  }
});

const styleGuidePJ = JSON.parse(styleGuidePJBody.getBody('utf8'));
let versionNumber = styleGuidePJ.version;

if (!(/\d{1,}\.\d{1,}\.\d{1,}/i.exec(versionNumber)))
  throw `Version number isn't correct: ${versionNumber}`;

let styleGuideLink = `https://styleguide.brainly.com/${versionNumber}/style-guide.css`;
let styleGuideContent = downloadFileSync(styleGuideLink);
let styleGuideMapContent = downloadFileSync(`${styleGuideLink}.map`);
styleGuideContent = styleGuideContent.replace(/\.\.\//g, "https://styleguide.brainly.com/");

fs.writeFileSync(`./${STYLE_GUIDE_PATH}`, styleGuideContent);
fs.writeFileSync(`./${STYLE_GUIDE_PATH}.map`, styleGuideMapContent);

// Clean previous build
task('clean', () => {
  return src(`./build/${target}`, { allowEmpty: true })
    .on('end', () => log('Waiting for 1 second before clean..'))
    .pipe($.wait(1000))
    .pipe($.clean());
})

/**
 * COMMON
 */
task("assets", () => {
  let assets = [{
      src: './src/icons/**/*',
      dest: `./build/${target}/icons`
    },
    {
      src: './src/_locales/**/*',
      dest: `./build/${target}/_locales`
    },
    {
      src: `./src/images/${target}/**/*`,
      dest: `./build/${target}/images`
    },
    {
      src: './src/images/shared/**/*',
      dest: `./build/${target}/images`
    },
    {
      src: './src/**/*.html',
      dest: `./build/${target}`
    },
    {
      src: "src/scripts/**/*.min.js",
      dest: `build/${target}/scripts`
    },
    {
      src: "src/configs/*.json",
      dest: `build/${target}/configs`
    }
  ];

  assets = assets.map(function(asset) {
    return src(asset.src)
      .pipe(dest(asset.dest));
  });

  return assets[assets.length - 1]
});

task("extensionConfig", () => {
  //const extensionOptions = require("./src/configs/_/extension.js");
  let extensionOptionsRaw = fs.readFileSync('./src/configs/_/main.yml', 'utf8');
  let extensionOptions = yaml.safeLoad(extensionOptionsRaw);
  let mergeJsonData = {
    fileName: "extension.json"
  };

  if (isProduction)
    mergeJsonData.endObj = extensionOptions.production;
  else
    mergeJsonData.endObj = extensionOptions.dev;

  return src('./src/configs/_/extension.json')
    .pipe($.mergeJson(mergeJsonData))
    .pipe(dest(`./src/configs/_`))
});

task('scss', () => {
  return compileScssFiles([
    'src/styles/**/*.scss',
    'src/styles/**/**/*.scss',
    '!src/styles/_/**/*.scss'
  ], `build/${target}/styles`);
});

task("styleGuide", () => {
  return FetchStyleGuide();
});

task("locales", () => {
  return src('src/locales/*.json')
    .pipe(dest(`build/${target}/locales`));
});

task('popup', () => {
  return compileJSFiles(
    [
      'src/popup/*.js'
    ],
    `build/${target}/popup`
  );
});

task('js', () => {
  return compileJSFiles(
    [
      'src/scripts/*.js',
      'src/scripts/**/**/*.js',

      '!src/scripts/**/**/_/*',
      '!src/scripts/**/**/_/**/*',
      '!src/scripts/components/**/*.js',
      '!src/scripts/controllers/**/*.js',
      '!src/scripts/helpers/**/*.js',
      '!src/scripts/utils/*.js',
      "!src/scripts/lib/*.min.js",
      "!src/scripts/jsx/*",
      "!src/scripts/jsx/**/*",
    ],
    `build/${target}/scripts`
  );
});

task('jsx', () => {
  return compileJSXFiles(
    [
      'src/scripts/jsx/**/*.jsx',

      '!src/scripts/jsx/**/_/*',
      '!src/scripts/jsx/**/_/**/*',
    ],
    `build/${target}/scripts/views`
  );
});

task("manifest", () => {
  let mergeJsonData = {
    fileName: "manifest.json"
  };

  if (target === "firefox") {
    mergeJsonData.endObj = manifest.firefox
  } else if (isProduction) {
    mergeJsonData.endObj = manifest.production
  } else {
    mergeJsonData.endObj = manifest.dev
  }

  return src('./manifest.json')
    .pipe($.mergeJson(mergeJsonData))
    .pipe(dest(`./build/${target}`))
});
task(
  "generateLocaleIndex",
  () => {
    return src('src/locales/en_US.json')
      .pipe($.rename("index.js"))
      .pipe($.modifyFile((content) => {
        const start = 'module.exports = ';
        content = content.replace(/\s"(.*)": /g, " $1: ");
        const end = "\n";

        return `${start}${content}${end}`;
      }))
      .pipe(dest(`src/locales`));
  }
)
task(
  'build',
  series('clean', "assets", "extensionConfig", 'scss', "styleGuide", "locales", "generateLocaleIndex", "popup", 'js', /* "jsx", */ 'manifest')
);
task(
  "reloadExtension",
  next => {
    $.livereload.reload();
    next();
  }
);

task(
  "watchFiles",
  () => {
    $.livereload.listen();

    /**
     * JS Files
     */
    let watchJSFilesNeedsOnlyReload = watch([
      './src/scripts/views/*/*.js',
      './src/scripts/*.js',

      '!./src/scripts/views/**/_/*.js',
      '!./src/scripts/views/**/_/**/*.js',
    ], series("reloadExtension"));
    let watchJSFilesNeedsToReBuild = watch([
      './src/**/*.js',
      './src/scripts/views/**/_/*.js',
      './src/scripts/views/**/_/**/*.js',

      '!./src/scripts/views/*/*.js',
      '!./src/scripts/*.js',
      '!src/locales/index.js'
    ], series('build', "reloadExtension"));

    /**
     * JSX files
     */
    let watchJSXFilesNeedsOnlyReload = watch([
      './src/scripts/jsx/**/*.jsx',

      '!./src/scripts/jsx/**/_/*.jsx',
      '!./src/scripts/jsx/**/_/**/*.jsx',
    ], series("reloadExtension"));
    let watchJSXFilesNeedsToReBuild = watch([
      './src/scripts/jsx/**/_/*.jsx',
      './src/scripts/jsx/**/_/**/*.jsx'
    ], series('build', "reloadExtension"));

    /**
     * SCSS files
     */
    let watchSCSSFilesNeedsOnlyReload = watch(
      [
        'src/styles/**/*.scss',
        'src/scripts/views/**/*.scss'
      ], series("reloadExtension"));

    /**
     * All files
     */
    let watchAllFilesNeedsToReBuild = watch(
      [
        './src/**/*',

        '!./src/**/*.js',
        "!./src/scripts/jsx/**/*.jsx",
        '!./src/configs/_/extension.json',
        '!src/styles/**/*.scss',
        '!src/scripts/views/**/*.scss',
        '!src/styles/_/style-guide.css',
        '!src/styles/_/style-guide.css.map'
      ],
      series('build', "reloadExtension"));

    watchJSFilesNeedsToReBuild.on("change", PrintRebuilding);
    watchJSFilesNeedsOnlyReload.on("change", function(path) {
      let filePath = path.split("/");
      let destPath = filePath.slice(1, -1).join("/");
      let fileName = filePath.pop();
      let destFullPath = `build/${target}/${destPath}/${fileName}`;

      compileJSFiles(path, `build/${target}/${destPath}`);

      log.info(`${colors.yellow("JS")}: ${colors.green(path)} has replaced with ${colors.magenta(destFullPath)}`);
    });

    watchJSXFilesNeedsToReBuild.on("change", PrintRebuilding);
    watchJSXFilesNeedsOnlyReload.on("change", function(path) {
      let filePath = path.split("/");
      let destPath = filePath.slice(1, -1).join("/");
      let fileName = filePath.pop();
      let destFullPath = `build/${target}/${destPath}/${fileName}`;

      compileJSXFiles(path, `build/${target}/${destPath}`);

      log.info(`${colors.yellow("JSX")}: ${colors.green(path)} has replaced with ${colors.magenta(destFullPath)}`);
    });

    watchSCSSFilesNeedsOnlyReload.on("change", function(path) {
      let filePath = path.split("/");
      let destPath = filePath.slice(1, -1).join("/");
      let fileName = filePath.pop().split(".");
      fileName.pop();
      fileName = fileName.join(".");
      let destFullPath = `build/${target}/${destPath}/${fileName}.css`;

      compileScssFiles(path, `build/${target}/${destPath}`);

      log.info(`${colors.yellow("SCSS")}: ${colors.green(path)} has replaced with ${colors.magenta(destFullPath)}`);
    });

    watchAllFilesNeedsToReBuild.on("change", PrintRebuilding);

    return watchAllFilesNeedsToReBuild;
  }
);

function PrintRebuilding(path) {
  log.info(colors.green(path), "has changed, rebuilding");
}
task(
  'watch',
  series('build', "watchFiles")
);

task(
  'default',
  series('build')
);

/**
 * DIST
 */
task(
  'zip',
  () => {
    return src(`./build/${target}/**/*`)
      .pipe($.zip(`${target}-${process.env.npm_package_version}.zip`))
      .pipe(dest('./dists'))
  }
);

task(
  'dist',
  series('build', 'zip')
);

/**
 * HELPERS
 */
function compileJSFiles(files, path) {
  return src(files)
    .pipe($.bro({
      transform: [
        babelify.configure({
          sourceMaps: false,
          presets: [
            '@babel/preset-env',
            {
              plugins: [
                '@babel/plugin-transform-runtime',
                [
                  "babel-plugin-inline-import", {
                    "extensions": [
                      ".html"
                    ]
                  }
                ]
              ]
            }
          ]
        }),
        //['uglifyify', { global: true, sourceMap: false }]
      ]
    }))
    .pipe($.minify({
      noSource: true,
      ext: {
        min: ".js",
      }
    }))
    .pipe(dest(path, { overwrite: true }));
}

function compileJSXFiles(files, path) {
  return src(files)
    .pipe($.bro({
      transform: [
        babelify.configure({
          sourceMaps: false,
          presets: [
            '@babel/preset-env',
            "@babel/preset-react",
            {
              plugins: [
                '@babel/plugin-transform-runtime',
                [
                  "babel-plugin-inline-import", {
                    "extensions": [
                      ".html"
                    ]
                  }
                ]
              ]
            }
          ]
        }),
        ['uglifyify', { global: true, sourceMap: false }]
      ]
    }))
    .pipe($.rename({ extname: '.js' }))
    .pipe(dest(path, { overwrite: true }));;
}

function compileScssFiles(files, path) {
  return src(files)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'compressed',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.sourcemaps.write(`./`))
    .pipe(dest(path, { overwrite: true }));
}

function FetchStyleGuide() {
  return src([
      STYLE_GUIDE_PATH,
      `${STYLE_GUIDE_PATH}.map`
    ])
    .pipe(dest(`build/${target}/styles`, { overwrite: true }));;
}
