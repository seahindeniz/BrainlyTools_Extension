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
];

export default function IsBrainly(url: URL | string) {
  if (!url) return false;

  // eslint-disable-next-line no-param-reassign
  if (typeof url === "string") url = new URL(url);

  return BRAINLY_MARKETS.includes(url.hostname);
}
