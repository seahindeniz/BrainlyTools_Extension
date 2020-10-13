export default function replaceLatexWithURL(content: string) {
  if (!content || typeof content !== "string") return content;

  return content
    .replace("http://tex.z-dn.net", "//tex.z-dn.net")
    .replace(/(?:\r\n|\n)/g, "")
    .replace(/\[tex\](.*?)\[\/tex\]/gi, (_, latex) => {
      let latexURI = window.encodeURIComponent(latex);

      if (!latex.startsWith("\\")) {
        latexURI = `%5C${latexURI}`;
      }

      return `<img src="${System.data.Brainly.defaultConfig.config.data.config.serviceLatexUrlHttps}${latexURI}" title="${latex}" align="absmiddle" class="latex-formula sg-box__image">`;
    });
}
