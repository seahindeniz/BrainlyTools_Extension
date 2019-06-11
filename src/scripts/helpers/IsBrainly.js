const BRAINLY_MARKETS = [
	"brainly.com",
	"eodev.com",
	"brainly.pl",
	"brainly.com.br",
	"brainly.co.id",
	"znanija.com",
	"brainly.lat",
	"brainly.in",
	"brainly.ph",
	"nosdevoirs.fr",
	"brainly.ro",
]

/**
 * @param {URL} url
 */
export default function IsBrainly(url) {
	return BRAINLY_MARKETS.includes(url.hostname);
}
