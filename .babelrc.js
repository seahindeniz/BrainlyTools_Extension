module.exports = {
  overrides: [
    {
      test: /\.js$/,
      presets: ["@babel/preset-env"],
      plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-class-properties",
        [
          "inline-import",
          {
            extensions: [".html"],
          },
        ],
        [
          "import-graphql",
          {
            runtime: true,
          },
        ],
        [
          "module-resolver",
          {
            alias: {
              "@BrainlyAction": "./src/scripts/controllers/Req/Brainly/Action",
              "@BrainlyReq": "./src/controllers/Req/Brainly",
              "@ServerReq": "./src/scripts/controllers/Req/Server",
              "@style-guide": "./src/scripts/components/style-guide",
              "@components": "./src/scripts/components",
              "@": "./src",
            },
          },
        ],
      ],
    },
    {
      test: /\.ts$/,
      presets: ["@babel/preset-typescript"],
    },
  ],
};
