module.exports = {
  overrides: [
    {
      test: /\.js$/,
      presets: ["@babel/preset-env", "@babel/preset-flow"],
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
              "@ServerReq": "./src/scripts/controllers/Req/Server",
              "@style-guide": "./src/scripts/components/style-guide",
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
  /* plugins: [
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
          "@ServerReq": "./src/scripts/controllers/Req/Server",
          "@style-guide": "./src/scripts/components/style-guide",
          "@": "./src",
        },
      },
    ],
  ],
  presets: [
    "@babel/preset-env",
    "@babel/preset-flow",
    // "@babel/preset-typescript",
  ], */
};
