import fs from "fs";
import yaml from "js-yaml";

export default cb => {
  const extensionOptionsRaw = fs.readFileSync(
    "./src/configs/_/main.yml",
    "utf8",
  );
  const extensionOptions = yaml.load(extensionOptionsRaw);
  const config = {
    ...(process.env.NODE_ENV === "production"
      ? extensionOptions.production
      : extensionOptions.dev),
    ...extensionOptions.common,
  };

  // TODO try to use sync here
  fs.writeFile(
    "./src/configs/_/extension.json",
    JSON.stringify(config, null, 2),
    cb,
  );
};
