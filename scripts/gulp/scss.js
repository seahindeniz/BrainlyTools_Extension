import { dest, src } from "gulp";
import gulpPlumber from "gulp-plumber";
import magicImporter from "node-sass-magic-importer";
import gulpSass from "gulp-dart-sass";

function compileScssFiles(files, destPath) {
  return src(files)
    .pipe(gulpPlumber())
    .pipe(
      gulpSass
        .sync({
          outputStyle:
            process.env.NODE_ENV === "production" ? "compressed" : "expanded",
          precision: 10,
          includePaths: ["node_modules", "."],
          importer: [magicImporter()],
        })
        .on("error", gulpSass.logError),
    )
    .pipe(dest(destPath, { overwrite: true }));
}

export default () =>
  compileScssFiles(
    [
      "src/styles/**/*.scss",
      "src/styles/**/**/*.scss",
      "!src/styles/_/**/*.scss",
    ],
    `${process.env.BUILD_FOLDER}/styles`,
  );
