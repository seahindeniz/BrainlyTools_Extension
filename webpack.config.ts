/* eslint-disable import/first */
/* eslint-disable import/no-extraneous-dependencies */
delete process.env.TS_NODE_PROJECT;

import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import ExtensionReloader from "webpack-extension-reloader";
import WebpackWatchedGlobEntries from "webpack-watched-glob-entries-plugin";
import webpack from "webpack";

const nodeEnv =
  (process.env.NODE_ENV as "development" | "production" | "none") ||
  "development";

const entriesOnlyToWatch = WebpackWatchedGlobEntries.getEntries(
  ["src/styles/**/*.scss", "src/*/views/{0,13}-*/*.ts"],
  {
    ignore: ["**/_/**"],
    cwd: __dirname,
  },
)();

const contentScriptEntries = WebpackWatchedGlobEntries.getEntries(
  // ["src/*/views/{0,1,2,3,4,5}-*/*.ts"],
  ["./src/*/views/*/*.ts"],
  {
    ignore: ["**/_/**"],
    cwd: __dirname,
  },
)();

function cleanEntries(
  entries: { [s: string]: any } | ArrayLike<any>,
  searchValue: string | RegExp = ".ts",
) {
  return Object.values(entries).map(entry => entry.replace(searchValue, ""));
}

// process.exit();

const mainConfig: webpack.Configuration = {
  mode: nodeEnv,
  target: "web",
  entry: {
    ...contentScriptEntries,
    ...WebpackWatchedGlobEntries.getEntries(
      [
        //
        // "src/*/*.ts",
        "./src/{background,popup,scripts}/*.ts",
        "./src/*/lib/*[!.min].js",
      ],
      {
        ignore: [
          //
          "./**/_/**",
          "./locales/*",
          "./*/lib/*.min.js",
          // "**/*.d.ts",
        ],
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
        test: /\.g(?:raph)?ql$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader",
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
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  output: {
    // filename: "[name].js",
    path: path.resolve(
      __dirname,
      `.${nodeEnv === "development" ? "" : "/dist"}/build`,
    ),
  },
  resolve: {
    extensions: [".js", ".ts"],
    plugins: [
      new TsconfigPathsPlugin(),
      //
    ],
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    /* fallback: {
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
    }, */
  },
  performance: {
    hints: false,
  },
  // watch: true,
};

if (nodeEnv === "development") {
  mainConfig.plugins.shift(
    // @ts-expect-error
    new ExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: [
          "scripts/contentScript",
          ...cleanEntries(contentScriptEntries),
          ...cleanEntries(entriesOnlyToWatch, /src\/|\.ts/i),
        ],
        background: "background",
        extensionPage: ["scripts/popup", "scripts/options"],
      },
    }),
  );
}

export default [mainConfig];
// module.exports = mainConfig;
