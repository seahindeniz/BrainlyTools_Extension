import { dest, src } from "gulp";
import gulpChange from "gulp-change";
import gulpRename from "gulp-rename";

export default () =>
  src("src/locales/en_US.json")
    .pipe(gulpRename("index.ts"))
    .pipe(
      gulpChange(_content => {
        const start = "export default ";
        const content = _content.replace(/\s"(.*)": /g, " $1: ");

        return `${start}${content}`;
      }),
    )
    .pipe(dest(`src/locales`));
