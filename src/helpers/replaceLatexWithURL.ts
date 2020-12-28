function htmlDecode(input: string) {
  const doc = new DOMParser().parseFromString(input, "text/html");

  return doc.documentElement.textContent;
}

export default function replaceLatexWithURL(content: string) {
  if (!content || typeof content !== "string") return content;

  return (
    htmlDecode(content)
      // https://regex101.com/r/JKt5LV/1
      .replace(/https?:\/\/(tex\..*?\.)/gi, "//$1")
      // .replace(/(?:\r\n|\n)/g, "")
      // https://regex101.com/r/XKRwQN/1
      .replace(/\[tex\](.*?)\[\/tex\]/gis, (_, latex) => {
        let latexEncodedPath = window.encodeURIComponent(
          latex, // .replace(/(?:\r\n|\n)/g, ""),
        );

        if (!latex.startsWith("\\")) {
          latexEncodedPath = `%5C${latexEncodedPath}`;
        }

        return `<div><img src="${
          System.data.Brainly.defaultConfig.config.data.config
            .serviceLatexUrlHttps
        }${latexEncodedPath}" title="${latex.replace(/\\\\ ?/g, "\n")}"></div`;
      })
  );
}
