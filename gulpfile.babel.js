import { series, task } from "gulp";
import {
  assets,
  clean,
  extensionConfig,
  generateLocaleIndex,
  locales,
  manifest,
  scss,
  styleGuide,
  watchFiles,
  zip,
} from "./scripts/gulp";

require("dotenv").config();

if (process.env.NODE_ENV === "production")
  process.env.BUILD_FOLDER = process.env.PROD_BUILD_FOLDER;

task("clean", clean);
task("assets", assets);
task("extensionConfig", extensionConfig);
task("styleGuide", styleGuide);
task("locales", locales);
task("generateLocaleIndex", generateLocaleIndex);
task("manifest", manifest);
task("scss", scss);
task("watchFiles", watchFiles);
task("zip", zip);

task(
  "build",
  series(
    "assets",
    "extensionConfig",
    "scss",
    "styleGuide",
    "locales",
    "generateLocaleIndex",
    "manifest",
  ),
);

task("cleanBuild", series("clean", "build"));

task("default", series("cleanBuild"));

task("watch", series("cleanBuild", "watchFiles"));

task("zip", zip);

task("dist", series("build"));
