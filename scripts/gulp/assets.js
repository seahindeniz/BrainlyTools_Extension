import { src, dest } from "gulp";

export default () => {
  let assets = [
    {
      src: "./src/icons/**/*",
      dest: `/icons`,
    },
    {
      src: "./src/_locales/**/*",
      dest: `/_locales`,
    },
    {
      src: `./src/images/**/*`,
      dest: `/images`,
    },
    {
      src: "./src/images/shared/**/*",
      dest: `/images`,
    },
    {
      src: ["./src/**/*.html", "!./src/scripts/**/*.html"],
      dest: ``,
    },
    {
      src: "src/scripts/**/*.min.js",
      dest: `/scripts`,
    },
    {
      src: "src/configs/*.json",
      dest: `/configs`,
    },
  ];

  assets = assets.map(asset => {
    return src(asset.src).pipe(
      dest(`${process.env.BUILD_FOLDER}${asset.dest}`),
    );
  });

  return assets[assets.length - 1];
};
