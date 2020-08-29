import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import ExtensionReloader from "webpack-extension-reloader";
import WebpackWatchedGlobEntries from "webpack-watched-glob-entries-plugin";

const nodeEnv = process.env.NODE_ENV || "development";

const entriesOnlyToWatch = WebpackWatchedGlobEntries.getEntries(
  ["src/styles/**/*.scss", "src/*/views/{0,12}-*/*.ts"],
  {
    ignore: ["**/_/**"],
    cwd: __dirname,
  },
)();

const contentScriptEntries = WebpackWatchedGlobEntries.getEntries(
  // ["src/*/views/{0,1,2,3,4,5}-*/*.ts"],
  ["src/*/views/*/*.ts"],
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
  return Object.values(entries).map(entry => entry.replace(searchValue, ""));
}

// console.log(contentScriptEntries);
// process.exit();

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
  plugins: [],
  output: {
    // filename: "[name].js",
    path: path.resolve(
      __dirname,
      `${nodeEnv === "development" ? "." : "./dist"}/build`,
    ),
  },
  resolve: {
    extensions: [".js", ".ts"],
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

if (nodeEnv === "development") {
  mainConfig.plugins.shift(
    new ExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: [
          "scripts/contentScript",
          ...cleanEntries(contentScriptEntries),
          ...cleanEntries(entriesOnlyToWatch, /src\/|\.ts/i),
        ],
        background: "scripts/background",
        extensionPage: ["scripts/popup", "scripts/options"],
      },
    }),
  );
}

export default [/* libConfig, */ mainConfig];
