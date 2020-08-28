import fs from "fs";
import glob from "glob";

export default next => {
  try {
    const files = glob.sync("build/**/*", {
      nodir: true,
      ignore: ["build/*", "build/icons/**", "build/scripts/*.js"],
    });

    // console.log(JSON.stringify(files, null, 2));
    files.forEach(fs.unlinkSync);
  } catch (err) {
    console.error(err);
  }

  next();
};
