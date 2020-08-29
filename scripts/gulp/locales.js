import { src, dest } from "gulp";

export default () => {
  return src("src/locales/*.json").pipe(
    dest(`${process.env.BUILD_FOLDER}/locales`),
  );
};
