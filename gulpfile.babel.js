import { dest, series, src, task } from "gulp";
import gulpZip from "gulp-zip";
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
} from "./scripts/gulp";

task("clean", clean);
task("assets", assets);
task("extensionConfig", extensionConfig);
task("styleGuide", styleGuide);
task("locales", locales);
task("generateLocaleIndex", generateLocaleIndex);
task("manifest", manifest);
task("scss", scss);
task("watchFiles", watchFiles);

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

task("zip", () => {
  return src(`./build/**/*`)
    .pipe(gulpZip(`${process.env.npm_package_version}.zip`))
    .pipe(dest("./dist"));
});
task("dist", series("cleanBuild", "zip"));
