const regexpIgnoredPaths = /\/(?:\b(?:login|graphql|api|sf|js|fonts|img|min|newcss|catinlays|_next|static)\b|\.php)/i;
// app is for question search results

export default function IsIgnoredPath(url: URL) {
  return regexpIgnoredPaths.test(url.pathname);
}
