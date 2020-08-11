import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import ExtensionReloader from "webpack-extension-reloader";
import WebpackWatchedGlobEntries from "webpack-watched-glob-entries-plugin";

const nodeEnv = process.env.NODE_ENV || "development";

// const entriesOnlyToWatch = WebpackWatchedGlobEntries.getEntries(
//   ["src/styles/**/*.scss"],
//   {
//     ignore: ["**/_/**"],
//     cwd: __dirname,
//   },
// )();

const contentScriptEntries = WebpackWatchedGlobEntries.getEntries(
  ["src/*/views/{0,1,2}-*/*.ts"],
  {
    ignore: ["**/_/**"],
    cwd: __dirname,
  },
)();

/**
 * @param {{ [x: string]: string }} entries
 * @param {string | RegExp} searchValue
 */
function cleanEntries(entries, searchValue = ".ts") {
  return Object.values(entries).map(entry => {
    return entry.replace(searchValue, "");
  });
}

// process.exit();

/**
 * @type {ExtensionReloader}
 */
const extensionReloaderPlugin =
  nodeEnv === "development"
    ? new ExtensionReloader({
        port: 9090,
        reloadPage: true,
        entries: {
          contentScript: [
            "scripts/contentScript",
            ...cleanEntries(contentScriptEntries),
            // ...cleanEntries(entriesOnlyToWatch, /src\/|\.ts/i),
          ],
          background: "scripts/background",
          extensionPage: ["scripts/popup", "scripts/options"],
        },
      })
    : undefined; /* () => {
        this.apply = () => {};
      } */

const mainConfig = {
  mode: nodeEnv,
  entry: {
    ...contentScriptEntries,
    ...WebpackWatchedGlobEntries.getEntries(
      ["src/*/*.ts", "src/*/lib/*.js"], // , "src/*/views/0-Core/*.ts"
      {
        ignore: ["./**/_/**", "src/locales/*", "src/*/lib/*.min.js"],
        cwd: __dirname,
      },
    )(),
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
        exclude: /node_modules/,
        options: {
          esModule: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: { chrome: "58", ie: "11" },
                },
              ],
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties",
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
        parser: { system: false },
      },
    ],
  },
  plugins: [extensionReloaderPlugin],
  output: {
    // filename: "[name].js",
    // path: path.resolve(process.cwd(), "build"),
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    extensions: [".js", ".ts" /* , ".json" */],
    plugins: [
      new TsconfigPathsPlugin(),
      //
    ],
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
  },
  performance: {
    hints: false,
  },
  // watch: true,
};

export default [/* libConfig, */ mainConfig];
