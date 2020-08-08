import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import entry from "webpack-glob-entry";

// import assetsConfig from "./webpack/webpack.assets.config";

/* console.log(path.resolve(process.cwd(), "build"));
console.log(path.resolve(__dirname, "build"));
process.exit(1); */

export default [
  {
    entry: entry(entry.basePath("src"), "src/scripts/views/0-Core/*.ts"),
    // entry: entry(entry.basePath("src"), "src/scripts/views/*/*.ts"),
    // ["src/scripts/views/0-Core/*.ts", "src/scripts/views/1-Home/*.ts"],
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
          test: /\.tsx?$/,
          // loader: "html-loader",
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      filename: "[name].js",
      path: path.resolve(process.cwd(), "build"),
      // path: path.resolve(__dirname, "build"),
    },
    resolve: {
      extensions: [".js", ".ts" /* , ".json" */],
      plugins: [
        new TsconfigPathsPlugin(),
        //
      ],
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: "src/icons", to: "icons" },
          { from: "src/_locales", to: "_locales" },
          { from: "src/images", to: "images" },
          { from: "**/*.html", to: "", context: "src/" },
          { from: "scripts/**/*.min.js", to: "scripts", context: "src/" },
          // { from: "src/", to: "" },
          // { from: "src/", to: "" },
        ],
      }),
      //
    ],
    performance: {
      hints: false,
    },
  },
];
