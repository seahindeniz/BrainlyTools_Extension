import { dest, src } from "gulp";
import gulpChange from "gulp-change";
import gulpRename from "gulp-rename";

export default () => {
  return src("src/locales/en_US.json")
    .pipe(gulpRename("index.ts"))
    .pipe(
      gulpChange(_content => {
        const start = "export default ";
        const content = _content.replace(/\s"(.*)": /g, " $1: ");
        const end = "\n";

        return `${start}${content}${end}`;
      }),
    )
    .pipe(dest(`src/locales`));
};
