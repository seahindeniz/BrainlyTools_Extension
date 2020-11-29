import { series, src, dest } from "gulp";

function copyFonts() {
  return src("node_modules/brainly-style-guide/src/fonts/*").pipe(
    dest(`${process.env.BUILD_FOLDER}/styles/pages/fonts`, { overwrite: true }),
  );
}

function copyBasicIcons() {
  return src("node_modules/brainly-style-guide/src/images/icons.js").pipe(
    dest(`${process.env.BUILD_FOLDER}/images`, { overwrite: true }),
  );
}

export default series(copyFonts, copyBasicIcons);
