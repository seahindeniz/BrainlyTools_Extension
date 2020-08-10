import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import entry from "webpack-glob-entry";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

// import assetsConfig from "./webpack/webpack.assets.config";
// console.log(entry("src/styles/*/*.scss"));
// console.log(entry(entry.basePath("src"), "src/styles/*/*.scss"));
// console.log(
//   WebpackWatchedGlobEntries.getEntries(["./src/styles/**/*.scss"], {
//     ignore: ["./**/_/**"],
//     // cwd: __dirname,
//   })(),
// );

// process.exit(1);

const mainConfig = {
  mode,
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
  performance: {
    hints: false,
  },
  // watch: true,
};

export default [mainConfig];
