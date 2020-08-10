import colors from "colors";
import log from "fancy-log";
import { series, watch } from "gulp";
import gulpLiveReload from "gulp-livereload";

const reloadExtension = next => {
  gulpLiveReload.reload();
  next();
};

export default () => {
  gulpLiveReload.listen();

  const watchAllFilesNeedsToReBuild = watch(
    [
      "./manifest.json",
      "./src/**/*",
      "./src/styles/**/*.scss",

      "!./src/**/*.ts",
      // "!./src/**/*.js",
      "!./src/locales/*.js",
      "!./src/scripts/jsx/**/*.jsx",
      "!./src/configs/_/*",
      "!src/styles/_/style-guide.css",
      "!src/styles/_/style-guide.css.map",
    ],
    series("build", reloadExtension),
  );

  watchAllFilesNeedsToReBuild.on("change", filePath => {
    log.info(colors.green(filePath), "has changed, rebuilding");
  });

  return watchAllFilesNeedsToReBuild;
};
