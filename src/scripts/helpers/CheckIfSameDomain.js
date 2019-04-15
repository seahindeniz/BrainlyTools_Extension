export default function CheckIfSameDomain(url1, url2) {
  url1 = new URL(url1);
  url2 = new URL(url2);

  return url1.host == url2.host && url1.host;
}
