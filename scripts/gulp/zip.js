import fs from "fs";
import { dest, series, src } from "gulp";
import gulpZip from "gulp-zip";

function zipBuildFolder() {
  return src(`${process.env.BUILD_FOLDER}/**`)
    .pipe(gulpZip(`${process.env.npm_package_version}.zip`))
    .pipe(dest("./dist"));
}

function deleteBuildFolder(next) {
  fs.rmdirSync(process.env.BUILD_FOLDER, { recursive: true });

  next();
}

export default series(zipBuildFolder, deleteBuildFolder);
