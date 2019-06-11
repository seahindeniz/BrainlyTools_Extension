const regexp_IGNORED_PATHS = /\/(?:login|graphql|api|sf|js|fonts|img|min|newcss|catinlays|\.php|_next|static)/i;
// app is for question search results
/**
 * @param {URL} url
 */
export default function IsIgnoredPath(url) {
	return regexp_IGNORED_PATHS.test(url.pathname);
}
