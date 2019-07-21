const regexp_IGNORED_PATHS = /\/(?:\b(?:login|graphql|api|sf|js|fonts|img|min|newcss|catinlays|_next|static)\b|\.php)/i;
// app is for question search results
/**
 * @param {URL} url
 */
export default function IsIgnoredPath(url) {
  return regexp_IGNORED_PATHS.test(url.pathname);
}
