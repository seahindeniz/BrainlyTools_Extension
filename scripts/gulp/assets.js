import { src, dest } from "gulp";

export default () => {
  let assets = [
    {
      src: "./src/icons/**/*",
      dest: `./build/icons`,
    },
    {
      src: "./src/_locales/**/*",
      dest: `./build/_locales`,
    },
    {
      src: `./src/images/**/*`,
      dest: `./build/images`,
    },
    {
      src: "./src/images/shared/**/*",
      dest: `./build/images`,
    },
    {
      src: ["./src/**/*.html", "!./src/scripts/**/*.html"],
      dest: `./build`,
    },
    {
      src: "src/scripts/**/*.min.js",
      dest: `build/scripts`,
    },
    {
      src: "src/configs/*.json",
      dest: `build/configs`,
    },
  ];

  assets = assets.map(asset => {
    return src(asset.src).pipe(dest(asset.dest));
  });

  return assets[assets.length - 1];
};
