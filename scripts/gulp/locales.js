import { src, dest } from "gulp";

export default () =>
  src("src/locales/*.json").pipe(dest(`${process.env.BUILD_FOLDER}/locales`));
