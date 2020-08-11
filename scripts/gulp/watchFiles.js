import colors from "colors";
import log from "fancy-log";
import { series, watch } from "gulp";
import gulpLiveReload from "gulp-livereload";

const reloadExtension = next => {
  gulpLiveReload.reload();
  next();
};

function watchScssFiles() {
  const scssWatcher = watch(
    [
      "./src/styles/**/*.scss",

      "!src/styles/_/style-guide.css",
      "!src/styles/_/style-guide.css.map",
    ],
    series("scss"),
  );

  scssWatcher.on("change", filePath => {
    log.info(colors.green(filePath), "has changed");
  });
}

export default () => {
  gulpLiveReload.listen();

  watchScssFiles();

  const watcher = watch(
    [
      "./manifest.json",
      "./src/**/*",

      "!./src/styles/*",
      "!./src/**/*.ts",
      // "!./src/**/*.js",
      "!./src/locales/*.js",
      "!./src/scripts/jsx/**/*.jsx",
      "!./src/configs/_/*",
    ],
    series("build", reloadExtension),
  );

  watcher.on("change", filePath => {
    log.info(colors.green(filePath), "has changed, rebuilding");
  });

  return watcher;
};
