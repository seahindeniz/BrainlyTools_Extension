import { dest, src } from "gulp";
import gulpPlumber from "gulp-plumber";
import gulpSass from "gulp-sass";
// import gulpSourceMaps from "gulp-sourcemaps";
import magicImporter from "node-sass-magic-importer";
import sass from "sass";

gulpSass.compiler = sass;

function compileScssFiles(files, destPath) {
  return src(files)
    .pipe(gulpPlumber())
    // .pipe(gulpSourceMaps.init())
    .pipe(
      gulpSass
        .sync({
          outputStyle: "compressed",
          precision: 10,
          includePaths: ["node_modules", "."],
          importer: [
            magicImporter(),
          ],
        })
        .on("error", gulpSass.logError),
    )
    // .pipe(gulpSourceMaps.write(`./`))
    .pipe(dest(destPath, { overwrite: true }));
}

export default () => {
  return compileScssFiles(
    [
      "src/styles/**/*.scss",
      "src/styles/**/**/*.scss",
      "!src/styles/_/**/*.scss",
    ],
    `${process.env.BUILD_FOLDER}/styles`,
  );
};
