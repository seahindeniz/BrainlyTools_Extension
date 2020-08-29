import fs from "fs";
import glob from "glob";

export default next => {
  try {
    const files = glob.sync(`${process.env.BUILD_FOLDER}/**/*`, {
      nodir: true,
      ignore: [
        `${process.env.BUILD_FOLDER}/*`,
        `${process.env.BUILD_FOLDER}/icons/**`,
        `${process.env.BUILD_FOLDER}/scripts/*.js`,
      ],
    });

    // console.log(JSON.stringify(files, null, 2));
    files.forEach(fs.unlinkSync);
  } catch (err) {
    console.error(err);
  }

  next();
};
