import CopyPlugin from "copy-webpack-plugin";

console.log(path.resolve(__dirname, "./src/"));

export default {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/icons", to: "./build/icons" },
        // { from: "other", to: "public" },
      ],
    }),
  ],
  performance: {
    hints: false,
  },
};
