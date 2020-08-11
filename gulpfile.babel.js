import log from "fancy-log";
import { dest, series, src, task } from "gulp";
import gulpClean from "gulp-clean";
import gulpWait from "gulp-wait";
import gulpZip from "gulp-zip";
import {
  assets,
  extensionConfig,
  generateLocaleIndex,
  locales,
  manifest,
  scss,
  styleGuide,
  watchFiles,
} from "./scripts/gulp";

// Clean previous build
task("clean", () => {
  return src(`build`, { allowEmpty: true })
    .on("end", () => log("Waiting for 1 second before cleaning.."))
    .pipe(gulpWait(1000))
    .pipe(gulpClean());
});

task("assets", assets);
task("extensionConfig", extensionConfig);
task("styleGuide", styleGuide);
task("locales", locales);
task("generateLocaleIndex", generateLocaleIndex);
task("manifest", manifest);
task("scss", scss);

task(
  "build",
  series(
    "assets",
    "extensionConfig", // TODO activate this
    "scss",
    "styleGuide",
    "locales",
    "generateLocaleIndex",
    "manifest",
  ),
);
task("cleanBuild", series("clean", "build"));

task("default", series("cleanBuild"));

task("zip", () => {
  return src(`./build/**/*`)
    .pipe(gulpZip(`${process.env.npm_package_version}.zip`))
    .pipe(dest("./dist"));
});
task("dist", series("cleanBuild", "zip"));

task("watchFiles", watchFiles);
task("watch", series("cleanBuild", "watchFiles"));
